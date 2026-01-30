<template>
  <footer class="footer-container py-5">
    <div class="footer-nebula"></div> <!-- Hiệu ứng nền vũ trụ -->
    <div class="container">
      <div class="row gy-4">

        <!-- Cột 1: Thông tin & Logo -->
        <div class="col-lg-4 col-md-6">
          <div class="d-flex align-items-center mb-3">
            <img src="@/assets/imgs/universe.png" alt="Logo CineVerse" class="footer-logo me-2">
            <h4 class="footer-title mb-0"><span class="brand-text">CineVerse</span></h4>
          </div>
          <p class="small">
            Cánh cổng đưa bạn đến với vũ trụ điện ảnh bất tận. Khám phá, theo dõi và thảo luận về những bộ phim yêu
            thích.
          </p>
          <p class="small mt-4 mb-0">&copy; 2025 CineVerse. Mọi quyền được bảo lưu.</p>
        </div>

        <!-- Cột 2: Liên kết nhanh -->
        <div class="col-lg-2 col-md-6">
          <h5 class="footer-heading mb-3">Khám phá</h5>
          <ul class="list-unstyled">
            <li><a href="#" class="footer-link">Trang chủ</a></li>
            <li><a href="#" class="footer-link">Phim mới</a></li>
            <li><a href="#" class="footer-link">Anime</a></li>
            <li><a href="#" class="footer-link">Bảng xếp hạng</a></li>
          </ul>
        </div>

        <!-- Cột 3: Pháp lý & Hỗ trợ -->
        <div class="col-lg-3 col-md-6">
          <h5 class="footer-heading mb-3">Hỗ trợ</h5>
          <ul class="list-unstyled">
            <li><a href="#" class="footer-link">Về chúng tôi</a></li>
            <li><a href="#" class="footer-link">Câu hỏi thường gặp (FAQ)</a></li>
            <li><a href="#" class="footer-link">Chính sách bảo mật</a></li>
            <li><a href="#" class="footer-link">Điều khoản dịch vụ</a></li>
          </ul>
        </div>

        <!-- Cột 4: Mạng xã hội -->
        <div class="col-lg-3 col-md-6">
          <h5 class="footer-heading mb-3">Theo dõi chúng tôi</h5>
          <div class="social-icons">
            <a href="#" target="_blank" rel="noopener noreferrer" class="social-icon" title="Facebook">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" class="social-icon" title="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" class="social-icon" title="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" class="social-icon" title="YouTube">
              <i class="fab fa-youtube"></i>
            </a>
          </div>
        </div>

      </div>
    </div>
  </footer>
</template>

<style scoped>
.brand-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(90deg, #FFFFFF 0%, var(--starlight-yellow) 30%, var(--cosmic-blue) 70%, var(--galaxy-purple) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(46, 115, 232, 0.5);
  letter-spacing: 1px;
}

.footer-container {
  position: relative;
  background: rgba(13, 12, 29, 0.4); /* More transparent to show stars */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(90, 66, 212, 0.5); /* Glowing border */
  box-shadow: 0 -5px 20px rgba(90, 66, 212, 0.2); /* Top glow */
  color: var(--nebula-white);
  overflow: hidden;
}

/* Hiệu ứng tinh vân (Nebula) chuyển động nền mạnh hơn */
.footer-nebula {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 100%, rgba(255, 0, 150, 0.15) 0%, transparent 50%), 
    radial-gradient(circle at 80% 0%, rgba(0, 200, 255, 0.15) 0%, transparent 50%);
  filter: blur(30px);
  z-index: 0;
  animation: nebula-shift 8s ease-in-out infinite alternate;
}

@keyframes nebula-shift {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.2); opacity: 0.9; }
}

/* Đảm bảo nội dung nằm trên lớp nền */
.footer-container .container {
  position: relative;
  z-index: 1;
}

.footer-logo {
  width: 50px;
  height: 50px;
}

.footer-title {
  font-weight: 700;
  color: #fff;
  /* Glow text managed by brand-text now */
}

.footer-heading {
  font-weight: 600;
  color: var(--starlight-yellow); /* Nổi bật tiêu đề cột */
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
  margin-bottom: 0.5rem;
}

.footer-link:hover {
  color: var(--starlight-yellow);
  padding-left: 5px;
  text-shadow: 0 0 8px rgba(255, 217, 77, 0.5);
}

.social-icons {
  display: flex;
  gap: 1rem;
}

.social-icon {
  color: var(--nebula-white);
  font-size: 1.25rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-glass);
  border-radius: 50%;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.05);
}

.social-icon:hover {
  color: #fff;
  background-color: var(--galaxy-purple);
  border-color: var(--galaxy-purple);
  transform: translateY(-3px) rotate(360deg); /* Xoay vòng khi hover */
  box-shadow: 0 0 15px rgba(90, 66, 212, 0.6);
}
</style>
