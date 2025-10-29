<script setup>
import { ref, computed } from 'vue';
import { sendContactEmail } from '../services/emailService';

const form = ref({
  nama: '',
  email: '',
  pesan: ''
});

const showMapPopup = ref(false);
const isSubmitting = ref(false);
const submitStatus = ref(null); 

// Computed untuk validasi form
const isFormValid = computed(() => {
  return form.value.nama.trim() && 
         form.value.email.trim() && 
         form.value.pesan.trim();
});

const openMap = () => {
  showMapPopup.value = true;
  document.body.style.overflow = 'hidden';
};

const closeMapPopup = () => {
  showMapPopup.value = false;
  document.body.style.overflow = '';
};

const submitForm = async (e) => {
  e.preventDefault();
  
  if (!isFormValid.value) {
    submitStatus.value = 'error';
    return;
  }

  isSubmitting.value = true;
  submitStatus.value = null;

  try {
    // Kirim email menggunakan EmailJS
    const result = await sendContactEmail(form.value);

    if (result.success) {
      submitStatus.value = 'success';
      
      // Reset form setelah 3 detik
      setTimeout(() => {
        form.value = {
          nama: '',
          email: '',
          pesan: ''
        };
        submitStatus.value = null;
      }, 3000);
    } else {
      submitStatus.value = 'error';
      setTimeout(() => {
        submitStatus.value = null;
      }, 5000);
    }
  } catch (error) {
    console.error('Error:', error);
    submitStatus.value = 'error';
    setTimeout(() => {
      submitStatus.value = null;
    }, 5000);
  } finally {
    isSubmitting.value = false;
  }
};

