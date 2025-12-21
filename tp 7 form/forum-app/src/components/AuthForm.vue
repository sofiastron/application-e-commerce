<template>
  <b-card class="fade-up">
    <b-form @submit.prevent="submit">
      <b-form-input v-model="email" placeholder="Email" />
      <b-form-input type="password" v-model="password" placeholder="Password" />
      <b-form-input v-if="register" v-model="name" placeholder="Name" />
      <b-button class="mt-3" type="submit">
        {{ register ? 'Register' : 'Login' }}
      </b-button>
    </b-form>
  </b-card>
</template>

<script setup>
import { ref } from "vue"
import { useAuth } from "@/composables/useAuth"

const props = defineProps({ register: Boolean })
const email = ref("")
const password = ref("")
const name = ref("")
const { login, register: signup } = useAuth()

const submit = () =>
  props.register
    ? signup(email.value, password.value, name.value)
    : login(email.value, password.value)
</script>
