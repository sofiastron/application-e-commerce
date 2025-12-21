<template>
  <div class="container d-flex justify-content-center align-items-center" style="min-height: 80vh;">
    <b-card style="max-width: 400px; width: 100%;">
      <h3 class="mb-4 text-center">Créer un compte</h3>

      <!-- Message d'erreur -->
      <b-alert variant="danger" v-if="error" dismissible @dismissed="error = ''">
        {{ error }}
      </b-alert>

      <!-- Formulaire -->
      <b-form @submit.prevent="handleRegister">

        <!-- Email -->
        <b-form-group label="Email" label-for="emailInput">
          <b-form-input
            id="emailInput"
            type="email"
            v-model="email"
            required
            placeholder="Entrez votre email"
          />
        </b-form-group>

        <!-- Mot de passe -->
        <b-form-group label="Mot de passe" label-for="passwordInput">
          <b-form-input
            id="passwordInput"
            type="password"
            v-model="password"
            required
            placeholder="Entrez votre mot de passe"
            minlength="6"
          />
        </b-form-group>

        <!-- Bouton -->
        <b-button type="submit" variant="primary" class="w-100" :disabled="loading">
          {{ loading ? "Inscription..." : "S'inscrire" }}
        </b-button>
      </b-form>

      <!-- Lien vers login -->
      <div class="mt-3 text-center">
        <router-link to="/login">Déjà un compte ? Se connecter</router-link>
      </div>
    </b-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const router = useRouter();
const { register } = useAuth();

async function handleRegister() {
  error.value = "";
  loading.value = true;

  try {
    await register(email.value, password.value);
    router.push({ name: "Home" });
  } catch (err) {
    error.value = err.message || "Erreur lors de l'inscription.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.container {
  max-width: 100%;
}
</style>
