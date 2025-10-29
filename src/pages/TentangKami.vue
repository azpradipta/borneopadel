<script setup>
import { ref, computed } from 'vue';
import tentangKamiImage from "../assets/tentang-kami.png";

// Story paragraphs - data-driven
const storyParagraphs = [
  'BorneoPadel dimulai dari passion sederhana terhadap olahraga padel yang sedang berkembang pesat di Indonesia. Melihat kurangnya fasilitas padel berkualitas tinggi di Balikpapan, kami memutuskan untuk menciptakan tempat yang tidak hanya menyediakan lapangan, tetapi juga membangun komunitas.',
  'Sejak dibuka pada tahun 2020, kami telah melayani lebih dari 5.000 member aktif dan terus berkembang menjadi salah satu venue padel terbesar di Balikpapan dengan 8 lapangan premium, baik indoor maupun outdoor.',
  'Kami percaya bahwa padel bukan hanya tentang olahraga, tetapi juga tentang membangun hubungan, kesehatan, dan kebahagiaan. Itulah mengapa kami terus berinovasi untuk memberikan pengalaman terbaik bagi setiap member kami.'
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

      <div class="max-w-7xl mx-auto relative z-10">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
          Tentang BorneoPadel
        </h1>
        <p class="text-lg md:text-xl text-white/90 animate-fade-in-delay">
          Destinasi utama untuk penggemar padel di Balikpapan sejak 2020
        </p>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-16 sm:py-20 px-6 sm:px-8 lg:px-4">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Image -->
          <div class="order-2 lg:order-1">
            <div class="relative group overflow-hidden rounded-2xl">
              <div class="absolute inset-0 bg-gradient-to-r from-primary to-blue-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
              <img 
                :src="tentangKamiImage" 
                alt="Lapangan Padel BorneoPadel" 
                class="w-full h-auto rounded-2xl shadow-lg group-hover:shadow-2xl 
                       transition-all duration-300 transform group-hover:scale-105"
              />
            </div>
          </div>

          <!-- Text Content -->
          <div class="order-1 lg:order-2 space-y-6">
            <div>
              <h2 class="text-3xl md:text-4xl font-bold text-navy mb-4">
                Kisah Kami
              </h2>
              <div class="w-20 h-1 bg-gradient-to-r from-primary to-blue-700 rounded-full"></div>
            </div>
            
            <div class="space-y-4 text-gray-text">
              <p 
                v-for="(paragraph, index) in storyParagraphs" 
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