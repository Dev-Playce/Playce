import axios from 'axios';

export const getCoordinatesByAddress = async (address: string): Promise<{
  bigRegionName: string,
  smallRegionName: string,
  lat: number,
  lng: number,
}> => {
  const REST_API_KEY = process.env.KAKAO_REST_API_KEY;
  const url = 'https://dapi.kakao.com/v2/local/search/address.json';

  try {
    const response = await axios.get(url, {headers: {
        Authorization: `KakaoAK ${REST_API_KEY}`,
      },
      params: {
        query: address,
      },
    });

    const documents = response.data.documents;

    if (!documents || documents.length === 0) {
      throw new Error('검색 결과가 없습니다.');
    }

    const { address: {region_1depth_name, region_2depth_name }, x, y} = documents[0];
    return { 
      bigRegionName: region_1depth_name,
      smallRegionName: region_2depth_name,
      lat: parseFloat(y),
      lng: parseFloat(x)
    };
  } catch (error) {
    console.error(`❌ 카카오 : 주소 -> 좌표 변환 실패 : ${address}`);
    throw error;
  }
};