/**
 * 3D Golden Sapphire Grand Fireworks & Interactive Touch/Click Particle Engine
 *
 * Implements:
 * 1. 12 Distinct Interactive & Automatic Fireworks Shapes:
 *    - 1: Chrysanthemum (Hoa cúc vàng kim, tia sáng tỏa hình cầu đuôi dài)
 *    - 2: Peony (Hoa mẫu đơn đa tầng, nở rộ bung sắc)
 *    - 3: Willow (Liễu rủ vàng óng rơi chậm như rèm kim tuyến)
 *    - 4: Ring (Vòng tròn đồng tâm cân đối ba chiều)
 *    - 5: Heart (Trái tim lớn vàng kim và sapphire)
 *    - 6: Lotus (Hoa sen vàng kim nhiều lớp cánh tinh tế)
 *    - 7: Palm (Tán cọ dừa ánh sáng với những tia vươn xa)
 *    - 8: Star (Ngôi sao 5 cánh lấp lánh sapphire & bạc)
 *    - 9: Double Ring (Hai vòng pháo hoa đồng tâm đối xứng)
 *    - 10: Brocade (Màn kim tuyến vàng sa thạch dệt bằng ngàn hạt lấp lánh)
 *    - 11: Sapphire (Pháo hoa xanh hoàng gia Sapphire kết hợp bạc)
 *    - 12: Grand Finale (Đại pháo hoa cao trào nhiều tầng, nhiều màu, chùm sáng khổng lồ)
 *
 * 2. Realistic Ballistic Rocket Physics & Dynamic Launch:
 *    - Launch phase: Rockets launch from screen bottom and fly in natural arcs
 *    - Raycasting / Unprojection: Screen click/touch accurately projects into 3D world target
 *    - Velocity, Drag, Gravity, Multi-stage Burst, Twinkle & Smoke Dissipation
 *
 * 3. Cinematic Visuals:
 *    - Glowing particle radial textures
 *    - Water surface reflection with real-time sinusoidal wave distortion
 *    - Floating golden dust & dynamic starfield
 *    - Multi-touch and pointer events support on iOS, Android, and Desktop
 */

import * as THREE from 'three';

export type FireworksLevel = 'lung-linh' | 'ruc-ro' | 'dai-tiec';

export type FireworkType =
  | 'chrysanthemum'
  | 'peony'
  | 'willow'
  | 'ring'
  | 'heart'
  | 'lotus'
  | 'palm'
  | 'star'
  | 'double-ring'
  | 'brocade'
  | 'sapphire'
  | 'grand-finale';

export interface FireworksConfig {
  enabled: boolean;
  interactiveEnabled: boolean;
  level: FireworksLevel;
  particleDensity: number; // 0.5 to 2.0
  bloomBrightness: number; // 0.5 to 2.0
  showReflection: boolean;
  showGoldenDust: boolean;
  autoLaunch: boolean;
  powerMode: 'auto' | 'high' | 'battery-save';
}

export const DEFAULT_FIREWORKS_CONFIG: FireworksConfig = {
  enabled: true,
  interactiveEnabled: true,
  level: 'ruc-ro',
  particleDensity: 1.0,
  bloomBrightness: 1.2,
  showReflection: true,
  showGoldenDust: true,
  autoLaunch: true,
  powerMode: 'auto',
};

export const ALL_12_FIREWORKS_TYPES: { id: FireworkType; name: string; desc: string }[] = [
  { id: 'chrysanthemum', name: '1. Chrysanthemum (Hoa cúc vàng)', desc: 'Tia sáng tỏa hình cầu đuôi dài' },
  { id: 'peony', name: '2. Peony (Hoa mẫu đơn)', desc: 'Nở thành nhiều lớp hạt sáng đa tầng' },
  { id: 'willow', name: '3. Willow (Liễu rủ vàng óng)', desc: 'Tia vàng dài rơi chậm như rèm kim tuyến' },
  { id: 'ring', name: '4. Ring (Vòng tròn đồng tâm)', desc: 'Vòng tròn cân đối ba chiều' },
  { id: 'heart', name: '5. Heart (Trái tim tri ân)', desc: 'Hàng nghìn hạt sáng vàng & sapphire' },
  { id: 'lotus', name: '6. Lotus (Hoa sen vàng kim)', desc: 'Nhiều lớp cánh sen bung nở mềm mại' },
  { id: 'palm', name: '7. Palm (Tán cây ánh sáng)', desc: 'Tia sáng lớn vươn rộng như tán lá cọ' },
  { id: 'star', name: '8. Star (Ngôi sao ánh sáng)', desc: 'Sao 5 cánh sapphire & bạc lấp lánh' },
  { id: 'double-ring', name: '9. Double Ring (Vòng đôi)', desc: 'Hai vòng pháo hoa đồng tâm đối xứng' },
  { id: 'brocade', name: '10. Brocade (Màn kim tuyến)', desc: 'Tấm màn vàng li ti sa thạch lộng lẫy' },
  { id: 'sapphire', name: '11. Sapphire (Xanh hoàng gia)', desc: 'Pháo hoa xanh sapphire kết hợp trắng bạc' },
  { id: 'grand-finale', name: '12. Grand Finale (Đại pháo hoa)', desc: 'Nhiều tầng, nhiều vòng, nhiều màu bùng nổ' },
];

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  r: number;
  g: number;
  b: number;
  alpha: number;
  size: number;
  life: number;
  maxLife: number;
  decay: number;
  gravity: number;
  drag: number;
  active: boolean;
  sparkle: boolean;
}

