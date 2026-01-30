<template>
  <div class="home-main">
    <div class="cineverse-theme">
      <HeroSlider />
      <!-- Bảng Xếp Hạng Top 10 (Mới) -->
      <TopRanking />
      
      <main id="content" class="py-5">
        <div class="container container-custom">
          <div v-if="isLoading">
            <SkeletonMovieList />
            <SkeletonMovieList />
            <SkeletonMovieList />
          </div>
          <div v-else-if="error" class="alert alert-danger">{{ error.message }}</div>

          <div v-else>
            <MovieList title="Thịnh hành trong tuần" :movies="trendingMovies" />
            <MovieList title="Đánh giá cao nhất" :movies="topRatedMovies" />
            <MovieList title="Anime Mới Cập Nhật" :movies="animeMovies" />
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import cineverseService from '@/services/cineverse.service';
import MovieList from '@/components/MovieList.vue';
import HeroSlider from '@/components/HeroSlider.vue';
import TopRanking from '@/components/TopRanking.vue';
import SkeletonMovieList from '@/components/SkeletonMovieList.vue';

// --- Banner nền ngẫu nhiên - Đã loại bỏ để dùng CSS Galaxy Effect ---

// --- Hàm tiện ích để ánh xạ dữ liệu  ---
const mapApiData = (movie) => ({
  id: movie.movie_id,
  title: movie.title,
  posterUrl: movie.poster_url,
  averageRating: movie.average_rating,
});

// --- Lấy dữ liệu phim bằng TanStack Vue Query ---

// 1. Query để lấy phim thịnh hành
const {
  data: trendingMovies,
  isLoading: isTrendingLoading,
  error: trendingError
} = useQuery({
  queryKey: ['movies', 'trending'],
  queryFn: () => cineverseService.getMovies({ sortBy: 'rating_count' }),
  select: (data) => (Array.isArray(data) ? data.map(mapApiData) : []),
});

// 2. Query để lấy phim đánh giá cao
const {
  data: topRatedMovies,
  isLoading: isTopRatedLoading,
  error: topRatedError
} = useQuery({
  queryKey: ['movies', 'topRated'],
  queryFn: () => cineverseService.getMovies({ sortBy: 'average_rating' }),
  select: (data) => (Array.isArray(data) ? data.map(mapApiData) : []),
});

// 3. Query để lấy Anime mới
const {
  data: animeMovies,
  isLoading: isAnimeLoading,
  error: animeError
} = useQuery({
  queryKey: ['movies', 'anime'],
  queryFn: () => cineverseService.getMovies({ type: 'tv_series', genre_type: 'anime' }),
  select: (data) => (Array.isArray(data) ? data.map(mapApiData) : []),
});

// --- Gộp trạng thái loading và error để dùng trong template ---
const isLoading = computed(() => isTrendingLoading.value || isTopRatedLoading.value || isAnimeLoading.value);
const error = computed(() => trendingError.value || topRatedError.value || animeError.value);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700&display=swap');

.home-main {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  padding: 0;
  margin: 0;
}
</style>