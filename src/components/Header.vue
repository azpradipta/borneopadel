<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import logoImage from "../assets/logo.png"; 

const router = useRouter();
const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const navigateToTop = (path) => {
  router.push(path);
  menuOpen.value = false;
  // Scroll ke atas setelah navigasi
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100);
};
</script>

<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <button 
          @click="navigateToTop('/')" 
          class="flex items-center gap-3 cursor-pointer"
        >
          <img :src="logoImage" alt="BorneoPadel Logo" class="h-10 w-10" />
          <span class="text-2xl font-bold text-navy">BORNEOPADEL</span>
        </button>

        <!-- Mobile & Tablet Menu Button -->
        <button 
          @click="toggleMenu" 
          class="lg:hidden p-2 rounded hover:bg-gray-100 transition text-gray-text"
        >
          <span v-if="!menuOpen" class="text-2xl">☰</span>
          <span v-else class="text-2xl">✕</span>
        </button>

        <!-- Desktop Menu -->
        <div class="hidden lg:flex gap-8">
          <button 
            @click="navigateToTop('/')" 
            class="font-medium text-base text-gray-text hover:text-primary transition"
            :class="{ 'text-primary': $route.path === '/' }"
          >
            Beranda
          </button>
          <button 
            @click="navigateToTop('/tentang-kami')" 
            class="font-medium text-base text-gray-text hover:text-primary transition"
            :class="{ 'text-primary': $route.path === '/tentang-kami' }"
          >
            Tentang Kami
          </button>
          <button 
            @click="navigateToTop('/fasilitas')" 
            class="font-medium text-base text-gray-text hover:text-primary transition"
            :class="{ 'text-primary': $route.path === '/fasilitas' }"
          >
            Fasilitas
          </button>
          <button 
            @click="navigateToTop('/booking')" 
            class="font-medium text-base text-gray-text hover:text-primary transition"
            :class="{ 'text-primary': $route.path === '/booking' }"
          >
            Booking
          </button>
          <button 
            @click="navigateToTop('/kontak')" 
            class="font-medium text-base text-gray-text hover:text-primary transition"
            :class="{ 'text-primary': $route.path === '/kontak' }"
          >
            Kontak
          </button>
        </div>
      </div>

      <!-- Mobile & Tablet Menu -->
      <div v-if="menuOpen" class="lg:hidden mt-4 space-y-2">
        <button 
          @click="navigateToTop('/')"
          class="w-full text-left block px-4 py-2 rounded transition font-medium text-gray-text hover:text-primary hover:bg-gray-100"
          :class="{ 'text-primary bg-gray-100': $route.path === '/' }"
        >
          Beranda
        </button>
        <button 
          @click="navigateToTop('/tentang-kami')"
          class="w-full text-left block px-4 py-2 rounded transition font-medium text-gray-text hover:text-primary hover:bg-gray-100"
          :class="{ 'text-primary bg-gray-100': $route.path === '/tentang-kami' }"
        >
          Tentang Kami
        </button>
        <button 
          @click="navigateToTop('/fasilitas')"
          class="w-full text-left block px-4 py-2 rounded transition font-medium text-gray-text hover:text-primary hover:bg-gray-100"
          :class="{ 'text-primary bg-gray-100': $route.path === '/fasilitas' }"
        >
          Fasilitas
        </button>
        <button 
          @click="navigateToTop('/booking')"
          class="w-full text-left block px-4 py-2 rounded transition font-medium text-gray-text hover:text-primary hover:bg-gray-100"
          :class="{ 'text-primary bg-gray-100': $route.path === '/booking' }"
        >
          Booking
        </button>
        <button 
          @click="navigateToTop('/kontak')"
          class="w-full text-left block px-4 py-2 rounded transition font-medium text-gray-text hover:text-primary hover:bg-gray-100"
          :class="{ 'text-primary bg-gray-100': $route.path === '/kontak' }"
        >
          Kontak
        </button>
      </div>
    </nav>
  </header>
</template>

<style scoped></style>