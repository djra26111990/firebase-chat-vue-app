import Vue from 'vue'
import VueRouter from 'vue-router'
import PrivateChat from '../views/PrivateChat.vue'
import SignUp from '@/views/SignUp'
import Login from '@/views/Login'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/chat',
    name: 'Chat',
    component: PrivateChat
  },
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
