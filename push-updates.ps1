# push-updates.ps1
Write-Host "--- Portal Evaluasi Pemdi Auto-Push ---" -ForegroundColor Cyan

# 1. Menambahkan semua perubahan ke staging area
git add .

# 2. Batalkan penambahan (unstage) file log agar tidak ikut di-commit
git reset PERUBAHAN.md
git reset REQUEST.md

# 3. Cek apakah ada perubahan yang tersisa untuk di-commit (selain file log)
$status = git status --porcelain
if ($null -eq $status -or $status -eq "") {
    Write-Host "Tidak ada perubahan yang perlu di-push (selain log)." -ForegroundColor Yellow
} else {
    $currentDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "Melakukan commit perubahan..." -ForegroundColor Cyan
    git commit -m "Auto-commit: Perbaikan & sinkronisasi otomatis ($currentDate)"
    Write-Host "Melakukan push ke origin/main..." -ForegroundColor Cyan
    git push origin main
    Write-Host "✅ Berhasil melakukan push ke GitHub! Vercel akan memulai build." -ForegroundColor Green
}