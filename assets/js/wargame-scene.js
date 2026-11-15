/*
 * Research 카드 3D 배경: War × Game — 헥스 지도 위 전장 (VBS4 · Combat Mission 같은 3D 전장 + 워게임 표기)
 * - 지형: 완만한 언덕, 북쪽 숲(나무 수천 그루), 남쪽 들판 조각, 도로, 헥스 격자, 지명
 * - 청군: 숲 가장자리 방어선(AbL, 하늘색 선)을 따라 배치, 머리 위에 NATO 부대 부호
 * - 적군: 남쪽에서 도로·들판을 따라 접근하며 먼지를 일으킴, 붉은 마름모 부호
 * - 교전: 이따금 예광탄과 섬광 / LLM 에이전트가 제안한 방책(COA) 화살표가 지형 위에서 맥동 / 무인기 선회
 */
(function () {
const THREE = window.THREE, K = window.NCSL3D;
if (!THREE || !K) return;

document.querySelectorAll('[data-scene="wargame3d"]').forEach((host) => (window.NCSL3D ? window.NCSL3D.lazy(host, init) : init(host)));   // 카드가 앞에 올 때 만듦

/* ---------- 잡음 함수 (지형, 숲) ---------- */
function hash(x, y) { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); }
function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y) { let s = 0, a = 0.5, f = 1; for (let i = 0; i < 5; i++) { s += a * vnoise(x * f, y * f); f *= 2; a *= 0.5; } return s; }

