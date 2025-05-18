<template>
  <div class="p-6 max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-4">Painel do Funcionário</h1>

    <!-- Campo de guichê -->
    <label class="block mb-2 text-sm font-medium text-gray-200">Guichê</label>
    <input
      v-model="guiche"
      type="number"
      min="1"
      placeholder="Digite o número do guichê"
      class="mb-4 w-full px-4 py-2 rounded border border-gray-400 text-black"
    />

    <!-- Botão de chamar -->
    <button
      @click="chamarSenha"
      class="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
    >
      Chamar próxima senha
    </button>

    <!-- Senha chamada -->
    <div v-if="senhaAtual" class="mt-6 p-4 bg-gray-800 rounded text-white">
      <p class="text-xl">Senha: <strong>{{ senhaAtual }}</strong></p>
      <p class="text-lg">Guichê: <strong>{{ guiche }}</strong></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const senhaAtual = ref(null)
const guiche = ref('1')

async function chamarSenha() {
  const res = await fetch(`http://localhost:3000/senha/proxima?guiche=${guiche.value}`)
  if (res.status === 204) {
    senhaAtual.value = null
  } else {
    const dados = await res.json()
    senhaAtual.value = dados.codigo
  }
}
</script>
