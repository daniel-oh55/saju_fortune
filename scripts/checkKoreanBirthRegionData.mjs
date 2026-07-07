import fs from 'node:fs';
import { execSync } from 'node:child_process';

const regionSourcePath = 'src/utils/profileRegionMetaStorage.js';
const packagePath = 'package.json';

const expectedRegions = {
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
  부산광역시: [
    '중구',
    '서구',
    '동구',
    '영도구',
    '부산진구',
    '동래구',
    '남구',
    '북구',
    '해운대구',
    '사하구',
    '금정구',
    '강서구',
    '연제구',
    '수영구',
    '사상구',
    '기장군',
  ],
  대구광역시: ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군', '군위군'],
  인천광역시: ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'],
  광주광역시: ['동구', '서구', '남구', '북구', '광산구'],
  대전광역시: ['유성구', '서구', '중구', '동구', '대덕구'],
  울산광역시: ['남구', '중구', '동구', '북구', '울주군'],
  세종특별자치시: ['세종특별자치시'],
  경기도: [
    '수원시',
    '성남시',
    '의정부시',
    '안양시',
    '부천시',
    '광명시',
    '평택시',
    '동두천시',
    '안산시',
    '고양시',
    '과천시',
    '구리시',
    '남양주시',
    '오산시',
    '시흥시',
    '군포시',
    '의왕시',
    '하남시',
    '용인시',
    '파주시',
    '이천시',
    '안성시',
    '김포시',
    '화성시',
    '광주시',
    '양주시',
    '포천시',
    '여주시',
    '연천군',
    '가평군',
    '양평군',
  ],
  강원특별자치도: [
    '춘천시',
    '원주시',
    '강릉시',
    '동해시',
    '태백시',
    '속초시',
    '삼척시',
    '홍천군',
    '횡성군',
    '영월군',
    '평창군',
    '정선군',
    '철원군',
    '화천군',
    '양구군',
    '인제군',
    '고성군',
    '양양군',
  ],
  충청북도: ['청주시', '충주시', '제천시', '보은군', '옥천군', '영동군', '증평군', '진천군', '괴산군', '음성군', '단양군'],
  충청남도: [
    '천안시',
    '공주시',
    '보령시',
    '아산시',
    '서산시',
    '논산시',
    '계룡시',
    '당진시',
    '금산군',
    '부여군',
    '서천군',
    '청양군',
    '홍성군',
    '예산군',
    '태안군',
  ],
  전북특별자치도: [
    '전주시',
    '군산시',
    '익산시',
    '정읍시',
    '남원시',
    '김제시',
    '완주군',
    '진안군',
    '무주군',
    '장수군',
    '임실군',
    '순창군',
    '고창군',
    '부안군',
  ],
  전라남도: [
    '목포시',
    '여수시',
    '순천시',
    '나주시',
    '광양시',
    '담양군',
    '곡성군',
    '구례군',
    '고흥군',
    '보성군',
    '화순군',
    '장흥군',
    '강진군',
    '해남군',
    '영암군',
    '무안군',
    '함평군',
    '영광군',
    '장성군',
    '완도군',
    '진도군',
    '신안군',
  ],
  경상북도: [
    '포항시',
    '경주시',
    '김천시',
    '안동시',
    '구미시',
    '영주시',
    '영천시',
    '상주시',
    '문경시',
    '경산시',
    '의성군',
    '청송군',
    '영양군',
    '영덕군',
    '청도군',
    '고령군',
    '성주군',
    '칠곡군',
    '예천군',
    '봉화군',
    '울진군',
    '울릉군',
  ],
  경상남도: [
    '창원시',
    '진주시',
    '통영시',
    '사천시',
    '김해시',
    '밀양시',
    '거제시',
    '양산시',
    '의령군',
    '함안군',
    '창녕군',
    '고성군',
    '남해군',
    '하동군',
    '산청군',
    '함양군',
    '거창군',
    '합천군',
  ],
  제주특별자치도: ['제주시', '서귀포시'],
};

const allowedChangedFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  packagePath,
  'scripts/checkAppWideBackNavigation.mjs',
  'scripts/checkFiveElementsGuidanceDeduplication.mjs',
  'scripts/checkNativeAndroidBackButton.mjs',
  'scripts/checkZodiacExplanationCardOrder.mjs',
  regionSourcePath,
  'scripts/checkBirthRegionDistrictOptions.mjs',
  'scripts/checkBirthRegionExpansionPolicy.mjs',
  'scripts/checkKoreanBirthRegionData.mjs',
]);

