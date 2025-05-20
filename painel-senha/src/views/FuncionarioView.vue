<template>
  <div class="h-screen w-screen relative overflow-hidden">
    <!-- BACKGROUND -->
    <div
      class="absolute inset-0 bg-cover bg-center blur-sm scale-105"
      style="background-image: url('/background.jpg')"
    ></div>

    <!-- CONTEUDO -->
    <div class="relative z-10 text-white flex flex-col p-6" style="padding-top: 12%;">
      <!-- ENGENAGEM -->
      <button
        class="absolute top-4 left-4 text-white hover:text-gray-300 text-3xl"
        @click="abrirConfiguracao = true"
        title="Configurar Guichê"
      >⚙️</button>

      <div class="w-full text-center content-center items-center justify-center h-full" style="padding-bottom: 50px;">
          <h1 class="text-9xl font-extrabold drop-shadow-md">Guichê #{{ guiche }} Configurado</h1>
        </div>

      <!-- COLUNAS -->
      <div class="flex gap-6 content-center items-center justify-center">
        <!-- COLUNA ESQUERDA -->
        <div class="flex flex-col justify-between w-1/4 bg-gray-300 bg-opacity-90 p-6 rounded-3xl text-black font-bold">
          <div class="bg-white p-6 rounded-full text-center shadow">
            <p class="text-sm uppercase">PRÓXIMO NA FILA</p>
            <p class="text-2xl mt-2">{{ proximaSenha?.codigo || '--' }}</p>
          </div>
          <br />
          <div class="bg-white p-6 rounded-full text-center shadow">
            <p class="text-sm uppercase">ÚLTIMA CHAMADA</p>
            <p class="text-2xl mt-2">{{ ultimaChamada?.codigo || '--' }}</p>
          </div>
          <br />
                    <!-- BOTOES -->
          <div class="mt-10 flex justify-center gap-6">
            <button
              class="bg-white text-black px-6 py-3 rounded-lg font-bold shadow hover:bg-gray-100"
              @click="chamarUltima"
            >
              CHAMAR ANTERIOR NOVAMENTE
            </button>
            <button
              class="bg-[#eb0641] text-white px-6 py-3 rounded-lg font-bold shadow hover:brightness-110"
              @click="chamarSenha"
            >
              Próximo
            </button>
          </div>

        </div>

        <!-- COLUNA DIREITA -->
        <div class="flex flex-col items-center justify-start bg-gray-300 bg-opacity-90 p-6 rounded-3xl">
          <!-- SENHAS AGUARDANDO -->
          <div class="w-full">
            <h2 class="text-3xl font-extrabold text-[#eb0641] text-center mb-6">
              SENHAS AGUARDANDO
            </h2>

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 justify-center">
              <div
                v-for="senha in fila"
                :key="senha.id"
                class="bg-gray-700 text-white text-lg font-mono py-3 px-4 rounded text-center shadow"
              >
                {{ senha.codigo }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL CONFIGURACAO GUICHE -->
      <div v-if="abrirConfiguracao" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white text-black p-6 rounded-xl shadow w-full max-w-sm space-y-4">
          <h2 class="text-2xl font-bold">Configurar Guichê</h2>
          <input
            type="number"
            min="1"
            v-model="guiche"
            class="w-full px-4 py-2 border rounded"
          />
          <div class="flex justify-end gap-4">
            <button
              @click="abrirConfiguracao = false"
              class="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              @click="salvarGuiche"
              class="bg-[#eb0641] text-white px-4 py-2 rounded hover:brightness-110"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'

const proximaSenha = ref(null)
const ultimaChamada = ref(null)
const filaPreferencial = ref([])
const filaComum = ref([])
const fila = ref([])
const horaAtual = ref(dayjs().format('HH:mm:ss'))
const guiche = ref(localStorage.getItem('guiche') || '1')
const abrirConfiguracao = ref(false)

async function carregarFila() {
  const res = await fetch('http://localhost:3000/fila')
  const todas = await res.json()
  fila.value = todas
  filaPreferencial.value = todas.filter(s => s.tipo === 'preferencial')
  filaComum.value = todas.filter(s => s.tipo === 'comum')
  proximaSenha.value = todas[0] || null
}

async function carregarUltima() {
  const res = await fetch('http://localhost:3000/senha/ultima')
  if (res.status === 200) {
    ultimaChamada.value = await res.json()
  }
}

async function chamarSenha() {
  const res = await fetch(`http://localhost:3000/senha/proxima?guiche=${guiche.value}`)
  if (res.status !== 204) {
    const dados = await res.json()
    ultimaChamada.value = dados
  }
  await carregarFila()
}

function chamarUltima() {
  if (ultimaChamada.value) {
    const codigo = ultimaChamada.value.codigo
    const guicheNum = ultimaChamada.value.guiche
    if ('speechSynthesis' in window) {
      const frase = `Senha ${codigo.split('').join(' ')}, dirigir-se ao guichê ${guicheNum}`
      const utterance = new SpeechSynthesisUtterance(frase)
      utterance.lang = 'pt-BR'
      utterance.rate = 0.9
      speechSynthesis.speak(utterance)
    }
  }
}

function salvarGuiche() {
  localStorage.setItem('guiche', guiche.value)
  abrirConfiguracao.value = false
}

onMounted(() => {
  carregarFila()
  carregarUltima()
  setInterval(() => {
    horaAtual.value = dayjs().format('HH:mm:ss')
    carregarFila()
    carregarUltima()
  }, 5000)
})
</script>

<style scoped>
body {
  font-family: 'Segoe UI', sans-serif;
}
</style>
