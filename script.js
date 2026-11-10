const makePages = (first, last, book) => Array.from({ length: last - first + 1 }, (_, index) => {
  const page = first + index;
  return {
    page,
    book,
    src: `01/works/po-${String(page).padStart(2, '0')}.png`,
    label: `${book} · ${page}쪽`,
    alt: `${book} ${page}쪽 그림`,
  };
});

const images = [
  ...makePages(4, 10, '베베의 초대장'),
  ...makePages(11, 20, '오늘도 누군가를 만났습니다'),
];

const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightboxImage');
const lightboxCaption = document.querySelector('#lightboxCaption');
let activeImage = 0;
let lastTrigger = null;

function showImage(index) {
  activeImage = (index + images.length) % images.length;
  const item = images[activeImage];
  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt;
  lightboxCaption.textContent = item.label;
}

function openLightbox(index) {
  lastTrigger = document.activeElement;
  showImage(index);
  lightbox.showModal();
  lightbox.querySelector('.lightbox-close').focus();
}

function closeLightbox() {
  lightbox.close();
  lastTrigger?.focus();
}

function fillGallery(id, pages) {
  const gallery = document.querySelector(id);
  pages.forEach((item) => {
    const imageIndex = images.indexOf(item);
    const card = document.createElement('button');
    card.className = 'gallery-card';
    card.type = 'button';
    card.setAttribute('aria-label', `${item.book} ${item.page}쪽 크게 보기`);
    card.innerHTML = `<img src="${item.src}" alt="${item.alt}" loading="lazy"><span>${item.page}쪽</span>`;
    card.addEventListener('click', () => openLightbox(imageIndex));
    gallery.append(card);
  });
}

fillGallery('#bebeGallery', images.slice(0, 7));
fillGallery('#todayGallery', images.slice(7));

lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showImage(activeImage - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showImage(activeImage + 1));
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') showImage(activeImage + 1);
  if (event.key === 'ArrowLeft') showImage(activeImage - 1);
});

const screenScroll = document.querySelector('#screenScroll');
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target || !screenScroll.contains(target)) return;
    event.preventDefault();
    const top = target.getBoundingClientRect().top - screenScroll.getBoundingClientRect().top + screenScroll.scrollTop;
    screenScroll.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    history.replaceState(null, '', link.getAttribute('href'));
  });
});
