<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import cineverseService from '@/services/cineverse.service';

// State quản lý slide hiện tại và tự động chạy
const currentSlide = ref(0);
let autoplayInterval = null;

// Danh sách ảnh nền vũ trụ (tương tự HomeView cũ)
const universeWallpapers = [
  'https://wallpapers.com/images/high/earth-in-the-universe-a879b6hwwtbywot0.webp',
  'https://wallpapers.com/images/hd/tree-and-vast-universe-hk1a2py5d3x1tpgf.webp',
  'https://cdn.pixabay.com/photo/2018/08/15/13/10/new-year-background-3608029_1280.jpg',
  'https://images.unsplash.com/photo-1462332420958-a05d1e002413?q=80&w=2007&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'
];

// Fetch Data từ API cho Slider
const { data: slides = [] } = useQuery({
  queryKey: ['movies', 'heroSlider'],
  queryFn: () => cineverseService.getMovies({ page: 1, limit: 5, sortBy: 'rating_count' }), // Lấy 5 phim hot nhất
  select: (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((movie, index) => ({
      id: movie.movie_id,
      title: movie.title,
      // Dùng description nếu có, không thì text mặc định
      subtitle: movie.description || 'Một siêu phẩm điện ảnh không thể bỏ lỡ trong năm nay. Khám phá ngay tại CineVerse.',
      year: movie.release_year || '2024',
      rating: movie.average_rating || '8.5',
      quality: 'HD',
      genre: Array.isArray(movie.genres) ? movie.genres.join(' • ') : 'Phim Hot',
      buttonText: 'Xem Ngay',
      // Dùng ảnh nền vũ trụ theo thứ tự
      backgroundUrl: universeWallpapers[index % universeWallpapers.length]
    }));
  }
});

// --- Functions ---
const nextSlide = () => {
  if (slides.value.length === 0) return;
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const prevSlide = () => {
  if (slides.value.length === 0) return;
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length;
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

const startAutoplay = () => {
  stopAutoplay();
  autoplayInterval = setInterval(() => {
    nextSlide();
  }, 6000); 
};

const stopAutoplay = () => {
  clearInterval(autoplayInterval);
};

// --- Lifecycle Hooks ---
onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay(); 
});
</script>

<template>
  <header class="hero-slider-container container" @mouseenter="stopAutoplay" @mouseleave="startAutoplay">
    <div class="slider-wrapper">
      <div v-for="(slide, index) in slides" :key="index" class="slide-item" 
           :class="{ active: index === currentSlide }"
           :style="{ backgroundImage: `url(${slide.backgroundUrl})` }">
        
        <!-- Lớp phủ Gradient: Trái (Đen) -> Phải (Trong suốt) -->
        <div class="gradient-overlay"></div>

        <div class="container h-100 position-relative">
          <div class="hero-content">
            <!-- Metadata: Năm, Quality, Rating -->
            <div class="meta-tags mb-3" :class="{ 'anim-fade-up': index === currentSlide }">
              <span class="meta-badge year">{{ slide.year }}</span>
              <span class="meta-badge quality">{{ slide.quality }}</span>
              <span class="rating ms-2">
                <i class="fa-solid fa-star text-warning me-1"></i>{{ slide.rating }}
              </span>
              <span class="genre ms-3">{{ slide.genre }}</span>
            </div>

            <!-- Tiêu đề chính -->
            <h1 class="hero-title mb-3" :class="{ 'anim-fade-up-delay-1': index === currentSlide }">
              {{ slide.title }}
            </h1>

            <!-- Mô tả ngắn -->
            <p class="hero-desc mb-4" :class="{ 'anim-fade-up-delay-2': index === currentSlide }">
              {{ slide.subtitle }}
            </p>

            <!-- Buttons Action -->
            <div class="hero-actions" :class="{ 'anim-fade-up-delay-3': index === currentSlide }">
              <button class="btn btn-primary-glass btn-lg me-3">
                <i class="fa-solid fa-play me-2"></i> {{ slide.buttonText }}
              </button>
              <button class="btn btn-secondary-glass btn-lg">
                <i class="fa-solid fa-circle-info me-2"></i> Chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Arrows -->
    <button @click="prevSlide" class="nav-arrow prev text-white" aria-label="Previous">
      <i class="fa-solid fa-chevron-left"></i>
    </button>
    <button @click="nextSlide" class="nav-arrow next text-white" aria-label="Next">
      <i class="fa-solid fa-chevron-right"></i>
    </button>

    <!-- Dots Pagination -->
    <div class="dots-container">
      <button v-for="(slide, index) in slides" :key="`dot-${index}`" class="dot-indicator"
        :class="{ active: index === currentSlide }" @click="goToSlide(index)">
      </button>
    </div>
  </header>
