import { auth } from "./firebase.js";
import {
 createUserWithEmailAndPassword,
 signInWithEmailAndPassword,
 signInWithPopup,
 GoogleAuthProvider,
 onAuthStateChanged,
 signOut,
 sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const provider = new GoogleAuthProvider();

// 회원가입 함수: 이메일 인증 포함
export async function signUp(email, password, messageElement) {
 try {
  const userCredential = await createUserWithEmailAndPassword(
   auth,
   email,
   password
  );
  await sendEmailVerification(userCredential.user);

  messageElement.textContent =
   "회원가입이 완료되었습니다! 이메일을 확인하여 인증을 완료해주세요.";
 } catch (error) {
  messageElement.textContent = `회원가입 오류: ${error.message}`;
 }
}

// 로그인 함수: 이메일 인증 확인 포함
export async function signIn(email, password, messageElement) {
 try {
  const userCredential = await signInWithEmailAndPassword(
   auth,
   email,
   password
  );

  // 이메일 인증 여부 확인
  if (!userCredential.user.emailVerified) {
   // 이메일 인증이 완료되지 않았을 때 메시지 출력 UI 제한
   messageElement.style.color = "red";
   messageElement.textContent =
    "이메일 인증이 완료되지 않았습니다. 이메일을 확인 후 인증을 완료해주세요!";
   return false; // 인증되지 않은 사용자
  }

  // 인증된 사용자만 로그인 상태 유지
  messageElement.style.color = "black";
  messageElement.textContent = `환영합니다, ${userCredential.user.email}님!`;
  return true;
 } catch (error) {
  messageElement.textContent = `로그인 오류: ${error.message}`;
  return false;
 }
}

// 구글 로그인 함수
export async function googleSignIn(messageElement) {
 try {
  await signInWithPopup(auth, provider);
 } catch (error) {
  messageElement.textContent = `구글 로그인 오류: ${error.message}`;
 }
}

// 로그아웃 함수
export async function logOut() {
 try {
  await signOut(auth);
 } catch (error) {
  console.error("로그아웃 오류:", error.message);
 }
}

// 인증 상태 변경 감지 함수
export function observeAuthState(callback) {
 onAuthStateChanged(auth, callback);
}
