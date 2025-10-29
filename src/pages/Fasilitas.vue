<script setup>
import { ref, computed } from 'vue';
import lapanganIndoorImage from "../assets/lapangan-indoor.jpg";
import lapanganOutdoorImage from "../assets/lapangan-outdoor.jpg";
import vipCourtImage from "../assets/vip-court.png";

// Data-driven court information
const courts = [
  {
    image: lapanganIndoorImage,
    icon: 'fa-house',
    title: 'Lapangan Indoor',
    description: 'Lapangan indoor dengan AC, pencahayaan LED profesional, dan lantai berkualitas tinggi. Ideal untuk bermain di segala cuaca.',
    price: 'Rp 250K',
    features: [
      'Per 1 jam',
      'AC & Pencahayaan LED',
      'Gratis air mineral',
      'WiFi gratis'
    ]
  },
  {
    image: lapanganOutdoorImage,
    icon: 'fa-cloud-sun',
    title: 'Lapangan Outdoor',
    description: 'Lapangan outdoor dengan pemandangan terbuka dan sirkulasi udara yang baik. Perfect untuk pengalaman bermain yang natural.',
    price: 'Rp 200K',
    features: [
      'Per 1 jam',
      'View terbuka',
      'Gratis air mineral',
      'WiFi gratis'
    ]
  },
  {
    image: vipCourtImage,
    icon: 'fa-crown',
    title: 'VIP Court',
    description: 'Lapangan VIP eksklusif dengan fasilitas premium, area lounge pribadi, dan layanan prioritas untuk pengalaman bermain yang luxury.',
    price: 'Rp 400K',
    features: [
      'Per 1 jam',
      'Lounge pribadi',
      'Gratis refreshment',
      'Priority service'
    ]
  }
];

// Data-driven facilities
const facilities = [
  {
    icon: 'fa-utensils',
    title: 'Cafe & Restaurant',
    description: 'Cafe dan restoran dengan menu sehat dan bergizi untuk pemain.'
  },
  {
    icon: 'fa-shop',
    title: 'Padel Store',
    description: 'Toko perlengkapan padel dengan produk original dan berkualitas.'
  },
  {
    icon: 'fa-dumbbell',
    title: 'Fitness Center',
    description: 'Gym lengkap untuk latihan fisik dan pemanasan.'
  },
  {
    icon: 'fa-shower',
    title: 'Locker & Shower',
    description: 'Ruang ganti dan shower yang bersih dan nyaman.'
  },
  {
    icon: 'fa-wifi',
    title: 'High-Speed WiFi',
    description: 'Internet berkecepatan tinggi di seluruh area.'
  },
  {
    icon: 'fa-car',
    title: 'Parking Area',
    description: 'Area parkir luas dan aman dengan security 24 jam.'
  },
  {
    icon: 'fa-users',
    title: 'Lounge Area',
    description: 'Ruang tunggu yang nyaman untuk bersantai dan bersosialisasi.'
  },
  {
    icon: 'fa-blender',
    title: 'Healthy Bar',
    description: 'Bar sehat dengan smoothies, jus segar, dan snack bergizi.'
  }
];
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-[#1c398e] to-[#1447e6] text-white py-16 sm:py-20 px-6 sm:px-8 lg:px-4 overflow-hidden">
      <!-- Decorative Elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div class="max-w-7xl mx-auto relative z-10">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
          Fasilitas Kami
        </h1>
        <p class="text-lg md:text-xl text-white/90 animate-fade-in-delay">
          Fasilitas lengkap dan modern untuk pengalaman bermain padel yang sempurna
        </p>
      </div>
    </section>

    <!-- Info Lapangan Section -->
    <section class="py-16 sm:py-20 px-6 sm:px-8 lg:px-4 bg-gradient-to-b from-gray-50 to-white">
      <div class="max-w-7xl mx-auto">
        <!-- Section Title -->
        <div class="text-center mb-12 sm:mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-navy mb-3 sm:mb-4">
            Info Lapangan
          </h2>
          <p class="text-gray-text max-w-2xl mx-auto text-base sm:text-lg">
            Total 8 lapangan dengan standar internasional, tersedia dalam berbagai kategori untuk memenuhi kebutuhan Anda
          </p>
        </div>

        <!-- Court Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="(court, index) in courts" 
            :key="index"
            class="group bg-white rounded-2xl shadow-lg overflow-hidden 
                   hover:shadow-2xl transform hover:-translate-y-2
                   transition-all duration-300"
          >
            <div class="relative overflow-hidden">
              <img 
                :src="court.image" 
                :alt="court.title" 
                class="w-full h-48 object-cover transition-transform duration-300 
                       group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div class="p-6">
              <div class="flex items-center gap-2 mb-3">
                <div class="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center
                            group-hover:bg-primary transition-colors duration-300">
                  <i 
                    :class="['fa-solid', court.icon, 'text-primary group-hover:text-white text-lg transition-colors duration-300']"
                  ></i>
                </div>
                <h3 class="text-xl font-semibold text-navy group-hover:text-primary transition-colors duration-300">
                  {{ court.title }}
                </h3>
              </div>
              
              <p class="text-gray-text text-sm mb-4 pb-4 border-b border-gray-200 leading-relaxed">
                {{ court.description }}
              </p>
              
              <div class="text-primary text-2xl font-bold mb-3">{{ court.price }}</div>
              
              <ul class="space-y-2 text-sm text-gray-text">
                <li 
                  v-for="(feature, idx) in court.features" 
                  :key="idx"
                  class="flex items-center gap-2"
                >
                  <i class="fa-solid fa-check text-primary text-xs"></i>
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Fasilitas Pendukung Section -->
    <section class="py-16 sm:py-20 px-6 sm:px-8 lg:px-4 bg-white">
      <div class="max-w-7xl mx-auto">
        <!-- Section Title -->
        <div class="text-center mb-12 sm:mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-navy mb-3 sm:mb-4">
            Fasilitas Pendukung
          </h2>
          <p class="text-gray-text max-w-2xl mx-auto text-base sm:text-lg">
            Nikmati berbagai fasilitas pendukung yang membuat pengalaman Anda lebih nyaman dan menyenangkan
          </p>
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