<template>
  <RouterLink :to="{ name: 'movie.detail', params: { id: movie.id } }" class="movie-card-wrapper">
    <div class="movie-card">
      <!-- Poster Image -->
      <div class="poster-container">
        <img :src="movie.posterUrl" class="card-img" :alt="movie.title" @error="handleImageError" loading="lazy">
        
        <!-- Overlay on Hover -->
        <div class="card-overlay">
          <!-- Play Button (Center) -->
          <div class="play-btn-wrapper">
            <button class="btn-play-circle">
              <i class="fa-solid fa-play"></i>
            </button>
          </div>
          
          <!-- Actions Top Right -->
          <div class="top-actions">
            <button class="action-btn" title="Thêm vào danh sách">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Info Footer -->
      <div class="card-info">
        <h5 class="card-title">{{ movie.title }}</h5>
        
        <div class="card-meta">
          <span class="meta-item year">{{ movie.year || '2024' }}</span>
          <span class="meta-item quality text-starlight-yellow">HD</span>
          <span class="meta-item rating">
            <i class="fa-solid fa-star text-warning me-1"></i>{{ formatRating(movie.averageRating) }}
          </span>
        </div>

        <div class="card-genres" v-if="movie.genres && movie.genres.length">
          <span v-for="(genre, index) in movie.genres.slice(0, 2)" :key="index" class="genre-pill">
            {{ genre }}
          </span>
          <span v-if="movie.genres.length > 2" class="genre-pill">+{{ movie.genres.length - 2 }}</span>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router';

// Nhận dữ liệu phim từ component cha
defineProps({
  movie: {
    type: Object,
    required: true
  }
});

// Hàm xử lý lỗi hình ảnh
const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/300x450/0D0C1D/F5F5FA?text=CineVerse';
};

const formatRating = (rating) => {
  if (rating === undefined || rating === null) return 'N/A';
  const num = Number(rating);
  return isNaN(num) ? 'N/A' : num.toFixed(1);
};
</script>

<style scoped>
.movie-card-wrapper {
  text-decoration: none;
  display: block;
  /* Ensure spacing in list layout */
  padding-right: 1.5rem; 
  padding-bottom: 1.5rem;
  height: 100%; /* Stretch to parent flex height */
}

.movie-card {
  position: relative;
  width: 215px; /* Increased by 15px */
  height: 100%; /* Fill wrapper height to maintain equal height */
  display: flex; 
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: var(--surface-glass);
  border: 1px solid var(--border-glass);
}

.movie-card:hover {
  transform: scale(1.05) translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
  border-color: var(--galaxy-purple);
  z-index: 10;
}

/* Poster */
.poster-container {
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  overflow: hidden;
  flex-shrink: 0; /* Prevent shrinking */
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.movie-card:hover .card-img {
  transform: scale(1.1);
  filter: brightness(0.7);
}

/* Overlay & Actions */
.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.movie-card:hover .card-overlay {
  opacity: 1;
}

.play-btn-wrapper {
  transform: scale(0.8);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.movie-card:hover .play-btn-wrapper {
  transform: scale(1);
}

.btn-play-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border: 2px solid white;
  color: white;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-play-circle:hover {
  background: var(--galaxy-purple);
  border-color: var(--galaxy-purple);
}

.top-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.action-btn:hover {
  background: white;
  color: black;
}

/* Info Section */
.card-info {
  padding: 12px;
  background: linear-gradient(to bottom, rgba(30, 30, 40, 0.95), rgba(15, 15, 20, 1));
  flex-grow: 1; 
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* Remove min-height, handle with inner elements */
}

.card-title {
  margin: 0 0 8px 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: white;
  line-height: 1.4;
  height: 2.8em; /* Force 2 lines height */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
}

.meta-item.year {
  background: rgba(255, 255, 255, 0.1);
  padding: 1px 4px;
  border-radius: 3px;
}

.meta-item.quality {
  font-weight: bold;
  border: 1px solid var(--starlight-yellow);
  padding: 0 3px;
  border-radius: 3px;
  color: var(--starlight-yellow);
}

.card-genres {
  display: flex;
  flex-wrap: nowrap; /* No wrap allowed */
  gap: 4px;
  overflow: hidden; /* Hide overflow */
  height: 1.5em; /* Fixed height for 1 line */
  align-items: center;
}

.genre-pill {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
}

.genre-pill:not(:last-child)::after {
  content: "•";
  margin-left: 4px;
  margin-right: 0;
  opacity: 0.5;
}
</style>