// Importa a função defineStore do Pinia
import { defineStore } from 'pinia'

// Variáveis de controle para os números das senhas
let contadorComum = 0
let contadorPref = 0

/**
 * Store "fila" controla a lógica de senhas:
 * - Filas separadas para comum e preferencial
 * - Histórico de senhas geradas
 * - Funções para adicionar e chamar senha
 */
export const useFilaStore = defineStore('fila', {
  state: () => ({
    filaComum: [],     // Fila de senhas comuns (ex: C001, C002)
    filaPref: [],      // Fila de senhas preferenciais (ex: P001, P002)
    historico: [],     // Lista de todas as senhas geradas (opcional)
  }),
  actions: {
    /**
     * Gera uma nova senha e adiciona na fila correta
     * @param {string} tipo - 'comum' ou 'preferencial'
     * @returns {string} - Código da senha gerada
     */
    adicionarSenha(tipo) {
      let codigo = ''

      if (tipo === 'comum') {
        contadorComum++
        codigo = 'C' + String(contadorComum).padStart(3, '0')
        this.filaComum.push(codigo)
      } else {
        contadorPref++
        codigo = 'P' + String(contadorPref).padStart(3, '0')
        this.filaPref.push(codigo)
      }

      this.historico.push(codigo)
      return codigo
    },

    /**
     * Retira a próxima senha da fila para atendimento
     * Prioriza preferencial > comum
     * @returns {string|null} - Código da senha ou null se vazio
     */
    chamarProximaSenha() {
      if (this.filaPref.length > 0) {
        return this.filaPref.shift()
      } else if (this.filaComum.length > 0) {
        return this.filaComum.shift()
      }
      return null
    }
  }
})
