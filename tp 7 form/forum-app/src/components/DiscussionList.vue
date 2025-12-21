<template>
  <div>
    <DiscussionItem
      v-for="d in discussions"
      :key="d.id"
      :discussion="d"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { db } from "@/firebase"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import DiscussionItem from "./DiscussionItem.vue"

const discussions = ref([])

onMounted(() => {
  const q = query(collection(db, "discussions"), orderBy("createdAt", "desc"))

  onSnapshot(q, snap => {
    discussions.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })
})
</script>
