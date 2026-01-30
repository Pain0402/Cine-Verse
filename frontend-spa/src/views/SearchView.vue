<template>
  <div class="search-view-container">
    <div class="container py-5">
      <!-- Tiêu đề trang, hiển thị từ khóa tìm kiếm -->
      <h1 class="page-title mb-4">
        Kết quả tìm kiếm cho: <span class="text-starlight-yellow">"{{ searchQuery }}"</span>
      </h1>

      <div class="row g-4">
        <!-- Danh sách kết quả -->
        <div class="col-lg-8">
          <div class="results-list">
            <!-- Trạng thái Loading -->
            <div v-if="isLoading" class="loading-container">
              <div v-for="n in 5" :key="n" class="result-item-placeholder placeholder-glow mb-3">
                <div class="placeholder col-2 me-3" style="width: 80px; height: 120px;"></div>
                <div class="flex-grow-1">
                  <div class="placeholder col-6 mb-2"></div>
                  <div class="placeholder col-4"></div>
                </div>
              </div>
            </div>

            <!-- Trạng thái có kết quả -->
            <div v-else-if="results && results.length > 0">
              <RouterLink v-for="item in results" :key="item.id" :to="{ name: 'movie.detail', params: { id: item.id } }" class="result-item text-decoration-none">
                <img :src="item.posterUrl" class="item-poster" :alt="item.title" @error="handleImageError">
                <div class="item-details">
                  <h3 class="item-title">{{ item.title }}</h3>
                  <p class="item-meta">{{ item.year }} • {{ item.type }}</p>
                  <p class="item-cast">Diễn viên: {{ item.cast }}</p>
                  <div class="mt-2">
                    <span v-for="genre in item.genres" :key="genre" class="badge bg-secondary me-1">{{ genre }}</span>
                  </div>
                </div>
              </RouterLink>

              <!-- Pagination Controls -->
              <div class="pagination-controls d-flex justify-content-center align-items-center mt-4">
                <button 
                  class="btn btn-glass me-3" 
                  :disabled="currentPage === 1 || isLoading" 
                  @click="changePage(currentPage - 1)"
                >
                  <i class="fa-solid fa-chevron-left me-1"></i> Trước
                </button>
                
                <span class="pagination-info">Trang {{ currentPage }} / {{ totalPages }}</span>
                
                <button 
                  class="btn btn-glass ms-3" 
                  :disabled="currentPage === totalPages || isLoading" 
                  @click="changePage(currentPage + 1)"
                >
                  Sau <i class="fa-solid fa-chevron-right ms-1"></i>
                </button>
              </div>
            </div>

            <!-- Trạng thái không có kết quả -->
            <div v-else class="text-center p-5 glass-pane">
              <h4 class="text-nebula-white">Không tìm thấy kết quả nào</h4>
              <p class="text-white-50">Vui lòng thử với một từ khóa khác.</p>
            </div>
          </div>
        </div>

        <!-- CBộ lọc -->
        <div class="col-lg-4">
          <aside class="sidebar-filters glass-pane p-4">
            <!-- Lọc theo loại -->
            <div class="filter-group mb-4">
              <h5 class="filter-title">Lọc theo loại</h5>
              <div class="d-flex flex-wrap gap-2">
                <button class="btn btn-filter" :class="{active: activeFilter === 'all'}" @click="applyFilter('all')">Tất cả</button>
                <button class="btn btn-filter" :class="{active: activeFilter === 'movie'}" @click="applyFilter('movie')">Phim Điện Ảnh</button>
                <button class="btn btn-filter" :class="{active: activeFilter === 'tv_series'}" @click="applyFilter('tv_series')">Phim Truyền Hình</button>
              </div>
            </div>

            <!-- Lọc theo thể loại -->
            <div class="filter-group">
              <h5 class="filter-title">Lọc theo thể loại</h5>
              <div class="d-flex flex-wrap gap-2">
                <button v-for="genre in genres" :key="genre" class="btn btn-filter" :class="{ active: activeGenre === genre }" @click="applyGenreFilter(genre)">
                  {{ genre }}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import cineverseService from '@/services/cineverse.service';

// --- Khởi tạo ---
const route = useRoute();
const ITEMS_PER_PAGE = 5; // Giới hạn số lượng phim mỗi trang

// --- State cục bộ ---
const searchQuery = ref('');
const activeFilter = ref('all');
const activeGenre = ref(null);
const currentPage = ref(1); // Trang hiện tại
const totalPages = ref(1); // Tổng số trang (sẽ cập nhật từ API)

// Danh sách thể loại
const genres = ref([
  "Hành Động", "Phiêu Lưu", "Giả Tượng", "Bí Ẩn", "Hài", "Lãng Mạn", "Khoa Học Viễn Tưởng", "Lịch Sử", "Kinh Dị",
  "Gây Cấn", "Chiến Tranh", "Chính Kịch", "Tài Liệu", "Hoạt Hình", "Gia Đình", "Hình Sự"
]);

