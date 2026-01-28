<template>
  <section class="movie-list-section mb-5">
    <!-- Skeleton Title -->
    <div class="skeleton-title mb-3"></div>
    
    <div class="horizontal-scroll-container">
      <!-- Render dummy skeletons -->
      <SkeletonMovieCard v-for="n in 5" :key="n" />
    </div>
  </section>
</template>

<script setup>
import SkeletonMovieCard from './SkeletonMovieCard.vue';
</script>

<style scoped>
.movie-list-section {
  display: block;
}

.skeleton-title {
  height: 2rem;
  width: 250px;
  background-color: #2c2c35;
  border-radius: 6px;
  border-left: 4px solid #5A42D4;
  margin-left: 1rem;
  animation: pulse 1.5s infinite ease-in-out;
}

.horizontal-scroll-container {
  display: flex;
  overflow-x: hidden; /* Hide scrollbar for skeleton to look cleaner */
  padding-bottom: 1rem;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
    background-color: #2c2c35;
  }
  50% {
    opacity: 1;
    background-color: #3f3f4e;
  }
  100% {
    opacity: 0.6;
    background-color: #2c2c35;
  }
}
</style>
