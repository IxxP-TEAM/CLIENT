<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// msg 값을 API로부터 받아서 업데이트할 수 있도록 ref 사용
const msg = ref('')

// API 호출하여 데이터 가져오기
const fetchMessage = async () => {
  try {
    const response = await axios.get('/api/hello')
    msg.value = response.data  // API 응답을 msg에 할당
  } catch (error) {
    console.error('Error fetching message:', error)
    msg.value = 'Error fetching message'
  }
}

// 컴포넌트가 마운트될 때 API 호출
onMounted(() => {
  fetchMessage()
})
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a href="https://vite.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>