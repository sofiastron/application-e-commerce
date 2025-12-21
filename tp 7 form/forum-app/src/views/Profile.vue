<template>
  <div class="container mt-4">
    <b-card>
      <h3 class="mb-4 text-center">Mon Profil</h3>

      <b-alert variant="danger" v-if="error" dismissible @dismissed="error = ''">
        {{ error }}
      </b-alert>

      <b-alert variant="success" v-if="success" dismissible @dismissed="success = ''">
        {{ success }}
      </b-alert>

      <b-form @submit.prevent="updateProfileHandler">
        <b-form-group label="Nom d'utilisateur" label-for="nameInput">
          <b-form-input
            id="nameInput"
            v-model="displayName"
            placeholder="Entrez votre nom"
          />
        </b-form-group>

        <b-form-group label="Email" label-for="emailInput">
          <b-form-input
            id="emailInput"
            type="email"
            v-model="email"
            disabled
          />
          <small class="text-muted">L'email ne peut pas être modifié.</small>
        </b-form-group>

        <b-form-group label="Photo de profil (facultatif)">
          <input
            type="file"
            accept="image/*"
            @change="onFileChange"
            :class="{'is-invalid': fileState === false}"
          />
          <b-img
            v-if="photoURL"
            :src="photoURL"
            alt="Photo de profil"
            thumbnail
            fluid
            class="mt-2"
            style="max-width: 150px;"
          />
        </b-form-group>

        <b-button type="submit" variant="primary" :disabled="loading">
          {{ loading ? "Mise à jour..." : "Mettre à jour" }}
        </b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAuth, updateProfile } from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const auth = getAuth();
const storage = getStorage();

const displayName = ref("");
const email = ref("");
const photoURL = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");
const selectedFile = ref(null);
const fileState = ref(null);

onMounted(() => {
  const user = auth.currentUser;
  if (user) {
    displayName.value = user.displayName || "";
    email.value = user.email || "";
    photoURL.value = user.photoURL || "";
  }
});

function onFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) { // limite 2 Mo
      error.value = "La taille de l'image ne doit pas dépasser 2 Mo.";
      fileState.value = false;
      selectedFile.value = null;
    } else {
      error.value = "";
      fileState.value = true;
      selectedFile.value = file;
    }
  }
}

async function uploadPhoto(file, userId) {
  const photoRef = storageRef(storage, `profilePhotos/${userId}/${file.name}`);
  await uploadBytes(photoRef, file);
  return await getDownloadURL(photoRef);
}

async function updateProfileHandler() {
  error.value = "";
  success.value = "";
  loading.value = true;

  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Utilisateur non connecté.");

    let newPhotoURL = photoURL.value;

    if (selectedFile.value) {
      newPhotoURL = await uploadPhoto(selectedFile.value, user.uid);
    }

    await updateProfile(user, {
      displayName: displayName.value,
      photoURL: newPhotoURL,
    });

    await user.reload();

    photoURL.value = newPhotoURL;
    success.value = "Profil mis à jour avec succès.";
  } catch (err) {
    error.value = err.message || "Erreur lors de la mise à jour du profil.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
}
.is-invalid {
  border-color: #dc3545;
}
</style>
