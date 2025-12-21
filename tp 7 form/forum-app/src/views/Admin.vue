<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-center">Panneau d’administration</h2>

    <b-tabs card>
      <!-- Onglet Utilisateurs -->
      <b-tab title="Utilisateurs" active>
        <b-table
          striped
          hover
          :items="users"
          :fields="userFields"
          :busy="loadingUsers"
          responsive="sm"
        >
          <template #cell(actions)="data">
            <b-button size="sm" variant="danger" @click="deleteUser(data.item.id)">
              Supprimer
            </b-button>
            <b-button size="sm" variant="warning" @click="toggleModerator(data.item)">
              {{ data.item.role === 'moderator' ? 'Retirer modérateur' : 'Promouvoir modérateur' }}
            </b-button>
          </template>
        </b-table>
      </b-tab>

      <!-- Onglet Discussions -->
      <b-tab title="Discussions">
        <b-table
          striped
          hover
          :items="discussions"
          :fields="discussionFields"
          :busy="loadingDiscussions"
          responsive="sm"
        >
          <template #cell(actions)="data">
            <b-button size="sm" variant="danger" @click="deleteDiscussion(data.item.id)">
              Supprimer
            </b-button>
          </template>
        </b-table>
      </b-tab>

      <!-- Onglet Signalements -->
      <b-tab title="Signalements">
        <b-table
          striped
          hover
          :items="reports"
          :fields="reportFields"
          :busy="loadingReports"
          responsive="sm"
        >
          <template #cell(actions)="data">
            <b-button size="sm" variant="success" @click="resolveReport(data.item.id)">
              Résoudre
            </b-button>
            <b-button size="sm" variant="danger" @click="deleteReportedMessage(data.item.messageId)">
              Supprimer message
            </b-button>
          </template>
        </b-table>
      </b-tab>
    </b-tabs>

    <b-alert
      v-if="errorMessage"
      variant="danger"
      dismissible
      class="mt-3"
      @dismissed="errorMessage = ''"
    >
      {{ errorMessage }}
    </b-alert>

    <b-alert
      v-if="successMessage"
      variant="success"
      dismissible
      class="mt-3"
      @dismissed="successMessage = ''"
    >
      {{ successMessage }}
    </b-alert>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { collection, getDocs, doc, deleteDoc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";

const users = ref([]);
const discussions = ref([]);
const reports = ref([]);

const loadingUsers = ref(false);
const loadingDiscussions = ref(false);
const loadingReports = ref(false);

const errorMessage = ref("");
const successMessage = ref("");

// Champs tables
const userFields = [
  { key: "email", label: "Email" },
  { key: "displayName", label: "Nom" },
  { key: "role", label: "Rôle" },
  { key: "actions", label: "Actions" },
];

const discussionFields = [
  { key: "title", label: "Titre" },
  { key: "authorName", label: "Auteur" },
  { key: "createdAt", label: "Date de création", formatter: (value) => value?.toDate().toLocaleString() || "" },
  { key: "actions", label: "Actions" },
];

const reportFields = [
  { key: "messageContent", label: "Message signalé" },
  { key: "reporterName", label: "Signalé par" },
  { key: "date", label: "Date", formatter: (value) => value?.toDate().toLocaleString() || "" },
  { key: "actions", label: "Actions" },
];

// Charger les utilisateurs
async function loadUsers() {
  loadingUsers.value = true;
  errorMessage.value = "";
  try {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    users.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    errorMessage.value = "Erreur lors du chargement des utilisateurs : " + error.message;
  } finally {
    loadingUsers.value = false;
  }
}

// Charger les discussions
async function loadDiscussions() {
  loadingDiscussions.value = true;
  errorMessage.value = "";
  try {
    const q = query(collection(db, "discussions"));
    const querySnapshot = await getDocs(q);
    discussions.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    errorMessage.value = "Erreur lors du chargement des discussions : " + error.message;
  } finally {
    loadingDiscussions.value = false;
  }
}

// Charger les signalements
async function loadReports() {
  loadingReports.value = true;
  errorMessage.value = "";
  try {
    const q = query(collection(db, "reports"));
    const querySnapshot = await getDocs(q);
    reports.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    errorMessage.value = "Erreur lors du chargement des signalements : " + error.message;
  } finally {
    loadingReports.value = false;
  }
}

// Supprimer un utilisateur
async function deleteUser(userId) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
  try {
    await deleteDoc(doc(db, "users", userId));
    successMessage.value = "Utilisateur supprimé avec succès.";
    await loadUsers();
  } catch (error) {
    errorMessage.value = "Erreur lors de la suppression de l'utilisateur : " + error.message;
  }
}

// Promouvoir ou retirer modérateur
async function toggleModerator(user) {
  const newRole = user.role === "moderator" ? "user" : "moderator";
  try {
    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, { role: newRole });
    successMessage.value = `Rôle mis à jour : ${newRole}`;
    await loadUsers();
  } catch (error) {
    errorMessage.value = "Erreur lors de la mise à jour du rôle : " + error.message;
  }
}

// Supprimer une discussion
async function deleteDiscussion(discussionId) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer cette discussion ?")) return;
  try {
    await deleteDoc(doc(db, "discussions", discussionId));
    successMessage.value = "Discussion supprimée avec succès.";
    await loadDiscussions();
  } catch (error) {
    errorMessage.value = "Erreur lors de la suppression de la discussion : " + error.message;
  }
}

// Résoudre un signalement (le supprimer)
async function resolveReport(reportId) {
  if (!confirm("Marquer ce signalement comme résolu ?")) return;
  try {
    await deleteDoc(doc(db, "reports", reportId));
    successMessage.value = "Signalement résolu.";
    await loadReports();
  } catch (error) {
    errorMessage.value = "Erreur lors de la résolution du signalement : " + error.message;
  }
}

// Supprimer le message signalé (discussion ou réponse)
async function deleteReportedMessage(messageId) {
  if (!confirm("Supprimer le message signalé ?")) return;
  try {
    // Ici tu dois vérifier si messageId est dans discussions ou réponses, exemple simplifié:
    const discussionRef = doc(db, "discussions", messageId);
    await deleteDoc(discussionRef);
    successMessage.value = "Message supprimé.";
    await loadReports();
    await loadDiscussions();
  } catch (error) {
    errorMessage.value = "Erreur lors de la suppression du message : " + error.message;
  }
}

onMounted(() => {
  loadUsers();
  loadDiscussions();
  loadReports();
});
</script>

<style scoped>
.container {
  max-width: 1000px;
}

h2 {
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  color: #34495e;
}
</style>
