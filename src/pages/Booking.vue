<script setup>
import { ref, computed } from 'vue';
import { sendBookingEmail } from '../services/emailService';

const bookingSteps = [
  {
    step: 1,
    icon: 'fa-calendar-days',
    title: 'Pilih Tanggal & Waktu',
    description: 'Pilih jadwal yang sesuai dengan ketersediaan Anda',
    color: 'from-primary to-blue-700'
  },
  {
    step: 2,
    icon: 'fa-location-dot',
    title: 'Pilih Lapangan',
    description: 'Pilih dari 8 lapangan berkualitas kami',
    color: 'from-primary to-blue-700'
  },
  {
    step: 3,
    icon: 'fa-clock',
    title: 'Tentukan Durasi',
    description: 'Tentukan durasi bermain dari 1 hingga 6 jam',
    color: 'from-primary to-blue-700'
  },
  {
    step: 4,
    icon: 'fa-credit-card',
    title: 'Konfirmasi Booking',
    description: 'Lengkapi data dan konfirmasi booking Anda',
    color: 'from-primary to-blue-700'
  }
];

// Form booking data
const bookingForm = ref({
  namaLengkap: '',
  email: '',
  nomorTelepon: '',
  tanggal: '',
  jamMulai: '',
  durasi: '',
  lapangan: '',
  catatan: ''
});

const isSubmitting = ref(false);
const submitStatus = ref(null);
const showConfirmModal = ref(false);

// Computed untuk validasi form
const isFormValid = computed(() => {
  return bookingForm.value.namaLengkap.trim() && 
         bookingForm.value.email.trim() && 
         bookingForm.value.nomorTelepon.trim() &&
         bookingForm.value.tanggal &&
         bookingForm.value.jamMulai &&
         bookingForm.value.durasi &&
         bookingForm.value.lapangan;
});

// Computed untuk mendapatkan hari dari tanggal yang dipilih
const selectedDay = computed(() => {
  if (!bookingForm.value.tanggal) return null;
  const date = new Date(bookingForm.value.tanggal + 'T00:00:00');
  return date.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
});

// Computed untuk mendapatkan nama hari
const namaHari = computed(() => {
  if (selectedDay.value === null) return '';
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return hari[selectedDay.value];
});

// Computed untuk format tanggal yang lebih readable
const tanggalFormatted = computed(() => {
  if (!bookingForm.value.tanggal) return '';
  const date = new Date(bookingForm.value.tanggal + 'T00:00:00');
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('id-ID', options);
});

// Computed untuk mendapatkan jam operasional berdasarkan hari
const jamOperasional = computed(() => {
  if (selectedDay.value === null) return null;
  
  // Minggu (0)
  if (selectedDay.value === 0) {
    return { mulai: 7, selesai: 22, tutup: 22 };
  }
  // Sabtu (6)
  else if (selectedDay.value === 6) {
    return { mulai: 7, selesai: 24, tutup: 24 };
  }
  // Senin - Jumat (1-5)
  else {
    return { mulai: 6, selesai: 23, tutup: 23 };
  }
});

// Computed untuk options jam berdasarkan hari yang dipilih
const jamOptions = computed(() => {
  if (!jamOperasional.value) return [];
  
  const options = [];
  const { mulai, selesai } = jamOperasional.value;
  
  for (let i = mulai; i <= selesai; i++) {
    options.push({
      value: `${String(i).padStart(2, '0')}:00`,
      label: `${String(i).padStart(2, '0')}:00 WITA`
    });
  }
  
  return options;
});

// Computed untuk jam selesai dengan handling untuk jam 24:00
const jamSelesai = computed(() => {
  if (!bookingForm.value.jamMulai || !bookingForm.value.durasi) return '';
  
  const [jam] = bookingForm.value.jamMulai.split(':').map(Number);
  const durasi = parseInt(bookingForm.value.durasi);
  
  let jamAkhir = jam + durasi;
  
  // Handle jam 24:00 ke atas (konversi ke hari berikutnya)
  if (jamAkhir > 24) {
    jamAkhir = jamAkhir - 24;
    return `${String(jamAkhir).padStart(2, '0')}:00 (Hari Berikutnya)`;
  } else if (jamAkhir === 24) {
    return '00:00 (Hari Berikutnya)';
  }
  
  return `${String(jamAkhir).padStart(2, '0')}:00`;
});

