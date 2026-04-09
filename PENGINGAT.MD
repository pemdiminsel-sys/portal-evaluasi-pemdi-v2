# 📌 PENGINGAT (REMINDERS) - PORTAL EVALUASI PEMDI

Daftar hal penting yang harus dilakukan setelah kuota Deployment Vercel direset (24 jam ke depan):

## 🚀 PRIORITAS UTAMA (AFTER VERCEL RESET)
1.  **Manual Redeploy**: Di Dashboard Vercel, lakukan "Redeploy" pada commit terakhir (**e00538c**) agar fitur AIAssistant Multi-Engine aktif di produksi.
2.  **Environment Variables**: Pastikan dua kunci ini sudah terdaftar di Vercel Dashboard:
    *   `VITE_GEMINI_KEY` (Sesuai kunci yang sudah dibuat)
    *   `VITE_GROQ_KEY` (Sesuai kunci yang sudah dibuat)

## 🛠️ PEMELIHARAAN DATABASE (SUPABASE)
1.  **SQL Setup**: Pastikan script SQL berikut sudah dijalankan di SQL Editor Supabase:
    *   `backend/sql/CREATE_LOGS_TABLE.sql` (Untuk fitur Log Aktivitas)
    *   `backend/sql/SETUP_PHOTOS_STORAGE.sql` (Untuk fitur Foto Profil)
    *   `backend/sql/UPDATE_ADMIN_EMAIL.sql` (Jika ingin mengubah email admin default)

## 🤖 KNOWLEDGE BASE
1.  **Review Knowledge Base**: Terus tambahkan konteks ke file `frontend/docs/KNOWLEDGE_BASE_AI.md` agar chatbot semakin pintar menjawab pertanyaan seputar kebijakan SPBE terbaru.

## 💾 BACKUP & SYNC
1.  **Local Test**: Gunakan `npm run dev` untuk memastikan semua fitur di AIAssistant berjalan lancar sebelum besok dipantau oleh pimpinan.

---
*Dibuat oleh AI Assistant pada 9 April 2026*
