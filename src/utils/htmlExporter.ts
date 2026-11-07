/**
 * Generates an ultra-portable, 100% self-contained single .html file
 * that can be double-clicked on any computer (Windows, macOS, Linux) or mobile device
 * without needing Node.js, internet access, or local web servers.
 *
 * Implements:
 * 1. Pure Canvas 2D Particle Fireworks Engine with:
 *    - Click & touch anywhere launches rising rocket from bottom with tail sparks to click coordinates
 *    - 12 procedural explosion shapes (Chrysanthemum, Peony, Willow, Ring, Heart, Lotus, Palm, Star, Double Ring, Brocade, Sapphire, Grand Finale)
 *    - Floating celebratory tribute text badges at burst centers
 *    - Welcoming corner bursts automatically fired on page open
 *    - Special grand fireworks on clicking "20 - 11"
 *    - Prominent toggle button for fireworks
 * 2. Pure Web Audio synthesizer playing the melody of "Bài ca người giáo viên nhân dân"
 * 3. Complete tribute content: Bouquet, Math Garden, Tribute Letter, and Personalized 3D Card
 */

export function downloadStandaloneSingleHtml() {
  const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Tháng Mười Một – Ngàn Hoa Tri Ân | Tổ Toán THPT Gia Hội 20/11</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #081226;
      color: #f5f5f4;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      overflow-x: hidden;
      position: relative;
    }
    .serif { font-family: "Georgia", "Times New Roman", serif; }
    .gold { color: #f59e0b; }
    .gold-gradient {
      background: linear-gradient(90deg, #d4af37, #fff3b0, #d4af37);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .container { max-width: 900px; margin: 0 auto; padding: 2rem 1rem; position: relative; z-index: 10; }
    .card {
      background: rgba(13, 27, 62, 0.88);
      border: 1px solid rgba(212, 175, 55, 0.35);
      border-radius: 1.25rem;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      backdrop-blur: 10px;
    }
    .letter-paper {
      background: #faf6ee;
      color: #292524;
      border: 2px solid #d4af37;
      border-radius: 1rem;
      padding: 2.5rem;
      margin: 2rem 0;
      box-shadow: 0 15px 40px rgba(0,0,0,0.4);
    }
    .letter-paper h2 { color: #78350f; font-family: Georgia, serif; text-align: center; margin-bottom: 1.5rem; }
    .letter-paper p { margin-bottom: 1rem; text-align: justify; }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #020617;
      font-weight: 700;
      border: none;
      border-radius: 0.75rem;
      padding: 0.75rem 1.5rem;
      cursor: pointer;
      font-size: 0.95rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4); }
    .btn-secondary {
      background: #1e293b;
      color: #f1f5f9;
      border: 1px solid #475569;
    }
    .interactive-flower {
      display: inline-block;
      padding: 0.6rem 1rem;
      margin: 0.4rem;
      background: #0f172a;
      border: 1px solid #d4af37;
      border-radius: 9999px;
      cursor: pointer;
      color: #fef08a;
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    .interactive-flower:hover {
      background: #78350f;
      transform: scale(1.05);
    }
    .quote-box {
      margin-top: 1.5rem;
      padding: 1.25rem;
      background: rgba(2, 6, 23, 0.85);
      border-left: 4px solid #f59e0b;
      border-radius: 0.5rem;
      font-style: italic;
      color: #fef3c7;
      min-height: 4rem;
    }
    .center { text-align: center; }

    /* Canvas Fireworks Overlay */
    #fireworks-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 2;
    }

    /* Fixed Floating Controls */
    .floating-bar {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 100;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .floating-btn {
      background: rgba(8, 18, 38, 0.85);
      border: 1px solid rgba(212, 175, 55, 0.4);
      color: #fef08a;
      padding: 0.5rem 0.9rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      transition: all 0.2s;
    }
    .floating-btn:hover {
      background: rgba(212, 175, 55, 0.25);
      transform: scale(1.04);
    }

    /* Interactive 20 - 11 Title */
    .title-centerpiece {
      cursor: pointer;
      display: inline-block;
      user-select: none;
      transition: transform 0.3s;
    }
    .title-centerpiece:hover {
      transform: scale(1.06);
    }
    .hint-badge {
      display: inline-block;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.3);
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      color: #fde047;
      margin-top: 0.5rem;
    }
  </style>
</head>
<body>
  <!-- Fullscreen Particle Fireworks Canvas -->
  <canvas id="fireworks-canvas"></canvas>

  <!-- Top Floating Controls -->
  <div class="floating-bar">
    <button class="floating-btn" id="toggle-fireworks-btn" onclick="toggleFireworks()">
      🎆 Pháo hoa: Đang Bật
    </button>
    <button class="floating-btn" id="toggle-music-btn" onclick="toggleMusic()">
      ♪ Hòa tấu: Bài Ca Người GVND
    </button>
  </div>

  <div class="container">
    <div class="center" style="padding: 2.5rem 0 1.5rem 0;">
      <div style="letter-spacing: 0.2em; text-transform: uppercase; color: #facc15; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.75rem;">
        ✦ TỔ TOÁN – TRƯỜNG THPT GIA HỘI ✦
      </div>
      <h1 class="serif gold-gradient" style="font-size: 2.5rem; line-height: 1.2; margin-bottom: 0.5rem;">
        CHÚC MỪNG NGÀY NHÀ GIÁO VIỆT NAM
      </h1>

      <!-- Clickable 20 - 11 Centerpiece -->
      <div class="title-centerpiece" onclick="launchGrand2011Burst()" title="Kích vào đây để bắn pháo hoa tri ân 20 - 11!">
        <div class="gold" style="font-size: 4.8rem; font-weight: 900; letter-spacing: 0.05em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-shadow: 0 4px 20px rgba(245,158,11,0.5);">
          20 − 11
        </div>
        <div class="hint-badge">
          ✨ Chạm vào 20 − 11 để bắn pháo hoa đặc biệt ✨
        </div>
      </div>

      <p class="serif" style="font-style: italic; font-size: 1.2rem; color: #e2e8f0; margin-top: 1rem;">
        “Tri thức gieo mầm – Yêu thương nở hoa – Nghề giáo tỏa sáng.”
      </p>
      <div style="font-size: 0.85rem; color: #94a3b8; margin-top: 0.5rem;">
        ✦ Mẹo: Kích chuột hoặc chạm bất kỳ đâu trên màn hình để phóng pháo hoa ✦
      </div>
    </div>

    <!-- Bó hoa nghệ thuật tương tác -->
    <div class="card center">
      <h2 class="serif gold" style="font-size: 1.75rem; margin-bottom: 0.5rem;">Bó Hoa Nghệ Thuật 20/11</h2>
      <p style="font-size: 0.9rem; color: #cbd5e1; margin-bottom: 1.5rem;">
        Chạm vào từng đóa hoa tượng trưng để đón nhận lời chúc mừng từ Tổ Toán
      </p>
      <div id="flower-buttons">
        <button class="interactive-flower" onclick="showQuote('Kính trọng người gieo hạt tri thức.')">🌹 Hoa Hồng Nhung</button>
        <button class="interactive-flower" onclick="showQuote('Biết ơn những tháng ngày tận tụy.')">🌸 Hoa Hồng Phấn</button>
        <button class="interactive-flower" onclick="showQuote('Trân quý những bài học làm người.')">💙 Hoa Cẩm Tú Cầu</button>
        <button class="interactive-flower" onclick="showQuote('Chúc Thầy Cô luôn mạnh khỏe và hạnh phúc.')">🌼 Hoa Đồng Tiền Vàng</button>
        <button class="interactive-flower" onclick="showQuote('Mỗi nét phấn trắng là một hạt mầm tương lai.')">🤍 Cúc Họa Mi Trắng</button>
        <button class="interactive-flower" onclick="showQuote('Bụi phấn rơi nghiêng, dệt nên những ước mơ bay xa.')">🌺 Hoa Hồng Tỉ Muội</button>
      </div>
      <div id="quote-display" class="quote-box serif">
        “Kính trọng người gieo hạt tri thức – Biết ơn những tháng ngày tận tụy của quý Thầy Cô.”
      </div>
    </div>

    <!-- Bức thư tri ân -->
    <div class="letter-paper">
      <h2>THƯ TRI ÂN – TỔ TOÁN THPT GIA HỘI</h2>
      <p style="font-style: italic; font-weight: bold; color: #78350f;">Kính gửi quý Thầy giáo, Cô giáo!</p>
      <p>Tháng Mười Một lại về, mang theo những tình cảm yêu thương và lòng biết ơn sâu sắc dành cho những người đã và đang tận tụy với sự nghiệp trồng người.</p>
      <p>Nhân Ngày Nhà giáo Việt Nam 20/11, Tổ Toán – Trường THPT Gia Hội xin kính gửi đến quý Thầy giáo, Cô giáo những lời chúc mừng tốt đẹp và chân thành nhất.</p>
      <p>Xin tri ân những bài giảng tâm huyết, những giờ lên lớp miệt mài, những lời động viên ân cần và cả những hy sinh thầm lặng mà quý Thầy Cô đã dành cho các thế hệ học sinh.</p>
      <p>Mỗi bài học không chỉ mở ra một chân trời tri thức, mà còn góp phần vun đắp nhân cách, khơi dậy niềm tin và chắp cánh cho những ước mơ.</p>
      <p>Trên hành trình ấy, tình yêu nghề, lòng tận tâm và sự sẻ chia của quý Thầy Cô luôn là những giá trị đáng trân trọng.</p>
      <p>Kính chúc quý Thầy giáo, Cô giáo luôn mạnh khỏe, bình an, hạnh phúc; giữ mãi ngọn lửa đam mê với nghề và tiếp tục gặt hái nhiều thành công trong sự nghiệp giáo dục.</p>
      <div style="text-align: right; margin-top: 1.5rem; font-weight: bold; color: #78350f;">
        <p style="font-style: italic;">Trân trọng và biết ơn!</p>
        <p style="text-transform: uppercase;">TẬP THỂ TỔ TOÁN – TRƯỜNG THPT GIA HỘI</p>
      </div>
    </div>

    <!-- Thiệp chúc mừng tương tác -->
    <div class="card center">
      <h2 class="serif gold" style="font-size: 1.75rem; margin-bottom: 0.5rem;">Thiệp Chúc Mừng</h2>
      <div style="margin: 1rem 0;">
        <label style="font-size: 0.85rem; color: #cbd5e1; display: block; margin-bottom: 0.4rem;">Nhập tên Thầy Cô nhận thiệp:</label>
        <input type="text" id="recipient-input" value="Quý Thầy Cô" oninput="updateCard()" style="padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; background: #020617; color: white; width: 260px; text-align: center;">
      </div>
      <div style="background: #faf6ee; color: #1c1917; padding: 2rem; border-radius: 1rem; max-width: 500px; margin: 1rem auto; border: 1px solid #d4af37;">
        <div style="font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; color: #78350f;">HAPPY VIETNAMESE TEACHERS' DAY 20 - 11</div>
        <h3 id="card-greeting" class="serif" style="color: #78350f; font-size: 1.4rem; margin: 0.75rem 0;">KÍNH CHÚC QUÝ THẦY CÔ</h3>
        <p style="font-size: 0.95rem; margin-bottom: 0.75rem;">Một mùa Hiến chương thật nhiều niềm vui, sức khỏe, bình an và hạnh phúc.</p>
        <p style="font-size: 0.95rem;">Chúc mỗi ngày đến trường là một ngày ý nghĩa, mỗi bài giảng là một niềm vui và mỗi thế hệ học trò là một niềm tự hào.</p>
        <div style="margin-top: 1rem; font-weight: bold; color: #78350f; font-size: 0.9rem;">
          Trân quý và biết ơn!<br>Tổ Toán – Trường THPT Gia Hội
        </div>
      </div>
      <button class="btn btn-secondary" onclick="copyCardText()">📋 Sao chép lời chúc</button>
    </div>

    <!-- Lời kết -->
    <div class="center" style="padding: 2.5rem 0; border-top: 1px solid rgba(212,175,55,0.2);">
      <h2 class="serif gold-gradient" style="font-size: 2rem; margin-bottom: 0.5rem;">NGÀN HOA TRI ÂN – VẠN LỜI YÊU THƯƠNG</h2>
      <p class="serif" style="font-style: italic; color: #fef3c7; font-size: 1.15rem;">
        “Cảm ơn Thầy Cô vì đã chọn gieo những hạt mầm tri thức và yêu thương.”
      </p>
      <div style="margin-top: 1.5rem; text-transform: uppercase; font-size: 0.9rem; color: #facc15; font-weight: 700; letter-spacing: 0.15em;">
        TẬP THỂ TỔ TOÁN – TRƯỜNG THPT GIA HỘI
      </div>
      <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.5rem;">
        Mừng Ngày Nhà giáo Việt Nam 20 - 11 · Bản chạy ngoại tuyến độc lập
      </div>
    </div>
  </div>

  <script>
    /* =========================================================
     * PURE CANVAS 2D FIREWORKS & RISING ROCKET ENGINE
     * 100% Offline, Zero external libraries
     * ========================================================= */
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let fireworksEnabled = true;

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);
    resizeCanvas();

    const rockets = [];
    const particles = [];
    const floatingBadges = [];

    const SHAPES = [
      'chrysanthemum', 'peony', 'willow', 'ring',
      'heart', 'lotus', 'palm', 'star',
      'double-ring', 'brocade', 'sapphire', 'grand-finale'
    ];

    const PHRASES = [
      '✨ TRI ÂN THẦY CÔ! ✨',
      '💐 HAPPY TEACHERS\' DAY!',
      '✦ 20 − 11 YÊU THƯƠNG! ✦',
      '🌸 NGÀN HOA TRI ÂN! 🌸',
      '★ TÔN VINH NGƯỜI GIEO CHỮ! ★',
      '✦ TỔ TOÁN – THPT GIA HỘI! ✦',
      '🌱 TRI THỨC GIEO MẦM! 🌱',
      '☀️ NGHỀ GIÁO TỎA SÁNG! ☀️'
    ];

    class Rocket {
      constructor(startX, startY, targetX, targetY, shape) {
        this.x = startX;
        this.y = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.shape = shape || SHAPES[Math.floor(Math.random() * SHAPES.length)];
        const dx = targetX - startX;
        const dy = targetY - startY;
        const dist = Math.hypot(dx, dy);
        const steps = Math.max(30, Math.floor(dist / 14));
        this.vx = dx / steps;
        this.vy = dy / steps;
        this.active = true;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        // Spark trail
        for (let i = 0; i < 2; i++) {
          particles.push({
            x: this.x + (Math.random() - 0.5) * 4,
            y: this.y + (Math.random() * 6),
            vx: (Math.random() - 0.5) * 0.8,
            vy: Math.random() * 1.5 + 0.5,
            color: 'rgba(251, 191, 36, ',
            alpha: 1.0,
            decay: 0.04,
            size: 2.2,
            active: true
          });
        }
        if (this.y <= this.targetY || (this.vy > 0 && this.y >= this.targetY)) {
          this.active = false;
          explode(this.x, this.y, this.shape);
        }
      }
      draw() {
        ctx.save();
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function createParticle(x, y, vx, vy, color, size, decay, gravity = 0.05, drag = 0.97) {
      return {
        x, y, vx, vy, color, size, decay, gravity, drag,
        alpha: 1.0,
        active: true
      };
    }

    function explode(cx, cy, shape) {
      // Spawn celebratory floating badge
      const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
      floatingBadges.push({
        x: cx,
        y: cy,
        vy: -0.6,
        text: phrase,
        alpha: 1.0,
        decay: 0.012
      });

      // Fingertip sparkle flash right at burst point
      for (let i = 0; i < 28; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 1.0 + Math.random() * 2.5;
        particles.push(createParticle(cx, cy, Math.cos(a) * spd, Math.sin(a) * spd, 'rgba(254, 240, 138, ', 3.5, 0.045, 0.02, 0.94));
      }

      // Play soft chime note if audio context is running
      if (audioCtx && isPlaying) {
        playNote(440 + Math.random() * 300, audioCtx.currentTime, 0.4);
      }

      const count = shape === 'grand-finale' ? 180 : 110;

      switch (shape) {
        case 'heart': {
          for (let i = 0; i < count; i++) {
            const t = Math.random() * Math.PI * 2;
            const hx = 16 * Math.pow(Math.sin(t), 3);
            const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            const speed = 0.22 + Math.random() * 0.08;
            const roll = Math.random();
            const color = roll < 0.45 ? 'rgba(239, 68, 68, ' : roll < 0.75 ? 'rgba(244, 63, 94, ' : 'rgba(245, 158, 11, ';
            particles.push(createParticle(cx, cy, hx * speed, hy * speed, color, 2.5, 0.012, 0.02, 0.96));
          }
          break;
        }
        case 'ring':
        case 'double-ring': {
          for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const speed = (shape === 'double-ring' && i % 2 === 0) ? 5.2 : 3.5;
            const color = (shape === 'double-ring' && i % 2 === 0) ? 'rgba(245, 158, 11, ' : (i % 2 === 0 ? 'rgba(168, 85, 247, ' : 'rgba(56, 189, 248, ');
            particles.push(createParticle(cx, cy, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 2.8, 0.013, 0.02, 0.97));
          }
          break;
        }
        case 'star': {
          const points = 5;
          for (let i = 0; i < count; i++) {
            const pIdx = i % points;
            const baseAngle = (pIdx / points) * Math.PI * 2 - Math.PI / 2;
            const spread = (Math.random() - 0.5) * 0.3;
            const speed = 2.0 + Math.random() * 4.5;
            const roll = Math.random();
            const color = roll < 0.35 ? 'rgba(56, 189, 248, ' : roll < 0.7 ? 'rgba(168, 85, 247, ' : 'rgba(255, 255, 255, ';
            particles.push(createParticle(cx, cy, Math.cos(baseAngle + spread) * speed, Math.sin(baseAngle + spread) * speed, color, 3, 0.014, 0.03, 0.97));
          }
          break;
        }
        case 'willow': {
          for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2.2;
            particles.push(createParticle(cx, cy, Math.cos(angle) * speed, Math.sin(angle) * speed - 1.5, 'rgba(254, 240, 138, ', 2.2, 0.007, 0.065, 0.985));
          }
          break;
        }
        case 'sapphire': {
          for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 4.8;
            const color = Math.random() > 0.3 ? 'rgba(56, 189, 248, ' : 'rgba(255, 255, 255, ';
            particles.push(createParticle(cx, cy, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 2.5, 0.013, 0.035, 0.97));
          }
          break;
        }
        case 'grand-finale':
        default: {
          for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.8 + Math.random() * 5.5;
            const tier = i % 6;
            const color = tier === 0 ? 'rgba(245, 158, 11, ' // Gold
              : tier === 1 ? 'rgba(239, 68, 68, ' // Ruby Red
              : tier === 2 ? 'rgba(56, 189, 248, ' // Sapphire Blue
              : tier === 3 ? 'rgba(168, 85, 247, ' // Amethyst Purple
              : tier === 4 ? 'rgba(244, 63, 94, ' // Rose Pink
              : 'rgba(255, 255, 255, '; // Diamond White
            particles.push(createParticle(cx, cy, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 3.2, 0.011, 0.038, 0.97));
          }
          break;
        }
      }
    }

    function launchFirework(targetX, targetY, shape) {
      if (!fireworksEnabled) return;
      const startX = targetX + (Math.random() - 0.5) * 60;
      const startY = height + 10;
      rockets.push(new Rocket(startX, startY, targetX, targetY, shape));
    }

    function launchGrand2011Burst() {
      const centerX = width / 2;
      const centerY = height * 0.28;
      launchFirework(centerX - 120, centerY + 20, 'grand-finale');
      setTimeout(() => launchFirework(centerX, centerY - 40, 'lotus'), 300);
      setTimeout(() => launchFirework(centerX + 120, centerY + 20, 'heart'), 600);
    }

    // Welcoming corner bursts on startup
    setTimeout(() => {
      launchFirework(width * 0.15, height * 0.25, 'lotus');
      setTimeout(() => launchFirework(width * 0.85, height * 0.25, 'chrysanthemum'), 450);
      setTimeout(() => launchFirework(width * 0.5, height * 0.20, 'star'), 900);
    }, 600);

    // Auto-firework director interval
    let lastAutoLaunch = Date.now();
    function checkAutoLaunch() {
      if (!fireworksEnabled) return;
      const now = Date.now();
      if (now - lastAutoLaunch > 1900) {
        lastAutoLaunch = now;
        const tx = width * (0.15 + Math.random() * 0.7);
        const ty = height * (0.15 + Math.random() * 0.4);
        launchFirework(tx, ty);
      }
    }

    // Animation Loop
    function render() {
      ctx.clearRect(0, 0, width, height);

      checkAutoLaunch();

      // Update & Draw Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.update();
        if (r.active) {
          r.draw();
        } else {
          rockets.splice(i, 1);
        }
      }

      // Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= p.drag;
        p.vy = (p.vy + p.gravity) * p.drag;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update & Draw Floating Badges
      for (let i = floatingBadges.length - 1; i >= 0; i--) {
        const b = floatingBadges[i];
        b.y += b.vy;
        b.alpha -= b.decay;

        if (b.alpha <= 0) {
          floatingBadges.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.font = 'bold 13px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(254, 240, 138, ' + b.alpha + ')';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;
        ctx.fillText(b.text, b.x, b.y);
        ctx.restore();
      }

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    let lastTouchTime = 0;

    // Click / Touch listener across the sky (Mobile: instant burst; Desktop: rising rocket)
    window.addEventListener('pointerdown', function(e) {
      if (!fireworksEnabled) return;

      const isTouch = e.pointerType === 'touch' || e.pointerType === 'pen';

      // Guard against synthetic mouse events fired ~300ms after touch on mobile
      if (isTouch) {
        lastTouchTime = Date.now();
      } else if (Date.now() - lastTouchTime < 450) {
        return; // Ignore synthetic mouse event
      }

      const target = e.target;
      if (target && target.closest('button, a, input, textarea, .interactive-flower, .floating-btn, .title-centerpiece')) {
        return; // Don't intercept clicks on interactive buttons
      }

      if (isTouch) {
        // MOBILE: Instant sparkling burst at the touched position!
        explode(e.clientX, e.clientY);
      } else {
        // DESKTOP: Launch rocket from bottom to cursor!
        launchFirework(e.clientX, e.clientY);
      }
    }, { passive: true });

    function toggleFireworks() {
      fireworksEnabled = !fireworksEnabled;
      const btn = document.getElementById('toggle-fireworks-btn');
      btn.innerText = fireworksEnabled ? '🎆 Pháo hoa: Đang Bật' : '🎆 Pháo hoa: Đang Tắt';
      btn.style.opacity = fireworksEnabled ? '1' : '0.6';
    }

    /* =========================================================
     * PURE WEB AUDIO SYNTHESIZER: "BÀI CA NGƯỜI GIÁO VIÊN NHÂN DÂN"
     * ========================================================= */
    let audioCtx = null;
    let isPlaying = false;
    let songIndex = 0;
    let melodyTimer = null;

    // Frequencies
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
    const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.00;

    // "Bài ca người giáo viên nhân dân" melody score
    const MELODY = [
      { f: C4, d: 0.6 }, { f: E4, d: 0.3 }, { f: G4, d: 0.3 }, { f: A4, d: 0.6 }, { f: G4, d: 0.6 },
      { f: C5, d: 0.9 }, { f: B4, d: 0.3 }, { f: A4, d: 0.6 }, { f: G4, d: 1.2 },
      { f: E4, d: 0.6 }, { f: G4, d: 0.3 }, { f: A4, d: 0.3 }, { f: C5, d: 0.6 }, { f: A4, d: 0.6 },
      { f: G4, d: 0.6 }, { f: E4, d: 0.6 }, { f: D4, d: 1.2 },
      { f: C4, d: 0.6 }, { f: E4, d: 0.3 }, { f: G4, d: 0.3 }, { f: A4, d: 0.6 }, { f: C5, d: 0.6 },
      { f: D5, d: 0.9 }, { f: C5, d: 0.3 }, { f: A4, d: 0.6 }, { f: G4, d: 1.2 },
      { f: G4, d: 0.6 }, { f: A4, d: 0.3 }, { f: C5, d: 0.3 }, { f: D5, d: 0.6 }, { f: E5, d: 0.6 },
      { f: D5, d: 0.6 }, { f: C5, d: 0.6 }, { f: C5, d: 1.4 }
    ];

    function initAudio() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    }

    function playNote(freq, time, duration = 0.8) {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle'; // warm woodwind / celesta tone
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.12, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(time);
      osc.stop(time + duration);
    }

    function scheduleNextNote() {
      if (!isPlaying || !audioCtx) return;
      const item = MELODY[songIndex];
      playNote(item.f, audioCtx.currentTime, item.d * 1.1);
      songIndex = (songIndex + 1) % MELODY.length;
      melodyTimer = setTimeout(scheduleNextNote, item.d * 900);
    }

    function toggleMusic() {
      initAudio();
      isPlaying = !isPlaying;
      const btn = document.getElementById('toggle-music-btn');
      if (isPlaying) {
        btn.innerText = '♪ Hòa tấu: Đang Phát';
        btn.style.color = '#38bdf8';
        scheduleNextNote();
      } else {
        btn.innerText = '♪ Hòa tấu: Đã Dừng';
        btn.style.color = '#cbd5e1';
        clearTimeout(melodyTimer);
      }
    }

    function showQuote(text) {
      initAudio();
      playNote(523.25, audioCtx.currentTime, 0.4);
      playNote(659.25, audioCtx.currentTime + 0.08, 0.6);
      document.getElementById('quote-display').innerText = '“' + text + '”';
    }

    function updateCard() {
      const name = document.getElementById('recipient-input').value.trim() || 'QUÝ THẦY CÔ';
      document.getElementById('card-greeting').innerText = 'KÍNH CHÚC ' + name.toUpperCase();
    }

    function copyCardText() {
      const name = document.getElementById('recipient-input').value.trim() || 'Quý Thầy Cô';
      const text = \`HAPPY VIETNAMESE TEACHERS' DAY 20 - 11\\n\\nKÍNH CHÚC \${name.toUpperCase()}\\nMột mùa Hiến chương thật nhiều niềm vui, sức khỏe, bình an và hạnh phúc.\\nChúc mỗi ngày đến trường là một ngày ý nghĩa, mỗi bài giảng là một niềm vui và mỗi thế hệ học trò là một niềm tự hào.\\n\\nTrân quý và biết ơn!\\nTổ Toán – Trường THPT Gia Hội\`;
      navigator.clipboard.writeText(text).then(function() {
        alert('Đã sao chép lời chúc vào khay nhớ tạm! Thầy Cô có thể dán vào Zalo, Facebook hoặc Tin nhắn.');
      }).catch(function() {
        alert('Đã chọn lời chúc!');
      });
    }
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Tri-An-Thay-Co-20-11-To-Toan-THPT-Gia-Hoi.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
