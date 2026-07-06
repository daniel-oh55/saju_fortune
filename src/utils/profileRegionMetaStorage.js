export const PROFILE_REGION_META_KEY = 'harupuli_profile_region_meta_v1';

const DEFAULT_PROFILE_REGION_META = {
  province: '서울특별시',
  district: '강남구',
};

const REGION_DISTRICTS = {
  서울특별시: [
    '강남구',
    '강동구',
    '강북구',
    '강서구',
    '관악구',
    '광진구',
    '구로구',
    '금천구',
    '노원구',
    '도봉구',
    '동대문구',
    '동작구',
    '마포구',
    '서대문구',
    '서초구',
    '성동구',
    '성북구',
    '송파구',
    '양천구',
    '영등포구',
    '용산구',
    '은평구',
    '종로구',
    '중구',
    '중랑구',
  ],
  부산광역시: ['해운대구', '수영구', '부산진구', '동래구', '남구'],
  대구광역시: ['중구', '수성구', '달서구', '북구'],
  인천광역시: ['연수구', '남동구', '부평구', '서구'],
  광주광역시: ['동구', '서구', '남구', '북구', '광산구'],
  대전광역시: ['유성구', '서구', '중구', '동구', '대덕구'],
  울산광역시: ['남구', '중구', '동구', '북구', '울주군'],
  세종특별자치시: ['세종시'],
  경기도: ['수원시', '성남시', '고양시', '용인시', '부천시'],
  강원특별자치도: ['춘천시', '원주시', '강릉시'],
  충청북도: ['청주시', '충주시', '제천시'],
  충청남도: ['천안시', '아산시', '공주시'],
  전북특별자치도: ['전주시', '익산시', '군산시'],
  전라남도: ['목포시', '여수시', '순천시'],
  경상북도: ['포항시', '경주시', '구미시'],
  경상남도: ['창원시', '김해시', '진주시'],
  제주특별자치도: ['제주시', '서귀포시'],
};

export const PROFILE_REGION_PROVINCES = Object.keys(REGION_DISTRICTS);

export function getDistrictsByProvince(province) {
  return REGION_DISTRICTS[province] || REGION_DISTRICTS[DEFAULT_PROFILE_REGION_META.province];
}

function normalizeProfileRegionMeta(value) {
  const province = PROFILE_REGION_PROVINCES.includes(value?.province)
    ? value.province
    : DEFAULT_PROFILE_REGION_META.province;
  const districts = getDistrictsByProvince(province);
  const district = districts.includes(value?.district) ? value.district : districts[0];

  return { province, district };
}

export function loadProfileRegionMeta() {
  if (typeof window === 'undefined') return DEFAULT_PROFILE_REGION_META;

  try {
    return normalizeProfileRegionMeta(JSON.parse(window.localStorage.getItem(PROFILE_REGION_META_KEY)));
  } catch {
    return DEFAULT_PROFILE_REGION_META;
  }
}

export function saveProfileRegionMeta(regionMeta) {
  const nextRegionMeta = normalizeProfileRegionMeta(regionMeta);

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(PROFILE_REGION_META_KEY, JSON.stringify(nextRegionMeta));
  }

  return nextRegionMeta;
}
