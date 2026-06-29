import { createRouter, createWebHashHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/tools/batch-collage', name: 'batch-collage', component: () => import('../views/CollageStudioView.vue') },
  ],
})
