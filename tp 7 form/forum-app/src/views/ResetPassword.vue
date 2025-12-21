<template>
  <div class="reset-password-container">
    <h2>Réinitialiser le mot de passe</h2>
    <b-form @submit.prevent="handleReset">
      <b-form-group label="Email">
        <b-form-input v-model="email" type="email" required placeholder="Votre email" />
      </b-form-group>
      <b-button type="submit" variant="primary">Envoyer</b-button>
    </b-form>
    <b-alert v-if="message" variant="success" class="mt-3">{{ message }}</b-alert>
    <b-alert v-if="error" variant="danger" class="mt-3">{{ error }}</b-alert>
  </div>
</template>

<script>
import { ref } from "vue";
import { useAuth } from "../composables/useAuth";

export default {
  setup() {
    const email = ref("");
    const message = ref("");
    const { resetPassword, error } = useAuth();

    const handleReset = async () => {
      message.value = "";
      try {
        await resetPassword(email.value);
        message.value = "Email de réinitialisation envoyé. Vérifiez votre boîte mail.";
        email.value = "";
      } catch (e) {
        // L’erreur est déjà gérée dans useAuth.error, on peut l’afficher ici aussi si besoin
      }
    };

    return { email, message, error, handleReset };
  },
};
</script>

<style scoped>
.reset-password-container {
  max-width: 400px;
  margin: 50px auto;
}
</style>
