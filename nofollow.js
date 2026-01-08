// nofollow.js
// Pastikan kode berjalan setelah DOM siap
function applyNoFollowToExternalLinks() {
  document.querySelectorAll('a[href]').forEach(function(a) {
    try {
      // Buat URL absolute dari link
      const linkUrl = new URL(a.href, location.origin);
      // Cek jika hostname berbeda (link eksternal)
      if (linkUrl.hostname !== location.hostname) {
        let rel = a.getAttribute('rel') || '';
        if (!rel.split(/\s+/).includes('nofollow')) {
          rel = rel ? rel + ' nofollow' : 'nofollow';
          a.setAttribute('rel', rel.trim());
        }
      }
    } catch (e) {
      // Skip jika parsing URL gagal
    }
  });
}

// Panggil saat awal dan setiap konten dinamis ditambahkan
document.addEventListener('DOMContentLoaded', applyNoFollowToExternalLinks);

// Optional: untuk konten yang diubah secara dinamis (misal pakai innerHTML)
const mo = new MutationObserver(applyNoFollowToExternalLinks);
mo.observe(document.body, { childList: true, subtree: true });
