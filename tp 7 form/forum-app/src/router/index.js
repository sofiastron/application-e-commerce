import { createRouter, createWebHistory } from "vue-router"
import { auth } from "@/firebase"
import { onAuthStateChanged } from "firebase/auth"

import Home from "@/views/Home.vue"
import Login from "@/views/Login.vue"
import Register from "@/views/Register.vue"
import Profile from "@/views/Profile.vue"
import Discussion from "@/views/Discussion.vue"
import Admin from "@/views/Admin.vue"

/* Routes */
const routes = [
  {
    path: "/login",
    component: Login,
    meta: { guest: true }
  },
  {
    path: "/register",
    component: Register,
    meta: { guest: true }
  },
  {
    path: "/",
    component: Home,
    meta: { requiresAuth: true } // Dashboard
  },
  {
    path: "/profile",
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: "/discussion/:id",
    component: Discussion,
    meta: { requiresAuth: true }
  },
  {
    path: "/admin",
    component: Admin,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


let isAuthChecked = false

router.beforeEach((to, from, next) => {
  if (!isAuthChecked) {
    onAuthStateChanged(auth, (user) => {
      isAuthChecked = true

      if (to.meta.requiresAuth && !user) {
        next("/login")
      } else if (to.meta.guest && user) {
        next("/")
      } else {
        next()
      }
    })
  } else {
    const user = auth.currentUser

    if (to.meta.requiresAuth && !user) {
      next("/login")
    } else if (to.meta.guest && user) {
      next("/")
    } else {
      next()
    }
  }
})

export default router
