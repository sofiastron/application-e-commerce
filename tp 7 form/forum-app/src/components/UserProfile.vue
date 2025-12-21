import { ref, onMounted } from "vue";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export function useProfile() {
  const userProfile = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Charger le profil utilisateur Firestore
  async function loadUserProfile(uid) {
    loading.value = true;
    error.value = null;
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        userProfile.value = docSnap.data();
      } else {
        userProfile.value = null;
      }
    } catch (err) {
      error.value = err.message || "Erreur lors du chargement du profil";
    } finally {
      loading.value = false;
    }
  }

  // Mettre à jour les infos de profil (Firestore)
  async function updateUserProfile(uid, data) {
    loading.value = true;
    error.value = null;
    try {
      const docRef = doc(db, "users", uid);
      // Met à jour uniquement les champs donnés (merge)
      await setDoc(docRef, data, { merge: true });
      userProfile.value = { ...userProfile.value, ...data };
    } catch (err) {
      error.value = err.message || "Erreur lors de la mise à jour du profil";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Surveille l’état de connexion Firebase Auth
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadUserProfile(user.uid);
    } else {
      userProfile.value = null;
    }
  });

  return {
    userProfile,
    loading,
    error,
    loadUserProfile,
    updateUserProfile,
  };
}
