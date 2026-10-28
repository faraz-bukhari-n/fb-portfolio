import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash) {
      return new Promise((resolve) => {
        const tryScroll = (attempt = 0) => {
          if (document.querySelector(to.hash) || attempt > 24) {
            resolve({ el: to.hash, top: 72 })
            return
          }
          requestAnimationFrame(() => tryScroll(attempt + 1))
        }
        tryScroll()
      })
    }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/experience',
      name: 'experience',
      component: () => import('@/views/ExperienceView.vue'),
    },
    {
      path: '/work',
      name: 'work',
      component: () => import('@/views/WorkView.vue'),
    },
    {
      path: '/work/:slug',
      name: 'work-detail',
      component: () => import('@/views/WorkDetailView.vue'),
    },
    {
      path: '/skills',
      redirect: { path: '/', hash: '#skills' },
    },
    {
      path: '/writing',
      name: 'writing',
      component: () => import('@/views/WritingView.vue'),
    },
    {
      path: '/writing/:slug',
      name: 'article',
      component: () => import('@/views/ArticleView.vue'),
    },
    {
      path: '/contact',
      redirect: { path: '/', hash: '#contact' },
    },
    {
      path: '/resume',
      name: 'resume',
      component: () => import('@/views/ResumeView.vue'),
    },
  ],
})

export default router
