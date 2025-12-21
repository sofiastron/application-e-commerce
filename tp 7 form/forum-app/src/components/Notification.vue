<template>
  <b-toast
    v-model="visible"
    :title="title"
    :variant="variant"
    :auto-hide-delay="duration"
    solid
    toaster="b-toaster-top-right"
    @hidden="onHidden"
  >
    {{ message }}
  </b-toast>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "Notification",
  },
  variant: {
    type: String,
    default: "info", // success, danger, warning, etc.
  },
  duration: {
    type: Number,
    default: 4000, // en ms
  },
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:show", "hidden"]);

const visible = ref(props.show);

watch(
  () => props.show,
  (newVal) => {
    visible.value = newVal;
  }
);

function onHidden() {
  emit("update:show", false);
  emit("hidden");
}
</script>
