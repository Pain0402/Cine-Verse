<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Sử dụng ảnh từ Unsplash để đảm bảo load được (Reliable Source)
const slides = ref([
  {
    title: 'Avengers: Endgame',
    subtitle: 'Sau sự kiện tàn khốc của Infinity War, vũ trụ đang dần tàn lụi. Với sự giúp đỡ của các đồng minh còn lại, Avengers tập hợp một lần nữa để đảo ngược hành động của Thanos.',
    year: '2019',
    rating: '8.4',
    quality: '4K',
    genre: 'Viễn Tưởng • Hành Động',
    buttonText: 'Xem Trailer',
    // Ảnh Avenger concept art (hoặc tương tự)
    backgroundUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop' 
  },
  {
    title: 'Interstellar',
    subtitle: 'Một nhóm nhà thám hiểm thực hiện chuyến du hành vượt không gian qua một lỗ sâu mới được khám phá để tìm kiếm vùng đất mới cho nhân loại.',
    year: '2014',
    rating: '8.7',
    quality: 'HD',
    genre: 'Khoa Học • Phiêu Lưu',
    buttonText: 'Xem Ngay',
    // Ảnh vũ trụ/lỗ đen
    backgroundUrl: 'https://images.unsplash.com/photo-1462332420958-a05d1e002413?q=80&w=2007&auto=format&fit=crop'
  },
  {
    title: 'Dune: Part Two',
    subtitle: 'Paul Atreides hợp nhất với Chani và người Fremen trên con đường trả thù những kẻ đã hủy hoại gia đình anh.',
    year: '2024',
    rating: '9.0',
    quality: 'IMAX',
    genre: 'Sử Thi • Hành Động',
    buttonText: 'Đặt Vé Ngay',
    // Ảnh sa mạc/Dune vibe
    backgroundUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1976&auto=format&fit=crop'
  }
]);

// State quản lý slide hiện tại và tự động chạy
const currentSlide = ref(0);
let autoplayInterval = null;

// --- Functions ---
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const prevSlide = () => {
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
  <header class="hero-slider-container" @mouseenter="stopAutoplay" @mouseleave="startAutoplay">
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
/* Container chính */
.hero-slider-container {
  position: relative;
  width: 100vw; /* Full width viewport */
  height: 85vh; /* Cinematic height */
  overflow: hidden;
  background-color: transparent; /* Fix: Remove solid black background */
  margin-top: -70px; /* Under navbar */
  margin-left: calc(-50vw + 50%); /* Hack to break out of container if parent constrains */
  left: 0;
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
  background-position: center center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.8s ease-in-out, visibility 0.8s, transform 8s linear;
  transform: scale(1);
}

.slide-item.active {
  opacity: 1;
  visibility: visible;
  z-index: 1;
  transform: scale(1.05); /* Zoom effect */
}

/* Gradient Overlay tối ưu hóa cho text trắng */
.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
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
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
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
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.2rem;
  backdrop-filter: blur(5px);
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
  background: rgba(255, 255, 255, 0.3);
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
  .hero-slider-container { height: 70vh; }
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
