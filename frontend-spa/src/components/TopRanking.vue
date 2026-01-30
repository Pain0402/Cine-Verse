<template>
  <section class="top-ranking-section py-5">
    <div class="container">
      <h2 class="section-title mb-5" data-aos="fade-right">
        <i class="fa-solid fa-crown text-warning me-2"></i>
        Top 10 Thịnh Hành Hôm Nay
      </h2>

      <div class="ranking-scroll-container">
        <div class="ranking-track">
          <div 
            v-for="(movie, index) in topMovies" 
            :key="movie.id" 
            class="ranking-card"
            @mouseenter="activeIndex = index"
            @mouseleave="activeIndex = null"
          >
            <!-- Số thứ tự khổng lồ (SVG stroke effect) -->
            <div class="rank-number-container">
              <svg viewBox="0 0 100 150" class="rank-svg">
                <text x="50%" y="100%" class="rank-text" :class="{'active': activeIndex === index}">
                  {{ index + 1 }}
                </text>
              </svg>
            </div>

            <!-- Poster Phim -->
            <div class="poster-wrapper">
              <img :src="movie.posterUrl" :alt="movie.title" class="poster-img" loading="lazy">
              
              <!-- Hover Overlay -->
              <div class="poster-overlay">
                <button class="btn btn-play-circle">
                  <i class="fa-solid fa-play"></i>
                </button>
                <div class="movie-info">
                  <h6 class="movie-title">{{ movie.title }}</h6>
                  <div class="d-flex align-items-center gap-2 small">
                    <span class="badge bg-warning text-dark fw-bold">{{ movie.rating }}</span>
                    <span class="text-light">{{ movie.year }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import cineverseService from '@/services/cineverse.service';

const activeIndex = ref(null);

// Fetch Top 10 Popular Movies from API
const { data: topMovies = [] } = useQuery({
  queryKey: ['movies', 'topRanking'],
  queryFn: () => cineverseService.getMovies({ sortBy: 'rating_count', limit: 10 }),
  select: (data) => {
    if (!Array.isArray(data)) return [];
    return data.map(movie => ({
      id: movie.movie_id,
      title: movie.title,
      year: movie.release_year,
      rating: movie.average_rating || 'N/A',
      posterUrl: movie.poster_url 
    }));
  }
});
</script>

<style scoped>
.top-ranking-section {
  position: relative;
  overflow: hidden;
}

.section-title {
  color: #fff;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-left: 5px solid var(--starlight-yellow);
  padding-left: 15px;
}

.ranking-scroll-container {
  overflow-x: auto;
  padding-bottom: 2rem;
  /* Ẩn scrollbar nhưng vẫn scroll được */
  scrollbar-width: none; 
  -ms-overflow-style: none;
}
.ranking-scroll-container::-webkit-scrollbar {
  display: none;
}

.ranking-track {
  display: flex;
  gap: 20px; /* Khoảng cách giữa các thẻ phim */
  padding-left: 10px;
}

.ranking-card {
  position: relative;
  display: flex;
  align-items: flex-end; /* Để số nằm thẳng hàng với đáy poster */
  flex: 0 0 auto; /* Không co giãn */
  /* width: 220px; */ /* Bỏ width cứng để linh hoạt */
  cursor: pointer;
  transition: transform 0.3s ease;
}

/* --- Thiết kế số thứ tự (Rank Number) --- */
.rank-number-container {
  position: relative;
  width: 120px;
  height: 180px; /* Chiều cao khớp với poster hoặc thấp hơn chút */
  margin-right: -40px; /* Số đè lên poster một chút */
  z-index: 1; /* Nằm dưới poster */
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  pointer-events: none;
}

.rank-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.rank-text {
  font-size: 11rem; /* Số cực lớn */
  font-weight: 900;
  font-family: 'Impact', sans-serif; /* Font to bản, mạnh mẽ */
  fill: #000; /* Màu nền trong suốt/đen */
  stroke: #555; /* Viền xám mặc định */
  stroke-width: 2px;
  text-anchor: middle;
  transform: translateY(10px); /* Tinh chỉnh vị trí */
  transition: all 0.3s ease;
}

.rank-text.active {
  stroke: var(--starlight-yellow); /* Hover đổi màu viền */
  fill: rgba(255, 217, 77, 0.1);
  filter: drop-shadow(0 0 10px var(--starlight-yellow));
}

/* --- Poster --- */
.poster-wrapper {
  width: 160px;
  height: 240px; /* Tỉ lệ 2:3 */
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  z-index: 2; /* Nằm trên số một chút */
  box-shadow: 10px 10px 30px rgba(0,0,0,0.5);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Hiệu ứng Hover card */
.ranking-card:hover .poster-wrapper {
  transform: scale(1.1) translateY(-10px) rotate(2deg);
  box-shadow: 0 15px 40px rgba(90, 66, 212, 0.4);
  z-index: 10;
}

.ranking-card:hover .rank-number-container {
  z-index: 0; /* Đẩy số xuống dưới khi hover để không che poster nếu lỡ */
  margin-right: -20px; /* Tách ra một chút */
}

/* Overlay thông tin khi hover */
.poster-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent 60%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 15px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.ranking-card:hover .poster-overlay {
  opacity: 1;
}

.btn-play-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border: 1px solid #fff;
  color: #fff;
  font-size: 1.2rem;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ranking-card:hover .btn-play-circle {
  transform: translate(-50%, -50%) scale(1);
}

.movie-title {
  color: #fff;
  font-weight: 700;
  margin-bottom: 5px;
  font-size: 1rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 768px) {
  .rank-text { font-size: 8rem; }
  .rank-number-container { width: 80px; margin-right: -25px; }
  .poster-wrapper { width: 120px; height: 180px; }
}
</style>
