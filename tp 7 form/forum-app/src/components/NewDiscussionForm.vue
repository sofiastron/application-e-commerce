<template>
  <b-card class="mb-3">
    <b-form @submit.prevent="create">
      <b-form-input v-model="title" placeholder="Titre de la discussion" required />
      <b-form-textarea v-model="content" placeholder="Contenu de la discussion" rows="4" required />

      <!-- Sélecteur de catégorie -->
      <b-form-select v-model="category" :options="categories" required class="mt-2" />
      
      <b-button type="submit" class="mt-2">Publier</b-button>
    </b-form>
  </b-card>
</template>

<script setup>
import { ref } from "vue"
import { auth, db } from "@/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

const title = ref("")
const content = ref("")
const category = ref("Général")

// Liste des catégories
const categories = [
  { value: "Général", text: "Général" },
  { value: "Technologie", text: "Technologie" },
  { value: "Actualité", text: "Actualité" },
  { value: "Autre", text: "Autre" }
]

const create = async () => {
  if (!title.value || !content.value || !category.value) return

  try {
    await addDoc(collection(db, "discussions"), {
      title: title.value,
      content: content.value,
      category: category.value,
      authorId: auth.currentUser.uid,
      createdAt: serverTimestamp()
    })

    title.value = ""
    content.value = ""
    category.value = "Général"
  } catch (err) {
    console.error("Erreur création discussion:", err)
  }
}
</script>
