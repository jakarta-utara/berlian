(function(){
  // escape untuk output HTML
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Parse berbagai format tag menjadi array of strings
  function parseTags(value) {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.map(String).map(s=>s.trim()).filter(Boolean);
    if (typeof value === 'string') {
      const v = value.trim();
      // coba parse JSON jika berbentuk array JSON
      if (v.startsWith('[') || v.startsWith('"')) {
        try {
          const parsed = JSON.parse(v);
          if (Array.isArray(parsed)) return parsed.map(String).map(s=>s.trim()).filter(Boolean);
        } catch (e) {
          // lanjut ke pemisahan biasa
        }
      }
      // pisahkan dengan koma, titik koma, pipe, atau newline
      return v.split(/[\n\r,;|]+/).map(s => s.trim()).filter(Boolean);
    }
    // fallback: ubah ke string
    return [String(value).trim()].filter(Boolean);
  }

  // menghasilkan HTML untuk satu atau beberapa tag
  function renderTagsHtml(raw) {
    const tags = parseTags(raw);
    if (!tags.length) return '';
    return tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join(' ');
  }

  // cari semua element .tag yang ada di DOM dan ganti jika perlu
  function transformTagElements() {
    // ambil snapshot (NodeList) supaya penggantian tidak memicu loop
    const els = Array.from(document.querySelectorAll('.tag'));
    els.forEach(el => {
      // jika elemen sudah berisi child span (artinya sudah multi-tag), lewati
      if (el.querySelector && el.querySelector('.tag')) return;

      // prioritas: data-tags attribute (untuk value yang aman), lalu textContent
      const raw = el.dataset && typeof el.dataset.tags !== 'undefined' ? el.dataset.tags : el.textContent || '';
      const html = renderTagsHtml(raw);
      if (!html) return;
      // ganti elemen tunggal <span class="tag">...</span> dengan satu atau banyak span yang baru
      el.outerHTML = html;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', transformTagElements);
  } else {
    transformTagElements();
  }
})();
