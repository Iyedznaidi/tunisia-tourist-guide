import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import OnboardingView from '../views/OnboardingView.vue'
import HomeView from '../views/HomeView.vue'
import ForYouView from '../views/ForYouView.vue'
import ExploreView from '../views/ExploreView.vue'
import ActivityDetailsView from '../views/ActivityDetailsView.vue'
import ItineraryBuilderView from '../views/ItineraryBuilderView.vue'
import ItineraryPublicView from '../views/ItineraryPublicView.vue'
import ProfileView from '../views/ProfileView.vue'
import FlightsView from '../views/FlightsView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  { path: '/', redirect: '/login' }, // default to login; guard will forward authenticated users to /home
  { path: '/login', component: LoginView, meta: { guestOnly: true } },
  { path: '/onboarding', component: OnboardingView, meta: { guestOnly: true } },
  { path: '/home', component: HomeView, meta: { requiresAuth: true } },
  { path: '/for-you', component: ForYouView, meta: { requiresAuth: true } },
  { path: '/explore', component: ExploreView, meta: { requiresAuth: true } },
  { path: '/activity/:id', component: ActivityDetailsView, meta: { requiresAuth: true } },
  { path: '/itineraries/create', component: ItineraryBuilderView, meta: { requiresAuth: true } },
  { path: '/itineraries/:id', component: ItineraryPublicView, meta: { requiresAuth: true } },
  { path: '/profile/:username', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/flights', component: FlightsView, meta: { requiresAuth: true } },
  { path: '/404', component: NotFoundView },
  { path: '/:pathMatch(.*)*', redirect: '/404' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ─── Navigation Guards ─────────────────────────────────────────────────────────
// We read the session directly from localStorage here to avoid a circular
// dependency with the useAuth composable (which itself imports this router).
function isSessionValid() {
  try {
    const raw = localStorage.getItem('ttg_session')
    if (!raw) return false
    const session = JSON.parse(raw)
    return session && session.expiry && Date.now() < session.expiry
  } catch {
    return false
  }
}

router.beforeEach((to, _from, next) => {
  const authenticated = isSessionValid()

  if (to.meta.requiresAuth && !authenticated) {
    next('/login')
  } else if (to.meta.guestOnly && authenticated) {
    next('/home')
  } else {
    next()
  }
})

export default router
