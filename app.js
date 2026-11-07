/**
 * DEMON SLAYER (鬼滅の刃) · STUDIO EDITION
 * Clean Interactive Handlers, Video Autoplay & Roster Filtering
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. IMAGE ERROR FALLBACK (Handles PNG/JPG cached swaps gracefully)
  // =========================================================================

  document.querySelectorAll('.card-media img').forEach((img) => {
    img.addEventListener('error', function () {
      if (this.dataset.retry) return;
      this.dataset.retry = 'true';
      if (this.src.endsWith('.png')) {
        this.src = this.src.replace(/\.png(\?.*)?$/, '.jpg');
      } else if (this.src.endsWith('.jpg')) {
        this.src = this.src.replace(/\.jpg(\?.*)?$/, '.png');
      }
    });
  });

  // =========================================================================
  // 2. VIDEO PLAYBACK ENHANCEMENTS
  // =========================================================================

  const videos = document.querySelectorAll('.cinematic-video, .hero-video');
  videos.forEach((video) => {
    // Ensure muted autoplay succeeds seamlessly without any control overlays
    video.muted = true;
    video.removeAttribute('controls');
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback retry on user touch/click without showing control icons
        const startPlay = () => {
          video.play();
          window.removeEventListener('click', startPlay);
        };
        window.addEventListener('click', startPlay, { once: true });
      });
    }
  });

  // =========================================================================
  // 2. CHARACTER ROSTER FILTERING & SEARCH
  // =========================================================================

  const filterBtns = document.querySelectorAll('.filter-btn');
  const characterCards = document.querySelectorAll('.character-card');
  const searchInput = document.getElementById('characterSearch');

  function updateRoster() {
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    const query = (searchInput?.value || '').trim().toLowerCase();

    characterCards.forEach((card) => {
      const group = card.dataset.group || '';
      const cardText = card.textContent.toLowerCase();

      const matchesGroup = (activeFilter === 'all') || group.split(' ').includes(activeFilter);
      const matchesSearch = !query || cardText.includes(query);

      if (matchesGroup && matchesSearch) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      updateRoster();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', updateRoster);
  }

  // =========================================================================
  // 3. SMOOTH NAVIGATION SCROLL
  // =========================================================================

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  console.log('Demon Slayer Studio Edition loaded cleanly.');
});