// Computed untuk validasi jam selesai tidak melebihi jam tutup
const isJamValid = computed(() => {
  if (!jamOperasional.value || !bookingForm.value.jamMulai || !bookingForm.value.durasi) {
    return true;
  }
  
  const [jam] = bookingForm.value.jamMulai.split(':').map(Number);
  const durasi = parseInt(bookingForm.value.durasi);
  const jamAkhir = jam + durasi;
  
  // Untuk Sabtu yang tutup jam 24:00, izinkan booking sampai 00:00 hari berikutnya
  if (jamOperasional.value.tutup === 24) {
    return jamAkhir <= 24;
  }
  
  return jamAkhir <= jamOperasional.value.tutup;
});

// Computed untuk menghitung estimasi harga
const estimasiHarga = computed(() => {
  if (!bookingForm.value.durasi || !bookingForm.value.lapangan) return null;
  
  const durasi = parseInt(bookingForm.value.durasi);
  
  // Harga per jam berdasarkan tipe lapangan
  let hargaPerJam = 0;
  const selectedLapangan = lapanganOptions.find(l => l.value === bookingForm.value.lapangan);
  if (selectedLapangan) {
    hargaPerJam = selectedLapangan.hargaNumber;
  }
  
  const total = durasi * hargaPerJam;
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(total);
});

// Computed untuk mendapatkan data lapangan yang dipilih
const selectedLapanganData = computed(() => {
  return lapanganOptions.find(l => l.value === bookingForm.value.lapangan);
});

// Options durasi (1-6 jam)
const durasiOptions = [
  { value: '1', label: '1 Jam' },
  { value: '2', label: '2 Jam' },
  { value: '3', label: '3 Jam' },
  { value: '4', label: '4 Jam' },
  { value: '5', label: '5 Jam' },
  { value: '6', label: '6 Jam' },
];

// 8 Lapangan sesuai data dari Fasilitas
const lapanganOptions = [
  // 3 Indoor Courts
  { 
    value: 'indoor-1', 
    label: 'Indoor Court 1',
    tipe: 'Indoor',
    harga: 'Rp 250.000/jam',
    hargaNumber: 250000,
    fitur: 'AC Premium, Lantai Karpet Berkualitas Tinggi, Lighting LED Profesional',
    fasilitas: ['AC Premium', 'Lantai Karpet Premium', 'Sound System', 'Ruang Tunggu']
  },
  { 
    value: 'indoor-2', 
    label: 'Indoor Court 2',
    tipe: 'Indoor',
    harga: 'Rp 250.000/jam',
    hargaNumber: 250000,
    fitur: 'AC Premium, Lantai Karpet Berkualitas Tinggi, Lighting LED Profesional',
    fasilitas: ['AC Premium', 'Lantai Karpet Premium', 'Sound System', 'Ruang Tunggu']
  },
  { 
    value: 'indoor-3', 
    label: 'Indoor Court 3',
    tipe: 'Indoor',
    harga: 'Rp 250.000/jam',
    hargaNumber: 250000,
    fitur: 'AC Premium, Lantai Karpet Berkualitas Tinggi, Lighting LED Profesional',
    fasilitas: ['AC Premium', 'Lantai Karpet Premium', 'Sound System', 'Ruang Tunggu']
  },
  // 3 Outdoor Courts
  { 
    value: 'outdoor-1', 
    label: 'Outdoor Court 1',
    tipe: 'Outdoor',
    harga: 'Rp 200.000/jam',
    hargaNumber: 200000,
    fitur: 'Rumput Sintetis Premium, Natural Lighting, Pemandangan Terbuka',
    fasilitas: ['Rumput Sintetis Premium', 'Lighting Standard', 'Area Parkir Luas']
  },
  { 
    value: 'outdoor-2', 
    label: 'Outdoor Court 2',
    tipe: 'Outdoor',
    harga: 'Rp 200.000/jam',
    hargaNumber: 200000,
    fitur: 'Rumput Sintetis Premium, Natural Lighting, Pemandangan Terbuka',
    fasilitas: ['Rumput Sintetis Premium', 'Lighting Standard', 'Area Parkir Luas']
  },
  { 
    value: 'outdoor-3', 
    label: 'Outdoor Court 3',
    tipe: 'Outdoor',
    harga: 'Rp 200.000/jam',
    hargaNumber: 200000,
    fitur: 'Rumput Sintetis Premium, Natural Lighting, Pemandangan Terbuka',
    fasilitas: ['Rumput Sintetis Premium', 'Lighting Standard', 'Area Parkir Luas']
  },
  // 2 VIP Courts
  { 
    value: 'vip-1', 
    label: 'VIP Court 1',
    tipe: 'VIP',
    harga: 'Rp 400.000/jam',
    hargaNumber: 400000,
    fitur: 'Full AC Premium, Private Lounge, Sound System High-End, Refreshment Complimentary',
    fasilitas: ['AC Premium', 'Private Lounge VIP', 'Sound System Premium', 'Refreshment', 'TV LED', 'Shower Pribadi']
  },
  { 
    value: 'vip-2', 
    label: 'VIP Court 2',
    tipe: 'VIP',
    harga: 'Rp 400.000/jam',
    hargaNumber: 400000,
    fitur: 'Full AC Premium, Private Lounge, Sound System High-End, Refreshment Complimentary',
    fasilitas: ['AC Premium', 'Private Lounge VIP', 'Sound System Premium', 'Refreshment', 'TV LED', 'Shower Pribadi']
  },
];