function init(host) {
  const W = 52, D = 32;
  const { renderer, scene, camera, run } = K.setup(host, { bg: 0x0b0f0c, fov: 30, exposure: 1.0, shadows: true, fog: new THREE.Fog(0x2a332c, 38, 80) });
  scene.add(new THREE.HemisphereLight(0xd8e4ff, 0x30361f, 0.8));
  const sun = new THREE.DirectionalLight(0xffe8c8, 2.4); sun.position.set(-20, 26, 12); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 20, bottom: -20, near: 1, far: 90 }); sun.shadow.bias = -0.0005;
  scene.add(sun);

  const height = (x, z) => (fbm(x * 0.05 + 7, z * 0.05 + 3) - 0.5) * 3.2 + Math.sin(x * 0.11) * 0.35;
  const forestV = (x, z) => fbm(x * 0.09 + 11, z * 0.09 + 5) + (z < -2 ? 0.2 : -0.12) + (z < -8 ? 0.1 : 0);
  const isForest = (x, z) => forestV(x, z) > 0.62;
  const road = [[-6, 17], [-4.5, 9], [-2, 3], [0.2, -2], [1.5, -8], [3.5, -17]];
  // 방어선(AbL): 각 x 에서 남쪽부터 올라가며 처음 숲이 시작되는 곳
  const PL = [];
  for (let x = -22; x <= 22; x += 2) { let z = 6; while (z > -14 && !isForest(x, z)) z -= 0.25; PL.push([x, z + 0.6]); }

  /* ---------- 지형 텍스처: 들판 조각, 숲, 도로, 헥스 격자, 방어선 ---------- */
  const TW = 2048, TH = Math.round(2048 * D / W);
  const toPx = (x, z) => [(x + W / 2) / W * TW, (z + D / 2) / D * TH];
  const tex = K.canvasTex(TW, TH, (c) => {
    c.fillStyle = "#6c7a45"; c.fillRect(0, 0, TW, TH);
    const fieldCols = ["#7d8a4c", "#8a8f53", "#6f8046", "#9a9660", "#7f9150", "#a49d68", "#687a42"];
    for (let i = 0; i < 520; i++) {
      const x = Math.random() * TW, y = Math.random() * TH, w = 30 + Math.random() * 70, h = 20 + Math.random() * 50;
      c.save(); c.translate(x, y); c.rotate(0.6 + (Math.random() - 0.5) * 0.3); c.fillStyle = fieldCols[i % fieldCols.length]; c.globalAlpha = 0.55; c.fillRect(-w / 2, -h / 2, w, h);
      c.strokeStyle = "rgba(60,70,40,0.35)"; c.lineWidth = 2; c.strokeRect(-w / 2, -h / 2, w, h); c.restore();
    }
    c.globalAlpha = 1;
    // 숲: 거친 격자(4px)에서만 잡음을 계산하고, 칸 안은 작은 점으로 질감 (계산량을 줄여 카드가 열릴 때 멈칫하지 않게)
    const img = c.getImageData(0, 0, TW, TH), d = img.data;
    for (let py = 0; py < TH; py += 4) for (let px = 0; px < TW; px += 4) {
      const x = px / TW * W - W / 2, z = py / TH * D - D / 2;
      if (forestV(x, z) > 0.62) {
        for (let dy = 0; dy < 4; dy += 2) for (let dx = 0; dx < 4; dx += 2) {
          const k = 0.62 + Math.random() * 0.38;
          for (let ey = 0; ey < 2; ey++) for (let ex = 0; ex < 2; ex++) { const i = ((py + dy + ey) * TW + px + dx + ex) * 4; d[i] = 30 * k; d[i + 1] = 58 * k; d[i + 2] = 30 * k; }
        }
      }
    }
    c.putImageData(img, 0, 0);
    c.strokeStyle = "#b8a882"; c.lineWidth = 9; c.lineJoin = c.lineCap = "round"; c.beginPath();       // 도로
    road.forEach(([x, z], i) => { const [a, b] = toPx(x, z); i ? c.lineTo(a, b) : c.moveTo(a, b); }); c.stroke();
    c.strokeStyle = "rgba(20,30,15,0.16)"; c.lineWidth = 1.2;                                         // 헥스 격자
    const r = 26, hw = Math.sqrt(3) * r;
    for (let row = 0; row * r * 1.5 < TH + r; row++) for (let col = 0; col * hw < TW + hw; col++) {
      const cx = col * hw + (row % 2 ? hw / 2 : 0), cy = row * r * 1.5; c.beginPath();
      for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k + Math.PI / 6; c.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); }
      c.closePath(); c.stroke();
    }
    c.strokeStyle = "#5fd2ff"; c.lineWidth = 6; c.shadowColor = "rgba(95,210,255,0.8)"; c.shadowBlur = 10; c.beginPath();   // 방어선
    PL.forEach(([x, z], i) => { const [a, b] = toPx(x, z); i ? c.lineTo(a, b) : c.moveTo(a, b); }); c.stroke(); c.shadowBlur = 0;
  });

  const geo = new THREE.PlaneGeometry(W, D, 156, 96); geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setY(i, height(pos.getX(i), pos.getZ(i)));
  geo.computeVertexNormals();
  const ground = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 })); ground.receiveShadow = true; scene.add(ground);
  const skirt = new THREE.Mesh(new THREE.BoxGeometry(W, 4, D), new THREE.MeshStandardMaterial({ color: 0x3a3226, roughness: 1 })); skirt.position.y = -3.6; scene.add(skirt);

  /* ---------- 나무 ---------- */
  const treeGeo = new THREE.ConeGeometry(0.32, 1.25, 7); treeGeo.translate(0, 0.62, 0);
  const crown = new THREE.SphereGeometry(0.42, 8, 6); crown.translate(0, 0.75, 0);
  const NT = 2400, trees = new THREE.InstancedMesh(treeGeo, new THREE.MeshStandardMaterial({ color: 0x24402a, roughness: 0.9 }), NT);
  const NB = 650, broad = new THREE.InstancedMesh(crown, new THREE.MeshStandardMaterial({ color: 0x2f5232, roughness: 0.9 }), NB);
  trees.castShadow = broad.castShadow = true;
  const d0 = new THREE.Object3D(); let ti = 0, bi = 0, guard = 0;
  while ((ti < NT || bi < NB) && guard++ < 60000) {
    const x = (Math.random() - 0.5) * (W - 1), z = (Math.random() - 0.5) * (D - 1);
    if (!isForest(x, z)) continue;
    d0.position.set(x, height(x, z) - 0.05, z); const s = 0.45 + Math.random() * 0.45; d0.scale.set(s, s * (0.9 + Math.random() * 0.5), s); d0.rotation.y = Math.random() * 6; d0.updateMatrix();
    if (ti < NT && Math.random() < 0.75) trees.setMatrixAt(ti++, d0.matrix); else if (bi < NB) broad.setMatrixAt(bi++, d0.matrix);
  }
  trees.count = ti; broad.count = bi; scene.add(trees, broad);

  /* ---------- 부대: 3D 차량 + NATO 부호 ---------- */
  const olive = new THREE.MeshStandardMaterial({ color: 0x4d5531, roughness: 0.75, metalness: 0.2 });
  const sand = new THREE.MeshStandardMaterial({ color: 0x6b5f45, roughness: 0.75, metalness: 0.2 });
  const tracks = new THREE.MeshStandardMaterial({ color: 0x23251f, roughness: 0.9 });
  const vehicle = (mat, tank) => {
    const g = new THREE.Group(), add = (geo, m, x, y, z) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; g.add(o); return o; };
    add(new THREE.BoxGeometry(0.9, 0.22, 0.48), mat, 0, 0.2, 0);
    add(new THREE.BoxGeometry(0.98, 0.12, 0.52), tracks, 0, 0.08, 0);
    add(new THREE.BoxGeometry(tank ? 0.42 : 0.34, 0.15, tank ? 0.36 : 0.3), mat, -0.05, 0.38, 0);
    const gun = add(new THREE.CylinderGeometry(0.025, 0.03, tank ? 0.75 : 0.45, 8), mat, tank ? 0.5 : 0.35, 0.4, 0); gun.rotation.z = Math.PI / 2;
    return g;
  };
  const symbol = (side, kind, name) => {
    const c = document.createElement("canvas"); c.width = 220; c.height = 200; const x = c.getContext("2d");
    x.lineWidth = 7; x.strokeStyle = "#0b0b0b";
    if (side === "blue") {
      x.fillStyle = "#7fd3f7"; x.fillRect(30, 30, 160, 100); x.strokeRect(30, 30, 160, 100);
      if (kind === "inf") { x.beginPath(); x.moveTo(30, 30); x.lineTo(190, 130); x.moveTo(190, 30); x.lineTo(30, 130); x.stroke(); }
      if (kind === "arm") { x.beginPath(); x.ellipse(110, 80, 52, 26, 0, 0, 7); x.stroke(); }
      if (kind === "hq") { x.fillStyle = "#0b0b0b"; x.fillRect(30, 125, 6, 50); }
    } else {
      x.fillStyle = "#ff7b7b"; x.beginPath(); x.moveTo(110, 10); x.lineTo(185, 85); x.lineTo(110, 160); x.lineTo(35, 85); x.closePath(); x.fill(); x.stroke();
      x.beginPath(); x.moveTo(72, 47); x.lineTo(148, 123); x.moveTo(148, 47); x.lineTo(72, 123); x.stroke();
    }
    x.fillStyle = side === "blue" ? "#d8f2ff" : "#ffd2d2"; x.font = "700 28px Arial"; x.textAlign = "center"; x.fillText(name, 110, 194);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false })); s.scale.set(1.1, 1.0, 1); s.renderOrder = 10; return s;
  };
  const units = [];
  const placeUnit = (side, kind, name, x, z, yaw, tank) => {
    const g = new THREE.Group(); const body = vehicle(side === "blue" ? olive : sand, tank); body.rotation.y = yaw; g.add(body);
    const sym = symbol(side, kind, name); sym.position.y = 1.45; g.add(sym);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.95, 4), new THREE.MeshBasicMaterial({ color: side === "blue" ? 0x7fd3f7 : 0xff7b7b })); stem.position.y = 0.88; g.add(stem);
    g.position.set(x, height(x, z), z); scene.add(g);
    const u = { g, body, side, x, z }; units.push(u); return u;
  };
  [[-14, "inf", "1-P1", true], [-11, "arm", "1-2", true], [-3, "inf", "2-P1", false], [0, "arm", "2-2", true], [8, "inf", "3-P1", false], [11, "arm", "3-2", true]].forEach(([x, k, n, tk]) => {
    const p = PL.reduce((a, b) => (Math.abs(b[0] - x) < Math.abs(a[0] - x) ? b : a)); placeUnit("blue", k, "B-112-" + n, x, p[1] - 1.1, -Math.PI / 2, tk);
  });
  placeUnit("blue", "hq", "B-112-HQ", 4, -11, -Math.PI / 2, false);
  const blues = units.slice(0, 6);
  const reds = [];
  [[-9, 15.5, -0.15], [-6, 14.5, 0], [-3.5, 15.8, 0.1], [5, 15.2, 0.05], [8, 14.2, -0.1], [11, 15.6, 0]].forEach(([x, z, drift], i) => {
    const u = placeUnit("red", "inf", "R-MR-" + (i < 3 ? 1 : 2), x, z, Math.PI / 2, i % 3 === 1);
    u.start = { x, z }; u.drift = drift; u.speed = 0.32 + (i % 3) * 0.04; reds.push(u);
  });

  /* ---------- 지명, 방어선 이름 ---------- */
  [["UNTERHOLZ", -15, -9], ["BUSCHWIESE", 7, -3], ["KOGEL", -16, 12], ["MITTERHOLZ", -2, -12]].forEach(([n, x, z]) => {
    const s = K.label(n, { h: 0.42, color: "#f3f1e6", size: 56 }); s.position.set(x, height(x, z) + 0.7, z); scene.add(s);
  });
  const plR = PL[PL.length - 4], ab = K.label("AbL — 숲 가장자리 방어선", { h: 0.4, color: "#7fdcff", size: 56 });
  ab.position.set(plR[0] + 1, height(plR[0], plR[1]) + 1.1, plR[1] + 0.6); scene.add(ab);

  /* ---------- LLM 방책(COA) 화살표: 지형에 붙은 반투명 층 ---------- */
  const coaTex = K.canvasTex(TW, TH, (c) => {
    const arrow = (pts, col) => {
      c.strokeStyle = col; c.lineWidth = 18; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath();
      pts.forEach(([x, z], i) => { const [a, b] = toPx(x, z); i ? c.lineTo(a, b) : c.moveTo(a, b); }); c.stroke();
      const [x1, z1] = pts[pts.length - 1], [x0, z0] = pts[pts.length - 2], [a1, b1] = toPx(x1, z1), [a0, b0] = toPx(x0, z0), ang = Math.atan2(b1 - b0, a1 - a0);
      c.fillStyle = col; c.beginPath(); c.moveTo(a1 + Math.cos(ang) * 50, b1 + Math.sin(ang) * 50); c.lineTo(a1 + Math.cos(ang + 2.3) * 50, b1 + Math.sin(ang + 2.3) * 50); c.lineTo(a1 + Math.cos(ang - 2.3) * 50, b1 + Math.sin(ang - 2.3) * 50); c.fill();
    };
    arrow([[-13, -6], [-14, 0], [-11, 6], [-7, 9.5]], "rgba(120,220,255,0.75)");
    arrow([[11, -6], [13, 0], [11, 6], [7, 10]], "rgba(120,220,255,0.75)");
    c.fillStyle = "rgba(230,250,255,0.95)"; c.font = "700 44px Arial";
    let [a, b] = toPx(-16.5, 1); c.fillText("COA-1", a, b); [a, b] = toPx(13.8, 1); c.fillText("COA-2", a, b);
  });
  const coa = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: coaTex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, opacity: 0.6 }));
  scene.add(coa);
  const agent = K.label("LLM AGENT · COA 제안", { h: 0.42, color: "#bff0ff", size: 56, bg: "rgba(6,20,28,0.65)", border: "rgba(120,220,255,0.9)" });
  agent.position.set(15, 3.6, 4); scene.add(agent);

  /* ---------- 무인기 ---------- */
  const uav = new THREE.Group(); scene.add(uav);
  { const m = new THREE.MeshStandardMaterial({ color: 0xc9ccd1, roughness: 0.5, metalness: 0.3 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.1, 1.0, 10), m); body.rotation.z = Math.PI / 2; uav.add(body);   // 굵은 쪽이 기수(+x)
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), m); nose.position.x = 0.5; uav.add(nose);
    uav.add(new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 1.9), m));
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 0.5), m); tail.position.x = -0.45; uav.add(tail); }

  /* ---------- 교전 효과: 예광탄, 섬광, 먼지 ---------- */
  const tracerMat = new THREE.LineBasicMaterial({ color: 0xffd38a, transparent: true, opacity: 0 });
  const tracerGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  scene.add(new THREE.Line(tracerGeo, tracerMat));
  const flashTex = K.glowTex([[0, "rgba(255,240,200,1)"], [0.3, "rgba(255,170,60,0.6)"], [1, "rgba(0,0,0,0)"]]);
  const spr = (sc) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: flashTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 })); s.scale.set(sc, sc, 1); scene.add(s); return s; };
  const flash = spr(1.2), hit = spr(1.6);
  const dustTex = K.glowTex([[0, "rgba(190,175,140,0.55)"], [1, "rgba(190,175,140,0)"]], 128);
  const dust = []; for (let i = 0; i < 36; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: dustTex, transparent: true, depthWrite: false, opacity: 0 })); scene.add(s); dust.push({ s, life: 0 }); }
  let di = 0, nextShot = 1.5, shotT = -9, from = null, to = null;

  run((dt, t, cur) => {
    reds.forEach((u, i) => {                                                     // 적군 전진, 일정 거리 후 처음부터
      const prog = (t * u.speed + i * 1.7) % 14;
      const z = u.start.z - prog, x = u.start.x + Math.sin(prog * 0.4 + i) * 0.5 + u.drift * prog;
      u.g.position.set(x, height(x, z), z); u.x = x; u.z = z;
      u.body.rotation.y = Math.PI / 2 - Math.cos(prog * 0.4 + i) * 0.15;
      if (dt && Math.random() < dt * 3) { const d = dust[di++ % dust.length]; d.s.position.set(x + (Math.random() - 0.5) * 0.3, u.g.position.y + 0.2, z + 0.5); d.life = 1; }
    });
    dust.forEach((d) => { if (d.life > 0) { d.life -= dt * 0.6; d.s.material.opacity = Math.max(0, d.life) * 0.6; const k = 0.6 + (1 - d.life) * 1.6; d.s.scale.set(k, k, 1); d.s.position.y += dt * 0.25; } });
    if (t > nextShot) {                                                           // 교전: 무작위 청군 → 가장 가까운 적
      const b = blues[Math.floor(Math.random() * blues.length)];
      const r = reds.reduce((a, c) => (Math.hypot(c.x - b.g.position.x, c.z - b.g.position.z) < Math.hypot(a.x - b.g.position.x, a.z - b.g.position.z) ? c : a));
      from = b.g.position.clone().add(new THREE.Vector3(0, 0.42, 0.4)); to = r.g.position.clone().add(new THREE.Vector3(0, 0.3, 0));
      shotT = t; nextShot = t + 1.2 + Math.random() * 2;
    }
    const st = t - shotT;
    if (from && st < 0.6) {
      const u = Math.min(1, st / 0.35), head = from.clone().lerp(to, u), tail = from.clone().lerp(to, Math.max(0, u - 0.25));
      tracerGeo.setFromPoints([tail, head]); tracerMat.opacity = st < 0.4 ? 1 : 0;
      flash.position.copy(from); flash.material.opacity = Math.max(0, 1 - st * 6);
      hit.position.copy(to); hit.material.opacity = st > 0.35 ? Math.max(0, 1 - (st - 0.35) * 4) : 0;
    } else { tracerMat.opacity = 0; flash.material.opacity = 0; hit.material.opacity = 0; }
    coa.material.opacity = 0.25 + 0.3 * (0.5 + 0.5 * Math.sin(t * 1.6));
    // 무인기: 타원 궤도를 돌며 기수(+x)가 진행 방향을 향하고, 선회 쪽으로 살짝 기울어짐
    const a = t * 0.22; uav.position.set(Math.cos(a) * 9 + 2, 7 + Math.sin(t * 0.5) * 0.3, Math.sin(a) * 6 + 2);
    const vx = -Math.sin(a) * 9, vz = Math.cos(a) * 6;
    uav.rotation.set(0, 0, 0); uav.rotation.order = "YXZ"; uav.rotation.y = Math.atan2(-vz, vx); uav.rotation.x = -0.28;
    camera.position.set(-1 + cur.x * 3, 27 - cur.y * 1.5, 32);
    camera.lookAt(3, 0, 0.5);
  });
}
})();
