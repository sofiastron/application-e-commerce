<template>
  <b-card class="mb-2">
    <b-form @submit.prevent="send">
      <b-form-textarea
        v-model="content"
        placeholder="Écrire une réponse..."
        rows="3"
        required
      />
      <b-button type="submit" class="mt-2">Répondre</b-button>
    </b-form>
  </b-card>
</template>

<script setup>
import { ref } from "vue"
import { auth, db } from "@/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

const props = defineProps({ discussionId: String })
const content = ref("")

const send = async () => {
  if (!content.value) return

  try {
    await addDoc(collection(db, "responses"), {
      content: content.value,
      discussionId: props.discussionId,
      authorId: auth.currentUser.uid,
      createdAt: serverTimestamp()
    })
    content.value = "" // vider le champ après envoi
  } catch (err) {
    console.error("Erreur lors de l'enregistrement de la réponse :", err)
  }
}
</script>
