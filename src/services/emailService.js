import emailjs from '@emailjs/browser';

// Konfigurasi EmailJS untuk Contact
const EMAIL_CONFIG = {
  serviceId: 'service_gmp3p0t', 
  templateId: 'template_pfc0079', 
  publicKey: 'sJmqasfrzy4m21ulw'
};

// Konfigurasi EmailJS untuk Booking
const BOOKING_CONFIG = {
  serviceId: 'service_gmp3p0t',
  templateId: 'template_yroymje', 
  publicKey: 'sJmqasfrzy4m21ulw'
};

// Function untuk Contact Form
export const sendContactEmail = async (formData) => {
  try {
    const templateParams = {
      name: formData.nama,
      email: formData.email,
      message: formData.pesan,
      timestamp: new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId,
      templateParams,
      EMAIL_CONFIG.publicKey
    );

    return { success: true, data: response };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
};

// Function untuk Booking Form
export const sendBookingEmail = async (bookingData) => {
  try {
    // Tentukan class untuk badge berdasarkan tipe
    let tipeClass = 'indoor';
    if (bookingData.lapanganTipe === 'Outdoor') tipeClass = 'outdoor';
    if (bookingData.lapanganTipe === 'VIP') tipeClass = 'vip';

    const templateParams = {
      nama_lengkap: bookingData.namaLengkap,
      email: bookingData.email,
      nomor_telepon: bookingData.nomorTelepon,
      tanggal: bookingData.tanggal,
      jam_mulai: bookingData.jamMulai,
      durasi: bookingData.durasi,
      jam_selesai: bookingData.jamSelesai,
      lapangan_nama: bookingData.lapanganNama,
      lapangan_tipe: bookingData.lapanganTipe,
      lapangan_tipe_class: tipeClass.toLowerCase(),
      lapangan_harga: bookingData.lapanganHarga,
      total_pembayaran: bookingData.totalPembayaran,
      catatan: bookingData.catatan || 'Tidak ada catatan tambahan',
      timestamp: new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const response = await emailjs.send(
      BOOKING_CONFIG.serviceId,
      BOOKING_CONFIG.templateId,
      templateParams,
      BOOKING_CONFIG.publicKey
    );

    return { success: true, data: response };
  } catch (error) {
    console.error('Booking email send error:', error);
    return { success: false, error };
  }
};