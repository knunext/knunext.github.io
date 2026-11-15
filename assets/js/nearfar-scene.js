/*
 * Research 카드 3D 배경: Near × Far — CXL 기반 Multi-GPU Near-Far 메모리 (밝은 스튜디오)
 * - 앞: 서버 보드 위 GPU 모듈 2개(HBM = Near), CXL 스위치, CXL 메모리(E3.S 모듈 · DIMM 확장 카드 = Far)
 * - 뒤: 가속 대상인 트랜스포머 모델 — 층(layer)들이 겹겹이 늘어서고, 맨 앞 층에서 행렬 × 벡터 곱이 진행됨
 *       (위 제목은 LLM → VLM → VLA 로 바뀜, 옆에 가속 대상 모델 로고 — data/research.js 의 sceneLogos)
 * - CXL 스위치는 컨트롤러 칩 모양, 이름은 뚜껑에 각인. 나머지 설명은 HTML 캡션(scene-kit captions)
 * - 층의 KV 캐시가 스위치를 거쳐 GPU HBM(Near, 파랑)과 CXL 메모리(Far, 주황)로 오감
 */
(function () {
const THREE = window.THREE, K = window.NCSL3D;
if (!THREE || !K) return;

document.querySelectorAll('[data-scene="nearfar3d"]').forEach((host) => (window.NCSL3D ? window.NCSL3D.lazy(host, init) : init(host)));   // 카드가 앞에 올 때 만듦

function init(host) {
  const ctx = K.setup(host, { fov: 30, exposure: 1.0 }), { scene, camera, run } = ctx;
  K.lightStudio(ctx, host, { shadow: 13, keyPos: [-7, 15, 10] });

  const M = (color, rough = 0.5, metal = 0, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: rough, metalness: metal }, extra));
  const B = (w, h, d) => new THREE.BoxGeometry(w, h, d);
  const add = (geo, mat, x, y, z, parent) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); (parent || scene).add(m); return m; };
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  /* ---------- 서버 보드: 짙은 초록 PCB + 금색 배선 ---------- */
  const boardTex = K.canvasTex(1400, 800, (x, w, h) => {
    x.fillStyle = "#1c4a35"; x.fillRect(0, 0, w, h);
    x.strokeStyle = "rgba(205,170,95,0.32)"; x.lineWidth = 3;
    for (let i = 0; i < 80; i++) { const y = 20 + Math.random() * (h - 40), x0 = Math.random() * w * 0.6; x.beginPath(); x.moveTo(x0, y); x.lineTo(x0 + 180 + Math.random() * 380, y); x.lineTo(x0 + 240 + Math.random() * 380, y + (Math.random() - 0.5) * 120); x.stroke(); }
    x.fillStyle = "rgba(225,195,120,0.55)"; for (let i = 0; i < 180; i++) x.fillRect(Math.random() * w, Math.random() * h, 6, 3);
  });
  const pcbSide = M(0x16382a, 0.6);
  add(B(15, 0.16, 8), [pcbSide, pcbSide, new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.6, metalness: 0.15 }), pcbSide, pcbSide, pcbSide], 0.5, 0.08, 0);

  /* ---------- GPU 모듈 2개 (Near: 다이 옆 HBM) ---------- */
  const comps = M(0x26292d, 0.4, 0.4), gold = M(0xd2ac62, 0.3, 1), silver = M(0xdfe3e8, 0.18, 1);
  const gpus = [];
  [[-3.6, -1.6], [-3.6, 1.7]].forEach(([gx, gz]) => {
    const g = new THREE.Group(); g.position.set(gx, 0.16, gz); scene.add(g);
    add(B(4.2, 0.1, 2.6), M(0x1b1d20, 0.6, 0.2), 0, 0.05, 0, g);
    [-1, 1].forEach((s) => add(B(1.8, 0.04, 0.42), gold, 0, 0.12, s * 1.05, g));
    [-1, 1].forEach((s) => add(B(0.42, 0.04, 1.2), gold, s * 1.65, 0.12, 0.2, g));
    add(B(1.7, 0.08, 1.5), M(0x24574f, 0.5, 0.2), 0, 0.14, 0, g);
    add(B(1.0, 0.09, 1.0), silver, 0, 0.22, 0, g);
    const hbm = [];
    [[-0.66, -0.4], [-0.66, 0], [-0.66, 0.4], [0.66, -0.4], [0.66, 0], [0.66, 0.4]].forEach(([x0, z0]) => hbm.push(add(B(0.26, 0.1, 0.34), M(0x3b3f45, 0.3, 0.6, { emissive: 0x1f6fff, emissiveIntensity: 0 }), x0, 0.23, z0, g)));
    for (let i = 0; i < 40; i++) add(B(0.08 + Math.random() * 0.1, 0.05, 0.06 + Math.random() * 0.08), comps, -2 + Math.random() * 4, 0.13, (Math.random() < 0.5 ? -1 : 1) * (0.75 + Math.random() * 0.45), g);
    [[-1.8, -1.05], [-1.4, -1.05], [1.4, -1.05], [1.8, -1.05], [-1.8, 1.05], [-1.4, 1.05], [1.4, 1.05], [1.8, 1.05]].forEach(([x0, z0]) => add(new THREE.CylinderGeometry(0.13, 0.13, 0.04, 20), M(0xc8925e, 0.4, 0.8), x0, 0.12, z0, g));
    gpus.push({ g, hbm });
  });

  /* ---------- CXL 스위치: 컨트롤러 칩 (기판 + 니켈 도금 뚜껑, 이름은 레이저 각인) ---------- */
  const sw = new THREE.Group(); sw.position.set(0.6, 0.16, 0); scene.add(sw);
  add(B(2.3, 0.08, 2.3), M(0x1f3d33, 0.55, 0.1), 0, 0.04, 0, sw);                                    // 패키지 기판
  for (let i = 0; i < 28; i++) { const a = i / 28, side = Math.floor(a * 4), u = (a * 4) % 1 - 0.5;     // 기판 가장자리 칩 커패시터
    const px = [u * 2.0, 1.06, -u * 2.0, -1.06][side], pz = [-1.06, u * 2.0, 1.06, -u * 2.0][side];
    add(B(0.07, 0.05, 0.04), M(0xb08a5a, 0.4, 0.6), px, 0.1, pz, sw); }
  const swLidTex = K.canvasTex(1024, 1024, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, "#e3e6ea"); g.addColorStop(0.5, "#c9ced4"); g.addColorStop(1, "#dde1e5"); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.globalAlpha = 0.06; for (let i = 0; i < 900; i++) { x.fillStyle = Math.random() < 0.5 ? "#000" : "#fff"; x.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 60, 1); } x.globalAlpha = 1;   // 헤어라인
    x.fillStyle = "#3f454c"; x.textAlign = "center"; x.textBaseline = "alphabetic";
    x.font = "800 330px 'Inter Tight', Arial, sans-serif"; x.fillText("CXL", w / 2, h * 0.5);
    x.font = "800 190px 'Inter Tight', Arial, sans-serif"; x.fillText("SWITCH", w / 2, h * 0.73);
    x.font = "600 54px 'Inter Tight', Arial, sans-serif"; x.fillText("CXL 3.x · PCIe 6.0 · 16 ports", w / 2, h * 0.86);
    x.beginPath(); x.arc(110, 110, 26, 0, 7); x.fill();                                                  // 1번 핀 표시
  });
  const lidSide = M(0xb9bec5, 0.3, 0.9);
  add(B(1.9, 0.12, 1.9), [lidSide, lidSide, new THREE.MeshStandardMaterial({ map: swLidTex, roughness: 0.32, metalness: 0.75 }), lidSide, lidSide, lidSide], 0, 0.14, 0, sw);

  /* ---------- CXL 메모리 (Far): E3.S 모듈 3개 + DIMM 확장 카드 ---------- */
  const e3Tex = K.canvasTex(512, 640, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, "#2a2d33"); g.addColorStop(1, "#121418"); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = "#eef1f4"; x.font = "700 46px 'Inter Tight', Arial, sans-serif"; x.textAlign = "center"; x.fillText("CXL", w / 2, h / 2 - 20);
    x.font = "500 30px 'Inter Tight', Arial, sans-serif"; x.fillText("Memory Module", w / 2, h / 2 + 24); x.fillText("DRAM", w / 2, h / 2 + 62);
    x.fillStyle = "#6b7179"; [[30, 30], [w - 30, 30], [30, h - 30], [w - 30, h - 30]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 9, 0, 7); x.fill(); });
  });
  const e3 = [], e3Side = M(0x2c3036, 0.3, 0.7);
  [4.0, 5.3, 6.6].forEach((x0) => {
    add(B(1.1, 0.22, 1.5), [e3Side, e3Side, new THREE.MeshStandardMaterial({ map: e3Tex, roughness: 0.35, metalness: 0.5 }), e3Side, e3Side, e3Side], x0, 0.27, -2.6);
    e3.push(add(B(0.06, 0.04, 0.04), new THREE.MeshBasicMaterial({ color: 0x14c46a }), x0 + 0.45, 0.39, -1.9));
  });
  const aic = new THREE.Group(); aic.position.set(5.3, 0.16, 1.4); scene.add(aic);
  add(B(3.4, 0.06, 2.2), M(0x1f7a3f, 0.5, 0.1), 0, 0.03, 0, aic);
  for (let i = 0; i < 4; i++) {
    add(B(3.0, 0.12, 0.12), M(0x16181a, 0.6), 0, 0.1, -0.85 + i * 0.32, aic);
    add(B(2.8, 0.5, 0.04), M(0x2a8a4a, 0.5, 0.1), 0, 0.4, -0.85 + i * 0.32, aic);
    for (let c = 0; c < 8; c++) add(B(0.24, 0.2, 0.02), M(0x17191c, 0.4, 0.3), -1.15 + c * 0.33, 0.42, -0.85 + i * 0.32 + 0.03, aic);
  }
  for (let i = 0; i < 10; i++) add(B(1.2, 0.36, 0.04), silver, 0.6, 0.2, 0.4 + i * 0.07, aic);
  const aicLed = add(B(0.08, 0.05, 0.05), new THREE.MeshBasicMaterial({ color: 0x14c46a }), -1.6, 0.1, 1.0, aic);

  /* ---------- 링크 ---------- */
  const links = [];
  const link = (a, b, lift) => {
    const mid = a.clone().lerp(b, 0.5); mid.y += lift;
    const c = new THREE.QuadraticBezierCurve3(a, mid, b);
    const m = new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.028, 6, false), new THREE.MeshBasicMaterial({ color: 0x1f6fff, transparent: true, opacity: 0.4 })); scene.add(m);
    links.push({ c, m }); return links.length - 1;
  };
  const L_G = [link(V(-1.8, 0.36, -1.6), V(-0.25, 0.3, -0.4), 0.6), link(V(-1.8, 0.36, 1.7), V(-0.25, 0.3, 0.4), 0.6)];
  const L_E = [link(V(1.45, 0.3, -0.5), V(4.0, 0.41, -2.2), 0.9), link(V(1.45, 0.3, -0.3), V(5.3, 0.41, -2.2), 1.1), link(V(1.45, 0.3, -0.1), V(6.6, 0.41, -2.2), 1.3)];
  link(V(1.45, 0.3, 0.4), V(4.0, 0.61, 1.4), 0.9);

  /* ---------- 트랜스포머 층 (3Blue1Brown 시각화처럼): 층 판들이 겹겹이, 맨 앞 판에서 행렬 × 벡터 ---------- */
  const layers = new THREE.Group(); layers.position.set(3.2, 0.16, -5.4); layers.rotation.y = 0.72; layers.scale.setScalar(1.45); scene.add(layers);   // 층 축(+x)이 오른쪽 뒤로
  const NL = 8;
  for (let k = 0; k < NL; k++) {
    const shade = 0.42 + k * 0.05, col = new THREE.Color(shade, shade, shade * 1.02);
    add(B(0.22, 2.7, 3.7), M(col.getHex(), 0.55, 0.1), 0.45 + k * 0.5, 1.5, 0, layers);
  }
  // 앞 판: 3×3 행렬 블록 (숫자는 빨강/파랑, 계산 중인 행과 벡터는 노랑)
  const mc = document.createElement("canvas"); mc.width = 1536; mc.height = 1080; const mx = mc.getContext("2d");
  const mtex = new THREE.CanvasTexture(mc); mtex.colorSpace = THREE.SRGBColorSpace; mtex.anisotropy = 8;
  const vals = Array.from({ length: 9 }, () => Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => (Math.random() * 20 - 10))));
  function drawMatrix(step) {
    mx.fillStyle = "#1b1c1f"; mx.fillRect(0, 0, mc.width, mc.height);
    const cw = mc.width / 3, chh = mc.height / 3;
    for (let b = 0; b < 9; b++) {
      const ox = (b % 3) * cw, oy = Math.floor(b / 3) * chh, hr = (step + b) % 8;
      mx.strokeStyle = "#5a5d63"; mx.lineWidth = 4; mx.strokeRect(ox + 4, oy + 4, cw - 8, chh - 8);
      mx.font = "500 15px 'Inter Tight', Arial, sans-serif";
      for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
        const v = vals[b][r][c], X = ox + 34 + c * 30, Y = oy + 46 + r * 30;
        mx.fillStyle = r === hr ? "#f2d14b" : v >= 0 ? "#7fb3ff" : "#ff7f7f"; mx.globalAlpha = r === hr ? 1 : 0.8;
        mx.fillText((v >= 0 ? "+" : "") + v.toFixed(1), X, Y);
      }
      mx.globalAlpha = 1;
      mx.strokeStyle = "#f2d14b"; mx.lineWidth = 2.5; mx.strokeRect(ox + 28, oy + 46 + hr * 30 - 20, 9 * 30, 26);         // 계산 중인 행
      mx.strokeRect(ox + 312, oy + 26, 40, 9 * 30 + 6);                                                                 // 입력 벡터
      mx.fillStyle = "#e8e9eb"; mx.font = "600 22px 'Inter Tight', Arial"; mx.fillText("=", ox + 368, oy + 180);
      mx.font = "500 15px 'Inter Tight', Arial";
      for (let r = 0; r <= hr && r < 8; r++) { mx.fillStyle = "#e8e9eb"; mx.fillText((vals[b][r][9] * 9).toFixed(1), ox + 398, oy + 46 + r * 30); }   // 결과가 한 줄씩 채워짐
      mx.strokeStyle = "#e8e9eb"; mx.lineWidth = 2; mx.beginPath(); mx.moveTo(ox + 392, oy + 26); mx.lineTo(ox + 386, oy + 26); mx.lineTo(ox + 386, oy + 296); mx.lineTo(ox + 392, oy + 296); mx.stroke();
    }
    mtex.needsUpdate = true;
  }
  drawMatrix(0);
  const panel = add(B(3.7, 2.6, 0.08), [M(0x6a6d72), M(0x6a6d72), M(0x6a6d72), M(0x6a6d72), new THREE.MeshBasicMaterial({ map: mtex }), M(0x6a6d72)], 0, 1.5, 0, layers);
  panel.rotation.y = -Math.PI / 2;                       // 숫자 면이 카메라 쪽(층 축의 앞)
  // 제목 (LLM / VLM / VLA) + 설명, 옆에 모델 로고: HTML 캡션
  const caps = K.captions(ctx);
  const titleAt = new THREE.Object3D(); titleAt.position.set(0, 2.95, 0); layers.add(titleAt);
  const title = caps.add("LLM<small>Transformer layers: MatMul + KV cache</small>", titleAt, { place: "above", cls: "cap-title" });
  const logos = host.parentElement.querySelector(".scene-logos");
  if (logos) { const wrap = document.createElement("div"), at = new THREE.Object3D(); at.position.set(2.6 + NL * 0.5, 1.95, 0); layers.add(at); wrap.appendChild(logos); caps.attach(wrap, at, { place: "right" }); }

  /* ---------- KV 캐시 블록 ---------- */
  const KVN = 14, kv = new THREE.InstancedMesh(B(0.16, 0.16, 0.16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }), KVN); scene.add(kv);
  const nearC = new THREE.Color(0x1f6fff), farC = new THREE.Color(0xf08a2c);
  for (let i = 0; i < KVN; i++) kv.setColorAt(i, i % 2 === 0 ? nearC : farC);

  /* ---------- 캡션 (CXL 스위치는 뚜껑 각인으로 대신함) ---------- */
  caps.add("Near memory<small>GPU + HBM</small>", V(-3.6, 0.5, -2.9), { color: "#1f6fff" });
  caps.add("Far memory<small>CXL memory modules</small>", V(7.0, 0.3, -1.7), { color: "#e07a1f", place: "right" });
  caps.add("Far memory<small>CXL DIMM expander</small>", V(7.0, 0.6, 1.4), { color: "#e07a1f", place: "right" });
  K.shadows(scene);

  /* ---------- 움직임 ---------- */
  const tmp = new THREE.Object3D(), swTop = V(0.6, 0.5, 0);
  const kvAt = new THREE.Vector3(); panel.getWorldPosition(kvAt); kvAt.y -= 0.6;
  const MODES = ["LLM", "VLM", "VLA"];
  const arc = (a, b, u, hgt) => a.clone().lerp(b, u).add(V(0, Math.sin(u * Math.PI) * hgt, 0));
  let lastStep = -1;
  run((dt, t, cur) => {
    const mode = MODES[Math.floor(t / 6) % 3];
    if (mode !== title.mode) { title.mode = mode; title.box.firstChild.nodeValue = mode; }
    const step = Math.floor(t * 2.2) % 8;
    if (step !== lastStep) { drawMatrix(step); lastStep = step; }
    for (let i = 0; i < KVN; i++) {
      const u = (i / KVN + t * 0.15) % 1;
      let p;
      if (i % 2 === 0) { const c = links[L_G[(i / 2) % 2]].c; p = u < 0.55 ? arc(kvAt, swTop, u / 0.55, 1.0) : c.getPoint(1 - (u - 0.55) / 0.45); }
      else { const c = links[L_E[i % 3]].c; p = u < 0.45 ? arc(kvAt, swTop, u / 0.45, 1.0) : c.getPoint((u - 0.45) / 0.55); }
      tmp.position.copy(p); tmp.rotation.set(t * 1.3, t, 0); tmp.scale.setScalar(u > 0.94 ? (1 - u) / 0.06 : u < 0.04 ? u / 0.04 : 1); tmp.updateMatrix(); kv.setMatrixAt(i, tmp.matrix);
    }
    kv.instanceMatrix.needsUpdate = true;
    links.forEach((l, k) => (l.m.material.opacity = 0.3 + 0.4 * Math.max(0, Math.sin(t * 2 + k))));
    gpus.forEach((g, gi) => g.hbm.forEach((h, k) => (h.material.emissiveIntensity = 0.9 * Math.max(0, Math.sin(t * 3 + k * 0.7 + gi)))));
    e3.forEach((e, k) => e.material.color.setHex(Math.sin(t * 6 + k * 2) > 0 ? 0x14c46a : 0x0b3a22));
    aicLed.material.color.setHex(Math.sin(t * 5) > 0 ? 0x14c46a : 0x0b3a22);
    camera.position.set(2.4 + cur.x * 1.6, 8.4 - cur.y * 0.8, 15.5);
    camera.lookAt(2.2, 2.0, -1.6);
  });
}
})();
