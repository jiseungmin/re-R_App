// app/constants/Exercises.js
export const EXERCISES = [
  {
    id: 0,
    title: '미니 스쿼트',
    description: [
      '양 팔을 어깨 너비로 벌리고 서주세요',
      '양 손으로 의자를 잡습니다',
      '천천히 5cm 가량 내려가 주세요',
      '해당 자세로 5초 유지합니다'
    ],
    totalSets: 3,
    repsPerSet: 10,
    prepTime: 5,        // 준비 동작 시간 (초)
    stayTime:5 ,         // 유지시간(초)
    cooldownTime: 5,    // 마무리 동작 시간 (초)
    restBetweenSets: 30, // 세트간 휴식 시간 (초)
    video: require('../assets/video/CPM app guide/A.mp4'),
  },
];