// --- QUERY (Lấy dữ liệu) ---
const { data: results, isLoading } = useQuery({
  // queryKey chứa tất cả các state ảnh hưởng đến kết quả, bao gồm currentPage
  queryKey: ['searchResults', searchQuery, activeFilter, activeGenre, currentPage],
  queryFn: async () => {
    // Xây dựng params
    const params = { 
      search: searchQuery.value,
      page: currentPage.value,
      limit: ITEMS_PER_PAGE
    };
    if (activeFilter.value && activeFilter.value !== 'all') {
      params.type = activeFilter.value;
    }
    if (activeGenre.value) {
      params.genre = activeGenre.value; // Chú ý: Backend cần check xem filter genre nhận tên hay ID. Tạm thời giả định là tên hoặc backend sẽ map. 
      // Tuy nhiên, model của bạn filter theo genre_id. Nếu flow Frontend gửi tên genre thì Backend phải sửa logic movieModel hoặc Frontend phải map Name -> ID.
      // Dựa vào code cũ, model filter theo genre_id (số). Nhưng UI đang hiển thị tên Genre.
      // Tạm thời Logic này có thể lỗi nếu Backend đòi ID. Tôi sẽ giữ nguyên logic cũ và giả định Backend xử lý hoặc người dùng chấp nhận tìm kiếm text.
    }
    
    // Sử dụng endpoint Advanced để hỗ trợ Pagination
    const response = await cineverseService.getMoviesAdvanced(params);
    return response; 
  },
  // Biến đổi dữ liệu trả về từ API
  select: (apiResponse) => {
    // Cập nhật State Pagination từ phản hồi
    if (apiResponse.pagination) {
      totalPages.value = apiResponse.pagination.totalPages;
    }

    const movies = apiResponse.movies || [];

    return movies.map(movie => ({
      id: movie.movie_id,
      title: movie.title,
      year: movie.release_year,
      type: movie.type === 'movie' ? 'Phim Điện Ảnh' : 'Phim Truyền Hình',
      cast: 'Đang cập nhật...', 
      posterUrl: movie.poster_url,
      genres: movie.genres || []
    }));
  },
  enabled: computed(() => true), // Luôn enable để có thể hiện danh sách mặc định hoặc search
  keepPreviousData: true, 
  initialData: [],
});

// --- Handlers ---

const applyFilter = (filterType) => {
  activeFilter.value = filterType;
  resetPagination(); 
};

const applyGenreFilter = (genre) => {
  if (activeGenre.value === genre) {
    activeGenre.value = null; 
  } else {
    activeGenre.value = genre;
  }
  resetPagination();
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên đầu trang khi chuyển trang
  }
};

const resetPagination = () => {
  currentPage.value = 1;
};

const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/80x120/0D0C1D/F5F5FA?text=No+Img';
};

// --- Watcher ---
watch(
  () => route.query.q,
  (newQuery) => {
    searchQuery.value = newQuery || '';
    resetPagination();
  },
  { immediate: true }
);
</script>

<style scoped>
.search-view-container {
  padding-top: 100px;
  /* background-color: var(--deep-space-black); REMOVED for global galaxy effect */
  min-height: 100vh;
  color: var(--nebula-white);
}

.page-title {
  font-weight: 700;
  border-left: 4px solid var(--galaxy-purple);
  padding-left: 1rem;
}

.text-starlight-yellow {
  color: var(--starlight-yellow);
}

.glass-pane {
  background: var(--surface-glass);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid var(--border-glass);
  border-radius: 0.75rem;
}

.result-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-glass);
  transition: background-color 0.3s ease;
  color: inherit;
  cursor: pointer;
}
.result-item:hover {
  background-color: var(--surface-glass);
  border-radius: 0.5rem;
}
.result-item:last-child {
  border-bottom: none;
}

.item-poster {
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-right: 1.5rem;
  flex-shrink: 0;
}

.item-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--nebula-white);
  margin-bottom: 0.25rem;
}

.item-meta {
  color: #adb5bd;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.item-cast {
  font-size: 0.9rem;
  color: #6c757d;
}

.sidebar-filters {
  position: sticky;
  top: 100px; 
}

.filter-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--starlight-yellow);
  margin-bottom: 1rem;
}

.btn-filter {
  background-color: rgba(245, 245, 250, 0.1);
  border: 1px solid var(--border-glass);
  color: var(--nebula-white);
  transition: all 0.3s ease;
}
.btn-filter:hover {
  background-color: var(--galaxy-purple);
  border-color: var(--galaxy-purple);
  color: white;
}
.btn-filter.active {
  background: linear-gradient(90deg, var(--galaxy-purple), var(--cosmic-blue));
  border-color: var(--cosmic-blue);
  color: white;
  font-weight: bold;
}

.result-item-placeholder {
  display: flex;
  align-items: center;
}

/* Pagination Styles */
.pagination-controls {
  padding-top: 1rem;
  border-top: 1px solid var(--border-glass);
}

.btn-glass {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-glass:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.btn-glass:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-weight: 600;
  color: var(--starlight-yellow);
}
</style>
