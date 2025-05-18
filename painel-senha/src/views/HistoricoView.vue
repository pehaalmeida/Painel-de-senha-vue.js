<template>
  <div class="p-6 max-w-2xl mx-auto">
    <!-- Título da página -->
    <h1 class="text-3xl font-bold mb-6 text-center text-purple-700">Histórico de Senhas Chamadas</h1>

    <!-- Lista das senhas chamadas -->
    <ul v-if="historico.length > 0" class="space-y-3">
      <li
        v-for="item in historico"
        :key="item.id"
        class="border border-gray-300 p-4 rounded-lg shadow-sm flex justify-between items-center"
      >
        <div class="text-lg font-mono">
          <strong>{{ item.codigo }}</strong> <span class="text-sm text-gray-500">(ID: {{ item.id }})</span>
        </div>

        <!-- Estilo do tipo de senha -->
        <span
          :class="item.tipo === 'preferencial'
            ? 'text-green-600 font-semibold'
            : 'text-blue-600 font-semibold'"
        >
          {{ item.tipo }}
        </span>
      </li>
    </ul>

    <!-- Caso não tenha nada no histórico -->
    <p v-else class="text-center text-gray-500 mt-6">Nenhum histórico encontrado.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Lista reativa com os dados do histórico
const historico = ref([])

/**
 * Função que chama a API e carrega o histórico das senhas chamadas
 */
async function carregarHistorico() {
  try {
    const res = await fetch('http://localhost:3000/historico')
    if (!res.ok) {
      console.error('Erro ao buscar histórico:', res.status)
      return
    }

    historico.value = await res.json()
  } catch (error) {
    console.error('Erro de rede:', error)
  }
}

// Executa a função ao abrir a tela
onMounted(carregarHistorico)
</script>
