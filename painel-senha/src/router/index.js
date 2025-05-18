import { createRouter, createWebHistory } from 'vue-router'

// Importação dinâmica das views
const routes = [
  { path: '/', redirect: '/cliente' },
  { path: '/cliente', component: () => import('../views/ClienteView.vue') },
  { path: '/funcionario', component: () => import('../views/FuncionarioView.vue') },
  { path: '/painel', component: () => import('../views/PainelView.vue') },
  { path: '/historico', component: () => import('../views/HistoricoView.vue') }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
