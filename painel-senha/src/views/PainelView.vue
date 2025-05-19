<template>
  <div class="h-screen bg-black text-white font-sans flex flex-col overflow-hidden">
    <!-- TOPO -->
    <div class="w-full bg-white text-black text-center py-6 shadow" style="flex: 0 0 20%;">
      <div class="flex items-center justify-center h-full space-x-6">
        <p class="text-8xl font-extrabold">
          <span class="text-[#eb0641]">SENHA: </span>
          <span class="text-black font-mono">{{ senhaAtual || '--' }}</span>
        </p>
        <span class="text-6xl font-extrabold">|</span>
        <p v-if="guicheAtual " class="text-8xl font-extrabold">
          <span class="text-[#eb0641] text-purple-600">GUICHÊ: </span>
          <span class="text-black font-mono">{{ guicheAtual }}</span>
        </p>
      </div>
    </div>


    <!-- CORPO PRINCIPAL -->
    <div class="flex flex-1">
      <!-- COLUNA ESQUERDA -->
      <div class="flex flex-col w-1/3 p-4 space-y-6">
        <!-- SENHAS AGUARDANDO -->
        <div class="flex flex-col flex-1 bg-gray-800 p-4 rounded shadow">
          <h2 class="text-4xl font-bold text-[#eb0641] text-center mb-4">SENHAS AGUARDANDO</h2>
          <div class="flex flex-wrap gap-3 overflow-y-auto justify-center">
            <span
              v-for="item in fila"
              :key="item.id"
              class="bg-gray-600 px-6 py-3 rounded text-lg font-mono"
            >
              {{ item.codigo }}
            </span>
          </div>
        </div>

        <!-- HISTÓRICO -->
        <div class="flex flex-col flex-1 bg-gray-800 p-4 rounded shadow">
          <h2 class="text-4xl font-bold text-[#ffff] text-center mb-4">SENHAS JÁ CHAMADAS</h2>
          <div class="flex flex-wrap gap-3 overflow-y-auto justify-center">
            <span
              v-for="item in historico"
              :key="item.id"
              class="bg-gray-600 px-6 py-3 rounded text-lg font-mono"
            >
              {{ item.codigo }}
            </span>
          </div>
        </div>
      </div>

      <!-- COLUNA DIREITA: VÍDEO -->
      <div class="flex-1 p-4 flex items-center justify-center">
        <div class="w-full h-full bg-black rounded shadow overflow-hidden">
          <video autoplay loop muted class="w-full h-full object-contain">
            <source src="/propaganda.mp4" type="video/mp4" />
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