// Get minimum date (today)
const minDate = new Date().toISOString().split('T')[0];

// Watch untuk reset jam mulai jika tanggal berubah
const resetJamMulai = () => {
  bookingForm.value.jamMulai = '';
  bookingForm.value.durasi = '';
};

// Function untuk show confirmation modal
const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!isFormValid.value || !isJamValid.value) {
    submitStatus.value = 'error';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      submitStatus.value = null;
    }, 5000);
    return;
  }

  // Show confirmation modal
  showConfirmModal.value = true;
};

// Function untuk close modal
const closeModal = () => {
  showConfirmModal.value = false;
};

// Function untuk confirm booking dengan EmailJS
const confirmBooking = async () => {
  showConfirmModal.value = false;
  isSubmitting.value = true;
  submitStatus.value = null;

  try {
    // Prepare booking data
    const bookingData = {
      namaLengkap: bookingForm.value.namaLengkap,
      email: bookingForm.value.email,
      nomorTelepon: bookingForm.value.nomorTelepon,
      tanggal: tanggalFormatted.value,
      jamMulai: bookingForm.value.jamMulai,
      durasi: bookingForm.value.durasi,
      jamSelesai: jamSelesai.value,
      lapanganNama: selectedLapanganData.value?.label || '-',
      lapanganTipe: selectedLapanganData.value?.tipe || '-',
      lapanganHarga: selectedLapanganData.value?.harga || '-',
      totalPembayaran: estimasiHarga.value || '-',
      catatan: bookingForm.value.catatan
    };

    // Send email via EmailJS
    const result = await sendBookingEmail(bookingData);
    
    if (result.success) {
      submitStatus.value = 'success';
      
      // Scroll to top untuk melihat notifikasi
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Reset form setelah 4 detik
      setTimeout(() => {
        bookingForm.value = {
          namaLengkap: '',
          email: '',
          nomorTelepon: '',
          tanggal: '',
          jamMulai: '',
          durasi: '',
          lapangan: '',
          catatan: ''
        };
        submitStatus.value = null;
      }, 4000);
    } else {
      throw new Error('Failed to send booking email');
    }
  } catch (error) {
    console.error('Booking Error:', error);
    submitStatus.value = 'error';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      submitStatus.value = null;
    }, 5000);
  } finally {
    isSubmitting.value = false;
  }
};

