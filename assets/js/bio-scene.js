/*
 * Research 카드 3D 배경: Bio × PIM
 * - 유전체 분석기(탁상형 NGS 시퀀서: 경사 터치스크린, 플로우셀 창, 상태 표시등, 윤곽선)가 읽어낸 염기 조각(read)이 흘러나와, 2.5D 패키지의 HBM-PIM 스택으로 들어감
 * - HBM 스택(12단 DRAM + 로직 다이)의 각 층 안에서 연산(PIM)이 차례로 켜지고, TSV 를 따라 데이터가 오르내림
 * - 결과는 인터포저를 건너 가속기 다이로 전달됨
 */
(function () {
const THREE = window.THREE, K = window.NCSL3D;
if (!THREE || !K) return;

document.querySelectorAll('[data-scene="bio3d"]').forEach((host) => (window.NCSL3D ? window.NCSL3D.lazy(host, init) : init(host)));   // 카드가 앞에 올 때 만듦

function init(host) {
  const ctx = K.setup(host, { fov: 30, exposure: 1.0 }), { renderer, scene, camera, run } = ctx;
  K.lightStudio(ctx, host, { shadow: 12 });

  const M = (color, rough = 0.5, metal = 0, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: rough, metalness: metal }, extra));
  const P = (color, extra = {}) => new THREE.MeshPhysicalMaterial(Object.assign({ color, roughness: 0.25, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.15 }, extra));
  const add = (geo, mat, x, y, z, parent) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); (parent || scene).add(m); return m; };
  const B = (w, h, d) => new THREE.BoxGeometry(w, h, d);

  // 바닥 (어두운 광택) + 패키지 아래 은은한 빛


  /* ---------- 2.5D 패키지 ---------- */
  const pkg = new THREE.Group(); pkg.position.set(1.6, 0, 0.4); scene.add(pkg);
  // 기판: 윗면에 배선 무늬
  const subTop = K.canvasTex(1024, 680, (x, w, h) => {
    x.fillStyle = "#3b4048"; x.fillRect(0, 0, w, h);
    x.strokeStyle = "rgba(214,176,98,0.85)"; x.lineWidth = 3;
    for (let i = 0; i < 26; i++) { const sx = 40 + i * 36, sy = h - 30; x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx, sy - 60 - (i % 5) * 18); x.lineTo(sx + 40 + (i % 3) * 20, sy - 120 - (i % 4) * 22); x.stroke(); x.beginPath(); x.arc(sx, sy, 6, 0, 7); x.fillStyle = "#e3c27a"; x.fill(); }
    x.strokeStyle = "rgba(20,22,26,0.7)"; x.lineWidth = 6; x.strokeRect(3, 3, w - 6, h - 6);
  });
  const subSide = M(0x2f343b, 0.5, 0.2);
  const subMat = [subSide, subSide, new THREE.MeshStandardMaterial({ map: subTop, roughness: 0.45, metalness: 0.2 }), subSide, subSide, subSide];
  add(B(6.4, 0.34, 4.2), subMat, 0, 0.62, 0, pkg);
  // BGA 솔더볼
  const balls = new THREE.InstancedMesh(new THREE.SphereGeometry(0.12, 16, 10), M(0xb9bec6, 0.25, 1), 15 * 9);
  const d0 = new THREE.Object3D(); let bi = 0;
  for (let i = 0; i < 15; i++) for (let j = 0; j < 9; j++) { d0.position.set(-2.95 + i * 0.42, 0.3, -1.75 + j * 0.44); d0.updateMatrix(); balls.setMatrixAt(bi++, d0.matrix); }
  pkg.add(balls);
  add(B(0.1, 0.18, 4.2), M(0x6b7ba6), 0, 0.36, 0, pkg).visible = false;
  // 인터포저
  add(B(5.0, 0.2, 3.3), M(0x2e7d77, 0.35, 0.3), 0, 0.89, 0, pkg);
  const bumps = new THREE.InstancedMesh(new THREE.SphereGeometry(0.035, 8, 6), M(0xd8dde6, 0.3, 1), 40 * 26);
  bi = 0; for (let i = 0; i < 40; i++) for (let j = 0; j < 26; j++) { d0.position.set(-2.35 + i * 0.12, 1.01, -1.5 + j * 0.12); d0.updateMatrix(); bumps.setMatrixAt(bi++, d0.matrix); }
  pkg.add(bumps);
  // 가속기 다이 (윗면 글자)
  const dieTop = K.canvasTex(512, 512, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, "#d9dde2"); g.addColorStop(1, "#aeb4bc"); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.strokeStyle = "rgba(90,96,106,0.25)"; x.lineWidth = 2; for (let i = 1; i < 8; i++) { x.beginPath(); x.moveTo(i * 64, 20); x.lineTo(i * 64, h - 20); x.stroke(); x.beginPath(); x.moveTo(20, i * 64); x.lineTo(w - 20, i * 64); x.stroke(); }
    x.fillStyle = "#2a2f36"; x.font = "700 64px 'Inter Tight', Arial, sans-serif"; x.textAlign = "center"; x.fillText("ACCEL", w / 2, h / 2 + 22);
  });
  const dieSide = M(0x2c3138, 0.4, 0.4);
  const dieMat = [dieSide, dieSide, new THREE.MeshStandardMaterial({ map: dieTop, roughness: 0.28, metalness: 0.85 }), dieSide, dieSide, dieSide];
  const die = add(B(2.1, 1.25, 2.4), dieMat, -1.2, 1.64, 0, pkg);
  // HBM-PIM 스택 2개: 12단 DRAM(구리색) + 로직 다이, 앞면에 TSV 줄과 PIM 연산 표시
  const copper = M(0xe8701a, 0.42, 0.15);
  const pimTiles = [], tsvDots = [];
  const stack = (z) => {
    const g = new THREE.Group(); g.position.set(1.35, 0, z); pkg.add(g);
    add(B(1.5, 0.14, 1.5), M(0x6a3fa0, 0.4, 0.2), 0, 1.08, 0, g);   // 로직 다이
    for (let l = 0; l < 12; l++) {
      const y = 1.2 + l * 0.11;
      add(B(1.5, 0.085, 1.5), copper, 0, y, 0, g);
      const tile = add(B(0.34, 0.06, 0.02), new THREE.MeshBasicMaterial({ color: 0x1462ff, transparent: true, opacity: 0.15 }), -0.42, y, 0.76, g);
      pimTiles.push({ m: tile, l });
    }
    [-0.05, 0.12, 0.29, 0.46].forEach((x0) => {
      add(new THREE.CylinderGeometry(0.02, 0.02, 1.36, 8), M(0xf3f5f8, 0.2, 1), x0, 1.75, 0.76, g);   // TSV
      const dot = add(new THREE.SphereGeometry(0.045, 10, 8), new THREE.MeshBasicMaterial({ color: 0x1462ff }), x0, 1.1, 0.77, g); tsvDots.push({ m: dot, x0, ph: Math.random() });
    });
    return g;
  };
  stack(0.8); stack(-0.85);

  /* ---------- 시퀀서: 탁상형 NGS 장비 (경사진 윗면 터치스크린, 앞 검은 유리 패널 속 플로우셀, 상태 표시등, 시약 서랍) ---------- */
  const seq = new THREE.Group(); seq.position.set(8.5, 0, -2.6); seq.rotation.y = -0.55; scene.add(seq);
  {
    // 옆모습(깊이 z, 높이 y)을 둥근 모서리로 그려 너비 방향으로 밀어낸 몸체
    const D = 1.2, HB = 2.35, HF = 1.45, ZS = 0.5, r = 0.14, sh = new THREE.Shape();
    sh.moveTo(-D + r, 0); sh.lineTo(D - r, 0); sh.quadraticCurveTo(D, 0, D, r); sh.lineTo(D, HF - r); sh.quadraticCurveTo(D, HF, D - r * 0.7, HF + r * 0.9);
    sh.lineTo(ZS + r * 0.6, HB - r * 0.8); sh.quadraticCurveTo(ZS, HB, ZS - r, HB); sh.lineTo(-D + r, HB); sh.quadraticCurveTo(-D, HB, -D, HB - r); sh.lineTo(-D, r); sh.quadraticCurveTo(-D, 0, -D + r, 0);
    const W = 2.8, geo = new THREE.ExtrudeGeometry(sh, { depth: W, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.07, bevelSegments: 5, curveSegments: 10 });
    geo.translate(0, 0, -W / 2); geo.rotateY(-Math.PI / 2);                                       // 앞면이 +z
    const shell = new THREE.MeshPhysicalMaterial({ color: 0xf3f4f6, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.4 });
    const body = new THREE.Mesh(geo, shell); body.position.y = 0.06; seq.add(body);
    // 윤곽: 몸체를 살짝 키운 뒷면 껍질로 가는 테두리 (밝은 배경과 구분)
    const outline = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x8a919b, side: THREE.BackSide })); outline.scale.setScalar(1.012); outline.position.set(0, 0.06 - 0.012 * HB / 2, 0); seq.add(outline);
    // 받침 발 + 바닥 접촉 그늘
    [[-1.25, -0.95], [1.25, -0.95], [-1.25, 0.95], [1.25, 0.95]].forEach(([x0, z0]) => add(new THREE.CylinderGeometry(0.09, 0.1, 0.06, 16), M(0x2a2d32, 0.6), x0, 0.03, z0, seq));
    const ao = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 3.4), new THREE.MeshBasicMaterial({ map: K.glowTex([[0, "rgba(40,46,56,0.5)"], [0.55, "rgba(40,46,56,0.22)"], [1, "rgba(40,46,56,0)"]]), transparent: true, depthWrite: false }));
    ao.rotation.x = -Math.PI / 2; ao.position.y = 0.004; seq.add(ao);
    // 앞 검은 유리 패널: 왼쪽 창 안에 플로우셀(유리판, 레인 8줄), 오른쪽에 표시등
    const fz = D + 0.07 + 0.012;
    const panelTex = K.canvasTex(1280, 520, (x, w, h) => {
      let g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#22262c"); g.addColorStop(1, "#0d0f12"); x.fillStyle = g; x.fillRect(0, 0, w, h);
      x.fillStyle = "rgba(255,255,255,0.05)"; x.beginPath(); x.moveTo(0, 0); x.lineTo(w * 0.55, 0); x.lineTo(w * 0.3, h); x.lineTo(0, h); x.fill();   // 유리 반사
      const wx = 90, wy = 80, ww = 640, wh = 340;                                                   // 플로우셀 창
      x.save(); x.beginPath(); x.roundRect(wx, wy, ww, wh, 26); x.clip();
      g = x.createRadialGradient(wx + ww / 2, wy + wh / 2, 20, wx + ww / 2, wy + wh / 2, ww * 0.7); g.addColorStop(0, "#2d6f9e"); g.addColorStop(1, "#0b1a28"); x.fillStyle = g; x.fillRect(wx, wy, ww, wh);
      x.fillStyle = "rgba(210,232,250,0.35)"; x.beginPath(); x.roundRect(wx + 70, wy + 95, ww - 140, wh - 190, 10); x.fill();   // 유리판
      x.strokeStyle = "rgba(235,245,255,0.8)"; x.lineWidth = 3; x.stroke();
      for (let i = 0; i < 8; i++) { const ly = wy + 112 + i * 14; g = x.createLinearGradient(wx + 90, 0, wx + ww - 90, 0); g.addColorStop(0, "#3ddc84"); g.addColorStop(0.35, "#4aa3ff"); g.addColorStop(0.7, "#ffd23f"); g.addColorStop(1, "#ff5a5f"); x.fillStyle = g; x.globalAlpha = 0.75; x.fillRect(wx + 100, ly, ww - 200, 6); }
      x.globalAlpha = 1; x.fillStyle = "#e8f2fb"; [[wx + 86, wy + 170], [wx + ww - 86, wy + 170]].forEach(([a, b2]) => { x.beginPath(); x.arc(a, b2, 9, 0, 7); x.fill(); });   // 주입·배출 구멍
      x.restore();
      x.strokeStyle = "#3a4048"; x.lineWidth = 6; x.beginPath(); x.roundRect(wx, wy, ww, wh, 26); x.stroke();
      [["#3ddc84", "RUN"], ["#4aa3ff", "DATA"], ["#6b7280", "ERR"]].forEach(([c, t], i) => { const cy = 150 + i * 90; x.fillStyle = c; x.beginPath(); x.arc(880, cy, 14, 0, 7); x.fill(); x.fillStyle = "#9aa3ad"; x.font = "600 34px 'Inter Tight', Arial, sans-serif"; x.fillText(t, 915, cy + 12); });
      x.fillStyle = "#c9ced5"; x.font = "700 40px 'Inter Tight', Arial, sans-serif"; x.fillText("NGS", 1110, 455);
    });
    const glass = new THREE.MeshPhysicalMaterial({ map: panelTex, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05, metalness: 0.1 });
    add(new THREE.PlaneGeometry(2.6, 1.06), glass, 0, 0.88, fz, seq);
    // 상태 표시등 띠 (패널 위)
    const lightBar = add(B(2.6, 0.035, 0.02), new THREE.MeshBasicMaterial({ color: 0x3fd8ff }), 0, 1.44, fz, seq);
    // 시약 서랍: 이음선 + 손잡이 홈
    add(B(2.62, 0.012, 0.01), M(0xb7bdc5, 0.5), 0, 0.33, fz - 0.003, seq);
    add(B(0.7, 0.05, 0.03), M(0x3a3f46, 0.5), 0, 0.22, fz - 0.005, seq);
    // 오른쪽 옆면 통풍구
    const vent = K.canvasTex(512, 512, (x, w, h) => { x.fillStyle = "#eceef1"; x.fillRect(0, 0, w, h); x.fillStyle = "#9aa1aa"; for (let i = 0; i < 14; i++) x.beginPath(), x.roundRect(90, 70 + i * 26, w - 180, 9, 4.5), x.fill(); });
    const vp = add(new THREE.PlaneGeometry(1.3, 1.3), new THREE.MeshStandardMaterial({ map: vent, roughness: 0.6, transparent: true }), W / 2 + 0.072, 1.0, -0.3, seq); vp.rotation.y = Math.PI / 2;
    // 경사진 윗면의 터치스크린
    const scr = K.canvasTex(900, 560, (x, w, h) => {
      x.fillStyle = "#0b1118"; x.fillRect(0, 0, w, h);
      x.fillStyle = "#e6eef6"; x.font = "700 34px 'Inter Tight', Arial, sans-serif"; x.fillText("Sequencing run", 34, 58);
      x.fillStyle = "#8fa3b6"; x.font = "500 24px 'Inter Tight', Arial, sans-serif"; x.fillText("Flow cell A   2 × 150 bp", 34, 96);
      x.fillStyle = "#1f2a36"; x.beginPath(); x.roundRect(34, 120, w - 68, 18, 9); x.fill(); x.fillStyle = "#3fd8ff"; x.beginPath(); x.roundRect(34, 120, (w - 68) * 0.62, 18, 9); x.fill();
      x.fillStyle = "#cfe0ef"; x.font = "600 24px 'Inter Tight', Arial, sans-serif"; x.fillText("Cycle 186 / 300", 34, 172);
      [["Q30", "92.4 %"], ["Clusters PF", "1.8 B"], ["Error rate", "0.21 %"]].forEach(([k, v], i) => { const X = 34 + i * 280; x.fillStyle = "#8fa3b6"; x.font = "500 22px 'Inter Tight', Arial, sans-serif"; x.fillText(k, X, 222); x.fillStyle = "#ffffff"; x.font = "700 38px 'Inter Tight', Arial, sans-serif"; x.fillText(v, X, 264); });
      const cols = ["#3ddc84", "#4aa3ff", "#ffd23f", "#ff5a5f"];
      for (let i = 0; i < 52; i++) { x.fillStyle = cols[i % 4]; const bh = 30 + Math.abs(Math.sin(i * 1.7)) * 150; x.fillRect(34 + i * 16, h - 70 - bh, 10, bh); }
      x.fillStyle = "#cfe8ff"; x.font = "600 24px ui-monospace, Menlo, Consolas, monospace"; x.fillText("ACGTTGCAAGTCCATGGA…", 34, h - 28);
    });
    const tilt = Math.atan2(HB - HF, D - ZS), sm = new THREE.Group(); sm.position.set(0.15, 0.06 + (HF + HB) / 2 + 0.02, (D + ZS) / 2 + 0.06); sm.rotation.x = -(Math.PI / 2 - tilt); seq.add(sm);
    add(B(1.75, 1.06, 0.03), M(0x0a0c10, 0.15, 0.2), 0, 0, 0.0, sm);
    add(new THREE.PlaneGeometry(1.65, 0.98), new THREE.MeshBasicMaterial({ map: scr, toneMapped: false }), 0, 0, 0.017, sm);
    seq.userData.out = new THREE.Vector3(-0.9, 2.2, 0.1);                                          // 데이터가 나가는 자리 (윗면 왼쪽)
    seq.userData.lightBar = lightBar;
  }

  /* ---------- 염기 조각 흐름 (시퀀서 → HBM 로직 다이) ---------- */
  seq.updateMatrixWorld(true); const out = seq.localToWorld(seq.userData.out.clone());
  const curve = new THREE.CatmullRomCurve3([out, V(out.x - 0.9, out.y + 0.55, out.z + 1.0), V(5.6, 2.6, 0.9), V(4.2, 1.5, 1.5), V(3.05, 1.12, 1.35)]);   // 시퀀서 → 앞쪽 HBM 스택 로직 다이
  function V(x, y, z) { return new THREE.Vector3(x, y, z); }
  const N = 70, reads = new THREE.InstancedMesh(B(0.2, 0.045, 0.045), new THREE.MeshBasicMaterial({ color: 0xffffff }), N);
  const baseCol = [0x3ddc84, 0x4aa3ff, 0xffd23f, 0xff5a5f].map((c) => new THREE.Color(c));
  for (let i = 0; i < N; i++) reads.setColorAt(i, baseCol[i % 4]);
  scene.add(reads);
  const offs = Array.from({ length: N }, (_, i) => ({ u: i / N, jy: (Math.random() - 0.5) * 0.25, jz: (Math.random() - 0.5) * 0.35 }));
  // 결과: HBM → 가속기 (인터포저 위)
  const M2 = 24, res = new THREE.InstancedMesh(new THREE.SphereGeometry(0.05, 8, 6), new THREE.MeshBasicMaterial({ color: 0x1462ff }), M2); scene.add(res);

  /* ---------- 라벨 ---------- */
  const L = (t, x, y, z) => { const s = K.label(t, { h: 0.26, color: "rgba(28,32,38,0.88)", size: 52 }); s.position.set(x, y, z); scene.add(s); };
  L("SEQUENCER", 8.5, 3.35, -2.6); L("GENOME READS", 5.7, 3.05, 1.0); L("HBM-PIM · 12-HIGH", 2.95, 3.2, 1.2); L("TSV", 3.9, 2.3, 1.45); L("ACCELERATOR", 0.4, 2.65, 0.4);

  K.shadows(scene);

  /* ---------- 움직임 ---------- */
  const tmp = new THREE.Object3D(), up = new THREE.Vector3(0, 1, 0);
  run((dt, t, cur) => {
    for (let i = 0; i < N; i++) {
      const o = offs[i], u = (o.u + t * 0.07) % 1, p = curve.getPointAt(u), tg = curve.getTangentAt(u);
      tmp.position.set(p.x, p.y + o.jy * Math.sin(u * Math.PI), p.z + o.jz * Math.sin(u * Math.PI));
      tmp.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), tg); tmp.scale.setScalar(u > 0.94 ? (1 - u) / 0.06 : 1); tmp.updateMatrix(); reads.setMatrixAt(i, tmp.matrix);
    }
    reads.instanceMatrix.needsUpdate = true;
    // PIM: 층마다 아래에서 위로 번지는 연산 물결
    pimTiles.forEach((p) => { const w = Math.max(0, Math.sin(t * 2.2 - p.l * 0.45)); p.m.material.opacity = 0.12 + 0.85 * Math.pow(w, 3); });
    tsvDots.forEach((d) => { const u = (t * 0.55 + d.ph) % 1; d.m.position.y = 1.1 + u * 1.32; d.m.material.opacity = 1; });
    for (let i = 0; i < M2; i++) {
      const u = (i / M2 + t * 0.18) % 1, z = (i % 2 ? 0.8 : -0.85) * (1 - u) + (i % 3 - 1) * 0.5 * u;
      tmp.position.set(pkg.position.x + 1.35 - u * 2.4, 1.03, pkg.position.z + z); tmp.quaternion.identity(); tmp.scale.setScalar(Math.sin(Math.PI * u) + 0.05); tmp.updateMatrix(); res.setMatrixAt(i, tmp.matrix);
    }
    res.instanceMatrix.needsUpdate = true;
    pkg.rotation.y = Math.sin(t * 0.12) * 0.06;
    seq.userData.lightBar.material.color.setHex(Math.sin(t * 2) > -0.6 ? 0x3fd8ff : 0x1a7a99);
    camera.position.set(2.6 + cur.x * 1.6, 6.8 - cur.y * 0.8, 13.5);
    camera.lookAt(2.4, 1.4, 0);
  });
}
})();
