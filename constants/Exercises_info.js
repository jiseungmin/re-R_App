
// app/constants/ExercisesWeek4.js
export const EXERCISES= [
  {
    id: 0,
    title: 'Warm Up',
    description: [
      '운동을 시작하기 전에 5분 동안 걸어주세요. 관절에 열을 주어 부드럽게 움직이고 심폐 능력을 향상시킬 수 있습니다.',
      '가능한 한 제일 빠른 속도로 걸어주시되 평평한 도로를 이용해주세요.',
      '걷기 힘든 여건이라면 제자리 걷기, 계단 오르내리기, 스쿼트나 팔 동작으로 대체할 수 있습니다.',
      '워밍업이 끝났다면 지체 없이 바로 운동을 시작해주세요.',
    ],
    totalSets: 0,
    repsPerSet: 0,
    prepTime: 300,        // Warm Up 총 5분 = 300초
    stayTime: 0,
    cooldownTime: 0,
    restBetweenSets: 0,
  },
  {
    id: 1,
    title: '세미 스쿼트',
    description: [
      '양 팔을 어깨 너비로 벌리고 서주세요. 안전을 위해 의자를 뒤에 배치해주세요.',
      '손끝만 테이블에 올리거나 손으로 테이블을 짚지 말아주세요.',
      '5kg 가량의 가방을 메주세요(허리 통증이 있다면 하지 말아주세요).',
      '무릎을 과도하게 굽혀 앉아주세요. 처음 자세로 돌아옵니다.',
    ],
    totalSets: 2,
    repsPerSet: 15,
    prepTime: 5,
    stayTime: 0,
    cooldownTime: 5,
    restBetweenSets: 30,
    video: require('../assets/video/CPM app guide/U.mp4'),
  },
  {
    id: 2,
    title: '스탭-업',
    description: [
      '전화번호부 두 개를 테이프로 단단히 묶어 바닥에 놓습니다.',
      '5kg 가량의 가방을 메주세요.',
      '벽을 잡아 지지합니다.',
      '수술한 다리를 발판 위에 올리고, 반대쪽 다리도 올립니다. 다시 내립니다.',
    ],
    totalSets: 2,
    repsPerSet: 15,
    prepTime: 5,
    stayTime: 0,
    cooldownTime: 5,
    restBetweenSets: 30,
    video: require('../assets/video/CPM app guide/R.mp4'),
  },
  {
    id: 3,
    title: '팔 올리기',
    description: [
      '수건이나 봉 대신 가벼운 덤벨이나 통조림 캔을 들어주세요.',
      '숨을 들이마시며 팔을 높게 들어올립니다.',
      '숨을 내쉬며 팔을 내립니다.',
      '팔꿈치는 항상 하늘을 향하게 해주세요. 등을 굽히지 말아주세요.',
    ],
    totalSets: 2,
    repsPerSet: 20,
    prepTime: 3,
    stayTime: 0,
    cooldownTime: 3,
    restBetweenSets: 30,
    video: require('../assets/video/CPM app guide/P.mp4'),
  },
  {
    id: 4,
    title: '까치발 들기',
    description: [
      '안전을 위해 의자를 뒤에 두고 테이블 앞에 서주세요.',
      '한 손으로 테이블을 잡아주세요.',
      '한 쪽 다리로만 서서 까치발을 듭니다.',
      '3초 동안 유지한 뒤 천천히 처음 자세로 돌아옵니다.',
    ],
    totalSets: 2,
    repsPerSet: 15,
    prepTime: 3,
    stayTime: 3,
    cooldownTime: 3,
    restBetweenSets: 30,
    video: require('../assets/video/CPM app guide/K.mp4'),
  },
  {
    id: 5,
    title: '일어서서 다리 굽히기',
    description: [
      '테이블을 잡고 서세요.',
      '아랫배 근육에 힘을 주세요.',
      '수술한 다리를 엉덩이 쪽으로 구부리고 3초간 유지합니다.',
      '천천히 다리를 내립니다. 등을 굽히지 마세요.',
    ],
    totalSets: 2,
    repsPerSet: 12,
    prepTime: 3,
    stayTime: 3,
    cooldownTime: 3,
    restBetweenSets: 30,
    video: require('../assets/video/CPM app guide/M.mp4'),
  },
  {
    id: 6,
    title: '일어서서 다리 뒤로 뻗기',
    description: [
      '테이블을 잡고 허리를 앞으로 숙입니다.',
      '아랫배 근육에 힘을 주세요.',
      '무릎을 곧게 펴고 다리를 뒤로 쭉 뻗어 3초간 유지합니다.',
      '천천히 다리를 내립니다. 허리를 굽히지 마세요.',
    ],
    totalSets: 2,
    repsPerSet: 12,
    prepTime: 3,
    stayTime: 3,
    cooldownTime: 3,
    restBetweenSets: 30,
    video: require('../assets/video/CPM app guide/L.mp4'),
  },
  {
    id: 7,
    title: '팔 양쪽으로 벌리기',
    description: [
      '가벼운 덤벨이나 통조림 캔을 들어주세요.',
      '숨을 들이마시며 팔을 어깨 높이까지 양옆으로 벌려 들어올립니다.',
      '숨을 내쉬며 팔을 앞으로 내밉니다. 팔꿈치는 곧게 유지하세요.',
      '팔을 천천히 내립니다.',
    ],
    totalSets: 2,
    repsPerSet: 20,
    prepTime: 3,
    stayTime: 3,        // 연결동작
    cooldownTime: 3,
    restBetweenSets: 30,
    video: require('../assets/video/CPM app guide/Q.mp4'),
  },
];
