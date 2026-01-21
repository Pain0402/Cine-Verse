<template>
  <div class="auth-page-container">
    <div class="auth-card">
      <!-- ===== PHẦN BRANDING BÊN TRÁI CỦA CARD ===== -->
      <div class="auth-branding">
        <div class="logo-area">
          <img src="@/assets/imgs/universe.png" alt="" class="logo" style="width: 100px;">
          <h1 class="brand-name">CineVerse</h1>
          <p class="slogan">Khám phá vũ trụ điện ảnh trong tầm tay.</p>
        </div>
      </div>

      <!-- ===== PHẦN FORM BÊN PHẢI CỦA CARD ===== -->
      <div class="auth-form">
        <div class="form-container">
          <!-- Form Đăng nhập -->
          <div v-if="viewMode === 'login'">
            <h2 class="form-title">Welcome Back</h2>
            <p class="form-subtitle">Nhập thông tin của bạn để tiếp tục.</p>
            <form @submit.prevent="handleLogin" class="mt-4">
              <input type="email" class="form-input" placeholder="Email" v-model="loginForm.email" required>
              <input type="password" class="form-input" placeholder="Mật khẩu" v-model="loginForm.password" required>
              <a href="#" @click.prevent="viewMode = 'forgotPassword'" class="forgot-password-link">Quên mật khẩu?</a>
              <button type="submit" class="btn-submit" :disabled="isLoginLoading">
                <span v-if="isLoginLoading" class="spinner-border spinner-border-sm"></span>
                <span v-else>Đăng Nhập</span>
              </button>
            </form>
            <div class="separator"><span>HOẶC</span></div>
            <div class="social-login-group">
              <button class="btn-social"><i class="bi bi-google"></i>Tiếp tục với Google</button>
              <button class="btn-social"><i class="bi bi-facebook"></i>Tiếp tục với Facebook</button>
            </div>
            <p class="switch-form-text">
              Chưa có tài khoản? <a href="#" @click.prevent="viewMode = 'register'">Đăng ký ngay</a>
            </p>
          </div>

          <!-- Form Đăng ký -->
          <div v-if="viewMode === 'register'">
            <h2 class="form-title">Tạo tài khoản</h2>
            <p class="form-subtitle">Bắt đầu hành trình khám phá phim ảnh.</p>
            <form @submit.prevent="handleRegister" class="mt-4">
              <input type="text" class="form-input" placeholder="Tên người dùng" v-model="registerForm.username"
                required>
              <input type="email" class="form-input" placeholder="Email" v-model="registerForm.email" required>
              <input type="password" class="form-input" placeholder="Mật khẩu" v-model="registerForm.password" required>
              <input type="password" class="form-input" placeholder="Xác nhận mật khẩu"
                v-model="registerForm.confirmPassword" required>
              <button type="submit" class="btn-submit" :disabled="isRegisterLoading">
                <span v-if="isRegisterLoading" class="spinner-border spinner-border-sm"></span>
                <span v-else>Tạo tài khoản</span>
              </button>
            </form>
            <p class="switch-form-text">
              Đã có tài khoản? <a href="#" @click.prevent="viewMode = 'login'">Đăng nhập</a>
            </p>
          </div>

          <!-- Form Quên mật khẩu -->
          <div v-if="viewMode === 'forgotPassword'">
            <h2 class="form-title">Quên mật khẩu</h2>
            <p class="form-subtitle">Nhập email của bạn để nhận liên kết khôi phục.</p>
            <form @submit.prevent="handleForgotPassword" class="mt-4">
              <input type="email" class="form-input" placeholder="Email" v-model="forgotPasswordForm.email" required>
              <button type="submit" class="btn-submit" :disabled="isForgotPasswordLoading">
                <span v-if="isForgotPasswordLoading" class="spinner-border spinner-border-sm"></span>
                <span v-else>Gửi liên kết</span>
              </button>
            </form>
            <p class="switch-form-text">
              <a href="#" @click.prevent="viewMode = 'login'"><i class="bi bi-arrow-left"></i> Quay lại Đăng nhập</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';
import cineverseService from '@/services/cineverse.service';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';

// --- Khởi tạo ---
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

// --- State cục bộ cho UI ---
const viewMode = ref('login'); // 'login', 'register', 'forgotPassword'

// --- State cho các Form ---
const loginForm = reactive({ email: '', password: '' });
const registerForm = reactive({ username: '', email: '', password: '', confirmPassword: '' });
const forgotPasswordForm = reactive({ email: '' });

// --- MUTATIONS ---
const { mutate: login, isPending: isLoginLoading } = useMutation({
  mutationFn: (credentials) => cineverseService.login(credentials),
  onSuccess: (responseData) => {
    authStore.setAuth(responseData.user, responseData.token);
    toast.success('Đăng nhập thành công! Đang chuyển hướng...');
    setTimeout(() => router.push({ name: 'home' }), 1000);
  },
  onError: (error) => toast.error(error.message || 'Email hoặc mật khẩu không chính xác.'),
});

