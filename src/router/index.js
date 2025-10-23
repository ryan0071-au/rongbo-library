import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import AccessDenied from '../views/AccessDenied.vue'
import { isAuthenticated } from '../stores/auth'
import FirebaseSigninView from '@/views/FirebaseSigninView.vue'
import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue'
import AddBookView from '@/views/AddBookView.vue'
import GetBookCountView from '@/views/GetBookCountView.vue'
import WeatherView from '@/views/WeatherView.vue'
import CountBookAPI from '@/views/CountBookAPI.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/about', name: 'About', component: AboutView, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/denied', name: 'AccessDenied', component: AccessDenied },
  { path: '/FireLogin', name: 'FireLogin', component: FirebaseSigninView },
  { path: '/FireRegister', name: 'FireRegister', component: FirebaseRegisterView },
  { path: '/AddBook', name: 'AddBook', component: AddBookView },
  { path: '/GetBookCount', name: 'GetBookCount', component: GetBookCountView },
  { path: '/WeatherCheck', name: 'WeatherCheck', component: WeatherView },
  { path: '/CountBookAPI', name: 'CountBookAPI', component: CountBookAPI },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }
  next()
})

export default router