interface Rocket {
  x: number;
  y: number;
  z: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  vx: number;
  vy: number;
  vz: number;
  r: number;
  g: number;
  b: number;
  type: FireworkType;
  active: boolean;
  progress: number;
}

export class FireworksEngine {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animId: number | null = null;

  // Particle System
  private maxParticles = 9500;
  private particles: Particle[] = [];
  private positions: Float32Array;
  private colors: Float32Array;
  private sizes: Float32Array;
  private pGeometry: THREE.BufferGeometry;
  private pMaterial: THREE.PointsMaterial;
  private pointsSystem: THREE.Points;

  // Reflection System
  private reflectionPositions: Float32Array;
  private reflectionColors: Float32Array;
  private reflectionGeometry: THREE.BufferGeometry;
  private reflectionMaterial: THREE.PointsMaterial;
  private reflectionPoints: THREE.Points;

  // Starfield & Ambient Dust System
  private starPoints: THREE.Points | null = null;
  private dustPoints: THREE.Points | null = null;
  private dustPositions: Float32Array | null = null;
  private dustCount = 350;

  // Rockets Queue
  private rockets: Rocket[] = [];

  // Director Timing
  public config: FireworksConfig;
  public onExplode?: (info: { screenX: number; screenY: number; type: FireworkType }) => void;
  private lastLaunchTime = 0;
  private nextLaunchInterval = 1800; // ms
  private lastTypeUsed: FireworkType | null = null;
  private isDestroyed = false;

  constructor(container: HTMLElement, userConfig: Partial<FireworksConfig> = {}) {
    this.container = container;
    this.config = { ...DEFAULT_FIREWORKS_CONFIG, ...userConfig };

    // Detect mobile / low power devices
    const isMobile = typeof window !== 'undefined' && (
      window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );
    if (isMobile) {
      this.maxParticles = 6500;
      this.dustCount = 180;
    }

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / Math.max(container.clientHeight, 1),
      1,
      2500
    );
    this.camera.position.set(0, 120, 520);
    this.camera.lookAt(0, 160, 0);

    // 2. WebGL Renderer with Alpha & High Performance
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    this.renderer.setClearColor(0x000000, 0);
    container.appendChild(this.renderer.domElement);

