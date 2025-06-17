// app/signUp/_layout.js
import { Slot } from 'expo-router';

export default function SignUpLayout() {
  // 회원가입 단계에서는 레이아웃(header 등)을 생략하고 하위 페이지만 렌더링합니다.
  return <Slot />;
}