// Contact info data
const contactInfo = [
  {
    icon: 'fa-location-dot',
    iconColor: 'text-primary',
    title: 'Alamat',
    content: ['Jl. Mulawarman No. 88', 'Balikpapan 76114', 'Kalimantan Timur, Indonesia']
  },
  {
    icon: 'fa-phone',
    iconColor: 'text-primary',
    title: 'Telepon',
    content: ['+62 812-3456-7890'],
    subtitle: 'WhatsApp available'
  },
  {
    icon: 'fa-envelope',
    iconColor: 'text-primary',
    title: 'Email',
    content: ['info@borneopadel.com']
  },
  {
    icon: 'fa-clock',
    iconColor: 'text-primary',
    title: 'Jam Operasional',
    content: ['Senin - Jumat: 06:00 - 23:00', 'Sabtu: 07:00 - 24:00', 'Minggu: 07:00 - 22:00']
  }
];
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-[#1c398e] to-[#1447e6] text-white py-16 sm:py-20 px-6 sm:px-8 lg:px-4 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div class="max-w-7xl mx-auto relative z-10">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
          Hubungi Kami
        </h1>
        <p class="text-lg md:text-xl text-white/90 max-w-2xl animate-fade-in-delay">
          Ada pertanyaan? Tim kami siap membantu Anda. Hubungi kami melalui form atau informasi kontak di bawah ini
        </p>
      </div>
    </section>

    <!-- Contact Info Cards -->
    <section class="py-16 px-6 sm:px-8 lg:px-4">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="(info, index) in contactInfo" 
            :key="index"
            class="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div class="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
              <i 
                :class="['fa-solid', info.icon, 'text-2xl', 'group-hover:text-white', 'transition-colors', 'duration-300', info.iconColor]"
              ></i>
            </div>
            <h3 class="text-lg font-medium text-navy mb-3">{{ info.title }}</h3>
            <div class="text-sm text-gray-text leading-relaxed">
              <p v-for="(line, idx) in info.content" :key="idx" :class="{ 'mb-1': idx < info.content.length - 1 }">
                {{ line }}
              </p>
              <p v-if="info.subtitle" class="text-xs text-gray-400 mt-2">{{ info.subtitle }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Form & Map Section -->
    <section class="py-16 px-6 sm:px-8 lg:px-4 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Kirim Pesan Section -->
          <div class="flex flex-col">
            <h2 class="text-2xl md:text-3xl font-medium text-navy mb-6">Kirim Pesan</h2>
            
            <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 flex-1 relative overflow-hidden">
              <!-- Fixed Notification Area -->
              <div class="absolute top-0 left-0 right-0 z-10 pointer-events-none">
                <div class="p-6 sm:p-8">
                  <!-- Success Alert -->
                  <Transition
                    enter-active-class="transition-all duration-300"
                    enter-from-class="opacity-0 -translate-y-4"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition-all duration-200"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-4"
                  >
                    <div 
                      v-if="submitStatus === 'success'"
                      class="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 shadow-lg pointer-events-auto"
                    >
                      <i class="fa-solid fa-circle-check text-green-500 text-xl mt-0.5 flex-shrink-0"></i>
                      <div>
                        <p class="font-medium text-green-800">Pesan Berhasil Dikirim!</p>
                        <p class="text-sm text-green-600 mt-1">Terima kasih. Kami akan segera menghubungi Anda.</p>
                      </div>
                    </div>
                  </Transition>

                  <!-- Error Alert -->
                  <Transition
                    enter-active-class="transition-all duration-300"
                    enter-from-class="opacity-0 -translate-y-4"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition-all duration-200"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-4"
                  >
                    <div 
                      v-if="submitStatus === 'error'"
                      class="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 shadow-lg pointer-events-auto"
                    >
                      <i class="fa-solid fa-circle-exclamation text-red-500 text-xl mt-0.5 flex-shrink-0"></i>
                      <div>
                        <p class="font-medium text-red-800">Gagal Mengirim Pesan</p>
                        <p class="text-sm text-red-600 mt-1">Mohon coba lagi atau hubungi kami langsung.</p>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>

              <!-- Form with Dynamic Padding -->
              <form 
                @submit="submitForm" 
                class="h-full flex flex-col space-y-4 transition-all duration-300"
                :class="{ 'pt-28': submitStatus }"
              >
                <!-- Nama & Email Row -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label for="nama" class="block text-sm font-medium text-navy">
                      Nama Lengkap <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nama"
                      v-model.trim="form.nama"
                      class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg 
                             focus:ring-2 focus:ring-primary focus:border-transparent 
                             outline-none transition-all duration-200 text-sm
                             hover:border-gray-300"
                      placeholder="Masukkan nama lengkap Anda"
                      required
                    />
                  </div>
                  <div class="space-y-2">
                    <label for="email" class="block text-sm font-medium text-navy">
                      Email <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      v-model.trim="form.email"
                      class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg 
                             focus:ring-2 focus:ring-primary focus:border-transparent 
                             outline-none transition-all duration-200 text-sm
                             hover:border-gray-300"
                      placeholder="nama@email.com"
                      required
                    />
                  </div>
                </div>

                <!-- Pesan -->
                <div class="flex-1 flex flex-col space-y-2">
                  <label for="pesan" class="block text-sm font-medium text-navy">
                    Pesan <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    id="pesan"
                    v-model.trim="form.pesan"
                    class="w-full flex-1 min-h-[150px] px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg 
                           focus:ring-2 focus:ring-primary focus:border-transparent 
                           outline-none transition-all duration-200 resize-none text-sm
                           hover:border-gray-300"
                    placeholder="Tulis pesan Anda di sini..."
                    required
                  ></textarea>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  :disabled="!isFormValid || isSubmitting"
                  class="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium 
                         hover:bg-blue-700 active:scale-95
                         transition-all duration-300 shadow-md hover:shadow-lg 
                         flex items-center justify-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
                >
                  <i 
                    :class="['fa-solid', isSubmitting ? 'fa-spinner fa-spin' : 'fa-paper-plane']"
                  ></i>
                  <span>{{ isSubmitting ? 'Mengirim...' : 'Kirim Pesan' }}</span>
                </button>
              </form>
            </div>
          </div>

          <!-- Lokasi Kami Section -->
          <div class="flex flex-col">
            <h2 class="text-2xl md:text-3xl font-medium text-navy mb-6">Lokasi Kami</h2>
            
            <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 flex-1">
              <button
                @click="openMap"
                type="button"
                class="w-full h-full min-h-[300px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl 
                       flex flex-col items-center justify-center 
                       hover:from-gray-200 hover:to-gray-300
                       transition-all duration-300 cursor-pointer group
                       focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <div class="text-center">
                  <i class="fa-solid fa-map-location-dot text-6xl text-gray-300 mb-4 
                           group-hover:text-primary group-hover:scale-110 
                           transition-all duration-300"></i>
                  <p class="text-gray-400 font-medium group-hover:text-navy transition-colors duration-300">
                    Klik untuk melihat Maps
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Popup Modal -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showMapPopup"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click="closeMapPopup"
      >
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="showMapPopup"
            class="bg-white rounded-2xl w-full shadow-2xl
                   max-w-3xl lg:max-w-5xl 
                   max-h-[85vh] lg:max-h-[80vh]
                   flex flex-col"
            @click.stop
          >
            <div class="flex items-center justify-between p-4 lg:p-5 border-b border-gray-200 bg-gradient-to-r from-[#1c398e] to-[#1447e6] rounded-t-2xl flex-shrink-0">
              <h3 class="text-lg lg:text-xl font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-map-marker-alt"></i>
                Lokasi BorneoPadel
              </h3>
              <button
                @click="closeMapPopup"
                class="text-white/80 hover:text-white transition p-2 hover:bg-white/10 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close modal"
              >
                <i class="fa-solid fa-xmark text-xl lg:text-2xl"></i>
              </button>
            </div>

            <div class="flex-1 flex flex-col p-4 lg:p-5 overflow-hidden">
              <div class="flex-1 rounded-lg overflow-hidden shadow-lg mb-3">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.686476567915!2d2.1202448760593278!3d41.38089597130077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a498f576297baf%3A0x44f65330fe1b04b9!2sCamp%20Nou!5e0!3m2!1sid!2sid!4v1761552313660!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style="border:0; min-height: 300px;"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  class="w-full h-full"
                ></iframe>
              </div>

              <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 lg:p-5 border border-blue-200 flex-shrink-0">
                <div class="flex items-start gap-3 lg:gap-4">
                  <div class="bg-primary text-white w-11 h-11 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="fa-solid fa-location-dot text-lg lg:text-xl"></i>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="font-bold text-navy mb-2 text-base lg:text-lg">Alamat Lengkap:</p>
                    <div class="text-sm lg:text-base text-gray-text leading-relaxed space-y-0.5">
                      <p class="font-medium">BorneoPadel</p>
                      <p>Jl. Mulawarman No. 88</p>
                      <p>Balikpapan, Kalimantan Timur</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-fade-in-delay {
  animation: fade-in 0.6s ease-out 0.2s both;
}
</style>