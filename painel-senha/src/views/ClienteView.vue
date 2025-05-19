<template>
  <div class="h-screen w-screen relative overflow-hidden">
    <!-- BACKGROUND COM DESFOQUE -->
    <div
      class="absolute inset-0 bg-cover bg-center scale-105"
      :style="{ backgroundImage: 'url(/background.jpg)' }"
    ></div>

    <!-- CAMADA DE CONTEÚDO CENTRAL -->
    <div class="relative z-10 h-full w-full flex flex-col text-white">
      <!-- TOPO -->


      <!-- CONTEÚDO CENTRAL -->
      <div class="flex-1 flex flex-col justify-center items-center space-y-12 px-4">

        <div class="w-full text-center p-8">
          <h1 class="text-9xl font-extrabold drop-shadow-md">Painel De Senha</h1>
          <p class="text-5xl mt-2 drop-shadow-md">Nome da organização</p>
        </div>

        <button
          @click="gerarSenha('Preferencial')"
          class="w-[500px] bg-[#eb0641] text-white text-3xl py-8 rounded-full shadow-xl hover:brightness-110 transition"
        >
          Senha Preferencial
        </button>

        <!-- BOTÃO COMUM -->
        <button
          @click="gerarSenha('Comum')"
          class="w-[500px] bg-white text-black border text-3xl py-8 rounded-full shadow-xl hover:bg-gray-100 transition"
        >
          Senha Comum
        </button>
      </div>

      <!-- ENGENAGEM -->
      <button
        @click="configAberta = true"
        class="absolute bottom-4 left-4 text-white hover:text-gray-200 text-4xl z-20"
        title="Configurações"
      >
        ⚙️
      </button>
    </div>

    <!-- MODAL DE SENHA -->
    <div v-if="modalAberto" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div class="bg-white text-black p-8 rounded-xl shadow-lg w-full max-w-md text-center space-y-6">
        <h2 class="text-3xl font-bold">Sua Senha</h2>
        <p class="text-5xl font-mono">{{ senhaModal }}</p>

        <div class="flex justify-center gap-4">
          <button
            @click="fecharModal"
            class="bg-gray-400 text-black px-6 py-3 rounded hover:bg-gray-500"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL CONFIGURAÇÕES -->
    <div v-if="configAberta" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow w-full max-w-sm text-black">
        <h2 class="text-2xl font-bold mb-4">Configurações</h2>
        <label class="flex items-center space-x-3">
          <input type="checkbox" v-model="configImpressao" class="w-5 h-5" />
          <span>Ativar impressão automática</span>
        </label>
        <div class="mt-6 flex justify-end">
          <button
            @click="configAberta = false"
            class="bg-[#eb0641] text-white px-4 py-2 rounded hover:bg-[#930404] transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>

    <!-- ÁREA OCULTA PARA IMPRESSÃO -->
    <div id="area-impressao" class="hidden p-8 text-center text-black">
      <!-- SENHA EM DESTAQUE -->
      <div class="bg-black text-white text-4xl font-bold py-4 px-6 mb-4">
        [=-=-=-=-=-=-=-= <b>SENHA</b> =-=-=-=-=-=-=-=]
      </div>

      <!-- DETALHES -->
      <p class="text-xl mb-2 capitalize"><b>SENHA:</b> {{ senhaModal }}</p>
      <p class="text-xl mb-2 capitalize"><b>TIPO DE SENHA:</b> {{ tipoSenhaModal }}</p>
      <p class="text-lg mb-6"><b>HORA DE ENTRADA:</b> {{ horaGerada }}</p>
      <p class="text-xl mb-8"><b>SEJA BEM VINDO!</b></p>

      <!-- RODAPÉ -->
      <div class="bg-black text-white text-lg font-medium py-2 px-4">
        [=-=-=-=-= <b> SISTEMA AUGUSTO </b> =-=-=-=-=]
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs' // você pode instalar com: npm i dayjs

const senhaModal = ref('')
const tipoSenhaModal = ref('')
const horaGerada = ref('')
const modalAberto = ref(false)
const configAberta = ref(false)
const configImpressao = ref(true)

async function gerarSenha(tipo) {
  const prefixo = tipo === 'comum' ? 'C' : 'P'
  const codigo = prefixo + Date.now().toString().slice(-4)

  await fetch('http://localhost:3000/senha', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipo, codigo })
  })

  senhaModal.value = codigo
  tipoSenhaModal.value = tipo
  horaGerada.value = dayjs().format('DD/MM/YYYY HH:mm')
  modalAberto.value = true

  if (configImpressao.value) {
    setTimeout(imprimirSenha, 300)
  }
}

function fecharModal() {
  modalAberto.value = false
}

function imprimirSenha() {
  const printContent = document.getElementById('area-impressao').innerHTML
  const janela = window.open('', '', 'height=600,width=400')
  janela.document.write(`
    <html><head><title>Imprimir Senha</title></head><body style="font-family: sans-serif; text-align: center;">
    ${printContent}
    </body></html>
  `)
  janela.document.close()
  janela.focus()
  janela.print()
}
</script>
