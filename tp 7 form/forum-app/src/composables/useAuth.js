import { auth } from "@/firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth"

export function useAuth() {
  const register = async (email, password, name) => {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(res.user, { displayName: name })
  }

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const logout = () => signOut(auth)

  return { register, login, logout }
}
