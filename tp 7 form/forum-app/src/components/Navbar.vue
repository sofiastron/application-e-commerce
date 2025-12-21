<template>
  <b-navbar variant="light">
    <b-navbar-brand>Forum</b-navbar-brand>

    <b-navbar-nav class="ms-auto">
      <b-nav-item to="/">Accueil</b-nav-item>

      <b-nav-item v-if="!user" to="/login">Connexion</b-nav-item>
      <b-nav-item v-if="!user" to="/register">Inscription</b-nav-item>

      <b-nav-item v-if="user" to="/profile">Profil</b-nav-item>

      <b-nav-item v-if="user" @click="logout" style="cursor:pointer">
        Déconnexion
      </b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const user = ref(null);

onMounted(() => {
  onAuthStateChanged(auth, (u) => {
    user.value = u;
  });
});

const logout = async () => {
  await signOut(auth);
};
</script>
