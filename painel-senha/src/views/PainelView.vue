<template>
  <div class="h-screen bg-black text-white font-sans flex flex-col overflow-hidden">
    <!-- TOPO -->
    <div class="w-full bg-white text-black text-center py-6 shadow" style="flex: 0 0 20%;">
      <h1 class="text-4xl font-bold text-purple-600">SENHA CHAMADA</h1>
      <p v-if="tipoSenha" class="text-lg text-gray-600 mt-2 uppercase"></p>
      <p class="text-6xl font-mono mt-4">{{ senhaAtual || '--' }}</p>
      <p v-if="guicheAtual" class="text-4xl font-bold text-purple-600 mt-4">
        GUICHÊ:<strong class="text-5xl font-mono ml-2">{{ guicheAtual }}</strong>
      </p>
    </div>


    <!-- CORPO PRINCIPAL -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 flex-1 overflow-hidden">
      <!-- COLUNA ESQUERDA -->
      <div class="flex flex-col gap-6 h-full">
        <!-- BLOCO: Aguardando -->
        <div class="bg-gray-800 p-4 rounded shadow w-full flex-1 flex flex-col">
          <h2 class="text-xl font-bold text-blue-300 mb-2">SENHAS AGUARDANDO</h2>
          <div class="flex flex-wrap gap-3 overflow-y-auto">
            <span
              v-for="item in fila"
              :key="item.id"
              class="bg-gray-600 px-6 py-3 rounded text-lg font-mono w-fit"
            >
              {{ item.codigo }}
            </span>
          </div>
        </div>

        <!-- BLOCO: Histórico -->
        <div class="bg-gray-800 p-4 rounded shadow w-full flex-1 flex flex-col">
          <h2 class="text-xl font-bold text-green-300 mb-2">ÚLTIMAS SENHAS CHAMADAS</h2>
          <div class="flex flex-wrap gap-3 overflow-y-auto">
            <span
              v-for="item in historico"
              :key="item.id"
              class="bg-gray-600 px-6 py-3 rounded text-lg font-mono w-fit"
            >
              {{ item.codigo }}
            </span>
          </div>
        </div>
      </div>

      <!-- COLUNA DIREITA: Vídeo -->
      <div class="md:col-span-2 h-full">
        <div class="w-full h-full bg-black rounded shadow overflow-hidden">
          <video autoplay loop muted class="w-full h-full object-cover rounded">
            <!--<source src="/propaganda.mp4" type="video/mp4" /> -->
            Seu navegador não suporta vídeo.
          </video>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const senhaAtual = ref(null)
const tipoSenha = ref(null)
const fila = ref([])
const historico = ref([])
const guicheAtual = ref(null)

async function atualizarPainel() {
  try {
    const atualRes = await fetch('http://localhost:3000/senha/ultima')
    if (atualRes.status === 200) {
      const dados = await atualRes.json()

      if (dados.codigo !== senhaAtual.value) {
        senhaAtual.value = dados.codigo
        tipoSenha.value = dados.tipo
        guicheAtual.value = dados.guiche || null

        const audio = new Audio('/som.mp3')

        // Aguarda o fim do som para falar a senha
        audio.addEventListener('ended', () => {
          falarSenha(dados.codigo, dados.guiche || '1')
        })

        audio.play().catch(() => {})
      }
    } else {
      senhaAtual.value = null
      tipoSenha.value = null
    }

    const filaRes = await fetch('http://localhost:3000/fila')
    fila.value = await filaRes.json()

    const histRes = await fetch('http://localhost:3000/historico')
    historico.value = await histRes.json()

  } catch (error) {
    console.error('Erro ao atualizar painel:', error)
  }
}

function falarSenha(codigo, guiche) {
  if ('speechSynthesis' in window) {
    const frase = `Senha ${codigo.split('').join(' ')}, dirigir-se ao guichê ${guiche}`;
    const utterance = new SpeechSynthesisUtterance(frase);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  } else {
    console.warn('Speech synthesis não suportado neste navegador.');
  }
}

onMounted(() => {
  atualizarPainel()
  setInterval(atualizarPainel, 3000)
})
</script>
