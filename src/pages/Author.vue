<script setup>
import { ref, computed } from 'vue';
import tentangKamiImage from "../assets/hero-img.webp";

// about paragraphs - data-driven
const aboutauthor = [
  'Saya adalah Arya Zaky Pradipta, seorang mahasiswa informatika di Institut Teknologi Kalimantan (ITK). Saya memiliki minat yang besar dalam pengembangan web dan teknologi informasi. Saat ini, saya sedang menempuh pendidikan di ITK untuk memperdalam pengetahuan dan keterampilan saya di bidang informatika.',
  
];

//skill
const facilities = [
  {
    icon: 'fa-earth',
    title: 'Website Developer',
    description: 'Javascript, HTML, CSS'
  },
  {
    icon: 'fa-earth',
    title: 'Website Developer',
    description: 'Javascript, HTML, CSS'
  },
  {
    icon: 'fa-earth',
    title: 'Website Developer',
    description: 'Javascript, HTML, CSS'
  },
  {
    icon: 'fa-earth',
    title: 'Website Developer',
    description: 'Javascript, HTML, CSS'
  },
];
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section with Gradient -->
    <section class="relative bg-gradient-to-r from-[#1c398e] to-[#1447e6] text-white py-16 sm:py-20 px-6 sm:px-8 lg:px-4 overflow-hidden">
      <!-- Decorative Elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div class="max-w-7xl mx-25 relative z-10">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
          Tentang Author
        </h1>
        <p class="text-lg md:text-xl text-white/90 animate-fade-in-delay">
          Author merupakan mahasiswa informatika di Institut Teknologi Kalimantan
        </p>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-16 sm:py-20 px-6 sm:px-8 lg:px-4">
      <div class="max-w-5xl mx-25">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Image -->
          <div class="order-2 lg:order-1">
            <div class="relative group overflow-hidden rounded-2xl">
              <div class="absolute inset-0 bg-gradient-to-r from-primary to-blue-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
              <img 
                :src="tentangKamiImage" 
                alt="Lapangan Padel BorneoPadel" 
                class="w-full h-auto hidden md:block rounded-2xl shadow-lg group-hover:shadow-2xl 
                       transition-all duration-300 transform group-hover:scale-105"
              />
            </div>
          </div>

          <!-- Text Content -->
          <div class="order-1 lg:order-2 space-y-6">
            <div>
              <h1 class="text-4xl font-bold text-navy mb-4">
                Arya Zaky Pradipta
              </h1>
              <div>
                <h1 class="text-2xl font-medium text-navy">11231013 - INFORMATIKA - ITK</h1>
            </div>
            </div>
            
            <div class="space-y-4 text-gray-text">
              <p 
                v-for="(paragraph, index) in aboutauthor" 
                :key="index"
                class="leading-relaxed text-base"
              >
                {{ paragraph }}
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  
    <!-- Fasilitas Pendukung Section -->
    <section class="py-16 sm:py-20 px-6 sm:px-8 lg:px-4 bg-white">
      <div class="max-w-7xl mx-auto">
        <!-- Section Title -->
        <div class="text-center">
        </div>

        <!-- Facility Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="(facility, index) in facilities" 
            :key="index"
            class="group bg-white rounded-2xl p-6 shadow-md 
                   hover:shadow-xl
                   transform hover:-translate-y-1
                   transition-all duration-300"
          >
            <div class="bg-blue-50 w-14 h-14 rounded-xl 
                        flex items-center justify-center mb-4 
                        group-hover:bg-primary
                        transition-colors duration-300">
              <i 
                :class="[
                  'fa-solid',
                  facility.icon,
                  'text-primary group-hover:text-white text-2xl',
                  'transition-colors duration-300'
                ]"
              ></i>
            </div>
            <h3 class="text-lg font-medium text-navy mb-2">
              {{ facility.title }}
            </h3>
            <p class="text-sm text-gray-text leading-relaxed">
              {{ facility.description }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-fade-in-delay {
  animation: fade-in 0.8s ease-out 0.2s both;
}
</style>