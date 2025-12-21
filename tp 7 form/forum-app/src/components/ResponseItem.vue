<template>
  <b-card class="mb-2">
    <div>
      <strong>{{ response.authorName }}</strong> — <small>{{ formatDate(response.createdAt) }}</small>
    </div>
    <div>{{ response.content }}</div>

    <b-button size="sm" variant="outline-primary" @click="$emit('edit', response)">Modifier</b-button>
    <b-button size="sm" variant="outline-danger" @click="$emit('delete', response.id)">Supprimer</b-button>
    <b-button size="sm" variant="outline-warning" @click="signalMessage">Signaler</b-button>
  </b-card>
</template>

<script setup>
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const props = defineProps({
  response: Object,
});

function formatDate(timestamp) {
  if (!timestamp) return "";
  return timestamp.toDate().toLocaleString();
}

async function signalMessage() {
  if (!auth.currentUser) {
    alert("Vous devez être connecté pour signaler un message.");
    return;
  }

  try {
    await addDoc(collection(db, "reports"), {
      messageId: props.response.id,
      reportedBy: auth.currentUser.uid,
      reason: "", // Optionnel: tu peux demander un motif via un modal
      createdAt: serverTimestamp(),
    });
    alert("Merci d'avoir signalé ce message. Nous allons l'examiner.");
  } catch (error) {
    console.error("Erreur lors du signalement :", error);
    alert("Erreur lors du signalement du message.");
  }
}
</script>
