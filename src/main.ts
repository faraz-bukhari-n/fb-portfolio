import { createHead } from '@unhead/vue/client'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'lenis/dist/lenis.css'
import './styles/base.css'

const app = createApp(App)
app.use(createHead())
app.use(router)
app.mount('#app')
