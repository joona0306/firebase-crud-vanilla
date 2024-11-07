import {
 googleSignIn,
 logOut,
 observeAuthState,
 signIn,
 signUp,
} from "./authservice.js";
import { addPost, deletePost, fetchPosts, updatePost } from "./dbservice.js";
import { auth } from "./firebase.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signUpButton = document.getElementById("sign-up-btn");
const signInButton = document.getElementById("sign-in-btn");
const googleSignInButton = document.getElementById("google-sign-in-btn");
const logoutButton = document.getElementById("logout-btn");
const messageElement = document.getElementById("message");
const newPostContent = document.getElementById("new-post-content");
const addPostButton = document.getElementById("add-post-btn");
const postList = document.getElementById("post-list");

// 인증 및 로그아웃 관련 이벤트 리스너
signUpButton.addEventListener("click", () => {
 signUp(emailInput.value, passwordInput.value, messageElement);
 emailInput.value = "";
 passwordInput.value = "";
});
signInButton.addEventListener("click", () => {
 signIn(emailInput.value, passwordInput.value, messageElement);
 emailInput.value = "";
 passwordInput.value = "";
});
googleSignInButton.addEventListener("click", () =>
 googleSignIn(messageElement)
);
logoutButton.addEventListener("click", () => logOut());

// 인증 상태 변경에 따라 UI 업데이트
observeAuthState(async (user) => {
 if (user) {
  // 이메일 인증 여부 확인
  if (user.emailVerified) {
   document.getElementById("auth-section").classList.add("hidden");
   document.getElementById("new-post-section").classList.remove("hidden");
   logoutButton.classList.remove("hidden");
   //  messageElement.textContent = `환영합니다! ${user.email}님`;
   renderPosts(user);
  } else {
   document.getElementById("new-post-section").classList.add("hidden");
   logoutButton.classList.add("hidden");
  }
 } else {
  document.getElementById("auth-section").classList.remove("hidden");
  document.getElementById("new-post-section").classList.add("hidden");
  logoutButton.classList.add("hidden");
  messageElement.textContent = "";
  renderPosts(null);
 }
});

// 글 작성 이벤트 리스너
addPostButton.addEventListener("click", async () => {
 const content = newPostContent.value.trim();
 if (content) {
  await addPost(content, auth.currentUser.email);
  newPostContent.value = "";
  renderPosts(auth.currentUser);
 }
});

// 게시물 목록 렌더링 함수
async function renderPosts(user) {
 postList.innerHTML = "";
 const posts = await fetchPosts();
 posts.forEach((post, index) => {
  const postItem = document.createElement("li");
  postItem.innerHTML = `
      <strong>${index + 1}. ${post.author}</strong>: ${post.content}
      <br><small>${post.createdAt}</small>
    `;

  if (user && post.author === user.email) {
   const editButton = document.createElement("button");
   editButton.textContent = "수정";
   editButton.addEventListener("click", async () => {
    const updatedContent = prompt("작성 글 수정하기", post.content);
    if (updatedContent) {
     await updatePost(post.id, updatedContent);
     renderPosts(user);
    }
   });

   const deleteButton = document.createElement("button");
   deleteButton.textContent = "삭제";
   deleteButton.addEventListener("click", async () => {
    await deletePost(post.id);
    renderPosts(user);
   });

   postItem.appendChild(editButton);
   postItem.appendChild(deleteButton);
  }

  postList.appendChild(postItem);
 });
}