const { mutate: register, isPending: isRegisterLoading } = useMutation({
  mutationFn: (userData) => cineverseService.register(userData),
  onSuccess: () => {
    toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
    const registeredEmail = registerForm.email;
    Object.assign(registerForm, { username: '', email: '', password: '', confirmPassword: '' });
    loginForm.email = registeredEmail;
    viewMode.value = 'login';
  },
  onError: (error) => toast.error(error.message || 'Đăng ký thất bại. Vui lòng thử lại.'),
});

const { mutate: forgotPassword, isPending: isForgotPasswordLoading } = useMutation({
  mutationFn: (emailData) => cineverseService.forgotPassword(emailData),
  onSuccess: (response) => toast.success(response.message || "Đã gửi liên kết khôi phục. Vui lòng kiểm tra email!"),
  onError: (error) => toast.error(error.message || "Email không tồn tại hoặc có lỗi xảy ra."),
});

// --- Handlers ---
const handleLogin = () => login(loginForm);

const handleRegister = () => {
  if (registerForm.password !== registerForm.confirmPassword) {
    return toast.error('Mật khẩu và xác nhận mật khẩu không khớp.');
  }
  register({
    username: registerForm.username,
    email: registerForm.email,
    password: registerForm.password,
  });
};

const handleForgotPassword = () => forgotPassword({ email: forgotPasswordForm.email });

// --- Computed ---
// const isLoading = computed(() => isLoginLoading.value || isRegisterLoading.value || isForgotPasswordLoading.value);
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");

/* Container chính bao bọc toàn bộ trang */
.auth-page-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 2rem;
  background-color: var(--deep-space-black);
  /* background-image: url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop'); */
  background-image: url(https://wallpapers.com/images/high/mysterious-exoplanet-orbiting-in-a-vibrant-cosmic-galaxy-with-glowing-nebulae-and-distant-stars-zfrdrrubov679nsw.webp);
  background-size: cover;
  background-position: center;
  font-family: 'Be Vietnam Pro', sans-serif;
  padding: 70px;
}

/* Thẻ chính chứa cả 2 phần */
.auth-card {
  width: 100%;
  max-width: 1100px;
  min-height: 650px;
  display: flex;
  border-radius: 1rem;
  overflow: hidden;
  background: var(--surface-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-glass);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

/* Phần branding bên trái */
.auth-branding {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  border-right: 1px solid var(--border-glass);
}

.logo-area .brand-name {
  font-size: 3rem;
  font-weight: 700;
  color: var(--nebula-white);
  margin-top: 1rem;
  text-shadow: 0 0 15px rgba(255, 217, 77, 0.5);
}

.logo-area .slogan {
  font-size: 1.25rem;
  color: rgba(245, 245, 250, 0.8);
  margin-top: 0.5rem;
}

/* Phần form bên phải */
.auth-form {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background-color: rgba(18, 17, 36, 0.5);
  /* Nền hơi trong suốt */
}

.form-container {
  width: 100%;
  max-width: 380px;
  color: var(--nebula-white);
}

.form-title {
  font-size: 2rem;
  font-weight: 600;
}

.form-subtitle {
  color: rgba(245, 245, 250, 0.6);
  margin-top: 0.5rem;
}

.form-input {
  width: 100%;
  background-color: var(--surface-glass);
  border: 1px solid var(--border-glass);
  color: var(--nebula-white);
  padding: 0.85rem 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  background-color: rgba(245, 245, 250, 0.1);
  border-color: var(--cosmic-blue);
  box-shadow: 0 0 0 3px rgba(46, 115, 232, 0.25);
  outline: none;
}

.forgot-password-link {
  display: block;
  text-align: right;
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: var(--cosmic-blue);
  text-decoration: none;
}

.btn-submit {
  width: 100%;
  padding: 0.85rem;
  margin-top: 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  background: linear-gradient(90deg, var(--galaxy-purple), var(--cosmic-blue));
  color: var(--nebula-white);
  transition: all 0.3s ease;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(46, 115, 232, 0.3);
}

.separator {
  display: flex;
  align-items: center;
  text-align: center;
  color: rgba(245, 245, 250, 0.4);
  margin: 2rem 0;
  font-size: 0.8rem;
  font-weight: 600;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--border-glass);
}

.separator span {
  padding: 0 1rem;
}

.btn-social {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  border: 1px solid var(--border-glass);
  background: transparent;
  color: var(--nebula-white);
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-social:hover {
  background-color: rgba(245, 245, 250, 0.1);
  border-color: var(--nebula-white);
}

.switch-form-text {
  text-align: center;
  margin-top: 2rem;
  color: rgba(245, 245, 250, 0.7);
}

.switch-form-text a {
  color: var(--starlight-yellow);
  font-weight: 600;
  text-decoration: none;
}

/* Responsive */
@media (max-width: 992px) {
  .auth-card {
    flex-direction: column;
    min-height: auto;
  }

  .auth-branding {
    border-right: none;
    border-bottom: 1px solid var(--border-glass);
    padding: 3rem 1rem;
  }

  .auth-page-container {
    padding: 1rem;
  }
}
</style>
