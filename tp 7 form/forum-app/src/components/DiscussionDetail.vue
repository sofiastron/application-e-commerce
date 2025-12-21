<template>
  <b-container class="my-4">
    <b-card v-if="discussion" class="mb-4 shadow-sm">
      <h2>{{ discussion.title }}</h2>
      <p class="text-muted">
        Par <strong>{{ discussion.authorName }}</strong> — {{ formatDate(discussion.createdAt) }}
      </p>
      <p>{{ discussion.content }}</p>

      <div v-if="isAuthor(discussion.authorId)">
        <b-button size="sm" variant="warning" @click="editingDiscussion = true">Modifier</b-button>
        <b-button size="sm" variant="danger" @click="deleteDiscussion">Supprimer</b-button>
      </div>
    </b-card>

    <!-- Formulaire modification discussion -->
    <b-modal v-model="editingDiscussion" title="Modifier la discussion" @ok="updateDiscussion">
      <b-form-group label="Titre">
        <b-form-input v-model="editTitle" required></b-form-input>
      </b-form-group>
      <b-form-group label="Contenu">
        <b-form-textarea v-model="editContent" rows="5" required></b-form-textarea>
      </b-form-group>
    </b-modal>

    <!-- Liste des réponses -->
    <h4>Réponses</h4>
    <b-list-group>
      <b-list-group-item v-for="response in responses" :key="response.id" class="d-flex justify-content-between align-items-start">
        <div>
          <p class="mb-1">{{ response.content }}</p>
          <small class="text-muted">Par {{ response.authorName }} — {{ formatDate(response.createdAt) }}</small>
        </div>
        <div v-if="isAuthor(response.authorId)">
          <b-button size="sm" variant="warning" @click="editResponse(response)">Modifier</b-button>
          <b-button size="sm" variant="danger" @click="deleteResponse(response.id)">Supprimer</b-button>
        </div>
      </b-list-group-item>
    </b-list-group>

    <!-- Formulaire ajout réponse -->
    <div v-if="user">
      <b-card class="mt-4">
        <h5>Ajouter une réponse</h5>
        <b-form @submit.prevent="addResponse">
          <b-form-textarea v-model="newResponse" rows="3" placeholder="Votre réponse..." required></b-form-textarea>
          <b-button type="submit" variant="primary" class="mt-2">Répondre</b-button>
        </b-form>
      </b-card>
    </div>
    <div v-else class="text-center mt-4">
      <b-alert variant="info">Connectez-vous pour répondre.</b-alert>
    </div>

    <!-- Modal modification réponse -->
    <b-modal v-model="editingResponse" title="Modifier la réponse" @ok="updateResponse">
      <b-form-textarea v-model="editResponseContent" rows="4" required></b-form-textarea>
    </b-modal>
  </b-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../composables/useAuth";

const route = useRoute();
const router = useRouter();
const { user } = useAuth();

const discussionId = route.params.id;

const discussion = ref(null);
const responses = ref([]);

const newResponse = ref("");

// Édition discussion
const editingDiscussion = ref(false);
const editTitle = ref("");
const editContent = ref("");

// Édition réponse
const editingResponse = ref(false);
const editResponseContent = ref("");
const responseBeingEdited = ref(null);

function formatDate(timestamp) {
  return timestamp ? timestamp.toDate().toLocaleString() : "";
}

function isAuthor(authorId) {
  return user.value && user.value.uid === authorId;
}

// Charger discussion
async function loadDiscussion() {
  const docRef = doc(db, "discussions", discussionId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    discussion.value = { id: docSnap.id, ...docSnap.data() };
    editTitle.value = discussion.value.title;
    editContent.value = discussion.value.content;
  } else {
    alert("Discussion non trouvée !");
    router.push("/");
  }
}

// Charger réponses liées à la discussion
async function loadResponses() {
  const q = query(collection(db, "responses"), where("discussionId", "==", discussionId));
  const querySnapshot = await getDocs(q);
  responses.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// Ajouter réponse
async function addResponse() {
  if (!newResponse.value.trim()) return;
  try {
    await addDoc(collection(db, "responses"), {
      content: newResponse.value.trim(),
      authorId: user.value.uid,
      authorName: user.value.displayName || user.value.email,
      discussionId,
      createdAt: serverTimestamp(),
    });
    newResponse.value = "";
    await loadResponses();
  } catch (e) {
    alert("Erreur lors de l'ajout de la réponse : " + e.message);
  }
}

// Modifier discussion
async function updateDiscussion() {
  if (!editTitle.value.trim() || !editContent.value.trim()) {
    alert("Titre et contenu requis");
    return;
  }
  try {
    const docRef = doc(db, "discussions", discussionId);
    await updateDoc(docRef, {
      title: editTitle.value.trim(),
      content: editContent.value.trim(),
    });
    discussion.value.title = editTitle.value;
    discussion.value.content = editContent.value;
    editingDiscussion.value = false;
  } catch (e) {
    alert("Erreur lors de la modification : " + e.message);
  }
}

// Supprimer discussion
async function deleteDiscussion() {
  if (!confirm("Voulez-vous vraiment supprimer cette discussion ?")) return;
  try {
    await deleteDoc(doc(db, "discussions", discussionId));
    router.push("/");
  } catch (e) {
    alert("Erreur lors de la suppression : " + e.message);
  }
}

// Modifier réponse (ouvrir modal)
function editResponse(response) {
  responseBeingEdited.value = response;
  editResponseContent.value = response.content;
  editingResponse.value = true;
}

// Valider modification réponse
async function updateResponse() {
  if (!editResponseContent.value.trim()) {
    alert("Le contenu est requis");
    return;
  }
  try {
    const docRef = doc(db, "responses", responseBeingEdited.value.id);
    await updateDoc(docRef, { content: editResponseContent.value.trim() });
    editingResponse.value = false;
    await loadResponses();
  } catch (e) {
    alert("Erreur lors de la modification : " + e.message);
  }
}

// Supprimer réponse
async function deleteResponse(responseId) {
  if (!confirm("Voulez-vous vraiment supprimer cette réponse ?")) return;
  try {
    await deleteDoc(doc(db, "responses", responseId));
    await loadResponses();
  } catch (e) {
    alert("Erreur lors de la suppression : " + e.message);
  }
}

onMounted(async () => {
  await loadDiscussion();
  await loadResponses();
});
</script>

<style scoped>
h2 {
  font-weight: 700;
  color: #2c3e50;
}
</style>