</template>

<style scoped>
/* Container chính - Boxed Style */
.hero-slider-container {
  position: relative;
  width: 100%;
  height: 60vh; /* Thu nhỏ chiều cao */
  overflow: hidden;
  background-color: var(--surface-glass);
  margin-top: 30px; /* Cách navbar một đoạn */
  border-radius: 15px; /* Bo góc */
  border: 1px solid var(--border-glass);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}

.slider-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.slide-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.8s ease-in-out, visibility 0.8s, transform 8s linear;
  transform: scale(1);
}

.slide-item.active {
  opacity: 1;
  visibility: visible;
  z-index: 1;
  transform: scale(1.05); /* Hiệu ứng Ken Burns nhẹ */
}

/* Gradient Overlay */
.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right, 
    rgba(0, 0, 0, 0.8) 0%, 
    rgba(0, 0, 0, 0.4) 50%, 
    transparent 100%
  );
  z-index: 1;
}

/* Định vị nội dung bên trái */
.hero-content {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  max-width: 600px;
  z-index: 2;
  color: #fff;
  padding-left: 1rem;
}

/* Glassmorphism Badge */
.meta-badge {
  display: inline-block;
  backdrop-filter: blur(var(--glass-blur));
  background: var(--surface-glass);
  border: 1px solid var(--border-glass);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-right: 10px;
  text-transform: uppercase;
  color: var(--starlight-yellow);
}

.quality {
  background: var(--galaxy-purple);
  color: white;
  border: none;
}

.rating {
  font-weight: bold;
  font-size: 1rem;
}

.genre {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

/* Typography */
.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  background: linear-gradient(45deg, #fff, #a0a0a0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-desc {
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

/* Buttons Glassmorphism */
.btn-primary-glass {
  background: linear-gradient(135deg, var(--galaxy-purple), var(--cosmic-blue));
  border: none;
  color: white;
  border-radius: 50px;
  padding: 12px 30px;
  font-weight: 600;
  box-shadow: 0 10px 20px rgba(90, 66, 212, 0.3);
  transition: all 0.3s ease;
}

.btn-primary-glass:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(90, 66, 212, 0.5);
}

.btn-secondary-glass {
  background: var(--surface-glass);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--border-glass);
  color: white;
  border-radius: 50px;
  padding: 12px 30px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary-glass:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

/* Navigation Arrow */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: var(--surface-glass);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.2rem;
  backdrop-filter: blur(var(--glass-blur));
  transition: all 0.3s ease;
  z-index: 10;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-arrow:hover {
  background: var(--galaxy-purple);
}
.prev { left: 20px; }
.next { right: 20px; }

/* Dots */
.dots-container {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}
.dot-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--surface-glass);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}
.dot-indicator.active {
  width: 30px;
  border-radius: 10px;
  background: var(--galaxy-purple);
}

/* Animations */
.anim-fade-up { animation: fadeUp 0.8s ease backwards; }
.anim-fade-up-delay-1 { animation: fadeUp 0.8s ease 0.2s backwards; }
.anim-fade-up-delay-2 { animation: fadeUp 0.8s ease 0.4s backwards; }
.anim-fade-up-delay-3 { animation: fadeUp 0.8s ease 0.6s backwards; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive adjustment */
@media (max-width: 768px) {
  .hero-slider-container { height: 70vh; margin-top: 80px; }
  .gradient-overlay {
    background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
  }
  .hero-content {
    bottom: 80px;
    top: auto;
    transform: none;
    width: 100%;
    padding-right: 1rem;
    text-align: center;
    max-width: 100%;
  }
  .hero-title { font-size: 2.5rem; }
  .nav-arrow { display: none; } /* Hide arrows on mobile */
}
</style>
