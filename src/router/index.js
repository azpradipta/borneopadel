import { createRouter, createWebHistory } from 'vue-router'
import Beranda from '../pages/Beranda.vue'
import TentangKami from '../pages/TentangKami.vue'
import Fasilitas from '../pages/Fasilitas.vue'
import Booking from '../pages/Booking.vue'
import Kontak from '../pages/Kontak.vue'

const routes = [
  { path: '/', component: Beranda, name: 'Beranda' },
  { path: '/tentang-kami', component: TentangKami, name: 'TentangKami' },
  { path: '/fasilitas', component: Fasilitas, name: 'Fasilitas' },
  { path: '/booking', component: Booking, name: 'Booking' },
  { path: '/kontak', component: Kontak, name: 'Kontak' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router