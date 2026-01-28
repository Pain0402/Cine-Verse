<template>
  <div class="skeleton-card">
    <div class="skeleton-image"></div>
    <div class="skeleton-content">
      <div class="skeleton-text title"></div>
      <div class="skeleton-text rating"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  flex: 0 0 auto;
  width: 220px;
  margin-right: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(245, 245, 250, 0.05);
  border: 1px solid rgba(245, 245, 250, 0.1);
}

.skeleton-image {
  width: 100%;
  height: 300px;
  background-color: #2c2c35;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-content {
  padding: 1rem;
}

.skeleton-text {
  background-color: #2c2c35;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

.title {
  height: 1.2rem;
  width: 80%;
  margin-bottom: 0.5rem;
}

.rating {
  height: 1rem;
  width: 40%;
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
