<template>
  <div class="p-4 text-center">
    <!-- Título da página -->
    <h1 class="text-2xl font-bold mb-4">Retirar Senha</h1>

    <!-- Botões para escolher o tipo de senha -->
    <div class="space-x-4">
      <!-- Botão de senha comum -->
      <button
        @click="gerarSenha('comum')"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Senha Comum
      </button>

      <!-- Botão de senha preferencial -->
      <button
        @click="gerarSenha('preferencial')"
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Senha Preferencial
      </button>
    </div>

    <!-- Exibe a última senha gerada -->
    <p v-if="ultimaSenha" class="mt-4 text-xl">
      Sua senha: <strong>{{ ultimaSenha }}</strong>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Estado local para mostrar a senha gerada
const ultimaSenha = ref(null)

// Função para gerar senha (comum ou preferencial)
async function gerarSenha(tipo) {
  const prefixo = tipo === 'comum' ? 'C' : 'P'
  const codigo = prefixo + Date.now().toString().slice(-4) // Ex: C8492

  // Envia para a API
  await fetch('http://localhost:3000/senha', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipo, codigo })
  })

  ultimaSenha.value = codigo
}

</script>
