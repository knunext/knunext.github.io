/*
 * Research 카드 3D 배경: Hetero × HPC — xPU 와 다중 계층 메모리 기반 이종 컴퓨팅 (밝은 스튜디오)
 * - 보드 위 칩렛: CPU · GPU · NPU · DPU · NDPU(메모리 위 연산), 옆 받침대에 QPU(극저온 냉각기 모양)
 * - 칩렛 사이를 잇는 온칩 네트워크(NoC) 메시: 라우터와 링크, 그 위를 XY 경로로 오가는 패킷
 * - 다중 계층 메모리: HBM(Near) · DDR · CXL 풀드 메모리(Far, 뒤쪽 섀시와 케이블)
 * - xPU 가 차례로 켜지며 일을 받음 (색: 연산 칩은 푸른 계열, 메모리는 앰버 한 가지, 링크는 파랑)
 * - 설명 글자는 HTML 캡션(scene-kit captions), 칩 이름은 뚜껑에 각인
 */
(function () {
const THREE = window.THREE, K = window.NCSL3D;
if (!THREE || !K) return;

document.querySelectorAll('[data-scene="hetero3d"]').forEach((host) => (window.NCSL3D ? window.NCSL3D.lazy(host, init) : init(host)));   // 카드가 앞에 올 때 만듦

function init(host) {
  const ctx = K.setup(host, { fov: 30, exposure: 1.0 }), { scene, camera, run } = ctx;
  K.lightStudio(ctx, host, { shadow: 13 });
  const M = (color, rough = 0.5, metal = 0, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: rough, metalness: metal }, extra));
  const B = (w, h, d) => new THREE.BoxGeometry(w, h, d);
  const add = (geo, mat, x, y, z, parent) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); (parent || scene).add(m); return m; };
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  /* ---------- 보드 (패키지 기판) ---------- */
  const subTex = K.canvasTex(1200, 720, (x, w, h) => {
    x.fillStyle = "#2f3540"; x.fillRect(0, 0, w, h);
    x.strokeStyle = "rgba(200,170,110,0.28)"; x.lineWidth = 2;
    for (let i = 0; i < 60; i++) { const y = Math.random() * h, a = Math.random() * w; x.beginPath(); x.moveTo(a, y); x.lineTo(a + 120 + Math.random() * 260, y); x.stroke(); }
  });
  const side = M(0x272c35, 0.5, 0.2);
  add(B(11, 0.24, 6.6), [side, side, new THREE.MeshStandardMaterial({ map: subTex, roughness: 0.5, metalness: 0.2 }), side, side, side], 0, 0.12, 0);
  add(B(10.2, 0.08, 5.8), M(0xc4cad1, 0.35, 0.45), 0, 0.28, 0);                                      // 실리콘 인터포저

  /* ---------- 칩렛 ---------- */
  const lidTex = (name, c1, c2, ink) => K.canvasTex(512, 512, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, c1); g.addColorStop(1, c2); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.strokeStyle = "rgba(0,0,0,0.12)"; x.lineWidth = 2; for (let i = 1; i < 8; i++) { x.beginPath(); x.moveTo(i * 64, 24); x.lineTo(i * 64, h - 24); x.stroke(); x.beginPath(); x.moveTo(24, i * 64); x.lineTo(w - 24, i * 64); x.stroke(); }
    x.fillStyle = ink; x.font = "700 92px 'Inter Tight', Arial, sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(name, w / 2, h / 2);
  });
  const chip = (name, x0, z0, w, d, h, c1, c2, ink, sideCol) => {
    const sm = M(sideCol, 0.4, 0.4);
    const m = add(B(w, h, d), [sm, sm, new THREE.MeshStandardMaterial({ map: lidTex(name, c1, c2, ink), roughness: 0.3, metalness: 0.6, emissive: 0x1f6fff, emissiveIntensity: 0 }), sm, sm, sm], x0, 0.32 + h / 2, z0);
    m.userData.top = m.material[2]; return m;
  };
  const chips = {
    CPU: chip("CPU", -3.2, -1.35, 2.2, 2.0, 0.34, "#6f88a8", "#4c6584", "#f2f6fb", 0x46607e),
    GPU: chip("GPU", 0, -1.35, 2.2, 2.0, 0.34, "#46505f", "#2c333e", "#eef1f5", 0x2a313b),
    NPU: chip("NPU", 3.2, -1.35, 2.2, 2.0, 0.34, "#4e64a6", "#344985", "#eef2ff", 0x33467e),
    DPU: chip("DPU", -3.2, 1.35, 2.2, 2.0, 0.34, "#3f8a92", "#2a6870", "#effcfd", 0x2a656c),
  };
  // NDPU: HBM 스택 위 연산 (주황 DRAM 층 + 보라 로직 다이)
  const ndpu = new THREE.Group(); ndpu.position.set(0, 0.32, 1.35); scene.add(ndpu);
  const dramM = M(0xd49a4c, 0.42, 0.2), logicM = M(0x3a4352, 0.4, 0.3);
  add(B(1.6, 0.14, 1.6), logicM, 0, 0.07, 0, ndpu);
  for (let l = 0; l < 8; l++) add(B(1.6, 0.09, 1.6), l % 2 ? dramM : M(0xc88b3c, 0.42, 0.2), 0, 0.2 + l * 0.11, 0, ndpu);
  const ndpuLight = add(B(1.62, 0.04, 0.02), new THREE.MeshBasicMaterial({ color: 0x1462ff, transparent: true, opacity: 0.2 }), 0, 0.5, 0.81, ndpu);
  // HBM (Near): GPU·NPU 옆
  const hbms = [];
  [[1.45, -2.0], [1.45, -0.7], [4.65, -2.0], [4.65, -0.7], [-1.45, -2.0], [-1.45, -0.7]].forEach(([x0, z0]) => {
    const g = new THREE.Group(); g.position.set(x0, 0.32, z0); scene.add(g);
    add(B(0.55, 0.08, 0.9), logicM, 0, 0.04, 0, g);
    for (let l = 0; l < 6; l++) add(B(0.55, 0.07, 0.9), l % 2 ? dramM : M(0xc88b3c, 0.42, 0.2), 0, 0.13 + l * 0.08, 0, g);
    hbms.push(g);
  });
  // DDR DIMM 줄 (보드 오른쪽 앞)
  const ddr = new THREE.Group(); ddr.position.set(3.2, 0.32, 1.35); scene.add(ddr);
  for (let i = 0; i < 6; i++) {
    add(B(2.0, 0.08, 0.1), M(0x16181a, 0.6), 0, 0.04, -0.75 + i * 0.3, ddr);
    add(B(1.9, 0.55, 0.035), M(0x2f5f5a, 0.5, 0.1), 0, 0.36, -0.75 + i * 0.3, ddr);
    add(B(1.9, 0.05, 0.04), M(0xc9a65a, 0.3, 0.9), 0, 0.11, -0.75 + i * 0.3, ddr);                     // 금 접점
    for (let c = 0; c < 6; c++) add(B(0.22, 0.2, 0.02), M(0x1d2128, 0.4, 0.3), -0.75 + c * 0.3, 0.38, -0.75 + i * 0.3 + 0.03, ddr);
  }

  /* ---------- NoC 메시: 라우터 4×3 + 링크 ---------- */
  const RX = [-4.8, -1.6, 1.6, 4.8], RZ = [-2.6, 0, 2.6], RY = 0.4;
  const routerMat = M(0xe2e6ea, 0.25, 0.85);
  RX.forEach((x0) => RZ.forEach((z0) => add(B(0.26, 0.16, 0.26), routerMat, x0, RY, z0)));
  const linkMat = new THREE.MeshBasicMaterial({ color: 0x2f6fe0, transparent: true, opacity: 0.5 });
  RZ.forEach((z0) => add(B(RX[3] - RX[0], 0.035, 0.05), linkMat, 0, RY, z0));
  RX.forEach((x0) => add(B(0.05, 0.035, RZ[2] - RZ[0]), linkMat, x0, RY, 0));
  // 칩렛 ↔ 가장 가까운 라우터
  const node = { CPU: [0, 0], GPU: [1, 0], NPU: [2, 0], DPU: [0, 1], NDPU: [1, 1], DDR: [3, 1], CXL: [1, 0] };

  /* ---------- QPU (극저온 냉각기 샹들리에) ---------- */
  const qpu = new THREE.Group(); qpu.position.set(7.6, 0, -1.4); scene.add(qpu);
  add(B(1.6, 0.3, 1.6), M(0xd9dde2, 0.4, 0.3), 0, 0.15, 0, qpu);
  const goldM = M(0xc9a560, 0.28, 1);
  [[1.0, 2.9], [0.85, 2.35], [0.7, 1.85], [0.55, 1.4], [0.4, 1.0]].forEach(([r, y]) => add(new THREE.CylinderGeometry(r, r, 0.06, 40), goldM, 0, y, 0, qpu));
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; add(new THREE.CylinderGeometry(0.02, 0.02, 1.95, 8), goldM, Math.cos(a) * 0.38, 1.95, Math.sin(a) * 0.38, qpu); }
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; const c = add(new THREE.CylinderGeometry(0.012, 0.012, 1.6, 6), M(0xb7c0c9, 0.3, 0.9), Math.cos(a) * 0.62, 2.1, Math.sin(a) * 0.62, qpu); }
  add(new THREE.CylinderGeometry(0.06, 0.06, 2.6, 10), goldM, 0, 1.6, 0, qpu);
  const qChip = add(B(0.22, 0.06, 0.22), M(0x2b2f36, 0.3, 0.5, { emissive: 0x2f6fe0, emissiveIntensity: 0.5 }), 0, 0.95, 0, qpu);


  /* ---------- CXL 풀드 메모리 (Far): 뒤쪽 섀시 + 케이블 ---------- */
  const pool = new THREE.Group(); pool.position.set(-0.8, 0, -5.4); scene.add(pool);
  add(B(6.2, 1.1, 1.5), M(0x343b46, 0.35, 0.6), 0, 0.55, 0, pool);
  const bays = [];
  for (let i = 0; i < 12; i++) {
    add(B(0.42, 0.75, 0.04), M(0x1a1d21, 0.4, 0.4), -2.75 + i * 0.5, 0.58, 0.76, pool);
    bays.push(add(B(0.06, 0.04, 0.02), new THREE.MeshBasicMaterial({ color: 0x14c46a }), -2.75 + i * 0.5, 0.9, 0.79, pool));
  }

  const cables = [];
  [-2, 0, 2].forEach((x0, k) => {
    const c = new THREE.CubicBezierCurve3(V(x0 - 0.8, 0.7, -4.6), V(x0 - 0.8, 0.9, -3.8), V(-1.6 + k * 1.6, 0.6, -3.6), V(-1.6 + k * 1.6, RY, -2.6));
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(c, 30, 0.05, 8, false), M(0x2a2d31, 0.6))); cables.push(c);
  });

  /* ---------- 캡션 ---------- */
  const caps = K.captions(ctx);
  caps.add("CXL pooled memory<small>Far</small>", V(2.6, 1.1, -5.4), { color: "#d08a3a", place: "right" });
  caps.add("HBM<small>Near</small>", V(5.0, 0.75, -0.7), { color: "#d08a3a", place: "right" });
  caps.add("NDPU<small>near-data processing</small>", V(0, 0.34, 2.2), { color: "#d08a3a", place: "below" });
  caps.add("DDR", V(4.3, 0.95, 2.4), { color: "#2f5f5a", place: "right" });
  caps.add("NoC mesh", V(-5.0, 0.45, 0), { color: "#2f6fe0", place: "left" });
  caps.add("QPU", V(7.6, 3.05, -1.4), { color: "#9a7a3a" });
  K.shadows(scene);

  /* ---------- 움직이는 것: 패킷(NoC), 작업 전달(그래프 → xPU), 메모리 접근 ---------- */
  const NP = 16, pk = new THREE.InstancedMesh(B(0.16, 0.16, 0.16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }), NP); scene.add(pk);
  const pcol = [0x2f6fe0, 0xd49a4c, 0x3f8a92, 0x5a6fc0].map((c) => new THREE.Color(c));
  const ends = ["CPU", "GPU", "NPU", "DPU", "NDPU", "DDR", "CXL"];
  const route = (a, b) => {                                   // XY 라우팅: x 먼저, 그다음 z
    const [ax, az] = node[a], [bx, bz] = node[b], pts = [V(RX[ax], RY + 0.14, RZ[az])];
    pts.push(V(RX[bx], RY + 0.14, RZ[az])); pts.push(V(RX[bx], RY + 0.14, RZ[bz])); return pts;
  };
  const flows = Array.from({ length: NP }, (_, i) => { const a = ends[i % ends.length], b = ends[(i * 3 + 2) % ends.length]; return { pts: route(a, b === a ? "CXL" : b), ph: i / NP }; });
  for (let i = 0; i < NP; i++) pk.setColorAt(i, pcol[i % 4]);
  const along = (pts, u) => {
    const L = []; let tot = 0; for (let k = 0; k < pts.length - 1; k++) { const d = pts[k].distanceTo(pts[k + 1]); L.push(d); tot += d; }
    let s = u * tot; for (let k = 0; k < L.length; k++) { if (s <= L[k] || k === L.length - 1) return pts[k].clone().lerp(pts[k + 1], L[k] ? Math.min(1, s / L[k]) : 0); s -= L[k]; }
  };
  const order = ["CPU", "GPU", "NPU", "DPU", "NDPU", "QPU"];
  const CXLP = 12, cp = new THREE.InstancedMesh(B(0.14, 0.14, 0.14), new THREE.MeshStandardMaterial({ color: 0xd49a4c, roughness: 0.4 }), CXLP); scene.add(cp);
  const tmp = new THREE.Object3D();

  run((dt, t, cur) => {
    for (let i = 0; i < NP; i++) {
      const f = flows[i], u = (f.ph + t * 0.13) % 1, p = along(f.pts, u);
      tmp.position.copy(p); tmp.rotation.set(0, t, 0); tmp.scale.setScalar(u < 0.05 ? u / 0.05 : u > 0.95 ? (1 - u) / 0.05 : 1); tmp.updateMatrix(); pk.setMatrixAt(i, tmp.matrix);
    }
    pk.instanceMatrix.needsUpdate = true;
    // xPU 가 차례로 일을 받아 켜짐
    const cyc = (t * 0.5) % order.length, active = Math.floor(cyc), fu = cyc - active;
    Object.entries(chips).forEach(([k, m]) => (m.userData.top.emissiveIntensity = order[active] === k ? 0.35 * Math.sin(fu * Math.PI) : 0));
    ndpuLight.material.opacity = order[active] === "NDPU" ? 0.3 + 0.6 * Math.sin(fu * Math.PI) : 0.15;
    qChip.material.emissiveIntensity = order[active] === "QPU" ? 0.4 + 0.8 * Math.sin(fu * Math.PI) : 0.3;
    // CXL 케이블 위로 오가는 데이터 (Far 메모리)
    for (let i = 0; i < CXLP; i++) {
      const c = cables[i % 3], u = (i / CXLP + t * 0.18) % 1, back = i % 2 === 1;
      tmp.position.copy(c.getPoint(back ? 1 - u : u)); tmp.rotation.set(t, t, 0); tmp.scale.setScalar(1); tmp.updateMatrix(); cp.setMatrixAt(i, tmp.matrix);
    }
    cp.instanceMatrix.needsUpdate = true;
    bays.forEach((b, k) => b.material.color.setHex(Math.sin(t * 5 + k * 1.3) > 0.2 ? 0x14c46a : 0x0b3a22));
    camera.position.set(0.6 + cur.x * 1.6, 9.4 - cur.y * 0.8, 15);
    camera.lookAt(-0.4, 1.3, -1.2);
  });
}
})();
