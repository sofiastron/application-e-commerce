<template>
  <b-card class="discussion-item fade-up">
    <h5>{{ discussion.title }}</h5>
    <p>{{ discussion.content }}</p>
    <router-link :to="`/discussion/${discussion.id}`">
      View discussion
    </router-link>
  </b-card>
</template>

<script setup>
defineProps({ discussion: Object })
</script>