    // 3. Particle Pool Initialization
    this.positions = new Float32Array(this.maxParticles * 3);
    this.colors = new Float32Array(this.maxParticles * 3);
    this.sizes = new Float32Array(this.maxParticles);

    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: 0,
        y: -9999,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        r: 1,
        g: 1,
        b: 1,
        alpha: 0,
        size: 2,
        life: 0,
        maxLife: 100,
        decay: 0.015,
        gravity: 0.05,
        drag: 0.97,
        active: false,
        sparkle: false,
      });
    }

    const spriteTexture = this.createGlowingParticleTexture();

    // Primary Explosions Points
    this.pGeometry = new THREE.BufferGeometry();
    this.pGeometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.pGeometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    this.pGeometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

    this.pMaterial = new THREE.PointsMaterial({
      size: 16,
      map: spriteTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false,
    });
    this.pointsSystem = new THREE.Points(this.pGeometry, this.pMaterial);
    this.scene.add(this.pointsSystem);

    // Reflection Points System
    this.reflectionPositions = new Float32Array(this.maxParticles * 3);
    this.reflectionColors = new Float32Array(this.maxParticles * 3);
    this.reflectionGeometry = new THREE.BufferGeometry();
    this.reflectionGeometry.setAttribute('position', new THREE.BufferAttribute(this.reflectionPositions, 3));
    this.reflectionGeometry.setAttribute('color', new THREE.BufferAttribute(this.reflectionColors, 3));

    this.reflectionMaterial = new THREE.PointsMaterial({
      size: 20,
      map: spriteTexture,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false,
    });
    this.reflectionPoints = new THREE.Points(this.reflectionGeometry, this.reflectionMaterial);
    this.reflectionPoints.position.y = -100;
    this.scene.add(this.reflectionPoints);

    // 4. Background Starfield & Golden Dust
    this.initStarfield();
    this.initGoldenDust(spriteTexture);

    // 5. Events & Render Loop
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleResize);

    this.animate = this.animate.bind(this);
    this.animId = requestAnimationFrame(this.animate);
  }

  private createGlowingParticleTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(255, 240, 180, 0.95)');
    grad.addColorStop(0.45, 'rgba(212, 175, 55, 0.6)');
    grad.addColorStop(0.75, 'rgba(56, 140, 248, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }

  private initStarfield() {
    const starCount = 380;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 1600;
      starPos[i * 3 + 1] = Math.random() * 600 - 50;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 1000 - 200;

      if (Math.random() > 0.4) {
        starColors[i * 3] = 1.0;
        starColors[i * 3 + 1] = 0.9;
        starColors[i * 3 + 2] = 0.6; // Gold
      } else {
        starColors[i * 3] = 0.6;
        starColors[i * 3 + 1] = 0.8;
        starColors[i * 3 + 2] = 1.0; // Sapphire
      }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 3,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    this.starPoints = new THREE.Points(starGeo, starMat);
    this.scene.add(this.starPoints);
  }

  private initGoldenDust(texture: THREE.Texture) {
    const geo = new THREE.BufferGeometry();
    this.dustPositions = new Float32Array(this.dustCount * 3);
    const dustColors = new Float32Array(this.dustCount * 3);

    for (let i = 0; i < this.dustCount; i++) {
      this.dustPositions[i * 3] = (Math.random() - 0.5) * 1200;
      this.dustPositions[i * 3 + 1] = Math.random() * 500 - 100;
      this.dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 600;

      dustColors[i * 3] = 0.98;
      dustColors[i * 3 + 1] = 0.82;
      dustColors[i * 3 + 2] = 0.35;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(this.dustPositions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

    const mat = new THREE.PointsMaterial({
      size: 6,
      map: texture,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false,
    });

    this.dustPoints = new THREE.Points(geo, mat);
    this.scene.add(this.dustPoints);
  }

  /**
   * Screen Client Coordinates (x, y) to 3D World Space coordinates
   * Accurately maps touch or mouse click to firework destination
   */
  public screenToWorld(clientX: number, clientY: number): { x: number; y: number; z: number } {
    const rect = this.container.getBoundingClientRect();
    const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
    const normY = -((clientY - rect.top) / rect.height) * 2 + 1;

    // Project vector into world plane at z = 0
    const vector = new THREE.Vector3(normX, normY, 0.5);
    vector.unproject(this.camera);

    const dir = vector.sub(this.camera.position).normalize();
    const distance = -this.camera.position.z / dir.z;
    const pos = this.camera.position.clone().add(dir.multiplyScalar(distance));

    return {
      x: Math.max(-420, Math.min(420, pos.x)),
      y: Math.max(-80, Math.min(390, pos.y)),
      z: (Math.random() - 0.5) * 40,
    };
  }

  /**
   * Immediate firework burst directly at the specified world coordinate (used for mobile touch).
   * Spawns fingertip sparkle ring + full 3D particle explosion instantly without rocket flight delay.
   */
  public triggerInstantBurst(
    targetX: number,
    targetY: number,
    targetZ: number = 0,
    type?: FireworkType
  ) {
    if (!this.config.enabled) return;

    const chosenType = type || this.selectSmartRandomType();

    // 1. Fingertip sparkle flash ring right under finger
    for (let i = 0; i < 36; i++) {
      const p = this.getPooledParticle();
      if (!p) break;
      const angle = (i / 36) * Math.PI * 2;
      const speed = 2.0 + Math.random() * 2.5;
      p.x = targetX;
      p.y = targetY;
      p.z = targetZ;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.vz = (Math.random() - 0.5) * 1.5;
      p.r = 1.0;
      p.g = 0.95;
      p.b = 0.55; // Brilliant golden flare
      p.alpha = 1.0;
      p.size = 24 * this.config.bloomBrightness;
      p.maxLife = 26;
      p.life = 26;
      p.decay = 0.038;
      p.gravity = 0.02;
      p.drag = 0.94;
      p.sparkle = true;
      p.active = true;
    }

    // 2. Main explosion of chosen type
    this.triggerExplosion(targetX, targetY, targetZ, chosenType);

    // 3. Trigger explosion callback for screen coordinates & floating badge
    if (this.onExplode && this.container) {
      try {
        const v = new THREE.Vector3(targetX, targetY, targetZ);
        v.project(this.camera);
        const rect = this.container.getBoundingClientRect();
        const screenX = ((v.x + 1) / 2) * rect.width + rect.left;
        const screenY = ((-v.y + 1) / 2) * rect.height + rect.top;
        this.onExplode({ screenX, screenY, type: chosenType });
      } catch {
        // Ignored
      }
    }
  }

  /**
   * Launch Firework towards exact target coordinates from bottom edge of screen (used for desktop mouse clicks)
   */
  public launchFireworkToTarget(
    targetX: number,
    targetY: number,
    targetZ: number = 0,
    type?: FireworkType
  ) {
    if (!this.config.enabled) return;

    const chosenType = type || this.selectSmartRandomType();
    // Launch from bottom of camera view (around y = -140)
    // Offset startX slightly for an elegant ballistic upward curve
    const startX = targetX * 0.45 + (Math.random() - 0.5) * 30;
    const startY = -135;
    const startZ = targetZ;

    const dx = targetX - startX;
    const dy = targetY - startY;
    const flightSteps = 28 + Math.random() * 10;

    this.rockets.push({
      x: startX,
      y: startY,
      z: startZ,
      targetX,
      targetY,
      targetZ,
      vx: dx / flightSteps,
      vy: dy / flightSteps,
      vz: 0,
      r: 1.0,
      g: 0.88,
      b: 0.45,
      type: chosenType,
      active: true,
      progress: 0,
    });
  }

  /**
   * General firework launch (used by automatic director)
   */
  public launchFirework(type?: FireworkType, customX?: number, customY?: number) {
    if (!this.config.enabled) return;

    const targetX = customX !== undefined ? customX : (Math.random() - 0.5) * 440;
    const targetY = customY !== undefined ? customY : 170 + Math.random() * 160;
    const targetZ = (Math.random() - 0.5) * 160;

    this.launchFireworkToTarget(targetX, targetY, targetZ, type);
  }

  public selectSmartRandomType(): FireworkType {
    const types: FireworkType[] = [
      'chrysanthemum',
      'peony',
      'willow',
      'ring',
      'heart',
      'lotus',
      'palm',
      'star',
      'double-ring',
      'brocade',
      'sapphire',
      'grand-finale',
    ];

    const available = types.filter((t) => t !== this.lastTypeUsed);
    const picked = available[Math.floor(Math.random() * available.length)];
    this.lastTypeUsed = picked;
    return picked;
  }

  /**
   * Master explosion router for all 12 distinct types
   */
  private triggerExplosion(x: number, y: number, z: number, type: FireworkType) {
    const densityMult = this.config.particleDensity;

    switch (type) {
      case 'chrysanthemum':
        this.explodeChrysanthemum(x, y, z, Math.round(520 * densityMult));
        break;
      case 'peony':
        this.explodePeony(x, y, z, Math.round(480 * densityMult));
        break;
      case 'willow':
        this.explodeWillow(x, y, z, Math.round(580 * densityMult));
        break;
      case 'ring':
        this.explodeRing(x, y, z, Math.round(420 * densityMult));
        break;
      case 'heart':
        this.explodeHeart(x, y, z, Math.round(500 * densityMult));
        break;
      case 'lotus':
        this.explodeLotus(x, y, z, Math.round(540 * densityMult));
        break;
      case 'palm':
        this.explodePalm(x, y, z, Math.round(440 * densityMult));
        break;
      case 'star':
        this.explodeStar(x, y, z, Math.round(460 * densityMult));
        break;
      case 'double-ring':
        this.explodeDoubleRing(x, y, z, Math.round(560 * densityMult));
        break;
      case 'brocade':
        this.explodeBrocade(x, y, z, Math.round(620 * densityMult));
        break;
      case 'sapphire':
        this.explodeSapphire(x, y, z, Math.round(520 * densityMult));
        break;
      case 'grand-finale':
      default:
        this.explodeGrandFinale(x, y, z, Math.round(850 * densityMult));
        break;
    }
  }

  // 1. Chrysanthemum (Hoa cúc vàng kim, cầu tròn tia sáng đuôi dài)
  private explodeChrysanthemum(cx: number, cy: number, cz: number, count: number) {
    for (let i = 0; i < count; i++) {
      const p = this.getPooledParticle();
      if (!p) break;

      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const speed = 4.2 + Math.random() * 2.5;

      p.x = cx;
      p.y = cy;
      p.z = cz;
      p.vx = Math.sin(phi) * Math.cos(theta) * speed;
      p.vy = Math.sin(phi) * Math.sin(theta) * speed;
      p.vz = Math.cos(phi) * speed;

      p.r = 1.0;
      p.g = 0.85 + Math.random() * 0.15;
      p.b = 0.30;
      p.alpha = 1.0;
      p.size = 20 * this.config.bloomBrightness;
      p.maxLife = 95 + Math.random() * 35;
      p.life = p.maxLife;
      p.decay = 0.011;
      p.gravity = 0.038;
      p.drag = 0.978;
      p.sparkle = true;
      p.active = true;
    }
  }

  // 2. Peony (Hoa mẫu đơn đa tầng, nở rộ bung sắc vàng và hồng ngọc)
  private explodePeony(cx: number, cy: number, cz: number, count: number) {
    for (let i = 0; i < count; i++) {
      const p = this.getPooledParticle();
      if (!p) break;

      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const layer = i % 3;
      const speed = layer === 0 ? 5.0 : layer === 1 ? 3.5 : 2.0;

      p.x = cx;
      p.y = cy;
      p.z = cz;
      p.vx = Math.sin(phi) * Math.cos(theta) * speed;
      p.vy = Math.sin(phi) * Math.sin(theta) * speed;
      p.vz = Math.cos(phi) * speed;

      if (layer === 0) {
        p.r = 1.0; p.g = 0.18; p.b = 0.28; // Ruby Red
      } else if (layer === 1) {
        p.r = 1.0; p.g = 0.45; p.b = 0.75; // Rose Pink
      } else {
        p.r = 1.0; p.g = 0.90; p.b = 0.40; // Pearl Gold
      }

      p.alpha = 1.0;
      p.size = 18 * this.config.bloomBrightness;
      p.maxLife = 85 + Math.random() * 30;
      p.life = p.maxLife;
      p.decay = 0.013;
      p.gravity = 0.04;
      p.drag = 0.968;
      p.sparkle = true;
      p.active = true;
    }
  }

  // 3. Willow (Liễu rủ vàng óng rơi chậm như rèm kim tuyến)
  private explodeWillow(cx: number, cy: number, cz: number, count: number) {
    for (let i = 0; i < count; i++) {
      const p = this.getPooledParticle();
      if (!p) break;

      const angle = Math.random() * Math.PI * 2;
      const horizSpeed = Math.random() * 2.5;

      p.x = cx;
      p.y = cy;
      p.z = cz;
      p.vx = Math.cos(angle) * horizSpeed;
      p.vy = 2.0 + Math.random() * 3.6;
      p.vz = Math.sin(angle) * horizSpeed;

      p.r = 1.0;
      p.g = 0.92;
      p.b = 0.52;
      p.alpha = 1.0;
      p.size = 16 * this.config.bloomBrightness;
      p.maxLife = 145 + Math.random() * 45; // Long falling willow stream
      p.life = p.maxLife;
      p.decay = 0.007;
      p.gravity = 0.065;
      p.drag = 0.985;
      p.sparkle = true;
      p.active = true;
    }
  }

  // 4. Ring (Vòng tròn đồng tâm cân đối ba chiều - Vàng kim & Tím hoàng gia)
  private explodeRing(cx: number, cy: number, cz: number, count: number) {
    for (let i = 0; i < count; i++) {
      const p = this.getPooledParticle();
      if (!p) break;

      const angle = (i / count) * Math.PI * 2;
      const speed = 4.5 + (Math.random() - 0.5) * 0.4;

      p.x = cx;
      p.y = cy;
      p.z = cz;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.vz = (Math.random() - 0.5) * 0.8;

      if (i % 2 === 0) {
        p.r = 1.0; p.g = 0.88; p.b = 0.35; // Gold
      } else {
        p.r = 0.78; p.g = 0.28; p.b = 0.98; // Amethyst Purple
      }

      p.alpha = 1.0;
      p.size = 20 * this.config.bloomBrightness;
      p.maxLife = 90;
      p.life = p.maxLife;
      p.decay = 0.012;
      p.gravity = 0.035;
      p.drag = 0.975;
      p.sparkle = true;
      p.active = true;
    }
  }

  // 5. Heart (Trái tim tri ân rực rỡ - Đỏ Ruby, Hồng ngọc & Vàng kim)
  private explodeHeart(cx: number, cy: number, cz: number, count: number) {
    for (let i = 0; i < count; i++) {
      const p = this.getPooledParticle();
      if (!p) break;

      const t = Math.random() * Math.PI * 2;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      const scale = 0.25 + Math.random() * 0.07;
      const colorRoll = Math.random();

      p.x = cx;
      p.y = cy;
      p.z = cz;
      p.vx = hx * scale;
      p.vy = hy * scale + 0.6;
      p.vz = (Math.random() - 0.5) * 1.5;

      if (colorRoll < 0.45) {
        p.r = 1.0; p.g = 0.18; p.b = 0.28; // Ruby Red
      } else if (colorRoll < 0.75) {
        p.r = 1.0; p.g = 0.45; p.b = 0.75; // Rose Pink
      } else {
        p.r = 1.0; p.g = 0.88; p.b = 0.35; // Gold
      }

      p.alpha = 1.0;
      p.size = 22 * this.config.bloomBrightness;
      p.maxLife = 90 + Math.random() * 25;
      p.life = p.maxLife;
      p.decay = 0.013;
      p.gravity = 0.032;
      p.drag = 0.965;
      p.sparkle = true;
      p.active = true;
    }
  }

  // 6. Lotus (Hoa sen vàng kim nhiều lớp cánh tinh tế)
  private explodeLotus(cx: number, cy: number, cz: number, count: number) {
    const petals = 8;
    for (let i = 0; i < count; i++) {
      const p = this.getPooledParticle();
      if (!p) break;

      const petalIdx = Math.floor(Math.random() * petals);
      const angle = (petalIdx / petals) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
      const t = Math.random();
      const speed = 2.2 + t * 4.2;

      p.x = cx;
      p.y = cy;
      p.z = cz;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(t * Math.PI) * 3.8 + (Math.random() - 0.2) * 1.5;
      p.vz = Math.sin(angle) * speed;

      p.r = 1.0;
      p.g = 0.82 + Math.random() * 0.15;
      p.b = 0.25;
      p.alpha = 1.0;
      p.size = 20 * this.config.bloomBrightness;
      p.maxLife = 95 + Math.random() * 35;
      p.life = p.maxLife;
      p.decay = 0.012;
      p.gravity = 0.035;
      p.drag = 0.965;
      p.sparkle = true;
      p.active = true;
    }
  }

  // 7. Palm (Tán cây ánh sáng với những tia vươn xa)
  private explodePalm(cx: number, cy: number, cz: number, count: number) {
    const fronds = 7;
    for (let i = 0; i < count; i++) {
      const p = this.getPooledParticle();
      if (!p) break;

      const frondIdx = i % fronds;
      const angle = (frondIdx / fronds) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
      const speed = 4.8 + Math.random() * 3.2;

      p.x = cx;
      p.y = cy;
      p.z = cz;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * 0.8 * speed + 2.0;
      p.vz = (Math.random() - 0.5) * 2.0;

      p.r = 1.0;
      p.g = 0.88;
      p.b = 0.40;
      p.alpha = 1.0;
      p.size = 22 * this.config.bloomBrightness;
      p.maxLife = 105;
      p.life = p.maxLife;
      p.decay = 0.011;
      p.gravity = 0.055;
      p.drag = 0.978;
      p.sparkle = true;
      p.active = true;
    }
  }

  // 8. Star (Ngôi sao 5 cánh bằng ánh sáng sapphire và vàng)
  private explodeStar(cx: number, cy: number, cz: number, count: number) {
    const points = 5;
    for (let i = 0; i < count; i++) {
      const p = this.getPooledParticle();
      if (!p) break;

      const pointIdx = i % points;
      const baseAngle = (pointIdx / points) * Math.PI * 2 - Math.PI / 2;
      const spread = (Math.random() - 0.5) * 0.25;
      const speed = 2.5 + Math.random() * 4.5;

      p.x = cx;
      p.y = cy;
      p.z = cz;
      p.vx = Math.cos(baseAngle + spread) * speed;
      p.vy = Math.sin(baseAngle + spread) * speed;
      p.vz = (Math.random() - 0.5) * 1.5;

      // Sapphire tips, gold center
      if (Math.random() > 0.5) {
        p.r = 0.22; p.g = 0.65; p.b = 1.0;
      } else {
        p.r = 1.0; p.g = 0.90; p.b = 0.45;
      }

      p.alpha = 1.0;
      p.size = 22 * this.config.bloomBrightness;
      p.maxLife = 85 + Math.random() * 25;
      p.life = p.maxLife;
      p.decay = 0.013;
      p.gravity = 0.035;
      p.drag = 0.97;
      p.sparkle = true;
      p.active = true;
    }
  }

  // 9. Double Ring (Hai vòng pháo hoa đồng tâm đối xứng)
  private explodeDoubleRing(cx: number, cy: number, cz: number, count: number) {
    for (let i = 0; i < count; i++) {
      const p = this.getPooledParticle();
      if (!p) break;

      const ringIdx = i % 2;
      const angle = (i / (count / 2)) * Math.PI * 2;
      const speed = ringIdx === 0 ? 5.2 : 3.2;

      p.x = cx;
      p.y = cy;
      p.z = cz;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.vz = (Math.random() - 0.5) * 0.6;

      if (ringIdx === 0) {
        p.r = 1.0; p.g = 0.85; p.b = 0.35; // Outer Gold
      } else {
        p.r = 0.25; p.g = 0.65; p.b = 1.0; // Inner Sapphire
      }

      p.alpha = 1.0;
      p.size = 20 * this.config.bloomBrightness;
      p.maxLife = 90;
      p.life = p.maxLife;
      p.decay = 0.012;
      p.gravity = 0.038;
      p.drag = 0.975;
      p.sparkle = true;
      p.active = true;
    }
  }

  // 10. Brocade (Hàng nghìn tia vàng li ti như tấm màn kim tuyến)
  private explodeBrocade(cx: number, cy: number, cz: number, count: number) {
    for (let i = 0; i < count; i++) {
      const p = this.getPooledParticle();
      if (!p) break;

      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const speed = 2.0 + Math.random() * 4.8;

      p.x = cx;
      p.y = cy;
      p.z = cz;
      p.vx = Math.sin(phi) * Math.cos(theta) * speed;
      p.vy = Math.sin(phi) * Math.sin(theta) * speed;
      p.vz = Math.cos(phi) * speed;

      p.r = 1.0;
      p.g = 0.90;
      p.b = 0.45;
      p.alpha = 1.0;
      p.size = 15 * this.config.bloomBrightness;
      p.maxLife = 120 + Math.random() * 40;
      p.life = p.maxLife;
      p.decay = 0.009;
      p.gravity = 0.045;
      p.drag = 0.982;
      p.sparkle = true;
      p.active = true;
    }
  }

  // 11. Sapphire (Pháo hoa xanh sapphire kết hợp trắng bạc)
  private explodeSapphire(cx: number, cy: number, cz: number, count: number) {
    for (let i = 0; i < count; i++) {
      const p = this.getPooledParticle();
      if (!p) break;

      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const speed = 3.2 + Math.random() * 3.8;

      p.x = cx;
      p.y = cy;
      p.z = cz;
      p.vx = Math.sin(phi) * Math.cos(theta) * speed;
      p.vy = Math.sin(phi) * Math.sin(theta) * speed;
      p.vz = Math.cos(phi) * speed;

      if (Math.random() > 0.3) {
        p.r = 0.18; p.g = 0.60; p.b = 1.0; // Royal sapphire
      } else {
        p.r = 0.98; p.g = 0.98; p.b = 1.0; // Diamond silver
      }

      p.alpha = 1.0;
      p.size = 20 * this.config.bloomBrightness;
      p.maxLife = 90 + Math.random() * 30;
      p.life = p.maxLife;
      p.decay = 0.013;
      p.gravity = 0.04;
      p.drag = 0.97;
      p.sparkle = true;
      p.active = true;
    }
  }

  // 12. Grand Finale (Đại pháo hoa nhiều tầng, nhiều vòng, nhiều màu)
  private explodeGrandFinale(cx: number, cy: number, cz: number, count: number) {
    for (let i = 0; i < count; i++) {
      const p = this.getPooledParticle();
      if (!p) break;

      const tier = i % 4;
      const speed = tier === 0 ? 6.8 : tier === 1 ? 5.0 : tier === 2 ? 3.4 : 1.8;

      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);

      p.x = cx;
      p.y = cy;
      p.z = cz;
      p.vx = Math.sin(phi) * Math.cos(theta) * speed;
      p.vy = Math.sin(phi) * Math.sin(theta) * speed;
      p.vz = Math.cos(phi) * speed;

      if (tier === 0) {
        // Outer gold burst
        p.r = 1.0; p.g = 0.90; p.b = 0.40;
        p.size = 25 * this.config.bloomBrightness;
      } else if (tier === 1) {
        // Middle sapphire ring
        p.r = 0.15; p.g = 0.65; p.b = 1.0;
        p.size = 22 * this.config.bloomBrightness;
      } else if (tier === 2) {
        // Pearl silver core
        p.r = 0.98; p.g = 0.98; p.b = 1.0;
        p.size = 18 * this.config.bloomBrightness;
      } else {
        // Golden champagne dust
        p.r = 1.0; p.g = 0.82; p.b = 0.28;
        p.size = 15 * this.config.bloomBrightness;
      }

      p.alpha = 1.0;
      p.maxLife = 115 + Math.random() * 40;
      p.life = p.maxLife;
      p.decay = 0.011;
      p.gravity = 0.042;
      p.drag = 0.972;
      p.sparkle = true;
      p.active = true;
    }
  }

  private getPooledParticle(): Particle | null {
    for (let i = 0; i < this.maxParticles; i++) {
      if (!this.particles[i].active) {
        return this.particles[i];
      }
    }
    return null;
  }

  private handleResize() {
    if (!this.container || this.isDestroyed) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / Math.max(h, 1);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  public setLevel(lvl: FireworksLevel) {
    this.config.level = lvl;
    if (lvl === 'lung-linh') {
      this.nextLaunchInterval = 3200;
      this.config.particleDensity = 0.7;
    } else if (lvl === 'ruc-ro') {
      this.nextLaunchInterval = 1700;
      this.config.particleDensity = 1.0;
    } else {
      // dai-tiec
      this.nextLaunchInterval = 850;
      this.config.particleDensity = 1.5;
    }
  }

  public setDensity(density: number) {
    this.config.particleDensity = Math.max(0.4, Math.min(2.0, density));
  }

  public setBloom(bloom: number) {
    this.config.bloomBrightness = Math.max(0.4, Math.min(2.5, bloom));
  }

  public launchCornerWelcome() {
    if (!this.config.enabled) return;
    // Welcoming burst from bottom-left corner
    this.launchFireworkToTarget(-240, 260, 0, 'lotus');
    // Welcoming burst from bottom-right corner
    setTimeout(() => {
      this.launchFireworkToTarget(240, 260, 0, 'chrysanthemum');
    }, 450);
    // Welcoming centerpiece star burst
    setTimeout(() => {
      this.launchFireworkToTarget(0, 310, 0, 'star');
    }, 900);
  }

  public triggerGrandClimax() {
    this.launchFireworkToTarget(-160, 260, 0, 'grand-finale');
    setTimeout(() => this.launchFireworkToTarget(0, 310, 0, 'lotus'), 300);
    setTimeout(() => this.launchFireworkToTarget(160, 260, 0, 'heart'), 600);
    setTimeout(() => this.launchFireworkToTarget(-90, 220, 0, 'willow'), 900);
    setTimeout(() => this.launchFireworkToTarget(90, 220, 0, 'brocade'), 1200);
  }

  private animate(time: number) {
    if (this.isDestroyed) return;
    this.animId = requestAnimationFrame(this.animate);

    // 1. Director Auto-Launcher based on level
    if (this.config.enabled && this.config.autoLaunch) {
      if (time - this.lastLaunchTime > this.nextLaunchInterval) {
        this.lastLaunchTime = time;

        if (this.config.level === 'dai-tiec') {
          this.launchFirework();
          if (Math.random() > 0.4) {
            setTimeout(() => this.launchFirework(), 250);
          }
          this.nextLaunchInterval = 700 + Math.random() * 600;
        } else if (this.config.level === 'ruc-ro') {
          this.launchFirework();
          this.nextLaunchInterval = 1400 + Math.random() * 1100;
        } else {
          this.launchFirework();
          this.nextLaunchInterval = 2800 + Math.random() * 2000;
        }
      }
    }

    // 2. Update Ballistic Rockets
    for (let i = 0; i < this.rockets.length; i++) {
      const r = this.rockets[i];
      if (!r.active) continue;

      r.x += r.vx;
      r.y += r.vy;
      r.z += r.vz;

      // Rocket glowing head + burning tail sparks
      for (let s = 0; s < 2; s++) {
        const p = this.getPooledParticle();
        if (p) {
          p.x = r.x + (Math.random() - 0.5) * 2.5;
          p.y = r.y - s * 3.5;
          p.z = r.z + (Math.random() - 0.5) * 1.5;
          p.vx = (Math.random() - 0.5) * 0.6;
          p.vy = -1.6 - Math.random() * 0.8;
          p.vz = (Math.random() - 0.5) * 0.6;
          p.r = 1.0;
          p.g = 0.92;
          p.b = 0.45; // Brilliant golden flare
          p.alpha = 1.0;
          p.size = 14;
          p.maxLife = 22;
          p.life = 22;
          p.decay = 0.048;
          p.gravity = 0.03;
          p.drag = 0.96;
          p.sparkle = true;
          p.active = true;
        }
      }

      // Detonate when reaching target altitude
      if (r.y >= r.targetY) {
        r.active = false;
        this.triggerExplosion(r.x, r.y, r.z, r.type);

        if (this.onExplode && this.container) {
          try {
            const v = new THREE.Vector3(r.x, r.y, r.z);
            v.project(this.camera);
            const rect = this.container.getBoundingClientRect();
            const screenX = ((v.x + 1) / 2) * rect.width + rect.left;
            const screenY = ((-v.y + 1) / 2) * rect.height + rect.top;
            this.onExplode({ screenX, screenY, type: r.type });
          } catch {
            // Ignored
          }
        }
      }
    }
    this.rockets = this.rockets.filter((r) => r.active);

    // 3. Update Particles Buffer
    const waveTime = time * 0.003;

    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.particles[i];

      if (p.active) {
        p.vx *= p.drag;
        p.vy = (p.vy - p.gravity) * p.drag;
        p.vz *= p.drag;

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        p.life -= 1;
        p.alpha = Math.max(0, p.life / p.maxLife);

        if (p.life <= 0) {
          p.active = false;
          this.positions[i * 3 + 1] = -9999;
          this.reflectionPositions[i * 3 + 1] = -9999;
          continue;
        }

        const flicker = p.sparkle ? 0.75 + Math.sin(time * 0.02 + i) * 0.25 : 1.0;

        this.positions[i * 3] = p.x;
        this.positions[i * 3 + 1] = p.y;
        this.positions[i * 3 + 2] = p.z;

        this.colors[i * 3] = p.r * p.alpha * flicker;
        this.colors[i * 3 + 1] = p.g * p.alpha * flicker;
        this.colors[i * 3 + 2] = p.b * p.alpha * flicker;

        this.sizes[i] = p.size * (0.4 + p.alpha * 0.6);

        // Water Reflection
        if (this.config.showReflection) {
          const rippleX = Math.sin(waveTime + p.y * 0.05) * 5.0;
          this.reflectionPositions[i * 3] = p.x + rippleX;
          this.reflectionPositions[i * 3 + 1] = -p.y * 0.35 - 30;
          this.reflectionPositions[i * 3 + 2] = p.z + 100;

          this.reflectionColors[i * 3] = p.r * p.alpha * 0.32;
          this.reflectionColors[i * 3 + 1] = p.g * p.alpha * 0.35;
          this.reflectionColors[i * 3 + 2] = p.b * p.alpha * 0.45;
        } else {
          this.reflectionPositions[i * 3 + 1] = -9999;
        }
      } else {
        this.positions[i * 3 + 1] = -9999;
        this.reflectionPositions[i * 3 + 1] = -9999;
      }
    }

    this.pGeometry.attributes.position.needsUpdate = true;
    this.pGeometry.attributes.color.needsUpdate = true;
    this.pGeometry.attributes.size.needsUpdate = true;

    if (this.config.showReflection) {
      this.reflectionGeometry.attributes.position.needsUpdate = true;
      this.reflectionGeometry.attributes.color.needsUpdate = true;
      this.reflectionPoints.visible = true;
    } else {
      this.reflectionPoints.visible = false;
    }

    // 4. Update Golden Dust Drift
    if (this.dustPoints && this.dustPositions && this.config.showGoldenDust) {
      this.dustPoints.visible = true;
      for (let i = 0; i < this.dustCount; i++) {
        this.dustPositions[i * 3 + 1] -= 0.35;
        this.dustPositions[i * 3] += Math.sin(waveTime + i) * 0.2;

        if (this.dustPositions[i * 3 + 1] < -120) {
          this.dustPositions[i * 3 + 1] = 480;
        }
      }
      this.dustPoints.geometry.attributes.position.needsUpdate = true;
    } else if (this.dustPoints) {
      this.dustPoints.visible = false;
    }

    // 5. Render Scene
    this.renderer.render(this.scene, this.camera);
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);

    try {
      this.renderer.dispose();
      this.pGeometry.dispose();
      this.pMaterial.dispose();
      this.reflectionGeometry.dispose();
      this.reflectionMaterial.dispose();
      if (this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    } catch {
      // Ignored
    }
  }
}
