import { ref } from "vue";

export function useNotification() {
  const show = ref(false);
  const message = ref("");
  const title = ref("");
  const variant = ref("info"); // success, danger, warning, info

  function notify({ msg, type = "info", heading = "Notification", duration = 4000 }) {
    message.value = msg;
    variant.value = type;
    title.value = heading;
    show.value = true;

    // Auto hide after duration (ms)
    setTimeout(() => {
      show.value = false;
    }, duration);
  }

  return {
    show,
    message,
    title,
    variant,
    notify,
  };
}