const protectedChangedPaths = [
  'android',
  'docs/generated',
  'public/privacy-policy.html',
  'package-lock.json',
  'src/domain',
  'src/utils/fortuneEngine.js',
  'src/domain/fortune/zodiacFortuneEngine.js',
];

function logResult(label, passed, detail = '') {
  console.log(`${label}: ${passed ? 'pass' : 'fail'}${detail ? ` - ${detail}` : ''}`);
}

function mark(passed, label, detail = '') {
  logResult(label, passed, detail);
  if (!passed) hasFailure = true;
}

function hasDuplicates(values) {
  return new Set(values).size !== values.length;
}

function changedFiles() {
  return [
    ...execSync('git diff --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
    ...execSync('git diff --cached --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
    ...execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' }).split(/\r?\n/),
  ].filter(Boolean);
}

let hasFailure = false;

for (const path of [regionSourcePath, packagePath]) {
  mark(fs.existsSync(path), `${path}_exists`);
}

if (hasFailure) process.exit(1);

const regionSource = fs.readFileSync(regionSourcePath, 'utf8');
const packageSource = fs.readFileSync(packagePath, 'utf8');
const regionModule = await import(`../${regionSourcePath}`);
const actualProvinces = regionModule.PROFILE_REGION_PROVINCES;
const expectedProvinces = Object.keys(expectedRegions);

mark(
  regionSource.includes("PROFILE_REGION_META_KEY = 'harupuli_profile_region_meta_v1'"),
  'profile_region_meta_key_unchanged',
);
mark(regionSource.includes('province:') && regionSource.includes('district:'), 'profile_region_object_shape_preserved');
mark(!regionSource.includes('schemaVersion'), 'schema_version_not_added_to_region_meta');
mark(!regionSource.includes('CURRENT_FORTUNE_SCHEMA_VERSION'), 'fortune_schema_version_not_changed_in_region_meta');
mark(!regionSource.includes('해외') && !regionSource.includes('직접'), 'overseas_or_direct_input_ui_not_added');

mark(actualProvinces.length === 17, 'korean_province_count_is_17', String(actualProvinces.length));
mark(!hasDuplicates(actualProvinces), 'province_names_have_no_duplicates');

for (const province of expectedProvinces) {
  const districts = regionModule.getDistrictsByProvince(province);
  mark(actualProvinces.includes(province), `province_includes_${province}`);
  mark(Array.isArray(districts), `${province}_districts_is_array`);
  mark(districts.length > 0, `${province}_districts_not_empty`, String(districts.length));
  mark(!hasDuplicates(districts), `${province}_districts_have_no_duplicates`);

  for (const district of expectedRegions[province]) {
    mark(districts.includes(district), `${province}_includes_${district}`);
  }
}

mark(regionModule.getDistrictsByProvince('서울특별시').length === 25, 'seoul_district_count_is_25');
mark(regionModule.getDistrictsByProvince('세종특별자치시').includes('세종특별자치시'), 'sejong_single_option_present');
mark(
  regionModule.getDistrictsByProvince('제주특별자치도').includes('제주시') &&
    regionModule.getDistrictsByProvince('제주특별자치도').includes('서귀포시'),
  'jeju_city_options_present',
);
mark(regionModule.getDistrictsByProvince('경기도').length >= 31, 'gyeonggi_city_count_is_complete_enough');

mark(
  packageSource.includes('"check:korean-birth-region-data": "node scripts/checkKoreanBirthRegionData.mjs"'),
  'package_script_registered',
);

const allChangedFiles = [...new Set(changedFiles())];
for (const file of allChangedFiles) {
  mark(allowedChangedFiles.has(file), `allowed_changed_file_${file}`);
}

const protectedDiff = execSync(`git diff --name-only -- ${protectedChangedPaths.join(' ')}`, { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);
mark(protectedDiff.length === 0, 'protected_android_generated_privacy_engine_files_unchanged', protectedDiff.join(', '));

const artifactFiles = [
  ...execSync('git ls-files', { encoding: 'utf8' }).split(/\r?\n/),
  ...allChangedFiles,
].filter((path) => path.endsWith('.aab') || path.endsWith('.zip') || path.endsWith('.jks') || path.endsWith('.keystore'));
mark(artifactFiles.length === 0, 'artifact_zip_and_keystore_files_not_added_to_repository', artifactFiles.join(', '));

if (hasFailure) {
  console.error('Korean birth region data check failed');
  process.exit(1);
}

console.log('Korean birth region data check passed');
