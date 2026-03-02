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
  { path: '/', redirect: '/home' },
  { path: '/login', component: LoginView },
  { path: '/onboarding', component: OnboardingView },
  { path: '/home', component: HomeView },
  { path: '/for-you', component: ForYouView },
  { path: '/explore', component: ExploreView },
  { path: '/activity/:id', component: ActivityDetailsView },
  { path: '/itineraries/create', component: ItineraryBuilderView },
  { path: '/itineraries/:id', component: ItineraryPublicView },
  { path: '/profile/:username', component: ProfileView },
  { path: '/flights', component: FlightsView },
  { path: '/404', component: NotFoundView },
  { path: '/:pathMatch(.*)*', redirect: '/404' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
