<template>
  <nav aria-label="breadcrumb" class="app-breadcrumb">
    <ol class="breadcrumb mb-0">
      <li class="breadcrumb-item">
        <router-link :to="{ name: 'home' }"><i class="fa-solid fa-house"></i> Home</router-link>
      </li>
      <li v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item"
        :class="{ active: index === breadcrumbs.length - 1 }">
        <router-link v-if="crumb.link" :to="crumb.link">{{ crumb.text }}</router-link>
        <span v-else>{{ crumb.text }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbs = computed(() => {
  const pathArray = route.path.split('/').filter(p => p);
  const breadcrumbList = [];

  // Logic map path sang text hiển thị đẹp mắt
  // Ví dụ: /movies/123 -> Home > Movies > Chi tiết phim
  
  if (route.name === 'search') {
    breadcrumbList.push({ text: 'Tìm kiếm', link: null });
  } else if (route.name === 'movie.detail') {
    breadcrumbList.push({ text: 'Phim', link: null }); 
    // Lý tưởng là lấy tên phim từ props hoặc store, nhưng ở mức router cơ bản ta để text tĩnh hoặc cập nhật sau
  } else if (route.path.startsWith('/auth')) {
    breadcrumbList.push({ text: 'Tài khoản', link: null });
  } else if (route.path.startsWith('/user')) {
    breadcrumbList.push({ text: 'Cá nhân', link: null });
  }

  // Nếu muốn dynamic title chính xác cho từng phim, ta cần một global state (Pinia) lưu title trang hiện tại
  // Ở đây ta dùng meta title từ router nếu có
  if (route.meta.title && route.name !== 'home') {
     // Check duplicate để tránh hiển thị 2 lần nếu logic trên đã push
     if (!breadcrumbList.some(b => b.text === route.meta.title)) {
        // breadcrumbList.push({ text: route.meta.title, link: null });
     }
  }

  return breadcrumbList;
});
</script>

<style scoped>
.app-breadcrumb {
  background: rgba(13, 12, 29, 0.8); /* Màu nền tối mờ */
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--border-glass);
}

.breadcrumb-item a {
  color: var(--starlight-yellow);
  text-decoration: none;
  font-weight: 500;
}

.breadcrumb-item a:hover {
  text-decoration: underline;
}

.breadcrumb-item.active {
  color: rgba(255, 255, 255, 0.6);
}

.breadcrumb-item + .breadcrumb-item::before {
  color: rgba(255, 255, 255, 0.4);
}
</style>
