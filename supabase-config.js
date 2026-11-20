// =============================================
// SUPABASE CONFIGURATION
// SMP NEGERI 7 KATINGAN HILIR
// =============================================

const SUPABASE_URL = "https://iibzzovgbddyasrfurcc.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_rDfzGhTftIljK-rfus-x3w_ZYt18DIP";

// Membuat koneksi Supabase
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

// Menyediakan client secara global
window.supabaseClient = supabaseClient;

console.log("Supabase berhasil terhubung.");