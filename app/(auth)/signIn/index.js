import Checkbox from 'expo-checkbox';
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// Asset requires
const logoImage = require("../../../assets/images/SignIn/re_R_logo.png");
const phoneIcon = require("../../../assets/images/SignIn/phone.png");
const lockIcon  = require("../../../assets/images/SignIn/그룹 187.png");

export default function SignIn() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword]       = useState("");
  const [keepLogin, setKeepLogin]     = useState(true);
  const router = useRouter();

  const handleLogin = () => {
    console.log("로그인!", { phoneNumber, password, keepLogin });
    // TODO: 실제 로그인 로직
  };


  return (
   <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Title */}
        <Image source={logoImage} style={styles.logo} />

        {/* ID Field */}
        <View style={styles.field}>
          <Text style={styles.label}>ID</Text>
          <View style={styles.inputRow}>
            <Image source={phoneIcon} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="휴대폰번호를 입력해주세요 (- 제외)"
              placeholderTextColor="#C7C7C7"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Password Field */}
        <View style={styles.field}>
          <Text style={styles.label}>비밀번호</Text>
          <View style={styles.inputRow}>
            <Image source={lockIcon} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 입력해주세요"
              placeholderTextColor="#C7C7C7"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        {/* Keep Login Checkbox */}
        <View style={styles.checkboxRow}>
          <Checkbox
            value={keepLogin}
            onValueChange={setKeepLogin}
            color={keepLogin ? PRIMARY : undefined}
          />
         <Text style={styles.checkboxLabel}>로그인 상태 유지</Text>
      </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>

        {/* Divider + Footer */}
        <View style={styles.dividerRow}>
          <View style={styles.separator} />
          <TouchableOpacity onPress={() => router.push("/signUp")}>
            <Text style={styles.dividerText}>회원가입</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </TouchableWithoutFeedback> 
  );
}

const PRIMARY = "#6573E3";

const styles = StyleSheet.create({
  container: {
   flex: 1,
   backgroundColor: "#FFFFFF",
   paddingHorizontal: 24,
   justifyContent: "flex-start",  // 세로 중앙 해제
   paddingTop: Platform.OS === "ios" ? 60 : 40, // 필요하면 적절히 조절
  },
  title: {
    fontSize: 32,
    color: PRIMARY,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 60,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 60,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: "#444444",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    paddingVertical: 4,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 12,
    tintColor: "#999999",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
    paddingVertical: 0,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#999999",
    borderRadius: 4,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxBoxChecked: {
    borderColor: PRIMARY,
  },
  innerCheckbox: {
    width: 12,
    height: 12,
    backgroundColor: PRIMARY,
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#555555",
    marginLeft:8
  },
  button: {
    backgroundColor: PRIMARY,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 32,
  },
  separator: {
    width: 1,
    height: 16,
    backgroundColor: "#E5E5E5",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: "#888888",
  },
});
