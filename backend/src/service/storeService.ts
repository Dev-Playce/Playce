import { AppDataSource } from "../data-source";
import { BigRegion } from "../entities/BigRegion";
import { BusinessNumber } from "../entities/BusinessNumber";
import { SmallRegion } from "../entities/SmallRegion";
import { Store } from "../entities/Store";
import { StoreImage } from "../entities/StoreImage";
import { getLocationDataFromAddress } from "../utils/locationUtils";
import { createError } from "../utils/createError";
import { deleteS3Object } from "../utils/s3";

const storeService = {
  // 1. 식당 등록
  createStore: async (userId: number, createData: any) => {
    const {
      store_name: storeName,
      business_number: businessNumber,
      address,
      phone,
      opening_hours: openingHours,
      menus,
      type,
      description,
      img_urls: imgUrls,
    } = createData;

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 사업자등록번호 유효성 검사
      const businessNumberRepo = AppDataSource.getRepository(BusinessNumber);

      const findBusinessNumber = await businessNumberRepo.findOne({
        where: { businessNumber: businessNumber },
        relations: ["store"],
      });

      if (!findBusinessNumber || !findBusinessNumber.isValid)
        throw createError("유효하지 않은 사업자등록번호입니다.", 400);
      if (findBusinessNumber.store)
        throw createError("이미 등록된 사업자등록번호입니다.", 409);
      console.log(
        `- 사업자등록번호(id: ${findBusinessNumber.id}, number: ${findBusinessNumber.businessNumber})`
      );

      // 주소-위치-지역 변환 및 DB 조회
      const bigRegionRepo = AppDataSource.getRepository(BigRegion);
      const smallRegionRepo = AppDataSource.getRepository(SmallRegion);

      // const { location, bigRegion, smallRegion } = await getLocationDataFromAddress(address, bigRegionRepo, smallRegionRepo);
      const { lat, lng, bigRegion, smallRegion } =
        await getLocationDataFromAddress(
          address,
          bigRegionRepo,
          smallRegionRepo
        );
      console.log(
        `- 지역 : 대분류(${bigRegion.id}, ${bigRegion.name}), 소분류(${smallRegion.id}, ${smallRegion.name}), 위도(${lat}), 경도(${lng})`
      );

      // stores에 정보 저장
      const storeRepo = AppDataSource.getRepository(Store);
      const newStore = storeRepo.create({
        user: { id: userId },
        storeName,
        businessNumber: findBusinessNumber,
        address,
        bigRegion,
        smallRegion,
        lat,
        lng,
        phone,
        openingHours,
        menus,
        type,
        description,
      });

      const saveStore = await storeRepo.save(newStore);
      console.log("- stores : 데이터 저장 완료");

      // store_images에 데이터 저장
      if (imgUrls && Array.isArray(imgUrls) && imgUrls.length > 0) {
        const storeImageRepo = AppDataSource.getRepository(StoreImage);
        const newStoreImages = imgUrls.map((url: string, index: number) =>
          storeImageRepo.create({
            store: saveStore,
            imgUrl: url,
            isMain: index === 0,
          })
        );

        await storeImageRepo.save(newStoreImages);
        console.log(
          `- store_image : ${newStoreImages.length}개의 이미지 저장 완료`
        );
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("❌ 식당 등록 : 트랜잭션 롤백됨");
      throw error;
    } finally {
      await queryRunner.release();
    }
  },
  // 2. 식당 수정
  updateStore: async (userId: number, storeId: number, updateData: any) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const storeRepo = AppDataSource.getRepository(Store);

      const storeToUpdate = await storeRepo.findOne({
        where: { id: storeId },
        relations: ["user"],
      });

      // 식당 유효성 검사
      if (!storeToUpdate)
        throw createError("해당 식당을 찾을 수 없습니다.", 404);
      console.log("- 식당 유효성 검사 완료 : DB에 있는지");

      if (storeToUpdate.user.id !== userId)
        throw createError("해당 식당에 대한 수정 권한이 없습니다.", 403);
      console.log("- 식당 유효성 검사 완료 : 소유권 확인");

      const allowedFields = [
        "store_name",
        "address",
        "phone",
        "opening_hours",
        "menus",
        "type",
        "description",
        "img_urls",
      ];
      const receiveFields = Object.keys(updateData);
      const invalidFields = receiveFields.filter(
        (field) => !allowedFields.includes(field)
      );

      if (invalidFields.length > 0)
        throw createError(
          `수정할 수 없는 항목(들)이 포함되어 있습니다. (${invalidFields.join(
            ", "
          )})`,
          400
        );
      console.log("- 식당 유효성 검사 완료 : 수정할 수 없는 필드 포함 여부");

      // DB 업데이트
      if (updateData.store_name)
        storeToUpdate.storeName = updateData.store_name;
      if (updateData.phone)
        storeToUpdate.phone = updateData.phone;
      if (updateData.opening_hours)
        storeToUpdate.openingHours = updateData.opening_hours;
      if (updateData.menus)
        storeToUpdate.menus = updateData.menus;
      if (updateData.type) storeToUpdate.type = updateData.type;
      if (updateData.description)
        storeToUpdate.description = updateData.description;

      if (updateData.address) {
        // 주소 -> location, bigRegion, smallRegion 같이 수정
        const bigRegionRepo = AppDataSource.getRepository(BigRegion);
        const smallRegionRepo = AppDataSource.getRepository(SmallRegion);

        // const { location, bigRegion, smallRegion } = await getLocationDataFromAddress(
        const { lat, lng, bigRegion, smallRegion } =
          await getLocationDataFromAddress(
            updateData.address,
            bigRegionRepo,
            smallRegionRepo
          );

        storeToUpdate.address = updateData.address;
        // storeToUpdate.location = location;
        storeToUpdate.lat = lat;
        storeToUpdate.lng = lng;
        storeToUpdate.bigRegion = bigRegion;
        storeToUpdate.smallRegion = smallRegion;
      }

      if (updateData.img_urls) {
        // 이미지 -> 전체 삭제 후 재등록
        const storeImageRepo = AppDataSource.getRepository(StoreImage);

        const oldImages = await storeImageRepo.find({
          where: { store: { id: storeId } },
        });

        await Promise.all(oldImages.map((img) => deleteS3Object(img.imgUrl)));
        await storeImageRepo.delete({ store: { id: storeId } }); // 기존 이미지 삭제

        const newImages = updateData.img_urls.map(
          (url: string, index: number) =>
            storeImageRepo.create({
              store: storeToUpdate,
              imgUrl: url,
              isMain: index === 0,
            })
        );
        await storeImageRepo.save(newImages);
      }

      await storeRepo.save(storeToUpdate);
      console.log("- 수정 완료");

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("❌ 식당 수정 : 트랜잭션 롤백됨");
      throw error;
    } finally {
      await queryRunner.release();
    }
  },
  // 3. 식당 삭제
  deleteStore: async (userId: number, storeId: number) => {
    const storeRepo = AppDataSource.getRepository(Store);
    const storeImageRepo = AppDataSource.getRepository(StoreImage);
    const storeToDelete = await storeRepo.findOne({
      where: { id: storeId },
      relations: ["user"],
    });

    // 식당 유효성 검사
    if (!storeToDelete) throw createError("해당 식당을 찾을 수 없습니다.", 404);
    console.log("- 식당 유효성 검사 통과");

    if (storeToDelete.user.id !== userId)
      throw createError("해당 식당에 대한 삭제 권한이 없습니다.", 403);
    console.log("- 식당 소유권 확인");

    // 1. 기존 이미지들 S3에서 삭제
    const images = await storeImageRepo.find({
      where: { store: { id: storeId } },
    });

    await Promise.all(images.map((img) => deleteS3Object(img.imgUrl)));

    // 2. DB에서 이미지 삭제
    await storeImageRepo.delete({ store: { id: storeId } });

    // 3. DB에서 store 삭제
    await storeRepo.remove(storeToDelete);
    return;
  },
  // 4. 식당 상세 조회
  getStoreDetail: async (userId: number | undefined, storeId: number) => {
    const storeRepo = AppDataSource.getRepository(Store);

    const store = await storeRepo.findOne({
      where: { id: storeId },
      relations: [
        "user",
        "images",
        "broadcasts",
        "broadcasts.sport",
        "broadcasts.league",
      ],
    });

    if (!store) throw createError("해당 식당을 찾을 수 없습니다.", 404);
    console.log("- store 유효성 검사");

    const imgUrlsData = store.images.map((img) => img.imgUrl);
    const broadcastData = store.broadcasts.map((bc) => ({
      match_date: bc.matchDate,
      match_time: bc.matchTime,
      sport: bc.sport.name,
      league: bc.league.name,
      team_one: bc.teamOne,
      team_two: bc.teamTwo,
      etc: bc.etc,
    }));
    const isOwner = !!userId && userId === store.user.id;

    const responseData = {
      store_name: store.storeName,
      address: store.address,
      phone: store.phone,
      opening_hours: store.openingHours,
      menus: store.menus,
      type: store.type,
      img_urls: imgUrlsData,
      description: store.description,
      broadcasts: broadcastData,
      is_owner: isOwner,
    };
    console.log("- 응답 데이터 : ", responseData);

    return responseData;
  },
  // 5. 내 식당 목록
  getMyStores: async (userId: number) => {
    const storeRepo = AppDataSource.getRepository(Store);

    const myStores = await storeRepo.find({
      where: { user: { id: userId } },
      relations: ["images"],
      select: ["id", "storeName", "address"],
    });

    const responseData = myStores.map((store) => {
      const mainImageObj = store.images.find((img) => img.isMain);
      const mainImage = mainImageObj ? mainImageObj.imgUrl : null;

      return {
        store_id: store.id,
        store_name: store.storeName,
        main_img: mainImage,
        address: store.address,
      };
    });
    console.log("- 응답 데이터 : ", responseData);

    return responseData;
  },
};

export default storeService;
