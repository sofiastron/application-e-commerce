<template>
  <b-container class="my-4">
    <h2 class="mb-4 text-primary">Panneau d'administration</h2>

    <b-alert v-if="error" variant="danger" dismissible @dismissed="error = ''">
      {{ error }}
    </b-alert>

    <b-alert v-if="success" variant="success" dismissible @dismissed="success = ''">
      {{ success }}
    </b-alert>

    <!-- Filtrer par discussions signalées -->
    <b-form-checkbox v-model="showFlaggedOnly" class="mb-3">
      Afficher uniquement les discussions signalées
    </b-form-checkbox>

    <b-table
      :items="filteredDiscussions"
      :fields="fields"
      responsive
      striped
      hover
      small
      class="shadow-sm"
    >
      <template #cell(actions)="row">
        <b-button
          size="sm"
          variant="danger"
          @click="deleteDiscussion(row.item.id)"
          title="Supprimer la discussion"
        >
          Supprimer
        </b-button>
      </template>

      <template #cell(flagged)="row">
        <b-badge variant="warning" v-if="row.item.flagged">Signalée</b-badge>
        <span v-else>—</span>
      </template>
    </b-table>
  </b-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const discussions = ref([]);
const error = ref("");
const success = ref("");
const showFlaggedOnly = ref(false);

const fields = [
  { key: "title", label: "Titre", sortable: true },
  { key: "authorName", label: "Auteur", sortable: true },
  { key: "createdAt", label: "Date de création", sortable: true, formatter: (val) => val?.toDate().toLocaleString() },
  { key: "flagged", label: "Signalée" },
  { key: "actions", label: "Actions" },
];

// Fonction pour charger les discussions (option filtre signalées)
async function loadDiscussions() {
  try {
    let q;
    if (showFlaggedOnly.value) {
      q = query(collection(db, "discussions"), where("flagged", "==", true));
    } else {
      q = query(collection(db, "discussions"));
    }

    const snapshot = await getDocs(q);
    discussions.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (e) {
    error.value = "Erreur lors du chargement des discussions : " + e.message;
  }
}

// Supprimer une discussion
async function deleteDiscussion(id) {
  if (!confirm("Voulez-vous vraiment supprimer cette discussion ?")) return;

  try {
    await deleteDoc(doc(db, "discussions", id));
    success.value = "Discussion supprimée avec succès.";
    await loadDiscussions();
  } catch (e) {
    error.value = "Erreur lors de la suppression : " + e.message;
  }
}

onMounted(() => {
  loadDiscussions();
});

// Recharger automatiquement quand filtre change
watch(showFlaggedOnly, () => {
  loadDiscussions();
});

const filteredDiscussions = computed(() => {
  return discussions.value;
});
</script>

<style scoped>
h2 {
  font-weight: 700;
}
</style>
