import { AppDataSource } from "../src/data-source";
import { BusinessNumber } from "../src/entities/BusinessNumber";

const initialBusinessNumbers = [
  { businessNumber: "111-11-12345", isValid: true },
  { businessNumber: "222-22-12345", isValid: true },
  { businessNumber: "333-33-12345", isValid: true },
  { businessNumber: "444-44-12345", isValid: true },
  { businessNumber: "555-55-12345", isValid: true },
  { businessNumber: "666-66-12345", isValid: true },
  { businessNumber: "777-77-12345", isValid: true },
  { businessNumber: "888-88-12345", isValid: true },
  { businessNumber: "999-99-12345", isValid: false },
];

const generateBusinessNumbers = (count: number) => {
  const numbers = [];
  let currentPrefix = 100;
  let currentMiddle = 10;
  let currentSuffix = 10000;

  for (let i = 0; i < count; i++) {
    const businessNumber = `${String(currentPrefix).padStart(3, "0")}-${String(
      currentMiddle
    ).padStart(2, "0")}-${String(currentSuffix).padStart(5, "0")}`;
    numbers.push({ businessNumber: businessNumber, isValid: true });

    // 다음 번호를 위해 증가
    currentSuffix++;
    if (currentSuffix > 99999) {
      // suffix가 최대치를 넘으면 middle 증가
      currentSuffix = 10000;
      currentMiddle++;
      if (currentMiddle > 99) {
        // middle이 최대치를 넘으면 prefix 증가
        currentMiddle = 10;
        currentPrefix++;
        if (currentPrefix > 999) {
          // prefix가 최대치를 넘으면 (매우 드물지만)
          // 더 이상 유효한 범위를 찾을 수 없음을 알립니다.
          console.warn(
            "⚠️ 경고: 사업자등록번호 생성 범위가 부족하여 더 이상 고유한 번호를 생성할 수 없습니다."
          );
          break; // 루프를 중단합니다.
        }
      }
    }
  }
  return numbers;
};

const businessNumbers = [
  ...initialBusinessNumbers,
  ...generateBusinessNumbers(500),
];

export const seedBusinessNumbers = async () => {
  const businessNumberRepo = AppDataSource.getRepository(BusinessNumber);

  for (const item of businessNumbers) {
    const existing = await businessNumberRepo.findOneBy({
      businessNumber: item.businessNumber,
    });
    if (!existing) {
      const businessNumber = businessNumberRepo.create(item);
      await businessNumberRepo.save(businessNumber);
    }
  }

  console.log("✅ 사업자등록번호 시드 완료");
};
