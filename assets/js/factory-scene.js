/*
 * Research 카드의 3D 배경: Sim × AX — 제조·물류 셀 (three.js)
 * - 공정 흐름 (메인 페이지 선화와 같음): 제어반(HMI) → 6축 로봇이 팔레트에서 상자를 집어 → 컨베이어 → 비전 검사 → AGV → 랙 보관
 * - 움직임은 실제 규칙을 따름: 로봇은 역기구학(IK)으로 집고 놓으며, 컨베이어 끝이 막히면 상자가 줄을 서고(대기열),
 *   AGV 두 대가 한 경로를 돌며 앞차와 간격을 유지하고, 도크에서 짐을 받고 랙 앞에서 내림
 * - <div data-scene="factory3d"> 안에 그림. 카드가 화면에 보일 때만 움직이고, 마우스를 따라 시점이 살짝 바뀜
 */
(function () {
const THREE = window.THREE;
if (!THREE) return;
const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// AGV 순환 경로 (바닥 좌표 x, z): 도크 → 랙 쪽 → 하역(인덱스 3) → 돌아오기
const AGV_PATH = [[7.3, 0], [9.0, 0], [9.0, 4.2], [12.5, 4.2], [12.5, 10.6], [5.0, 10.6], [5.0, 2.4], [6.2, 0]];

document.querySelectorAll('[data-scene="factory3d"]').forEach((host) => (window.NCSL3D ? window.NCSL3D.lazy(host, init) : init(host)));   // 카드가 앞에 올 때 만듦

function init(host) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07090c);
  scene.fog = new THREE.Fog(0x07090c, 70, 120);
  const camera = new THREE.PerspectiveCamera(30, 2, 0.5, 400);

  /* ---------- 반사용 환경 (밝은 천장 조명이 있는 회색 공간) ---------- */
  {
    const pm = new THREE.PMREMGenerator(renderer), env = new THREE.Scene();
    env.add(new THREE.Mesh(new THREE.SphereGeometry(20, 32, 16), new THREE.MeshBasicMaterial({ color: 0x3a3f46, side: THREE.BackSide })));
    for (let i = 0; i < 6; i++) {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(8, 1.2), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      p.position.set(-12 + i * 5, 14, (i % 2 ? 4 : -4)); p.rotation.x = Math.PI / 2; env.add(p);
    }
    scene.environment = pm.fromScene(env, 0.04).texture;
  }

  /* ---------- 빛 ---------- */
  scene.add(new THREE.HemisphereLight(0xdfe6f0, 0x3a3530, 0.55));
  const sun = new THREE.DirectionalLight(0xfff4e6, 2.2);
  sun.position.set(-18, 34, 22); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 22, bottom: -22, near: 1, far: 90 });
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02;
  scene.add(sun);

  const world = new THREE.Group(); scene.add(world);
  const M = (color, rough = 0.6, metal = 0.0, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: rough, metalness: metal }, extra));
  const box = (w, h, d, mat, x, y, z, parent, cast = true) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z);
    m.castShadow = cast; m.receiveShadow = true; (parent || world).add(m); return m;
  };
  const cyl = (r, h, mat, x, y, z, parent, seg = 24) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), mat); m.position.set(x, y, z);
    m.castShadow = true; m.receiveShadow = true; (parent || world).add(m); return m;
  };

  /* ---------- 바닥: 콘크리트 + 노란 구역선 + AGV 경로 ---------- */
  const FW = 40, FD = 26;
  const floorTex = (() => {
    const W = 2048, H = Math.round(2048 * FD / FW), c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
    const sx = W / FW, sz = H / FD, px = (v) => (v + FW / 2) * sx, pz = (v) => (v + FD / 2) * sz;
    x.fillStyle = "#6d7176"; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 26000; i++) { const g = 90 + Math.random() * 40; x.fillStyle = `rgba(${g},${g + 3},${g + 6},0.25)`; x.fillRect(Math.random() * W, Math.random() * H, 2, 2); }
    x.strokeStyle = "rgba(60,62,66,0.5)"; x.lineWidth = 2;                                   // 바닥 줄눈
    for (let v = -FW / 2; v <= FW / 2; v += 5) { x.beginPath(); x.moveTo(px(v), 0); x.lineTo(px(v), H); x.stroke(); }
    for (let v = -FD / 2; v <= FD / 2; v += 5) { x.beginPath(); x.moveTo(0, pz(v)); x.lineTo(W, pz(v)); x.stroke(); }
    const rect = (x0, z0, x1, z1, col, lw, dash) => { x.setLineDash(dash || []); x.strokeStyle = col; x.lineWidth = lw; x.strokeRect(px(x0), pz(z0), px(x1) - px(x0), pz(z1) - pz(z0)); x.setLineDash([]); };
    rect(-14, -4.2, -7.6, 3.2, "#e8c22a", 7);                                                 // 로봇 셀
    rect(-8.2, -1.4, 6.6, 1.4, "#e8c22a", 6);                                                 // 컨베이어 구역
    rect(9.6, -10.5, 19, 10.5, "#e8c22a", 6);                                                 // 랙 구역
    rect(-18.6, 4.5, -10, 11.5, "#e8c22a", 6);                                                // 팔레트 적재 구역
    x.setLineDash([22, 16]); x.strokeStyle = "rgba(240,240,240,0.55)"; x.lineWidth = 6;      // AGV 경로
    x.beginPath(); AGV_PATH.forEach(([a, b], i) => (i ? x.lineTo(px(a), pz(b)) : x.moveTo(px(a), pz(b)))); x.closePath(); x.stroke(); x.setLineDash([]);
    x.save(); x.beginPath(); x.rect(px(-14), pz(-4.2), px(-7.6) - px(-14), pz(3.2) - pz(-4.2)); x.clip();   // 로봇 셀 빗금
    x.strokeStyle = "rgba(232,194,42,0.18)"; x.lineWidth = 8;
    for (let k = -40; k < 80; k++) { x.beginPath(); x.moveTo(px(-14) + k * 28, pz(-4.2)); x.lineTo(px(-14) + k * 28 - 300, pz(3.2)); x.stroke(); }
    x.restore();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  })();
  const floor = new THREE.Mesh(new THREE.BoxGeometry(FW, 0.4, FD), [M(0x55595e), M(0x55595e), new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.82 }), M(0x55595e), M(0x55595e), M(0x55595e)]);
  floor.position.y = -0.2; floor.receiveShadow = true; world.add(floor);

  /* ---------- 벽: 잘라낸 단면 (뒤·오른쪽은 높게, 창 띠 / 앞·왼쪽은 낮게) ---------- */
  const wallMat = M(0x8b9097, 0.7), capMat = M(0xb7bcc2, 0.5), glass = M(0x1b2633, 0.15, 0.6, { emissive: 0x0d1724 });
  box(FW, 6, 0.4, wallMat, 0, 3, -FD / 2);                                                    // 뒤
  box(0.4, 6, FD, wallMat, FW / 2, 3, 0);                                                     // 오른쪽
  box(FW, 1.4, 0.4, wallMat, 0, 0.7, FD / 2);                                                 // 앞 (낮게 자름)
  box(0.4, 1.4, FD, wallMat, -FW / 2, 0.7, 0);                                                // 왼쪽
  box(FW, 0.12, 0.5, capMat, 0, 6.06, -FD / 2, null, false); box(0.5, 0.12, FD, capMat, FW / 2, 6.06, 0, null, false);
  for (let i = 0; i < 9; i++) box(3.2, 0.9, 0.06, glass, -16 + i * 4.2, 4.6, -FD / 2 + 0.23, null, false);                // 창 띠
  for (let i = 0; i < 6; i++) box(0.06, 0.9, 3.2, glass, FW / 2 - 0.23, 4.6, -10 + i * 4.2, null, false);
  for (let i = 0; i < 4; i++) { box(3.4, 3.6, 0.08, M(0x9aa1a8, 0.55, 0.3), -6 + i * 4.6, 1.8, -FD / 2 + 0.25); }    // 셔터 문
  for (let i = 0; i < 9; i++) box(0.3, 6, 0.3, M(0x6f757c), -18 + i * 4.5, 3, -FD / 2 + 0.35);                         // 기둥

  /* ---------- 사무동 (왼쪽 뒤): 옥상 패널 + 계단 ---------- */
  {
    const g = new THREE.Group(); g.position.set(-15.2, 0, -8.6); world.add(g);
    box(9, 3.4, 6.2, M(0xa7adb3, 0.6), 0, 1.7, 0, g);
    for (let i = 0; i < 4; i++) box(1.5, 1.1, 0.05, glass, -3 + i * 2, 1.9, 3.12, g, false);
    const roofTex = (() => { const c = document.createElement("canvas"); c.width = 512; c.height = 360; const x = c.getContext("2d"); x.fillStyle = "#23272d"; x.fillRect(0, 0, 512, 360); x.strokeStyle = "#4a5058"; x.lineWidth = 3; for (let i = 0; i <= 512; i += 42) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 360); x.stroke(); } for (let j = 0; j <= 360; j += 42) { x.beginPath(); x.moveTo(0, j); x.lineTo(512, j); x.stroke(); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
    const roof = new THREE.Mesh(new THREE.BoxGeometry(9.1, 0.12, 6.3), new THREE.MeshStandardMaterial({ map: roofTex, roughness: 0.4, metalness: 0.3 })); roof.position.y = 3.46; roof.castShadow = true; g.add(roof);
    for (let i = 0; i < 8; i++) box(1.2, 0.18, 0.5, M(0x8a5a3a, 0.7), 5.1 + i * 0.32, 0.2 + i * 0.4, 1.6 + i * 0.0, g);     // 계단
    box(0.06, 1, 4.2, M(0xc0653a), 5.8, 2.4, 1.6, g);
    [[2.6, 0.8], [3.8, 0.8]].forEach(([x0, z0]) => box(0.9, 0.6, 0.9, M(0xc9ced4, 0.5, 0.3), x0, 3.82, z0, g));                 // 실외기
  }

  /* ---------- 팔레트 적재 구역 (왼쪽 앞) ---------- */
  const cardboard = M(0xc6a06a, 0.85), pallet = M(0x9b7a4e, 0.9);
  const boxGeo = new THREE.BoxGeometry(0.7, 0.5, 0.55);
  [[-17, 6], [-15.3, 6], [-13.6, 6], [-17, 8.6], [-15.3, 8.6], [-12, 9.6]].forEach(([x0, z0], k) => {
    box(1.4, 0.15, 1.2, pallet, x0, 0.08, z0);
    const layers = 2 + (k % 3);
    for (let l = 0; l < layers; l++) for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) {
      const m = new THREE.Mesh(boxGeo, cardboard); m.position.set(x0 - 0.36 + a * 0.72, 0.41 + l * 0.51, z0 - 0.29 + b * 0.57); m.castShadow = m.receiveShadow = true; world.add(m);
    }
  });

  /* ---------- 랙 (오른쪽): 파란 기둥, 주황 보, 상자 ---------- */
  const rackUp = M(0x2c58a8, 0.45, 0.4), rackBeam = M(0xe07a2c, 0.45, 0.3);
  const RACK_X = [11.2, 13.8, 16.4, 18.6], RZ0 = -9.6, RZ1 = 9.4, LEVELS = [0.15, 1.35, 2.55];
  const rackSlots = [];
  RACK_X.forEach((rx) => {
    for (let z = RZ0; z <= RZ1 + 0.01; z += 2.0) { [-0.5, 0.5].forEach((dx) => box(0.08, 3.4, 0.08, rackUp, rx + dx, 1.7, z)); }
    LEVELS.forEach((ly) => [-0.5, 0.5].forEach((dx) => box(0.08, 0.1, RZ1 - RZ0, rackBeam, rx + dx, ly + 0.05, (RZ0 + RZ1) / 2)));
    LEVELS.forEach((ly) => { for (let z = RZ0 + 0.5; z < RZ1; z += 0.72) rackSlots.push(new THREE.Vector3(rx, ly + 0.36, z + 0.1)); });
  });
  const rackBoxes = new THREE.InstancedMesh(boxGeo, cardboard, rackSlots.length);
  rackBoxes.castShadow = rackBoxes.receiveShadow = true;
  const dummy = new THREE.Object3D(), tint = new THREE.Color();
  rackSlots.forEach((p, i) => {
    const filled = Math.random() < 0.72;
    dummy.position.copy(p); dummy.rotation.y = Math.PI / 2; dummy.scale.setScalar(filled ? 1 : 0.0001); dummy.updateMatrix();
    rackBoxes.setMatrixAt(i, dummy.matrix);
    tint.setHSL(0.09 + Math.random() * 0.02, 0.45, 0.52 + Math.random() * 0.1); rackBoxes.setColorAt(i, tint);
    p.filled = filled;
  });
  world.add(rackBoxes);

  /* ---------- 제어반 (HMI) + 경광등 ---------- */
  box(1.1, 2.0, 0.6, M(0xbfc4ca, 0.45, 0.2), -13.2, 1.0, -3.4);
  const screen = box(0.7, 0.45, 0.02, M(0x0, 0.3, 0, { emissive: 0x3fb4ff, emissiveIntensity: 0.9 }), -13.2, 1.45, -3.09, null, false);
  cyl(0.06, 0.6, M(0x777c82), -12.75, 2.3, -3.4);
  const lampG = cyl(0.09, 0.14, M(0x2bd96b, 0.3, 0, { emissive: 0x2bd96b, emissiveIntensity: 1.6 }), -12.75, 2.66, -3.4);
  cyl(0.09, 0.14, M(0xf2b632, 0.3, 0, { emissive: 0x000000 }), -12.75, 2.52, -3.4);

  /* ---------- 안전 펜스 (로봇 셀) ---------- */
  {
    const post = M(0xe8c22a, 0.5), mesh = new THREE.MeshStandardMaterial({ color: 0x9aa1a8, roughness: 0.6, metalness: 0.4, transparent: true, opacity: 0.32, side: THREE.DoubleSide });
    const fence = (x0, z0, x1, z1) => {
      const L = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.round(L / 1.6));
      for (let i = 0; i <= n; i++) box(0.08, 1.8, 0.08, post, x0 + (x1 - x0) * i / n, 0.9, z0 + (z1 - z0) * i / n);
      const p = new THREE.Mesh(new THREE.PlaneGeometry(L, 1.6), mesh); p.position.set((x0 + x1) / 2, 0.95, (z0 + z1) / 2); p.rotation.y = -Math.atan2(z1 - z0, x1 - x0); world.add(p);
    };
    fence(-14, -4.2, -8.4, -4.2); fence(-14, -4.2, -14, 3.2); fence(-14, 3.2, -10.5, 3.2);
  }

  /* ---------- 컨베이어 ---------- */
  const CX0 = -8.0, CX1 = 6.2, CY = 0.9, CW = 0.9;
  {
    const frame = M(0x9ba2aa, 0.4, 0.6), belt = M(0x24272b, 0.8);
    box(CX1 - CX0, 0.06, CW, belt, (CX0 + CX1) / 2, CY - 0.03, 0);
    [-1, 1].forEach((s) => box(CX1 - CX0, 0.16, 0.06, frame, (CX0 + CX1) / 2, CY - 0.02, s * (CW / 2 + 0.03)));
    for (let x0 = CX0 + 0.4; x0 < CX1; x0 += 2.0) [-1, 1].forEach((s) => box(0.07, CY - 0.1, 0.07, frame, x0, (CY - 0.1) / 2, s * 0.4));
    box(0.5, 0.36, 0.42, M(0x3c4148, 0.5, 0.4), CX1 - 0.3, CY - 0.32, -0.62);                // 구동 모터
  }
  const rollers = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.05, 0.05, CW - 0.06, 12), M(0xc9ced4, 0.3, 0.8), Math.floor((CX1 - CX0) / 0.3));
  for (let i = 0; i < rollers.count; i++) { dummy.position.set(CX0 + 0.15 + i * 0.3, CY - 0.07, 0); dummy.rotation.set(Math.PI / 2, 0, 0); dummy.scale.setScalar(1); dummy.updateMatrix(); rollers.setMatrixAt(i, dummy.matrix); }
  world.add(rollers);

  /* ---------- 비전 검사 갠트리 ---------- */
  const VX = -0.8;
  const scanLight = new THREE.SpotLight(0x9fe8ff, 0, 4, 0.5, 0.6, 1.2);
  {
    const fr = M(0xd8dde2, 0.4, 0.4);
    [-1, 1].forEach((s) => box(0.14, 2.7, 0.14, fr, VX, 1.35, s * 1.0));
    box(0.18, 0.18, 2.2, fr, VX, 2.72, 0);
    box(0.36, 0.26, 0.36, M(0x2c3036, 0.4, 0.5), VX, 2.5, 0);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.035, 10, 32), M(0xffffff, 0.3, 0, { emissive: 0xbff4ff, emissiveIntensity: 0.6 }));
    ring.rotation.x = Math.PI / 2; ring.position.set(VX, 2.33, 0); world.add(ring);
    scanLight.position.set(VX, 2.3, 0); scanLight.target.position.set(VX, 0, 0); world.add(scanLight, scanLight.target);
  }
  const beam = new THREE.Mesh(new THREE.ConeGeometry(0.62, 1.45, 32, 1, true), new THREE.MeshBasicMaterial({ color: 0x9fe8ff, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
  beam.position.set(VX, 1.6, 0); world.add(beam);

  /* ---------- 로봇 (6축, 주황) ---------- */
  const RB = new THREE.Vector3(-9.8, 0, -1.0);
  const orange = M(0xf08a1c, 0.38, 0.25), grayR = M(0x2e3238, 0.5, 0.5);
  const robot = { base: new THREE.Group(), j1: new THREE.Group(), j2: new THREE.Group(), j3: new THREE.Group(), j4: new THREE.Group() };
  const SH = 0.95, L1 = 1.55, L2 = 1.45, L3 = 0.42;
  robot.base.position.copy(RB); world.add(robot.base);
  cyl(0.42, 0.3, grayR, 0, 0.15, 0, robot.base, 32);
  robot.base.add(robot.j1); robot.j1.position.y = 0.3;
  cyl(0.34, 0.4, orange, 0, 0.2, 0, robot.j1, 32);
  box(0.5, 0.36, 0.5, orange, 0.06, 0.55, 0, robot.j1);
  robot.j1.add(robot.j2); robot.j2.position.y = SH - 0.3;                                  // 어깨
  const hub = (r, w, parent, mat) => { const m = cyl(r, w, mat || orange, 0, 0, 0, parent, 28); m.rotation.x = Math.PI / 2; return m; };
  hub(0.24, 0.62, robot.j2); hub(0.12, 0.66, robot.j2, grayR);
  const ua = box(0.3, L1, 0.34, orange, 0, L1 / 2, 0, robot.j2); ua.scale.set(1, 1, 1);
  box(0.1, L1 * 0.7, 0.1, grayR, -0.2, L1 * 0.45, 0.2, robot.j2);                            // 평형 실린더
  robot.j2.add(robot.j3); robot.j3.position.y = L1;                                          // 팔꿈치
  hub(0.2, 0.5, robot.j3); box(0.42, 0.36, 0.42, orange, -0.12, 0, 0, robot.j3);
  box(L2, 0.22, 0.24, orange, L2 / 2, 0.04, 0, robot.j3);
  robot.j3.add(robot.j4); robot.j4.position.set(L2, 0.04, 0);                                 // 손목
  hub(0.12, 0.3, robot.j4, grayR);
  box(0.16, L3 * 0.6, 0.16, grayR, 0, -L3 * 0.3, 0, robot.j4);
  box(0.42, 0.06, 0.32, M(0x9ba2aa, 0.35, 0.7), 0, -L3 * 0.62, 0, robot.j4);                 // 흡착 그리퍼 판
  [-0.12, 0.12].forEach((dx) => [-0.09, 0.09].forEach((dz) => cyl(0.035, 0.08, M(0x222222, 0.8), dx, -L3 * 0.72, dz, robot.j4, 12)));
  const grip = new THREE.Object3D(); grip.position.y = -L3 - 0.02; robot.j4.add(grip);       // 상자를 붙일 지점

  // 역기구학: 목표점(세계 좌표)에 그리퍼 끝이 오도록 j1 회전, j2/j3 각, j4는 그리퍼가 항상 아래를 보게
  function ik(target) {
    const lx = target.x - RB.x, lz = target.z - RB.z, yaw = Math.atan2(-lz, lx);
    robot.j1.rotation.y = yaw;
    const r = Math.hypot(lx, lz), h = target.y + L3 + 0.02 - (RB.y + SH);
    const d = Math.min(Math.hypot(r, h), L1 + L2 - 1e-3);
    const a = Math.atan2(h, r), cosB = (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), B = Math.acos(Math.max(-1, Math.min(1, cosB)));
    const sh = a + B;                                                                          // 위팔 각 (수평 기준)
    const cosE = (L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2), E = Math.acos(Math.max(-1, Math.min(1, cosE)));
    robot.j2.rotation.z = sh - Math.PI / 2;                                                    // 위팔은 +Y 방향으로 모델링
    const fa = sh - (Math.PI - E);                                                             // 아래팔의 수평 기준 각 (+X 방향으로 모델링)
    robot.j3.rotation.z = fa - sh + Math.PI / 2;
    robot.j4.rotation.z = -fa;                                                                 // 그리퍼가 늘 아래를 향함
  }

  /* ---------- 상자 (공정을 흐르는 개체) ---------- */
  const flowMat = M(0xcfa46c, 0.85);
  const tapeTex = (() => { const c = document.createElement("canvas"); c.width = 128; c.height = 128; const x = c.getContext("2d"); x.fillStyle = "#cfa46c"; x.fillRect(0, 0, 128, 128); x.fillStyle = "#b98d55"; x.fillRect(54, 0, 20, 128); x.fillStyle = "#f2f2f2"; x.fillRect(12, 84, 30, 22); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const flowBoxMat = new THREE.MeshStandardMaterial({ map: tapeTex, roughness: 0.85 });
  const BOX = { w: 0.55, h: 0.42, d: 0.5 };
  const newBox = () => { const m = new THREE.Mesh(new THREE.BoxGeometry(BOX.w, BOX.h, BOX.d), flowBoxMat); m.castShadow = m.receiveShadow = true; world.add(m); return m; };

  // 투입 팔레트 (로봇이 집는 곳)
  const PICK = new THREE.Vector3(-11.3, 0, 0.7);
  box(1.3, 0.15, 1.1, pallet, PICK.x, 0.08, PICK.z);
  let stack = [];
  function refill() {
    stack.forEach((b) => world.remove(b)); stack = [];
    for (let l = 0; l < 3; l++) for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) {
      const m = newBox(); m.position.set(PICK.x - 0.3 + a * 0.6, 0.15 + BOX.h / 2 + l * BOX.h, PICK.z - 0.27 + b * 0.54); stack.push(m);
    }
  }
  refill();

  /* ---------- AGV 두 대 (한 경로를 돌며 간격 유지) ---------- */
  const DOCK = new THREE.Vector3(7.3, 0, 0), DROP_I = 3;
  function AGVmesh() {
    const g = new THREE.Group(); world.add(g);
    box(1.3, 0.32, 0.9, M(0x1f5fb8, 0.4, 0.3), 0, 0.26, 0, g);
    box(1.34, 0.06, 0.94, M(0x2a2d32, 0.6), 0, 0.12, 0, g);
    box(1.0, 0.05, 0.7, M(0x8d949c, 0.4, 0.6), 0, 0.445, 0, g);
    cyl(0.07, 0.08, M(0x1c1f23, 0.4, 0.4), 0.56, 0.48, 0, g, 16);                                // 라이다
    const led = box(0.04, 0.05, 0.6, M(0x000000, 0.3, 0, { emissive: 0x39d6ff, emissiveIntensity: 1.4 }), 0.66, 0.26, 0, g, false);
    return { g, led, s: 0, state: "move", t: 0, load: null };
  }
  const agvs = [AGVmesh(), AGVmesh()];

  /* ---------- 작은 선반 (앞쪽), 흩어진 팔레트, 지게차 ---------- */
  for (let r = 0; r < 4; r++) {
    const x0 = -5 + r * 2.4, shelf = M(0x2c58a8, 0.45, 0.4), deck = M(0x6f767e, 0.5, 0.4);
    [-1.6, 1.6].forEach((dz) => [-0.35, 0.35].forEach((dx) => box(0.06, 2.0, 0.06, shelf, x0 + dx, 1.0, 9.6 + dz)));
    [0.3, 1.0, 1.7].forEach((ly) => {
      box(0.76, 0.04, 3.3, deck, x0, ly, 9.6);
      for (let k = 0; k < 4; k++) if (Math.random() < 0.75) box(0.5, 0.32, 0.6, k % 2 ? M(0x3a6fc4, 0.6) : cardboard, x0, ly + 0.18, 8.3 + k * 0.85);
    });
  }
  [[2.5, -5.5], [4.2, -5.5], [-3.5, -6.5], [7.5, 6.8]].forEach(([x0, z0], k) => {
    box(1.3, 0.15, 1.1, pallet, x0, 0.08, z0);
    for (let l = 0; l < 1 + (k % 2); l++) box(1.2, 0.5, 1.0, cardboard, x0, 0.42 + l * 0.52, z0);
  });
  const fork = new THREE.Group(); world.add(fork);
  {
    const red = M(0xd8452f, 0.45, 0.2), blk = M(0x1d2024, 0.6, 0.3);
    box(1.5, 0.7, 1.0, red, 0, 0.55, 0, fork); box(0.9, 0.08, 1.0, blk, -0.2, 1.9, 0, fork);                // 차체, 지붕
    [[-0.6, 0.45], [0.2, 0.45], [-0.6, -0.45], [0.2, -0.45]].forEach(([x0, z0]) => box(0.05, 1.0, 0.05, blk, x0, 1.4, z0, fork));
    box(0.1, 2.2, 0.8, blk, 0.85, 1.1, 0, fork);                                                              // 마스트
    [-0.25, 0.25].forEach((z0) => box(0.9, 0.05, 0.12, M(0x9ba2aa, 0.4, 0.7), 1.35, 0.12, z0, fork));       // 포크
    [[-0.5, 0.52], [0.5, 0.52], [-0.5, -0.52], [0.5, -0.52]].forEach(([x0, z0]) => { const w0 = cyl(0.22, 0.18, blk, x0, 0.22, z0, fork, 16); w0.rotation.x = Math.PI / 2; });
    box(1.1, 0.4, 0.9, cardboard, 1.5, 0.4, 0, fork);                                                         // 실은 짐
  }

  /* ---------- 사람 (안전조끼) ---------- */
  const people = [];
  function person(path, speed, phase) {
    const g = new THREE.Group(); world.add(g);
    const legs = cyl(0.13, 0.8, M(0x2b2f36, 0.8), 0, 0.4, 0, g, 12);
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.45, 4, 12), M(0xd7f04a, 0.6)); body.position.y = 1.1; body.castShadow = true; g.add(body);
    cyl(0.12, 0.2, M(0xd9b18e, 0.7), 0, 1.6, 0, g, 12);
    const hat = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), M(0xffffff, 0.4)); hat.position.y = 1.7; g.add(hat);
    people.push({ g, path, speed, phase });
  }
  person([[-6, 3.2], [4, 3.2]], 0.9, 0);
  person([[9, -8], [9, 8]], 0.7, 4);
  person([[-17, 3.6], [-11, 3.6]], 0.6, 2);

  /* ---------- 카메라·배치 ---------- */
  world.rotation.y = 0.32;
  const look = new THREE.Vector3(-1.5, 0, 1.5);
  let w = 1, h = 1, visible = true;
  const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  function resize() {
    const r = host.getBoundingClientRect(); w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = w / h < 1.6 ? 40 : 30; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(host); resize();
  const card = host.closest(".slide") || host;
  card.addEventListener("pointermove", (e) => { const r = host.getBoundingClientRect(); target.x = ((e.clientX - r.left) / r.width - 0.5) * 2; target.y = ((e.clientY - r.top) / r.height - 0.5) * 2; });
  card.addEventListener("pointerleave", () => { target.x = 0; target.y = 0; });
  new IntersectionObserver((es) => es.forEach((en) => (visible = en.isIntersecting)), { threshold: 0.02 }).observe(host);

  /* ---------- 공정 시뮬레이션 ---------- */
  const ease = (u) => u * u * (3 - 2 * u);
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const HOME = V(-9.6, 2.1, 0.2), PLACE = V(CX0 + 0.5, CY + BOX.h / 2, 0);
  let rob = { phase: 0, t: 0, held: null, from: HOME.clone(), to: HOME.clone(), dur: 1 };
  const belt = [];                       // 컨베이어 위 상자들 (x 순서)
  const BELT_V = 0.9, GAP = 0.85;
  const transfers = [];                  // 옮겨지는 상자 애니메이션

  function robotStep(dt) {
    rob.t += dt;
    const u = Math.min(1, rob.t / rob.dur);
    const p = rob.from.clone().lerp(rob.to, ease(u));
    if (rob.phase === 1 || rob.phase === 5) p.y += Math.sin(Math.PI * ease(u)) * 0.6;            // 옮길 때 위로 호를 그림
    ik(p);
    if (rob.held) { grip.getWorldPosition(rob.held.position); world.worldToLocal(rob.held.position); rob.held.position.y -= BOX.h / 2; rob.held.rotation.y = robot.j1.rotation.y; }
    if (u < 1) return;
    const top = stack[stack.length - 1];
    const go = (to, dur, phase) => { rob.from = p.clone(); rob.to = to; rob.dur = dur; rob.t = 0; rob.phase = phase; };
    switch (rob.phase) {
      case 0: if (!top) { refill(); return; } go(V(top.position.x, top.position.y + BOX.h / 2 + 0.5, top.position.z), 1.3, 1); break;   // 집을 상자 위로
      case 1: go(V(top.position.x, top.position.y + BOX.h / 2, top.position.z), 0.6, 2); break;                                              // 내려가기
      case 2: rob.held = stack.pop(); go(V(p.x, p.y + 0.5, p.z), 0.5, 3); break;                                                              // 흡착 후 들기
      case 3: go(PLACE.clone().add(V(0, 0.55, 0)), 1.5, 4); break;                                                                            // 컨베이어 위로
      case 4: { const free = !belt.length || belt[belt.length - 1].position.x > CX0 + 0.5 + GAP; if (free) go(PLACE.clone().add(V(0, BOX.h / 2 + 0.02, 0)), 0.5, 6); else rob.t = rob.dur; break; }   // 자리가 비면 내려놓기 (아니면 대기)
      case 6: { const b = rob.held; rob.held = null; b.position.set(PLACE.x, CY + BOX.h / 2, 0); b.rotation.y = 0; belt.push(b); go(V(p.x, p.y + 0.5, p.z), 0.45, 7); break; }
      case 7: go(HOME.clone(), 1.1, 0); break;
      default: go(HOME.clone(), 1, 0);
    }
  }

  function beltStep(dt) {
    let scan = 0;
    for (let i = 0; i < belt.length; i++) {
      const b = belt[i], ahead = belt[i - 1];
      let limit = CX1 - BOX.w / 2;                                         // 끝
      if (ahead) limit = Math.min(limit, ahead.position.x - GAP);          // 앞 상자와 간격 유지 → 대기열
      b.position.x = Math.min(limit, b.position.x + BELT_V * dt);
      if (Math.abs(b.position.x - VX) < 0.45) scan = 1;
    }
    // 끝에 도착한 상자 → 도크에 빈 AGV 가 있으면 옮김
    const head = belt[0];
    if (head && head.position.x >= CX1 - BOX.w / 2 - 1e-3) {
      const a = agvs.find((v) => v.state === "dock" && !v.load && !v.reserved);
      if (a) { a.reserved = true; belt.shift(); transfers.push({ b: head, from: head.position.clone(), to: null, agv: a, t: 0, dur: 0.7, kind: "load" }); }
    }
    beam.material.opacity += ((scan ? 0.16 : 0) - beam.material.opacity) * 0.15;
    scanLight.intensity += ((scan ? 6 : 0) - scanLight.intensity) * 0.15;
  }

  // AGV 경로 길이 계산
  const segs = []; let total = 0;
  for (let i = 0; i < AGV_PATH.length; i++) { const a = AGV_PATH[i], b = AGV_PATH[(i + 1) % AGV_PATH.length]; const L = Math.hypot(b[0] - a[0], b[1] - a[1]); segs.push({ a, b, L, s0: total }); total += L; }
  const at = (s) => { s = ((s % total) + total) % total; const g = segs.find((q) => s >= q.s0 && s <= q.s0 + q.L) || segs[0]; const u = (s - g.s0) / g.L; return { x: g.a[0] + (g.b[0] - g.a[0]) * u, z: g.a[1] + (g.b[1] - g.a[1]) * u, yaw: Math.atan2(-(g.b[1] - g.a[1]), g.b[0] - g.a[0]) }; };
  const sDock = segs[0].s0, sDrop = segs[DROP_I].s0;
  agvs[0].s = sDock - 0.01; agvs[1].s = sDock - total / 2;
  const AGV_V = 1.6, MIN_GAP = 2.4;
  function agvStep(dt) {
    agvs.forEach((v, i) => {
      const other = agvs[1 - i];
      const gapAhead = (((other.s - v.s) % total) + total) % total;
      if (v.state === "dock") { if (v.load && !v.reserved) { v.state = "move"; } }
      else if (v.state === "drop") { v.t += dt; if (v.t > 1.0 && !v.unloading) { v.unloading = true; unload(v); } if (v.done) { v.state = "move"; v.done = false; v.unloading = false; } }
      else {
        const before = v.s;
        if (gapAhead > MIN_GAP || gapAhead < 0.01) v.s += AGV_V * dt;
        const passed = (s0) => { const d0 = (((s0 - before) % total) + total) % total, d1 = (((s0 - v.s) % total) + total) % total; return d0 < d1 && d0 < AGV_V * dt + 1e-3 || d0 === 0; };
        if (!v.load && passed(sDock)) { v.s = sDock; v.state = "dock"; }
        else if (v.load && passed(sDrop)) { v.s = sDrop; v.state = "drop"; v.t = 0; }
      }
      const q = at(v.s); v.g.position.set(q.x, 0, q.z); v.g.rotation.y = q.yaw;
      v.led.material.emissive.setHex(v.state === "move" ? 0x39d6ff : 0x2bd96b);
      if (v.load && !v.inTransfer) { v.load.position.set(q.x, 0.47 + BOX.h / 2, q.z); v.load.rotation.y = q.yaw; }
    });
  }
  function unload(v) {
    const near = (p) => Math.abs(p.x - AGV_PATH[DROP_I][0]) < 1.5 && Math.abs(p.z - AGV_PATH[DROP_I][1]) < 5;
    let free = rackSlots.findIndex((p) => !p.filled && near(p));
    if (free < 0) { rackSlots.forEach((p, i) => { if (Math.random() < 0.5) { p.filled = false; dummy.position.copy(p); dummy.rotation.y = Math.PI / 2; dummy.scale.setScalar(0.0001); dummy.updateMatrix(); rackBoxes.setMatrixAt(i, dummy.matrix); } }); rackBoxes.instanceMatrix.needsUpdate = true; free = rackSlots.findIndex((p) => !p.filled && near(p)); if (free < 0) free = rackSlots.findIndex((p) => !p.filled); }
    v.inTransfer = true;
    transfers.push({ b: v.load, from: v.load.position.clone(), to: rackSlots[free].clone(), slot: free, agv: v, t: 0, dur: 0.9, kind: "store" });
  }
  function transferStep(dt) {
    for (let i = transfers.length - 1; i >= 0; i--) {
      const tr = transfers[i]; tr.t += dt; const u = ease(Math.min(1, tr.t / tr.dur));
      if (tr.kind === "load") { const to = tr.agv.g.position.clone(); to.y = 0.47 + BOX.h / 2; tr.b.position.lerpVectors(tr.from, to, u); tr.b.position.y += Math.sin(Math.PI * u) * 0.2; }
      else { tr.b.position.lerpVectors(tr.from, tr.to, u); tr.b.position.y += Math.sin(Math.PI * u) * 0.4; }
      if (tr.t >= tr.dur) {
        transfers.splice(i, 1);
        if (tr.kind === "load") { tr.agv.load = tr.b; tr.agv.reserved = false; }
        else {
          world.remove(tr.b); const p = rackSlots[tr.slot]; p.filled = true;
          dummy.position.copy(p); dummy.rotation.y = Math.PI / 2; dummy.scale.setScalar(1); dummy.updateMatrix(); rackBoxes.setMatrixAt(tr.slot, dummy.matrix); rackBoxes.instanceMatrix.needsUpdate = true;
          tr.agv.load = null; tr.agv.inTransfer = false; tr.agv.done = true;
        }
      }
    }
  }
  function forkStep(t) {                                    // 지게차: 랙 앞 통로를 오가며 잠깐씩 멈춤
    const period = 14, u = (t % period) / period, k = u < 0.4 ? ease(u / 0.4) : u < 0.5 ? 1 : u < 0.9 ? 1 - ease((u - 0.5) / 0.4) : 0;
    fork.position.set(-1 + k * 6.5, 0, -8.2); fork.rotation.y = u < 0.45 ? 0 : Math.PI;
  }
  function peopleStep(t) {
    people.forEach((p) => {
      const [a, b] = p.path, L = Math.hypot(b[0] - a[0], b[1] - a[1]), period = 2 * L / p.speed, u = ((t + p.phase * 3) % period) / period;
      const k = u < 0.5 ? u * 2 : 2 - u * 2, dir = u < 0.5 ? 1 : -1;
      p.g.position.set(a[0] + (b[0] - a[0]) * k, Math.abs(Math.sin(t * 6 + p.phase)) * 0.04, a[1] + (b[1] - a[1]) * k);
      p.g.rotation.y = Math.atan2(-(b[1] - a[1]) * dir, (b[0] - a[0]) * dir);
    });
  }

  /* ---------- 루프 ---------- */
  let last = performance.now(), t0 = last, rollerPhase = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!visible) return;
    if (frame.drawn && card.classList.contains("slide") && !card.classList.contains("is-active")) return;   // 옆에 살짝 보이는 카드는 멈춘 장면
    frame.drawn = true;
    const t = (now - t0) / 1000;
    if (!reduce) {
      robotStep(dt); beltStep(dt); agvStep(dt); transferStep(dt); peopleStep(t); forkStep(t);
      rollerPhase += dt * BELT_V / 0.05;
      for (let i = 0; i < rollers.count; i++) { dummy.position.set(CX0 + 0.15 + i * 0.3, CY - 0.07, 0); dummy.rotation.set(Math.PI / 2, -rollerPhase, 0); dummy.scale.setScalar(1); dummy.updateMatrix(); rollers.setMatrixAt(i, dummy.matrix); }
      rollers.instanceMatrix.needsUpdate = true;
      lampG.material.emissiveIntensity = 1.2 + Math.sin(t * 2) * 0.4;
      screen.material.emissiveIntensity = 0.8 + Math.sin(t * 0.7) * 0.1;
      cur.x += (target.x - cur.x) * 0.04; cur.y += (target.y - cur.y) * 0.04;
    } else if (!frame.once) { ik(HOME); frame.once = true; }
    camera.position.set(-6 + cur.x * 3, 33 - cur.y * 2, 38);
    camera.lookAt(look);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
  host.classList.add("is-ready");
}

})();
