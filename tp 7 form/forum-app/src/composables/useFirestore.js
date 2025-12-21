import { db } from "@/firebase"
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy
} from "firebase/firestore"

export function useFirestore() {

  const createDiscussion = (data) =>
    addDoc(collection(db, "discussions"), data)

  const getDiscussions = () =>
    getDocs(query(
      collection(db, "discussions"),
      orderBy("createdAt", "desc")
    ))

  const createResponse = (data) =>
    addDoc(collection(db, "responses"), data)

  const getResponses = (discussionId) =>
    getDocs(query(
      collection(db, "responses"),
      where("discussionId", "==", discussionId)
    ))

  return { createDiscussion, getDiscussions, createResponse, getResponses }
}
