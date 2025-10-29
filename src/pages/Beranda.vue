<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import heroBg from '../assets/hero-bg.png'; 

const router = useRouter();

const navigateToPage = (path) => {
  router.push(path);
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100);
};

// FAQ State 
const openFaq = ref(null);

const toggleFaq = (index) => {
  openFaq.value = openFaq.value === index ? null : index;
};

// Data-driven stats
const stats = [
  {
    icon: 'fa-table-tennis-paddle-ball',
    color: 'text-[#FFDF20]',
    value: '8+',
    label: 'Lapangan Premium'
  },
  {
    icon: 'fa-users',
    color: 'text-[#7BF1A8]',
    value: '5000+',
    label: 'Member Aktif'
  },
  {
    icon: 'fa-calendar',
    iconType: 'fa-regular',
    color: 'text-[#DAB2FF]',
    value: '24/7',
    label: 'Layanan Booking'
  }
];

// Data-driven features
const features = [
  {
    icon: 'fa-star',
    title: 'Fasilitas Premium',
    description: 'Lapangan berkualitas tinggi dengan pencahayaan LED dan lantai profesional'
  },
  {
    icon: 'fa-calendar-check',
    title: 'Booking Instan',
    description: 'Sistem booking online 24/7 yang mudah dan cepat'
  },
  {
    icon: 'fa-user-tie',
    title: 'Pelatih Profesional',
    description: 'Tim pelatih bersertifikat siap membantu meningkatkan permainan Anda'
  },
  {
    icon: 'fa-user-group',
    title: 'Komunitas Aktif',
    description: 'Bergabung dengan komunitas pemain padel yang ramah dan solid'
  },
  {
    icon: 'fa-wifi',
    title: 'WiFi Gratis',
    description: 'Internet berkecepatan tinggi tersedia di seluruh area'
  },
  {
    icon: 'fa-square-parking',
    title: 'Parkir Luas',
    description: 'Area parkir yang luas dan aman untuk kendaraan Anda'
  }
];

