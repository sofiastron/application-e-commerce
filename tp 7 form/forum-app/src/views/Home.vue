<template>
  <div class="container mt-4">
    <b-row class="mb-3 align-items-center">
      <b-col cols="12" md="6">
        <b-form-input
          v-model="searchTerm"
          placeholder="Rechercher une discussion..."
          clearable
        />
      </b-col>
      <b-col cols="12" md="6" class="text-md-end mt-2 mt-md-0">
        <b-form-select
          v-model="selectedCategory"
          :options="categoryOptions"
        />
      </b-col>
    </b-row>

    <b-button variant="primary" class="mb-3" @click="showNewDiscussionForm = !showNewDiscussionForm">
      {{ showNewDiscussionForm ? "Annuler" : "Créer une nouvelle discussion" }}
    </b-button>

    <NewDiscussionForm
      v-if="showNewDiscussionForm"
      @discussion-created="handleDiscussionCreated"
    />

    <b-tabs card>
      <b-tab title="Discussions récentes" active>
        <DiscussionList :discussions="filteredDiscussionsRecent" />
      </b-tab>
      <b-tab title="Discussions populaires">
        <DiscussionList :discussions="filteredDiscussionsPopular" />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import DiscussionList from "../components/DiscussionList.vue";
import NewDiscussionForm from "../components/NewDiscussionForm.vue";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const discussions = ref([]);
const searchTerm = ref("");
const selectedCategory = ref("Toutes les catégories");
const showNewDiscussionForm = ref(false);

const categories = [
  { value: "Toutes les catégories", text: "Toutes les catégories" },
  { value: "Général", text: "Général" },
  { value: "Technologie", text: "Technologie" },
  { value: "Actualité", text: "Actualité" },
  { value: "Autre", text: "Autre" }
];

const categoryOptions = categories;

const loadDiscussions = () => {
  const q = query(collection(db, "discussions"), orderBy("createdAt", "desc"));
  onSnapshot(q, snap => {
    discussions.value = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      popularity: doc.data().popularity || 0
    }));
  });
};

// Filtrage par catégorie + recherche
const filteredDiscussionsRecent = computed(() => {
  return discussions.value
    .filter(d => {
      return selectedCategory.value === "Toutes les catégories" || d.category === selectedCategory.value;
    })
    .filter(d => {
      return d.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
             d.content.toLowerCase().includes(searchTerm.value.toLowerCase());
    })
    .slice(0, 10);
});

const filteredDiscussionsPopular = computed(() => {
  return discussions.value
    .filter(d => {
      return selectedCategory.value === "Toutes les catégories" || d.category === selectedCategory.value;
    })
    .filter(d => {
      return d.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
             d.content.toLowerCase().includes(searchTerm.value.toLowerCase());
    })
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10);
});

function handleDiscussionCreated() {
  showNewDiscussionForm.value = false;
}

onMounted(() => {
  loadDiscussions();
});
</script>

<style scoped>
.container {
  max-width: 900px;
}
</style>
