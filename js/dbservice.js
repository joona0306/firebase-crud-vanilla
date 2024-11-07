import { db } from "./firebase.js";
import {
 collection,
 addDoc,
 deleteDoc,
 updateDoc,
 doc,
 getDocs,
 serverTimestamp,
 orderBy,
 query,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// 게시물 조회 함수
export async function fetchPosts() {
 const posts = [];
 const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

 try {
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
   posts.push({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt
     ? new Date(doc.data().createdAt.seconds * 1000).toLocaleString()
     : "Timestamp not available",
   });
  });
 } catch (error) {
  console.error("Failed to fetch posts:", error);
 }

 return posts;
}

// 게시물 추가 함수
export async function addPost(content, author) {
 try {
  await addDoc(collection(db, "posts"), {
   content,
   author,
   createdAt: serverTimestamp(),
  });
 } catch (error) {
  console.error("Failed to add post:", error);
 }
}

// 게시물 수정 함수
export async function updatePost(id, updatedContent) {
 const postRef = doc(db, "posts", id);
 try {
  await updateDoc(postRef, { content: updatedContent });
 } catch (error) {
  console.error("Failed to update post:", error);
 }
}

// 게시물 삭제 함수
export async function deletePost(id) {
 const postRef = doc(db, "posts", id);
 try {
  await deleteDoc(postRef);
 } catch (error) {
  console.error("Failed to delete post:", error);
 }
}
