<template>
  <div class="container mt-4">
    <h2>{{ discussion?.title }}</h2>
    <p>{{ discussion?.content }}</p>

    <NewResponseForm :discussionId="discussionId" />
    <ResponseList :discussionId="discussionId" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { db } from "@/firebase"
import { doc, getDoc } from "firebase/firestore"
import NewResponseForm from "@/components/NewResponseForm.vue"
import ResponseList from "@/components/ResponseList.vue"

const route = useRoute()
const discussionId = route.params.id
const discussion = ref(null)

onMounted(async () => {
  const snap = await getDoc(doc(db, "discussions", discussionId))
  discussion.value = { id: snap.id, ...snap.data() }
})
</script>
