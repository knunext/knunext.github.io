/*
 * Research 카드 3D 배경: Ouro × boros — AI 기반 재귀개선(RSI) (밝은 스튜디오)
 * - 바닥 위에 누운 우로보로스: 몸통이 한 바퀴 돌며 가늘어져 꼬리 끝이 머리의 입 속으로 들어감
 *   (연금술 그림의 색: 등 진홍·분홍 비늘, 배 올리브·노랑 비늘, 귀가 선 머리, 짧은 네 다리)
 * - 고리 바깥 네 정거장: Design(설계 도면) · Build & Run(서버) · Feedback(성능 막대) · Improve(세대 표시)
 * - AI 에이전트 빛 구슬이 몸통을 따라 돌며 정거장을 지날 때마다 그 정거장이 켜짐, 한 바퀴마다 세대가 오름
 * - 고리 가운데: 세대마다 코어가 늘어나는 시스템(칩) — 대상: CPU · GPU · TPU · Memory · M&S
 */
(function () {
const THREE = window.THREE, K = window.NCSL3D;
if (!THREE || !K) return;

document.querySelectorAll('[data-scene="ouroboros3d"]').forEach((host) => (K.lazy(host, init)));   // 카드가 앞에 올 때 만듦

function init(host) {
  const ctx = K.setup(host, { fov: 30, exposure: 1.0 }), { scene, camera, run } = ctx;
  K.lightStudio(ctx, host, { shadow: 9, keyPos: [-6, 12, 7] });
  const M = (color, rough = 0.5, metal = 0, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: rough, metalness: metal }, extra));
  const B = (w, h, d) => new THREE.BoxGeometry(w, h, d);
  const add = (geo, mat, x, y, z, parent) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); (parent || scene).add(m); return m; };
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  /* ---------- 우로보로스 (중세 연금술 그림의 색과 생김새: 등은 진홍·분홍 비늘, 배는 올리브·노랑 비늘, 늑대처럼 귀가 선 머리, 짧은 네 다리) ---------- */
  const R = 2.7, Y = 0.47, snake = new THREE.Group(); snake.rotation.y = -Math.PI * 0.42; scene.add(snake);   // 머리가 앞쪽(카메라 쪽)에서 옆모습으로 보이도록 돌림
  // 각도 φ: 머리가 φ=0 에서 +방향(반시계)을 향함. 몸통은 목(φ=NECK)에서 φ 를 줄여가며 한 바퀴, 꼬리 끝은 φ=+0.2 (입 속)
  const NECK = -0.07, TAIL = -2 * Math.PI + 0.22, at = (phi) => V(R * Math.cos(phi), Y, -R * Math.sin(phi));
  const radius = (phi) => { const u = (NECK - phi) / (NECK - TAIL); return 0.37 * (u < 0.5 ? 1 : Math.pow(1 - (u - 0.5) / 0.5, 0.85) * 0.93 + 0.07); };
  // 비늘 질감: 가로 = 몸 길이 방향(꼬리 쪽이 +), 세로 = 몸 둘레 (0 과 1 = 배, 0.5 = 등)
  const PINK = ["#a82c57", "#b63863", "#9a244c", "#bf456d"], OLIVE = ["#a8922e", "#b49f38", "#9a8526", "#bfa944"];
  function scaleArt(x, w, h, o, bump) {
    const rows = o.rows, cols = o.cols, sw = w / cols, sh = h / rows;
    x.fillStyle = bump ? "#303030" : o.base; x.fillRect(0, 0, w, h);
    for (let c = cols; c >= -1; c--) for (let r = -1; r <= rows; r++) {          // 꼬리 쪽부터 그려서 머리 쪽 비늘이 위로 겹침
      const cx = (c + (r % 2 ? 0.5 : 0)) * sw, cy = (r + 0.5) * sh, v = cy / h;
      const dors = o.mode === "pink" ? 1 : o.mode === "olive" ? 0 : (Math.abs(v - 0.5) < 0.2 ? 1 : Math.abs(v - 0.5) > 0.28 ? 0 : (Math.random() < 0.5 ? 1 : 0));
      const pal = dors ? PINK : OLIVE, col = pal[(Math.random() * pal.length) | 0];
      x.beginPath();                                                              // 둥근 끝이 꼬리 쪽(+x)을 향한 비늘
      x.moveTo(cx - sw * 0.35, cy - sh * 0.62);
      x.bezierCurveTo(cx + sw * 0.55, cy - sh * 0.7, cx + sw * 0.85, cy - sh * 0.1, cx + sw * 0.78, cy);
      x.bezierCurveTo(cx + sw * 0.85, cy + sh * 0.1, cx + sw * 0.55, cy + sh * 0.7, cx - sw * 0.35, cy + sh * 0.62);
      x.closePath();
      const g = x.createRadialGradient(cx + sw * 0.15, cy - sh * 0.12, sw * 0.05, cx + sw * 0.2, cy, sw * 0.75);
      if (bump) { g.addColorStop(0, "#f2f2f2"); g.addColorStop(0.7, "#a0a0a0"); g.addColorStop(1, "#404040"); }
      else { g.addColorStop(0, dors ? "#de7898" : "#ddc870"); g.addColorStop(0.4, col); g.addColorStop(1, dors ? "#6e1a3a" : "#655616"); }
      x.fillStyle = g; x.fill();
      x.lineWidth = bump ? 3 : 2.6; x.strokeStyle = bump ? "#1a1a1a" : dors ? "#4e0f27" : "#463c10"; x.stroke();
      if (!bump) { x.lineWidth = 1.6; x.strokeStyle = dors ? "rgba(255,190,210,0.45)" : "rgba(255,240,180,0.5)"; x.beginPath(); x.moveTo(cx - sw * 0.05, cy - sh * 0.42); x.quadraticCurveTo(cx + sw * 0.45, cy - sh * 0.38, cx + sw * 0.55, cy - sh * 0.05); x.stroke(); }
    }
  }
  const scaleTex = (o) => {
    const mk = (bump) => { const t = K.canvasTex(o.w || 1024, o.h || 512, (x, w, h) => scaleArt(x, w, h, o, bump)); t.wrapS = t.wrapT = THREE.RepeatWrapping; if (bump) t.colorSpace = THREE.NoColorSpace; return t; };
    return { map: mk(false), bump: mk(true) };
  };
  const bodyTex = scaleTex({ mode: "body", rows: 14, cols: 7, base: "#4a1028" });
  const skin = (tx, rep) => { [tx.map, tx.bump].forEach((t) => t.repeat.set(rep[0], rep[1])); return new THREE.MeshPhysicalMaterial({ map: tx.map, bumpMap: tx.bump, bumpScale: 2.4, roughness: 0.52, metalness: 0.0, clearcoat: 0.25, clearcoatRoughness: 0.5, envMapIntensity: 0.55 }); };
  // 몸통: 직접 만든 관(타원 단면) — 둘레 좌표 0 이 안쪽 아래(배), 0.5 가 바깥 위(등)
  { const SEG = 420, RAD = 44, pos = [], uv = [], idx = [], up = V(0, 1, 0), L = R * Math.abs(TAIL - NECK), tile = 2 * Math.PI * 0.37 * 1.25;
    for (let i = 0; i <= SEG; i++) {
      const u = i / SEG, phi = NECK + (TAIL - NECK) * u, c = at(phi), r = radius(phi), n = V(Math.cos(phi), 0, -Math.sin(phi));
      c.y += 0.03 * Math.sin(u * 26) * (1 - u) * Math.min(1, u / 0.05);   // 목 근처는 머리 높이에 맞춤                                   // 몸이 살짝 물결침
      for (let j = 0; j <= RAD; j++) {
        const th = (j / RAD) * Math.PI * 2 + Math.PI / 3, o = n.clone().multiplyScalar(Math.cos(th) * r).addScaledVector(up, Math.sin(th) * r * 0.86);
        pos.push(c.x + o.x, Math.max(0.012, c.y + o.y), c.z + o.z); uv.push(u * L / tile, j / RAD);
      }
    }
    for (let i = 0; i < SEG; i++) for (let j = 0; j < RAD; j++) { const a = i * (RAD + 1) + j, b = a + RAD + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
    const body = new THREE.Mesh(geo, skin(bodyTex, [1, 1])); body.castShadow = body.receiveShadow = true; snake.add(body); }

  // 원통을 두 점 사이에 놓는 도우미 (다리·발가락)
  const limb = (a, b, r1, r2, mat, parent) => { const d = b.clone().sub(a), m = new THREE.Mesh(new THREE.CylinderGeometry(r2, r1, d.length(), 14), mat); m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); (parent || snake).add(m); return m; };
  const pinkM = skin(scaleTex({ mode: "pink", rows: 9, cols: 7, base: "#4a1028", w: 512, h: 512 }), [2, 2]);
  const oliveM = skin(scaleTex({ mode: "olive", rows: 9, cols: 7, base: "#3d3510", w: 512, h: 512 }), [2, 2]);
  const legM = new THREE.MeshPhysicalMaterial({ color: 0xa8922e, roughness: 0.55, clearcoat: 0.2, envMapIntensity: 0.55 }), clawM = M(0x3a2a1e, 0.4);

  // 짧은 네 다리: 앞다리 한 쌍, 뒷다리 한 쌍. 쌍마다 몸통 양옆(고리 안쪽·바깥쪽)에서 도마뱀처럼 옆으로 뻗어 바닥을 디딤
  // 걸음: 대각선 다리끼리 같은 쪽으로 (앞 안쪽 + 뒤 바깥쪽이 앞으로, 나머지는 뒤로)
  [[-0.95, 1], [-3.55, -1]].forEach(([phi, gait]) => {
    const c = at(phi), n = V(Math.cos(phi), 0, -Math.sin(phi)), tg = V(-Math.sin(phi), 0, -Math.cos(phi)), r = radius(phi);
    [-1, 1].forEach((side) => {                                                  // side: -1 = 안쪽, +1 = 바깥쪽
      const step = gait * side * -0.09, out = n.clone().multiplyScalar(side);
      const hip = c.clone().addScaledVector(out, r * 0.62).add(V(0, -r * 0.3, 0));
      const knee = hip.clone().addScaledVector(out, 0.24).addScaledVector(tg, step).setY(hip.y + 0.07);
      const ankle = knee.clone().addScaledVector(out, 0.13).addScaledVector(tg, step * 0.6).setY(0.07);
      limb(hip, knee, 0.1, 0.075, legM); limb(knee, ankle, 0.068, 0.05, legM);
      add(new THREE.SphereGeometry(0.072, 14, 10), legM, knee.x, knee.y, knee.z, snake);
      const foot = add(new THREE.SphereGeometry(0.078, 14, 10), legM, ankle.x, ankle.y, ankle.z, snake); foot.scale.set(1, 0.6, 1);
      [-0.55, 0, 0.55, Math.PI].forEach((a) => {                                 // 발가락 셋은 머리 쪽(앞)으로 부채꼴, 하나는 뒤로
        const dir = tg.clone().multiplyScalar(Math.cos(a)).addScaledVector(out, Math.sin(Math.abs(a) < 1 ? a : 0) + (Math.abs(a) < 1 ? 0.25 : 0.15)).normalize();
        const tip = ankle.clone().addScaledVector(dir, Math.abs(a) > 1 ? 0.09 : 0.16); tip.y = 0.025;
        limb(ankle, tip, 0.03, 0.021, legM);
        const cl = new THREE.Mesh(new THREE.ConeGeometry(0.017, 0.065, 8), clawM); cl.position.copy(tip).addScaledVector(dir, 0.028); cl.quaternion.setFromUnitVectors(V(0, 1, 0), dir.clone().add(V(0, -0.3, 0)).normalize()); snake.add(cl);
      });
    });
  });

  // 머리: 늑대·용 같은 머리. 쫑긋 선 두 귀, 길쭉한 주둥이, 벌린 입이 꼬리 끝을 묾
  const head = new THREE.Group(); snake.add(head);
  const hp = at(-0.02); head.position.copy(hp); head.rotation.y = Math.PI - 0.02;   // 머리 앞(+z 로컬)이 진행 방향
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.44, 32, 22), pinkM); skull.scale.set(0.93, 0.76, 1.32); skull.position.set(0, 0.03, -0.14); head.add(skull);
  const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 16), oliveM); cheekL.scale.set(1.25, 0.7, 1.2); cheekL.position.set(0, -0.14, 0.0); head.add(cheekL);   // 턱 아래 (배 색)
  const upperJaw = new THREE.Group(); upperJaw.position.set(0, 0.04, 0.18); upperJaw.rotation.x = -0.24; head.add(upperJaw);   // 윗턱 (위로 벌림)
  { const sn = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.27, 0.95, 24, 1), pinkM); sn.rotation.x = Math.PI / 2; sn.scale.set(1, 1, 0.6); sn.position.set(0, 0.03, 0.47); upperJaw.add(sn);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.11, 18, 12), pinkM); tip.scale.set(1, 0.62, 1.1); tip.position.set(0, 0.035, 0.94); upperJaw.add(tip);
    [-1, 1].forEach((s) => { add(new THREE.SphereGeometry(0.022, 8, 6), M(0x3a0f1f, 0.6), s * 0.05, 0.085, 0.96, upperJaw);                       // 콧구멍
      for (let i = 0; i < 6; i++) { const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.09, 8), M(0xf7f2e6, 0.3)); tooth.rotation.x = Math.PI; tooth.position.set(s * (0.2 - i * 0.022), -0.08, 0.2 + i * 0.12); upperJaw.add(tooth); } }); }
  const lowerJaw = new THREE.Group(); lowerJaw.position.set(0, -0.06, 0.16); lowerJaw.rotation.x = 0.3; head.add(lowerJaw);    // 아래턱 (아래로 벌림)
  { const jw = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.23, 0.76, 22, 1), oliveM); jw.rotation.x = Math.PI / 2; jw.scale.set(1, 1, 0.5); jw.position.set(0, -0.03, 0.38); lowerJaw.add(jw);
    [-1, 1].forEach((s) => { for (let i = 0; i < 5; i++) { const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.08, 8), M(0xf7f2e6, 0.3)); tooth.position.set(s * (0.16 - i * 0.022), 0.05, 0.18 + i * 0.12); lowerJaw.add(tooth); } }); }
  { const mouth = new THREE.Mesh(new THREE.SphereGeometry(0.2, 18, 12), M(0x7d1a2c, 0.65)); mouth.scale.set(0.9, 0.55, 2.0); mouth.position.set(0, -0.02, 0.45); head.add(mouth);
    const tongue = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), M(0xd8506a, 0.5)); tongue.scale.set(1, 0.35, 3); tongue.position.set(0, -0.09, 0.42); head.add(tongue); }
  [-1, 1].forEach((s) => {
    const ear = new THREE.Group(); ear.position.set(s * 0.21, 0.36, -0.2); ear.rotation.set(-0.55, 0, -s * 0.32); head.add(ear);   // 쫑긋 선 귀
    const outer = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.5, 18), pinkM); outer.scale.set(1, 1, 0.55); outer.position.y = 0.22; ear.add(outer);
    const inner = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.36, 14), M(0x8f2a4d, 0.6)); inner.scale.set(1, 1, 0.3); inner.position.set(0, 0.18, 0.045); ear.add(inner);
    const brow = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 10), pinkM); brow.scale.set(1, 0.45, 1.5); brow.position.set(s * 0.24, 0.27, 0.16); brow.rotation.z = s * 0.3; head.add(brow);   // 눈두덩
    const eye = add(new THREE.SphereGeometry(0.075, 20, 14), new THREE.MeshPhysicalMaterial({ color: 0xf0c83c, roughness: 0.15, clearcoat: 1, emissive: 0x6a4a00, emissiveIntensity: 0.25 }), s * 0.29, 0.19, 0.2, head);
    const pupil = add(new THREE.SphereGeometry(0.032, 12, 10), M(0x0b0c0e, 0.2), s * 0.355, 0.19, 0.23, head); pupil.scale.set(0.5, 1.5, 0.8);   // 세로로 길쭉한 동공
  });
  K.shadows(snake);

  /* ---------- 가운데: 세대마다 나아지는 시스템 ---------- */
  const core = new THREE.Group(); scene.add(core);
  add(B(1.9, 0.18, 1.9), M(0x3b4048, 0.5, 0.2), 0, 0.09, 0, core);
  add(B(1.6, 0.12, 1.6), M(0x2e7d77, 0.35, 0.3), 0, 0.24, 0, core);
  const die = add(B(1.3, 0.14, 1.3), M(0xd9dde2, 0.25, 0.85), 0, 0.37, 0, core);
  const cores = new THREE.Group(); core.add(cores);
  const coreMat = new THREE.MeshStandardMaterial({ color: 0x1f6fff, roughness: 0.4, emissive: 0x1f6fff, emissiveIntensity: 0.3 });
  function buildCores(gen) {
    while (cores.children.length) cores.remove(cores.children[0]);
    const n = Math.min(2 + gen, 6), s = 1.1 / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) add(B(s * 0.78, 0.05, s * 0.78), coreMat, -0.55 + s * (i + 0.5), 0.47, -0.55 + s * (j + 0.5), cores);
  }
  const caps = K.captions(ctx);
  const genCap = caps.add("Gen 1<small>CPU · GPU · TPU<br>Memory · M&amp;S</small>", null, { cls: "cap-side" });   // 세대 표시는 카드 오른쪽에 따로 (뱀과 겹치지 않게)
  const setGen = (g) => { genCap.box.firstChild.nodeValue = "Gen " + g; };

  /* ---------- 네 정거장 ---------- */
  const ST = [{ name: "Design", phi: Math.PI * 0.75 }, { name: "Build &amp; Run", phi: Math.PI * 1.25 }, { name: "Feedback", phi: Math.PI * 1.75 }, { name: "Improve", phi: Math.PI * 0.25 }];
  const stations = ST.map((s) => {
    const g = new THREE.Group(), p = V(Math.cos(s.phi) * (R + 1.7), 0, -Math.sin(s.phi) * (R + 1.7)); g.position.copy(p); g.lookAt(0, 0, 0); g.rotateY(Math.PI); scene.add(g);
    add(new THREE.CylinderGeometry(0.75, 0.8, 0.12, 40), M(0xffffff, 0.6), 0, 0.06, 0, g);
    const ring = add(new THREE.TorusGeometry(0.78, 0.03, 8, 48), new THREE.MeshBasicMaterial({ color: 0x1f6fff, transparent: true, opacity: 0.15 }), 0, 0.13, 0, g); ring.rotation.x = Math.PI / 2;
    const anchor = new THREE.Object3D(); anchor.position.set(0, 1.55, 0); g.add(anchor);
    const cap = caps.add(s.name, anchor, { color: "#1f6fff" });
    return { g, ring, phi: s.phi, cap };
  });
  // Design: 설계 도면판
  { const g = stations[0].g, bp = K.canvasTex(512, 384, (x, w, h) => { x.fillStyle = "#1d4f9a"; x.fillRect(0, 0, w, h); x.strokeStyle = "rgba(255,255,255,0.25)"; x.lineWidth = 1; for (let i = 0; i < w; i += 24) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, h); x.stroke(); } for (let j = 0; j < h; j += 24) { x.beginPath(); x.moveTo(0, j); x.lineTo(w, j); x.stroke(); } x.strokeStyle = "#ffffff"; x.lineWidth = 4; x.strokeRect(120, 80, 270, 220); x.strokeRect(160, 120, 80, 60); x.strokeRect(270, 120, 80, 60); x.strokeRect(160, 210, 190, 60); });
    const board = add(B(1.1, 0.8, 0.05), [M(0xdfe3e8), M(0xdfe3e8), M(0xdfe3e8), M(0xdfe3e8), new THREE.MeshStandardMaterial({ map: bp, roughness: 0.6 }), M(0xdfe3e8)], 0, 0.9, 0, g); board.rotation.x = -0.25;
    add(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8), M(0x9aa1aa, 0.3, 0.8), 0, 0.42, -0.1, g); }
  // Build & Run: 서버
  const runLeds = [];
  { const g = stations[1].g; add(B(0.8, 1.2, 0.7), M(0x2c3036, 0.35, 0.5), 0, 0.72, 0, g);
    for (let i = 0; i < 6; i++) { add(B(0.66, 0.12, 0.02), M(0x1a1d21, 0.4), 0, 0.3 + i * 0.17, 0.36, g); runLeds.push(add(B(0.05, 0.04, 0.02), new THREE.MeshBasicMaterial({ color: 0x14c46a }), 0.26, 0.3 + i * 0.17, 0.375, g)); } }
  // Feedback: 성능 막대
  const bars = [];
  { const g = stations[2].g; for (let i = 0; i < 5; i++) { const m = add(B(0.16, 1, 0.16), M([0x1f6fff, 0x4a8cff, 0x14b89a, 0xf08a2c, 0x8a5cff][i], 0.45), -0.36 + i * 0.18, 0.62, 0, g); bars.push(m); } }
  // Improve: 오르는 화살표
  const upArrow = new THREE.Group(); stations[3].g.add(upArrow);
  { const shaft = add(new THREE.CylinderGeometry(0.08, 0.08, 0.7, 16), M(0x14b89a, 0.4), 0, 0.55, 0, upArrow); add(new THREE.ConeGeometry(0.22, 0.35, 24), M(0x14b89a, 0.4), 0, 1.05, 0, upArrow); }

  /* ---------- AI 에이전트 (몸통을 따라 도는 빛 구슬) ---------- */
  const agent = add(new THREE.SphereGeometry(0.2, 24, 16), new THREE.MeshStandardMaterial({ color: 0x1f6fff, emissive: 0x1f6fff, emissiveIntensity: 1.2, roughness: 0.3 }), 0, 0, 0);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: K.glowTex([[0, "rgba(31,111,255,0.6)"], [1, "rgba(31,111,255,0)"]]), transparent: true, depthWrite: false })); halo.scale.set(1.2, 1.2, 1); scene.add(halo);
  const agentAt = new THREE.Object3D(); scene.add(agentAt);
  caps.add("AI agent", agentAt, { color: "#1f6fff" });
  K.shadows(scene);

  let gen = 1, lastLap = 0; buildCores(1);
  run((dt, t, cur) => {
    const LAP = 9, u = (t % LAP) / LAP, lap = Math.floor(t / LAP);
    if (lap !== lastLap) { lastLap = lap; gen = (gen % 5) + 1; buildCores(gen); setGen(gen); }
    const phi = u * Math.PI * 2;                                            // 반시계로 한 바퀴 (머리 방향)
    const r = R, p = V(Math.cos(phi) * r, Y + 0.55, -Math.sin(phi) * r);
    agent.position.copy(p); halo.position.copy(p); agentAt.position.copy(p).add(V(0, 0.25, 0));
    stations.forEach((s) => { let d = Math.abs(((phi - s.phi + Math.PI * 3) % (Math.PI * 2)) - Math.PI); s.ring.material.opacity = d < 0.5 ? 0.9 : 0.15; s.cap.el.classList.toggle("is-on", d < 0.5); });
    runLeds.forEach((l, i) => l.material.color.setHex(Math.sin(t * 6 + i) > 0 ? 0x14c46a : 0x0b3a22));
    bars.forEach((b, i) => { const hgt = 0.3 + (i + 1) * 0.12 * (0.6 + gen * 0.15); b.scale.y = hgt; b.position.y = 0.12 + hgt / 2; });
    upArrow.position.y = Math.sin(t * 2) * 0.08;
    coreMat.emissiveIntensity = 0.25 + 0.35 * Math.max(0, Math.sin(t * 3));
    core.rotation.y = t * 0.15;
    camera.position.set(2.0 + cur.x * 1.6, 9.8 - cur.y * 0.8, 13.2);
    camera.lookAt(-0.6, 0.2, -0.4);
  });
}
})();