// Helper untuk mendapatkan warna badge berdasarkan tipe
const getTipeBadgeColor = (tipe) => {
  switch(tipe) {
    case 'Indoor':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Outdoor':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'VIP':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

// Helper untuk icon tipe lapangan
const getTipeIcon = (tipe) => {
  switch(tipe) {
    case 'Indoor':
      return 'fa-building';
    case 'Outdoor':
      return 'fa-tree';
    case 'VIP':
      return 'fa-crown';
    default:
      return 'fa-location-dot';
  }
};
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Fixed Notification Area (Top of Screen) -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 -translate-y-full"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-full"
    >
      <div 
        v-if="submitStatus"
        class="fixed top-0 left-0 right-0 z-[60] p-4 md:p-6"
      >
        <div class="max-w-3xl mx-auto">
          <!-- Success Alert -->
          <div 
            v-if="submitStatus === 'success'"
            class="p-4 md:p-5 bg-green-50 border-2 border-green-200 rounded-xl shadow-2xl flex items-start gap-3 animate-bounce-in"
          >
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <i class="fa-solid fa-circle-check text-white text-xl"></i>
              </div>
            </div>
            <div class="flex-1">
              <p class="font-bold text-green-800 text-lg">Booking Berhasil! 🎉</p>
              <p class="text-sm text-green-600 mt-1">
                Terima kasih. Kami akan segera menghubungi Anda melalui WhatsApp untuk konfirmasi pembayaran.
              </p>
            </div>
            <button 
              @click="submitStatus = null"
              class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-100 transition-colors"
            >
              <i class="fa-solid fa-times text-green-600"></i>
            </button>
          </div>

          <!-- Error Alert -->
          <div 
            v-if="submitStatus === 'error'"
            class="p-4 md:p-5 bg-red-50 border-2 border-red-200 rounded-xl shadow-2xl flex items-start gap-3 animate-bounce-in"
          >
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <i class="fa-solid fa-circle-exclamation text-white text-xl"></i>
              </div>
            </div>
            <div class="flex-1">
              <p class="font-bold text-red-800 text-lg">Booking Gagal!</p>
              <p class="text-sm text-red-600 mt-1">
                {{ !isJamValid ? 'Jam selesai melebihi jam tutup. Silakan pilih durasi yang lebih pendek.' : 'Mohon periksa kembali data Anda atau hubungi kami langsung.' }}
              </p>
            </div>
            <button 
              @click="submitStatus = null"
              class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 transition-colors"
            >
              <i class="fa-solid fa-times text-red-600"></i>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-[#1c398e] to-[#1447e6] text-white py-20 sm:py-24 px-6 sm:px-8 lg:px-4 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div class="max-w-7xl mx-auto relative z-10">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
          Booking Lapangan
        </h1>
        <p class="text-lg md:text-xl text-white/90 max-w-2xl animate-fade-in-delay">
          Pesan lapangan padel Anda dengan mudah dan cepat. Sistem booking online 24/7
        </p>
      </div>
    </section>

    <!-- Booking Steps Section -->
    <section class="py-16 px-6 sm:px-8 lg:px-4 bg-white">
      <div class="max-w-7xl mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-navy mb-4">
            Cara Booking
          </h2>
          <p class="text-lg text-gray-text max-w-2xl mx-auto">
            Ikuti 4 langkah sederhana untuk melakukan booking lapangan
          </p>
        </div>

        <!-- Steps Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative mb-16">
          <!-- Connecting Lines (Hidden on mobile) -->
          <div class="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 -z-10"></div>

          <div 
            v-for="(step, index) in bookingSteps" 
            :key="index"
            class="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
          >
            <!-- Step Number Badge -->
            <div class="absolute -top-4 left-1/2 -translate-x-1/2">
              <div :class="[
                'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg',
                'bg-gradient-to-br', step.color,
                'group-hover:scale-110 transition-transform duration-300'
              ]">
                {{ step.step }}
              </div>
            </div>

            <!-- Icon Container -->
            <div class="mt-8 mb-6 flex justify-center">
              <div :class="[
                'w-16 h-16 rounded-2xl flex items-center justify-center',
                'bg-gradient-to-br', step.color,
                'group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg'
              ]">
                <i :class="['fa-solid', step.icon, 'text-2xl text-white']"></i>
              </div>
            </div>

            <!-- Content -->
            <div class="text-center space-y-3">
              <h3 class="text-xl font-bold text-navy group-hover:text-primary transition-colors duration-300">
                {{ step.title }}
              </h3>
              <p class="text-sm text-gray-text leading-relaxed">
                {{ step.description }}
              </p>
            </div>

            <!-- Hover Indicator -->
            <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Form Booking Section -->
    <section class="py-16 px-6 sm:px-8 lg:px-4 bg-gray-50">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-8">
          <h2 class="text-3xl md:text-4xl font-bold text-navy mb-4">
            Form Booking Lapangan
          </h2>
          <p class="text-lg text-gray-text">
            Lengkapi formulir di bawah ini untuk melakukan booking
          </p>
        </div>

        <div class="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <!-- Form -->
          <form 
            @submit="handleSubmit" 
            class="space-y-6"
          >
            <!-- Data Pemesan -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-navy flex items-center gap-2">
                <i class="fa-solid fa-user text-primary"></i>
                Data Pemesan
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div class="space-y-2">
                  <label for="namaLengkap" class="block text-sm font-medium text-navy">
                    Nama Lengkap <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="namaLengkap"
                    v-model.trim="bookingForm.namaLengkap"
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                           focus:ring-2 focus:ring-primary focus:border-transparent 
                           outline-none transition-all duration-200
                           hover:border-gray-300 text-base"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div class="space-y-2">
                  <label for="nomorTelepon" class="block text-sm font-medium text-navy">
                    Nomor Telepon/WhatsApp <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="nomorTelepon"
                    v-model.trim="bookingForm.nomorTelepon"
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                           focus:ring-2 focus:ring-primary focus:border-transparent 
                           outline-none transition-all duration-200
                           hover:border-gray-300 text-base"
                    placeholder="08XX-XXXX-XXXX"
                    required
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label for="email" class="block text-sm font-medium text-navy">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  v-model.trim="bookingForm.email"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                         focus:ring-2 focus:ring-primary focus:border-transparent 
                         outline-none transition-all duration-200
                         hover:border-gray-300 text-base"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            <hr class="border-gray-200">

            <!-- Jadwal Booking -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-navy flex items-center gap-2">
                <i class="fa-solid fa-calendar-days text-primary"></i>
                Jadwal Booking
              </h3>
              
              <div class="space-y-2">
                <label for="tanggal" class="block text-sm font-medium text-navy">
                  Tanggal Main <span class="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="tanggal"
                  v-model="bookingForm.tanggal"
                  @change="resetJamMulai"
                  :min="minDate"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                         focus:ring-2 focus:ring-primary focus:border-transparent 
                         outline-none transition-all duration-200
                         hover:border-gray-300 text-base"
                  required
                />
              </div>

              <!-- Info Jam Operasional -->
              <div 
                v-if="namaHari && jamOperasional" 
                class="p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div class="flex items-center gap-2 text-sm">
                  <i class="fa-solid fa-info-circle text-blue-600"></i>
                  <span class="font-medium text-navy">
                    {{ namaHari }}: Buka pukul 
                    {{ String(jamOperasional.mulai).padStart(2, '0') }}:00 - 
                    {{ jamOperasional.tutup === 24 ? '00:00' : String(jamOperasional.tutup).padStart(2, '0') + ':00' }} WITA
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div class="space-y-2">
                  <label for="jamMulai" class="block text-sm font-medium text-navy">
                    Jam Mulai <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <select
                      id="jamMulai"
                      v-model="bookingForm.jamMulai"
                      :disabled="!bookingForm.tanggal"
                      class="w-full px-4 py-3 pr-10 bg-gray-50 border border-gray-200 rounded-lg 
                             focus:ring-2 focus:ring-primary focus:border-transparent 
                             outline-none transition-all duration-200
                             hover:border-gray-300 cursor-pointer appearance-none
                             disabled:opacity-50 disabled:cursor-not-allowed text-base"
                      required
                    >
                      <option value="" disabled>
                        {{ bookingForm.tanggal ? 'Pilih jam mulai' : 'Pilih tanggal terlebih dahulu' }}
                      </option>
                      <option v-for="jam in jamOptions" :key="jam.value" :value="jam.value">
                        {{ jam.label }}
                      </option>
                    </select>
                    <i class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                  </div>
                </div>

                <div class="space-y-2">
                  <label for="durasi" class="block text-sm font-medium text-navy">
                    Durasi <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <select
                      id="durasi"
                      v-model="bookingForm.durasi"
                      class="w-full px-4 py-3 pr-10 bg-gray-50 border border-gray-200 rounded-lg 
                             focus:ring-2 focus:ring-primary focus:border-transparent 
                             outline-none transition-all duration-200
                             hover:border-gray-300 cursor-pointer appearance-none text-base"
                      required
                    >
                      <option value="" disabled>Pilih durasi</option>
                      <option v-for="durasi in durasiOptions" :key="durasi.value" :value="durasi.value">
                        {{ durasi.label }}
                      </option>
                    </select>
                    <i class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                  </div>
                </div>
              </div>

              <!-- Jam Selesai Info -->
              <div 
                v-if="jamSelesai" 
                :class="[
                  'p-4 border rounded-lg flex items-center gap-3',
                  isJamValid 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-red-50 border-red-200'
                ]"
              >
                <i :class="[
                  'fa-solid text-xl',
                  isJamValid ? 'fa-clock text-primary' : 'fa-triangle-exclamation text-red-500'
                ]"></i>
                <div>
                  <p class="text-sm font-medium text-navy">Jam Selesai:</p>
                  <p :class="[
                    'text-lg font-bold',
                    isJamValid ? 'text-primary' : 'text-red-600'
                  ]">
                    {{ jamSelesai }} WITA
                    <span v-if="!isJamValid" class="text-sm font-normal ml-2">
                      (Melebihi jam tutup!)
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <hr class="border-gray-200">

            <!-- Pilih Lapangan -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-navy flex items-center gap-2">
                <i class="fa-solid fa-location-dot text-primary"></i>
                Pilih Lapangan <span class="text-sm font-normal text-gray-500">(8 Lapangan Tersedia)</span>
              </h3>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div 
                  v-for="lapangan in lapanganOptions" 
                  :key="lapangan.value"
                  class="relative"
                >
                  <input
                    type="radio"
                    :id="lapangan.value"
                    :value="lapangan.value"
                    v-model="bookingForm.lapangan"
                    class="peer sr-only"
                    required
                  />
                  <label
                    :for="lapangan.value"
                    class="flex flex-col p-4 bg-gray-50 border-2 border-gray-200 rounded-xl cursor-pointer
                           hover:border-primary hover:bg-blue-50 transition-all duration-200
                           peer-checked:border-primary peer-checked:bg-blue-50 peer-checked:shadow-lg"
                  >
                    <!-- Header -->
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex items-center gap-3">
                        <!-- Radio Circle Indicator -->
                        <div :class="[
                          'w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200',
                          bookingForm.lapangan === lapangan.value 
                            ? 'border-primary bg-primary shadow-md' 
                            : 'border-gray-300 bg-white'
                        ]">
                          <Transition
                            enter-active-class="transition-all duration-200"
                            enter-from-class="scale-0 opacity-0"
                            enter-to-class="scale-100 opacity-100"
                            leave-active-class="transition-all duration-150"
                            leave-from-class="scale-100 opacity-100"
                            leave-to-class="scale-0 opacity-0"
                          >
                            <i 
                              v-if="bookingForm.lapangan === lapangan.value" 
                              class="fa-solid fa-check text-white text-lg"
                            ></i>
                          </Transition>
                        </div>
                        
                        <div>
                          <h4 class="font-bold text-navy">{{ lapangan.label }}</h4>
                          <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border', getTipeBadgeColor(lapangan.tipe)]">
                            <i :class="['fa-solid', getTipeIcon(lapangan.tipe), 'text-xs']"></i>
                            {{ lapangan.tipe }}
                          </span>
                        </div>
                      </div>
                      <div class="text-right">
                        <p class="font-bold text-primary text-lg">{{ lapangan.harga }}</p>
                      </div>
                    </div>

                    <!-- Fitur -->
                    <div class="mb-3">
                      <p class="text-sm text-gray-600 leading-relaxed">{{ lapangan.fitur }}</p>
                    </div>

                    <!-- Fasilitas Tags -->
                    <div class="flex flex-wrap gap-1.5">
                      <span 
                        v-for="(fas, idx) in lapangan.fasilitas" 
                        :key="idx"
                        class="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded-md text-xs text-gray-600"
                      >
                        <i class="fa-solid fa-check text-green-500 text-xs"></i>
                        {{ fas }}
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Estimasi Harga -->
            <div 
              v-if="estimasiHarga" 
              class="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <i class="fa-solid fa-money-bill-wave text-white text-xl"></i>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600 font-medium">Estimasi Total Pembayaran</p>
                    <p class="text-2xl font-bold text-green-700">{{ estimasiHarga }}</p>
                  </div>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-3">
                <i class="fa-solid fa-info-circle mr-1"></i>
                Harga dapat berubah berdasarkan promo atau event khusus
              </p>
            </div>

            <hr class="border-gray-200">

            <!-- Catatan Tambahan -->
            <div class="space-y-2">
              <label for="catatan" class="block text-sm font-medium text-navy">
                Catatan Tambahan (Opsional)
              </label>
              <textarea
                id="catatan"
                v-model.trim="bookingForm.catatan"
                rows="3"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                       focus:ring-2 focus:ring-primary focus:border-transparent 
                       outline-none transition-all duration-200 resize-none
                       hover:border-gray-300 text-base"
                placeholder="Tambahkan catatan khusus untuk booking Anda (misal: request peralatan tambahan, jumlah pemain, dll)"
              ></textarea>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="!isFormValid || isSubmitting || !isJamValid"
              class="w-full bg-primary text-white px-6 py-4 rounded-lg font-semibold text-lg
                     hover:bg-blue-700 active:scale-95
                     transition-all duration-300 shadow-md hover:shadow-lg 
                     flex items-center justify-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
            >
              <i v-if="!isSubmitting" class="fa-solid fa-calendar-check"></i>
              <i v-else class="fa-solid fa-spinner fa-spin"></i>
              <span>{{ isSubmitting ? 'Mengirim...' : 'Konfirmasi Booking' }}</span>
            </button>

            <!-- Info Footer -->
            <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p class="text-sm text-gray-700">
                <i class="fa-solid fa-circle-info text-yellow-600 mr-2"></i>
                <strong>Catatan:</strong> Setelah submit, tim kami akan menghubungi Anda melalui WhatsApp untuk konfirmasi dan pembayaran.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Confirmation Modal -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="showConfirmModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click="closeModal"
      >
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div 
            v-if="showConfirmModal"
            class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            @click.stop
          >
            <!-- Modal Header -->
            <div class="sticky top-0 bg-gradient-to-r from-primary to-blue-700 text-white p-6 rounded-t-2xl z-10">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <i class="fa-solid fa-clipboard-check text-2xl"></i>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold">Konfirmasi Booking</h3>
                    <p class="text-sm text-white/80">Periksa kembali detail booking Anda</p>
                  </div>
                </div>
                <button 
                  @click="closeModal"
                  class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                >
                  <i class="fa-solid fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <!-- Modal Body -->
            <div class="p-6 space-y-6">
              <!-- Data Pemesan -->
              <div class="space-y-3">
                <h4 class="font-semibold text-navy flex items-center gap-2">
                  <i class="fa-solid fa-user text-primary"></i>
                  Data Pemesan
                </h4>
                <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Nama:</span>
                    <span class="font-medium text-navy">{{ bookingForm.namaLengkap }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Email:</span>
                    <span class="font-medium text-navy">{{ bookingForm.email }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">No. Telepon:</span>
                    <span class="font-medium text-navy">{{ bookingForm.nomorTelepon }}</span>
                  </div>
                </div>
              </div>

              <!-- Jadwal Booking -->
              <div class="space-y-3">
                <h4 class="font-semibold text-navy flex items-center gap-2">
                  <i class="fa-solid fa-calendar-days text-primary"></i>
                  Jadwal Booking
                </h4>
                <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Tanggal:</span>
                    <span class="font-medium text-navy">{{ tanggalFormatted }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Jam Mulai:</span>
                    <span class="font-medium text-navy">{{ bookingForm.jamMulai }} WITA</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Durasi:</span>
                    <span class="font-medium text-navy">{{ bookingForm.durasi }} Jam</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Jam Selesai:</span>
                    <span class="font-medium text-primary">{{ jamSelesai }} WITA</span>
                  </div>
                </div>
              </div>

              <!-- Detail Lapangan -->
              <div class="space-y-3">
                <h4 class="font-semibold text-navy flex items-center gap-2">
                  <i class="fa-solid fa-location-dot text-primary"></i>
                  Detail Lapangan
                </h4>
                <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="font-bold text-navy">{{ selectedLapanganData?.label }}</p>
                      <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border mt-1', getTipeBadgeColor(selectedLapanganData?.tipe)]">
                        <i :class="['fa-solid', getTipeIcon(selectedLapanganData?.tipe), 'text-xs']"></i>
                        {{ selectedLapanganData?.tipe }}
                      </span>
                    </div>
                    <p class="font-bold text-primary text-lg">{{ selectedLapanganData?.harga }}</p>
                  </div>
                  <p class="text-sm text-gray-600">{{ selectedLapanganData?.fitur }}</p>
                </div>
              </div>

              <!-- Total Pembayaran -->
              <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <i class="fa-solid fa-money-bill-wave text-white text-xl"></i>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 font-medium">Total Pembayaran</p>
                      <p class="text-2xl font-bold text-green-700">{{ estimasiHarga }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Catatan -->
              <div v-if="bookingForm.catatan" class="space-y-2">
                <h4 class="font-semibold text-navy flex items-center gap-2">
                  <i class="fa-solid fa-note-sticky text-primary"></i>
                  Catatan Tambahan
                </h4>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-700">{{ bookingForm.catatan }}</p>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t border-gray-200 z-10">
              <div class="flex gap-3">
                <button
                  @click="closeModal"
                  :disabled="isSubmitting"
                  class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold
                         hover:bg-gray-100 transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fa-solid fa-arrow-left mr-2"></i>
                  Kembali
                </button>
                <button
                  @click="confirmBooking"
                  :disabled="isSubmitting"
                  class="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold
                         hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
                >
                  <i v-if="!isSubmitting" class="fa-solid fa-check"></i>
                  <i v-else class="fa-solid fa-spinner fa-spin"></i>
                  <span>{{ isSubmitting ? 'Mengirim...' : 'Konfirmasi Booking' }}</span>
                </button>
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

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: translateY(-100%) scale(0.9);
  }
  50% {
    transform: translateY(10px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-fade-in-delay {
  animation: fade-in 0.6s ease-out 0.2s both;
}

.animate-bounce-in {
  animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Custom styling for date input */
input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.6;
  filter: invert(0.5);
}

input[type="date"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

/* Custom dropdown arrow styling */
select {
  background-image: none;
}

/* Prevent zoom on iOS when focusing inputs */
@supports (-webkit-touch-callout: none) {
  input,
  select,
  textarea {
    font-size: 16px !important;
  }
}

/* Better mobile dropdown styling */
@media (max-width: 768px) {
  select option {
    font-size: 16px;
    padding: 12px;
  }
}
</style>