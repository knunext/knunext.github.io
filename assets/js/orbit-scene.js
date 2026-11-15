/*
 * Research 카드의 3D 배경: 궤도 AI 데이터센터 (three.js)
 * - 위성: 가운데 연산 모듈, 날개와 수직으로 세운 방열판, 트러스 끝의 태양광 날개 두 장
 * - <div data-scene="orbit3d"> 안에 그림. 카드가 화면에 보일 때만 움직이고, 마우스를 따라 시점이 살짝 바뀜
 * - 지구 텍스처: NASA Blue Marble 기반 (three.js 예제 텍스처, MIT) — assets/img/space/earth-textures.js 에 data URI 로
 * - WebGL 이 안 되면 CSS 배경(우주 그라데이션)만 남음
 */
(function () {
// 일반 스크립트로 불러옴 (파일로 직접 열어도 동작하도록): three.min.js 가 window.THREE 를 만듦
const THREE = window.THREE;
const TEXSRC = window.ORBIT_TEX || {};
const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!THREE) return;

document.querySelectorAll('[data-scene="orbit3d"]').forEach((host) => (window.NCSL3D ? window.NCSL3D.lazy(host, init) : init(host)));   // 카드가 앞에 올 때 만듦

function init(host) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.98;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020306);
  const camera = new THREE.PerspectiveCamera(32, 2, 0.1, 3000);
  const camBase = new THREE.Vector3(0, 0.35, 9);
  camera.position.copy(camBase);

  const loader = new THREE.TextureLoader();
  const tex = (k, srgb) => { const t = loader.load(TEXSRC[k], () => (dirty = true)); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };

  /* ---------- 별 ---------- */
  {
    const n = 1400, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, r = 900;
      pos[i * 3] = r * Math.sqrt(1 - u * u) * Math.cos(th);
      pos[i * 3 + 1] = Math.abs(r * u) * 0.9 + 20;
      pos[i * 3 + 2] = r * Math.sqrt(1 - u * u) * Math.sin(th) - 200;
    }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xcfd8ff, size: 1.1, sizeAttenuation: false, transparent: true, opacity: 0.75 })));
  }

  /* ---------- 지구 (지표, 구름, 대기 테두리) ---------- */
  const earth = new THREE.Group();
  const R = 40;
  earth.position.set(0, -R - 1.25, -14);
  earth.rotation.set(0.25, -1.9, 0);
  scene.add(earth);
  const ground = new THREE.Mesh(
    new THREE.SphereGeometry(R, 128, 96),
    new THREE.MeshPhongMaterial({ map: tex("atmos", true), specularMap: tex("spec"), specular: new THREE.Color(0x2a3a55), shininess: 18 })
  );
  earth.add(ground);
  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.006, 128, 96),
    new THREE.MeshLambertMaterial({ map: tex("clouds", true), transparent: true, opacity: 0.85, depthWrite: false })
  );
  earth.add(clouds);
  const rim = (scale, power, strength, side, color) => new THREE.Mesh(
    new THREE.SphereGeometry(R * scale, 128, 96),
    new THREE.ShaderMaterial({
      uniforms: { c: { value: new THREE.Color(color) }, p: { value: power }, s: { value: strength } },
      vertexShader: "varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",
      fragmentShader: "uniform vec3 c; uniform float p; uniform float s; varying vec3 vN; varying vec3 vV; void main(){ float f = 1.0 - abs(dot(vN, vV)); float i = pow(f, p) * s; gl_FragColor = vec4(c * i, i); }",
      side, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
    })
  );
  earth.add(rim(1.012, 4.0, 0.55, THREE.FrontSide, 0x8fbaff));   // 지표 가장자리의 푸른 빛
  earth.add(rim(1.04, 7.0, 1.25, THREE.BackSide, 0x7fb0ff));     // 바깥 대기층

  /* ---------- 빛: 지평선 뒤의 태양 + 약한 보조광 ---------- */
  const sunDir = new THREE.Vector3(-1.6, 0.55, -10).normalize();
  const sun = new THREE.DirectionalLight(0xfff0dc, 2.6); sun.position.copy(sunDir.clone().multiplyScalar(100)); scene.add(sun);
  const fill = new THREE.DirectionalLight(0x9db8ff, 0.16); fill.position.set(2, 4, 10); scene.add(fill);
  const key = new THREE.DirectionalLight(0xffffff, 0.38); key.position.set(-6, 5, 8); scene.add(key);   // 위성을 비추는 빛 (지구는 거의 안 비춤)
  key.target.position.set(1, 0.6, 1); scene.add(key.target);
  scene.add(new THREE.AmbientLight(0x1c2533, 0.3));

  // 태양 빛무리 (지구 뒤에 있어 아래쪽은 지구에 가려짐)
  const glowTex = (stops, w = 256) => {
    const c = document.createElement("canvas"); c.width = c.height = w; const x = c.getContext("2d");
    const g = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); stops.forEach(([o, col]) => g.addColorStop(o, col));
    x.fillStyle = g; x.fillRect(0, 0, w, w); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  };
  const sprite = (t, size, opacity) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity }));
    s.scale.set(size, size, 1); return s;
  };
  const sunPos = new THREE.Vector3(-1.4, -0.35, -40);
  const halo = sprite(glowTex([[0, "rgba(255,214,160,1)"], [0.16, "rgba(255,150,70,0.55)"], [0.5, "rgba(140,70,30,0.16)"], [1, "rgba(0,0,0,0)"]]), 52, 1);
  const core = sprite(glowTex([[0, "rgba(255,255,255,1)"], [0.12, "rgba(255,246,228,0.95)"], [0.4, "rgba(255,200,140,0.25)"], [1, "rgba(0,0,0,0)"]]), 9, 1);
  halo.position.copy(sunPos); core.position.copy(sunPos);
  scene.add(halo, core);
  // 가로로 퍼지는 빛줄기
  const streak = (() => {
    const c = document.createElement("canvas"); c.width = 512; c.height = 64; const x = c.getContext("2d");
    x.save(); x.translate(256, 32); x.scale(1, 0.125);
    const g = x.createRadialGradient(0, 0, 0, 0, 0, 256); g.addColorStop(0, "rgba(255,236,210,0.9)"); g.addColorStop(0.35, "rgba(255,200,150,0.25)"); g.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = g; x.fillRect(-256, -256, 512, 512); x.restore(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.55 }));
    s.scale.set(70, 3.2, 1); s.position.copy(sunPos); return s;
  })();
  scene.add(streak);

  /* ---------- 위성: 가운데 연산 모듈(AI DC) + 세로로 펼친 방열판 + 큰 태양광 날개 두 장 ----------
   *  방열판은 날개와 수직(태양을 옆으로 비껴 서서 열을 우주로 내보냄), 연산 모듈은 그 교차점에 있음 */
  const sat = new THREE.Group();
  scene.add(sat);
  const metal = new THREE.MeshStandardMaterial({ color: 0xe4e8ee, metalness: 0.35, roughness: 0.38, emissive: 0x9aa4b2, emissiveIntensity: 0.35 });
  const foil = new THREE.MeshStandardMaterial({ color: 0xd0a650, metalness: 0.45, roughness: 0.4, emissive: 0x2a1c05, emissiveIntensity: 0.6 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x30353d, metalness: 0.6, roughness: 0.5 });
  // 방열판 텍스처: 밝은 회백색 판 + 가로로 흐르는 냉각 유로 + 패널 이음선
  const radTex = (() => {
    const W = 256, H = 1536, c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
    const g = x.createLinearGradient(0, 0, W, 0); g.addColorStop(0, "#b9bcc0"); g.addColorStop(0.5, "#d9dbdd"); g.addColorStop(1, "#aeb2b7");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.strokeStyle = "rgba(120,124,130,0.55)"; x.lineWidth = 2;
    for (let j = 10; j < H; j += 22) { x.beginPath(); x.moveTo(8, j); x.lineTo(W - 8, j); x.stroke(); }          // 냉각 유로
    x.strokeStyle = "rgba(90,94,100,0.8)"; x.lineWidth = 4;
    [0.25, 0.5, 0.75].forEach((t) => { x.beginPath(); x.moveTo(0, H * t); x.lineTo(W, H * t); x.stroke(); });   // 접힘 이음선
    x.beginPath(); x.moveTo(W / 2, 0); x.lineTo(W / 2, H); x.lineWidth = 3; x.stroke();                           // 가운데 주배관
    x.strokeStyle = "rgba(70,74,80,0.9)"; x.lineWidth = 6; x.strokeRect(3, 3, W - 6, H - 6);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  })();
  const radiator = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 3.4),
    new THREE.MeshStandardMaterial({ map: radTex, emissiveMap: radTex, emissive: new THREE.Color(0xffffff), emissiveIntensity: 0.5, metalness: 0.3, roughness: 0.5, side: THREE.DoubleSide }));
  radiator.rotation.y = Math.PI / 2;                    // 날개 면과 수직
  sat.add(radiator);
  // 연산 모듈 (방열판 앞뒤를 감싸는 상자 + 금박 + 광통신 단말)
  const bus = new THREE.Group(); bus.position.y = 0.05; sat.add(bus);
  bus.add(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.2, 0.3), metal));
  [[0, 0.11, 0, 0.28, 0.03, 0.24, foil], [0.12, -0.02, 0.16, 0.08, 0.12, 0.02, dark], [-0.1, 0, 0.16, 0.1, 0.08, 0.02, foil], [0, -0.12, 0, 0.2, 0.04, 0.2, dark]]
    .forEach(([x, y, z, w, h, d, m]) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); bus.add(b); });
  const term = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.05, 24), dark); term.rotation.x = Math.PI / 2; term.position.set(0.04, 0.02, 0.18); bus.add(term);   // 광통신 단말
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.015, 12, 8), new THREE.MeshBasicMaterial({ color: 0x9fe3ff })); lamp.position.set(-0.12, 0.05, 0.17); bus.add(lamp);
  // 옆으로 뻗은 가는 안테나 붐
  const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.3, 8), metal); boom.position.set(0, -0.1, -0.42); sat.add(boom);
  const boomArm = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.42, 8), metal); boomArm.rotation.x = Math.PI / 2; boomArm.position.set(0, 0.05, -0.21); sat.add(boomArm);
  // 날개 (AI1 위성 참고): 짙은 회청색 셀이 촘촘한 큰 판, 길이 방향 이음선 두 줄로 세 줄기, 반사가 큰 면
  const wingTex = (() => {
    const W = 2048, H = 900, c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#1a222e"); g.addColorStop(1, "#121821"); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.strokeStyle = "rgba(170,190,215,0.13)"; x.lineWidth = 1;                                    // 셀 격자 (가로로 긴 셀)
    for (let i = 0; i <= W; i += 22) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, H); x.stroke(); }
    for (let j = 0; j <= H; j += 12) { x.beginPath(); x.moveTo(0, j); x.lineTo(W, j); x.stroke(); }
    x.strokeStyle = "rgba(225,232,242,0.55)"; x.lineWidth = 3;                                   // 길이 방향 이음선 두 줄 → 세 줄기
    [1 / 3, 2 / 3].forEach((t) => { x.beginPath(); x.moveTo(0, H * t); x.lineTo(W, H * t); x.stroke(); });
    x.strokeStyle = "rgba(200,208,220,0.7)"; x.lineWidth = 6; x.strokeRect(3, 3, W - 6, H - 6);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  })();
  // 반사용 환경: 위는 어둡고 지평선 쪽이 밝은 하늘 → 날개가 돌 때 사진처럼 넓은 반사 띠가 지나감
  {
    const ec = document.createElement("canvas"); ec.width = 1024; ec.height = 512; const ex = ec.getContext("2d");
    const eg = ex.createLinearGradient(0, 0, 0, 512); eg.addColorStop(0, "#000000"); eg.addColorStop(0.42, "#0b1220"); eg.addColorStop(0.5, "#cfe0ff"); eg.addColorStop(0.53, "#ffffff"); eg.addColorStop(0.6, "#4a6fa8"); eg.addColorStop(1, "#0a1222");
    ex.fillStyle = eg; ex.fillRect(0, 0, 1024, 512);
    const sg = ex.createRadialGradient(330, 252, 0, 330, 252, 160); sg.addColorStop(0, "rgba(255,240,220,1)"); sg.addColorStop(1, "rgba(255,200,150,0)"); ex.fillStyle = sg; ex.fillRect(0, 0, 1024, 512);
    const et = new THREE.CanvasTexture(ec); et.mapping = THREE.EquirectangularReflectionMapping; et.colorSpace = THREE.SRGBColorSpace;
    var wingEnv = new THREE.PMREMGenerator(renderer).fromEquirectangular(et).texture;
  }
  const wingMat = new THREE.MeshPhysicalMaterial({ map: wingTex, metalness: 0.75, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08, envMap: wingEnv, envMapIntensity: 1.6, side: THREE.DoubleSide, emissiveMap: wingTex, emissive: new THREE.Color(0xffffff), emissiveIntensity: 0.12 });
  const wingGeo = new THREE.PlaneGeometry(3.6, 1.6);
  // 마름모 트러스 붐: 두 가닥이 엇갈리며 마름모가 이어지는 접이식 붐 (AI1 · Starlink 그림 참고)
  const rod = (a, b, r) => { const d = b.clone().sub(a), L = d.length(); const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, L, 6), metal); m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); sat.add(m); };
  [-1, 1].forEach((d) => {
    const w = new THREE.Mesh(wingGeo, wingMat); w.position.set(d * (0.85 + 1.8), 0.05, 0); sat.add(w);
    const x0 = d * 0.17, x1 = d * 0.85, n = 3, amp = 0.09;
    for (let k = 0; k < n; k++) {
      const a = x0 + (x1 - x0) * k / n, b = x0 + (x1 - x0) * (k + 1) / n, m = (a + b) / 2;
      [1, -1].forEach((s) => { rod(new THREE.Vector3(a, 0.05, 0), new THREE.Vector3(m, 0.05 + s * amp, 0), 0.007); rod(new THREE.Vector3(m, 0.05 + s * amp, 0), new THREE.Vector3(b, 0.05, 0), 0.007); });
    }
    rod(new THREE.Vector3(x1, 0.05 - 0.8, 0), new THREE.Vector3(x1, 0.05 + 0.8, 0), 0.012);           // 날개 뿌리 막대
  });
  sat.scale.setScalar(0.6);
  sat.position.set(0.95, 0.45, 2.2);
  sat.rotation.set(0.04, -0.82, 0.05);                    // 원근: 날개는 비스듬히 멀어지고, 수직 방열판이 보이게

  /* ---------- 크기, 움직임, 상호작용 ---------- */
  let w = 0, h = 0, dirty = true, visible = true, t0 = performance.now();
  const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  function resize() {
    const r = host.getBoundingClientRect(); w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.fov = w / h < 1.6 ? 42 : 32;                   // 세로로 길어지면 조금 넓게
    camera.updateProjectionMatrix(); dirty = true;
  }
  new ResizeObserver(resize).observe(host); resize();
  const card = host.closest(".slide") || host;
  card.addEventListener("pointermove", (e) => {
    const r = host.getBoundingClientRect();
    target.x = ((e.clientX - r.left) / r.width - 0.5) * 2; target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
  });
  card.addEventListener("pointerleave", () => { target.x = 0; target.y = 0; });
  new IntersectionObserver((es) => es.forEach((en) => { visible = en.isIntersecting; if (visible) dirty = true; }), { threshold: 0.02 }).observe(host);

  const look = new THREE.Vector3(0.2, -0.05, 0);
  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible || (reduce && !dirty)) return;
    if (!dirty && card.classList.contains("slide") && !card.classList.contains("is-active")) return;   // 옆에 살짝 보이는 카드는 멈춘 장면
    const t = (now - t0) / 1000;
    if (!reduce) {
      cur.x += (target.x - cur.x) * 0.04; cur.y += (target.y - cur.y) * 0.04;
      clouds.rotation.y = t * 0.004;
      ground.rotation.y = t * 0.0025;
      sat.rotation.y = -0.82 + Math.sin(t * 0.15) * 0.1 + cur.x * 0.12;
      sat.rotation.x = 0.04 + cur.y * 0.05;
      sat.position.y = 0.45 + Math.sin(t * 0.4) * 0.04;
      const pulse = 1 + Math.sin(t * 0.8) * 0.03; halo.scale.set(52 * pulse, 52 * pulse, 1);
      lamp.material.color.setHSL(0.55, 0.9, 0.55 + 0.3 * Math.max(0, Math.sin(t * 3)));
    }
    camera.position.set(camBase.x + cur.x * 0.5, camBase.y - cur.y * 0.25, camBase.z);
    camera.lookAt(look);
    camera.rotateZ(-0.1);                                   // 지평선: 왼쪽이 높고 오른쪽이 낮게
    renderer.render(scene, camera);
    dirty = false;
  }
  requestAnimationFrame(frame);
  host.classList.add("is-ready");
}
})();
