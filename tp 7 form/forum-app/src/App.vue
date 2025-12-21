<template>
  <div id="app">
    <Navbar />

    <b-container fluid class="mt-3">
      <router-view />
    </b-container>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>

<style>
body {
  font-family: 'Poppins', sans-serif;
  background-color: #f9f9f9;
  margin: 0;
  padding: 0;
}
</style>
