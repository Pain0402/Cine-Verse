import { createWebHistory, createRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // --- PUBLIC ROUTES ---
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Trang chủ' },
  },
  {
    path: '/movies/:id',
    name: 'movie.detail',
    component: () => import('@/views/MovieDetailView.vue'),
    props: true,
    meta: { title: 'Chi tiết phim' }, // Tiêu đề sẽ được cập nhật động sau
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/SearchView.vue'),
    meta: { title: 'Tìm kiếm' },
  },

  // --- GUEST ROUTE (chỉ dành cho người chưa đăng nhập) ---
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/views/AuthView.vue'),
    meta: { title: 'Đăng nhập / Đăng ký' },
  },

  // --- USER PROTECTED ROUTES (yêu cầu đăng nhập) ---
  {
    path: '/user',
    component: () => import('@/layouts/UserLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        // Đường dẫn thực tế: /user/profile
        path: 'profile',
        name: 'user.profile',
        component: () => import('@/views/UserProfile.vue'),
        meta: { title: 'Hồ sơ của tôi' },
      },
      {
        // Đường dẫn thực tế: /user/watchlist
        path: 'watchlist',
        name: 'user.watchlist',
        component: () => import('@/views/WatchListView.vue'),
        meta: { title: 'Danh sách xem' },
      },
    ],
  },

  // --- ADMIN PROTECTED ROUTES (yêu cầu quyền admin) ---
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        // Đường dẫn mặc định cho /admin
        path: '',
        name: 'admin.dashboard',
        component: () => import('@/views/MovieManagementView.vue'),
        meta: { title: 'Bảng điều khiển Admin' },
      },
    ],
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: () => import('@/views/ErrorView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

/**
 * Global Navigation Guard:
 * Chạy trước mỗi lần điều hướng.
 * Dùng để kiểm tra quyền truy cập.
 */
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  const requiresAdmin = to.meta.requiresAdmin
  const isAuthenticated = authStore.isAuthenticated
  const isAdmin = authStore.isAdmin // Giả sử store có getter/state này

  // 1. Nếu route yêu cầu đăng nhập VÀ người dùng chưa đăng nhập
  if (requiresAuth && !isAuthenticated) {
    // Chuyển hướng đến trang đăng nhập, lưu lại đường dẫn họ muốn vào
    return next({ name: 'auth', query: { redirect: to.fullPath } })
  }

  // 2. Nếu route yêu cầu quyền admin VÀ người dùng không phải admin
  if (requiresAdmin && !isAdmin) {
    // Chuyển hướng về trang chủ (hoặc trang "không có quyền")
    return next({ name: 'home' })
  }

  // 3. Nếu người dùng đã đăng nhập VÀ cố vào trang auth
  if (to.name === 'auth' && isAuthenticated) {
    // Chuyển hướng đến trang hồ sơ
    return next({ name: 'user.profile' })
  }

  // Mọi trường hợp khác, cho phép đi tiếp
  next()
})

/**
 * Global After Hook:
 * Chạy sau mỗi lần điều hướng thành công.
 * Dùng để cập nhật tiêu đề trang.
 */
router.afterEach((to) => {
  const defaultTitle = 'Cineverse'
  if (to.name === 'movie.detail') {
    // Tiêu đề cho trang chi tiết phim có thể được cập nhật động bên trong component
    // Nhưng ta vẫn có thể đặt một tiêu đề tạm thời
    document.title = `Chi tiết phim | ${defaultTitle}`
  } else {
    document.title = to.meta.title ? `${to.meta.title} | ${defaultTitle}` : defaultTitle
  }
})

export default router