// Data-driven FAQs
const faqs = [
  {
    question: 'Bagaimana cara melakukan booking lapangan?',
    answer: 'Sangat mudah! Anda bisa booking langsung melalui website kami dengan memilih tanggal, waktu, dan jenis lapangan yang diinginkan. Atau hubungi kami via WhatsApp di +62 812-3456-7890 untuk bantuan personal. Booking minimal 2 jam sebelum waktu bermain, dan konfirmasi langsung diterima!'
  },
  {
    question: 'Berapa harga sewa lapangan?',
    answer: 'Kami menawarkan harga kompetitif! Lapangan Outdoor mulai Rp 200.000/jam, Indoor Rp 250.000/jam, dan VIP Court Rp 400.000/jam dengan fasilitas premium. Ada juga paket hemat untuk member dan booking lebih dari 2 jam. Cek halaman Booking untuk promo terbaru!'
  },
  {
    question: 'Apakah tersedia penyewaan raket dan bola?',
    answer: 'Tentu! Kami menyediakan penyewaan raket berkualitas mulai Rp 50.000 dan bola padel Rp 30.000 per sesi. Jika ingin membeli perlengkapan baru, kunjungi Pro Shop kami yang menjual berbagai brand ternama dengan harga spesial untuk member!'
  },
  {
    question: 'Apakah ada program pelatihan untuk pemula?',
    answer: 'Ada! Kami memiliki program pelatihan lengkap dari level pemula hingga advanced. Pelatih kami bersertifikat internasional dan berpengalaman. Paket pelatihan mulai dari Rp 500.000 untuk 4 sesi (2 jam/sesi). Private class dan group class tersedia. Daftar sekarang dan dapatkan 1 sesi trial gratis!'
  },
  {
    question: 'Bagaimana kebijakan pembatalan booking?',
    answer: 'Kami memberikan fleksibilitas untuk Anda! Pembatalan gratis 100% jika dilakukan minimal 4 jam sebelum waktu bermain. Pembatalan 2-4 jam sebelumnya dikenakan biaya 50%. Kurang dari 2 jam? Full charge berlaku. Untuk reschedule, bisa dilakukan kapan saja tanpa biaya tambahan!'
  },
  {
    question: 'Apakah tersedia fasilitas parkir?',
    answer: 'Parkir super luas dan aman! Area parkir kami bisa menampung hingga 100 kendaraan dengan pengawasan CCTV 24/7 dan petugas security yang ramah. Parkir GRATIS untuk semua pengunjung. Ada area khusus untuk motor dan mobil, plus spot teduh untuk kenyamanan kendaraan Anda!'
  }
];
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section 
      class="relative text-white py-24 sm:py-32 lg:py-40 px-6 sm:px-8 lg:px-4 overflow-hidden bg-cover bg-center"
      :style="{ backgroundImage: `url(${heroBg})` }"
    >
      <!-- Overlay Gradient -->
      <div class="absolute inset-0 bg-gradient-to-r from-[#1c398e]/90 to-[#1447e6]/80"></div>

      <div class="max-w-7xl mx-auto relative z-10">
        <div class="max-w-3xl space-y-8">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in">
            Lapangan Padel<br>Premium di Balikpapan
          </h1>
          <p class="text-lg md:text-xl text-white/90 leading-relaxed animate-fade-in-delay">
            Nikmati pengalaman bermain padel terbaik dengan fasilitas modern dan pelayanan profesional
          </p>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-2">
            <button 
              @click="navigateToPage('/booking')"
              class="group inline-flex items-center justify-center gap-2 
                     bg-white text-[#1c398e] px-8 py-3.5 rounded-lg font-medium 
                     border-2 border-white hover:bg-transparent hover:text-white 
                     transition-all duration-300 shadow-lg hover:shadow-xl 
                     w-full sm:w-auto active:scale-95"
            >
              <i class="fa-solid fa-calendar-check group-hover:scale-110 transition-transform duration-300"></i>
              Booking Sekarang
            </button>
            <button 
              @click="navigateToPage('/fasilitas')"
              class="group inline-flex items-center justify-center gap-2 
                     bg-transparent text-white px-8 py-3.5 rounded-lg font-medium 
                     border-2 border-white hover:bg-white hover:text-[#1c398e] 
                     transition-all duration-300 w-full sm:w-auto active:scale-95"
            >
              <i class="fa-solid fa-building group-hover:scale-110 transition-transform duration-300"></i>
              Lihat Fasilitas
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="max-w-7xl mx-auto mt-16 sm:mt-20 relative z-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="(stat, index) in stats" 
            :key="index"
            class="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-center 
                   border border-white/20 hover:bg-white/15 hover:border-white/30
                   transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
          >
            <div class="mb-4">
              <i 
                :class="[
                  stat.iconType || 'fa-solid',
                  stat.icon,
                  stat.color,
                  'text-4xl group-hover:scale-110 transition-transform duration-300'
                ]"
              ></i>
            </div>
            <div class="text-3xl font-bold mb-2">{{ stat.value }}</div>
            <div class="text-white text-base">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mengapa Memilih Kami Section -->
    <section class="py-16 sm:py-20 px-6 sm:px-8 lg:px-4 bg-gradient-to-b from-gray-50 to-white">
      <div class="max-w-7xl mx-auto">
        <!-- Section Title -->
        <div class="text-center mb-12 sm:mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-navy mb-3 sm:mb-4">
            Mengapa Memilih Kami?
          </h2>
          <p class="text-gray-text max-w-2xl mx-auto text-base sm:text-lg">
            Kami menyediakan fasilitas dan layanan terbaik untuk pengalaman bermain padel yang tak terlupakan
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="(feature, index) in features" 
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
                  feature.icon,
                  'text-primary group-hover:text-white text-2xl',
                  'transition-colors duration-300'
                ]"
              ></i>
            </div>
            <h3 class="text-lg font-medium text-navy mb-2">
              {{ feature.title }}
            </h3>
            <p class="text-sm text-gray-text leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 sm:py-20 px-6 sm:px-8 lg:px-4 bg-white">
      <div class="max-w-4xl mx-auto">
        <!-- Section Title -->
        <div class="text-center mb-12 sm:mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-navy mb-3 sm:mb-4">
            Pertanyaan Umum (FAQ)
          </h2>
          <p class="text-gray-text text-base sm:text-lg">
            Temukan jawaban untuk pertanyaan yang sering diajukan
          </p>
        </div>

        <!-- FAQ Accordion -->
        <div class="space-y-4">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            class="bg-white border border-gray-200 rounded-xl overflow-hidden 
                   hover:shadow-lg hover:border-primary/30
                   transition-all duration-300"
          >
            <button
              @click="toggleFaq(index)"
              type="button"
              class="w-full px-6 py-4 text-left flex items-center justify-between 
                     hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent
                     transition-all duration-200 group"
            >
              <h3 class="text-base font-medium text-navy pr-4 group-hover:text-primary transition-colors">
                {{ faq.question }}
              </h3>
              <i 
                class="fa-solid fa-chevron-down text-primary flex-shrink-0
                       transition-all duration-300"
                :class="{ 
                  'rotate-180': openFaq === index,
                  'scale-110': openFaq === index
                }"
              ></i>
            </button>
            
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="max-h-0 opacity-0"
              enter-to-class="max-h-96 opacity-100"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="max-h-96 opacity-100"
              leave-to-class="max-h-0 opacity-0"
            >
              <div
                v-show="openFaq === index"
                class="overflow-hidden"
              >
                <div class="px-6 pb-4 pt-2 text-sm text-gray-text leading-relaxed border-t border-gray-100 bg-gray-50/50">
                  {{ faq.answer }}
                </div>
              </div>
            </Transition>
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

.animate-fade-in-delay-2 {
  animation: fade-in 0.8s ease-out 0.4s both;
}
</style>