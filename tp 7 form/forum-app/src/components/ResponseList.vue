<template>
  <div>
    <ResponseItem
      v-for="r in responses"
      :key="r.id"
      :response="r"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { db } from "@/firebase"
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"
import ResponseItem from "./ResponseItem.vue"

const props = defineProps({ discussionId: String })
const responses = ref([])

onMounted(() => {
  const q = query(
    collection(db, "responses"),
    where("discussionId", "==", props.discussionId),
    orderBy("createdAt", "asc")
  )

  onSnapshot(q, snap => {
    responses.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })
})
</script>
