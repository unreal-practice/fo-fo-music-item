import { ref } from 'vue'
  const count = ref(0)
  const load = () => {
    count.value += 2
  }