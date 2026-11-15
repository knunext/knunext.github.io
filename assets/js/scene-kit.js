/*
 * Research 카드 3D 장면 공용 도구 (three.js 일반 스크립트 위에서 동작)
 * - setup(host, opts): 렌더러·장면·카메라, 크기 맞춤, 마우스 시점, 화면에 보일 때만 그리기
 * - studioEnv(renderer, opts): 반사용 스튜디오 환경
 * - label(text, opts): 글자 스프라이트 (장면 안 라벨)
 * - captions(ctx, host): 장면 위 HTML 캡션 (3D 위치를 따라다니는 큼직한 글자 상자)
 */
(function () {
  const THREE = window.THREE;
  if (!THREE) return;
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setup(host, o) {
    o = Object.assign({ bg: 0x05070b, fov: 32, exposure: 1, shadows: false, fog: null }, o || {});
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = o.exposure;
    if (o.shadows) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(o.bg);
    if (o.fog) scene.fog = o.fog;
    const camera = new THREE.PerspectiveCamera(o.fov, 2, 0.1, 2000);
    const cur = { x: 0, y: 0 }, target = { x: 0, y: 0 };
    let visible = true;
    const after = [];                          // 매 프레임 장면을 그리기 직전에 부르는 함수 (캡션 위치 등)
    function resize() {
      const r = host.getBoundingClientRect(), w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = w / h < 1.6 ? o.fov * 1.3 : o.fov; camera.updateProjectionMatrix();
    }
    new ResizeObserver(resize).observe(host); resize();
    const card = host.closest(".slide") || host;
    card.addEventListener("pointermove", (e) => { const r = host.getBoundingClientRect(); target.x = ((e.clientX - r.left) / r.width - 0.5) * 2; target.y = ((e.clientY - r.top) / r.height - 0.5) * 2; });
    card.addEventListener("pointerleave", () => { target.x = 0; target.y = 0; });
    new IntersectionObserver((es) => es.forEach((en) => (visible = en.isIntersecting)), { threshold: 0.02 }).observe(host);
    function run(step) {
      let last = performance.now(); const t0 = last; let first = true;
      (function frame(now) {
        requestAnimationFrame(frame);
        const dt = Math.max(0, Math.min(0.05, (now - last) / 1000)); last = Math.max(last, now);   // rAF 시각이 직전 시각보다 앞설 수 있음
        if (!visible) return;
        if (reduce && !first) return;            // 동작 줄이기: 첫 장면만
        if (!first && card.classList.contains("slide") && !card.classList.contains("is-active")) return;   // 옆에 살짝 보이는 카드는 멈춘 장면
        if (!reduce) { cur.x += (target.x - cur.x) * 0.04; cur.y += (target.y - cur.y) * 0.04; }
        step(reduce ? 0 : dt, Math.max(0, (now - t0) / 1000), cur);
        for (let i = 0; i < after.length; i++) after[i]();
        renderer.render(scene, camera);
        first = false;
      })(last);
      host.classList.add("is-ready");
    }
    return { renderer, scene, camera, cur, run, reduce, after, host };
  }

  function studioEnv(renderer, o) {
    o = Object.assign({ base: 0x1a2236, panels: [[0, 12, 0, 0xffffff, 10, 2]] }, o || {});
    const pm = new THREE.PMREMGenerator(renderer), env = new THREE.Scene();
    env.add(new THREE.Mesh(new THREE.SphereGeometry(30, 32, 16), new THREE.MeshBasicMaterial({ color: o.base, side: THREE.BackSide })));
    o.panels.forEach(([x, y, z, c, w, h]) => {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }));
      p.position.set(x, y, z); p.lookAt(0, 0, 0); env.add(p);
    });
    return pm.fromScene(env, 0.04).texture;
  }

  // 밝은 스튜디오: 연회색 배경, 그림자를 받는 바닥, 부드러운 빛. 카드 글자는 어두운 색으로 바뀜(scene-light)
  function lightStudio(ctx, host, o) {
    o = Object.assign({ bg: 0xe9ebee, floor: 0xf1f2f4, shadow: 14, keyPos: [-8, 14, 9] }, o || {});
    const { renderer, scene } = ctx;
    scene.background = new THREE.Color(o.bg);
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    scene.environment = studioEnv(renderer, { base: 0xdfe3e8, panels: [[-8, 12, 8, 0xffffff, 12, 4], [10, 9, -6, 0xffffff, 10, 3], [0, 16, -10, 0xffffff, 14, 3]] });
    scene.add(new THREE.HemisphereLight(0xffffff, 0xbfc4cc, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 2.0); key.position.set(...o.keyPos); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -o.shadow, right: o.shadow, top: o.shadow, bottom: -o.shadow, near: 1, far: 60 });
    key.shadow.bias = -0.0004; key.shadow.radius = 4; scene.add(key);
    const fill = new THREE.DirectionalLight(0xdfe8ff, 0.6); fill.position.set(9, 6, -4); scene.add(fill);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: o.floor, roughness: 0.95 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    const slide = host.closest(".slide"); if (slide) slide.classList.add("scene-light");
    return { key, floor };
  }
  // 장면의 불투명한 물체 모두 그림자 주고받기
  function shadows(root) { root.traverse((m) => { if (m.isMesh && !m.isInstancedMesh && !Array.isArray(m.material) && !m.material.transparent && !m.material.isMeshBasicMaterial && m.geometry.type !== "PlaneGeometry") { m.castShadow = true; m.receiveShadow = true; } else if (m.isMesh && Array.isArray(m.material)) { m.castShadow = true; m.receiveShadow = true; } }); }

  // 글자 스프라이트: 카메라를 항상 바라봄. h = 장면 단위 높이
  function label(text, o) {
    o = Object.assign({ h: 0.5, color: "#f4f5f7", bg: null, weight: 600, size: 64, pad: 18, mono: false, border: null }, o || {});
    const c = document.createElement("canvas"), x = c.getContext("2d");
    const font = (o.mono ? "" : "") + o.weight + " " + o.size + "px " + (o.mono ? "ui-monospace, Menlo, Consolas, monospace" : "'Inter Tight', 'Archivo', Pretendard, Arial, sans-serif");
    x.font = font; const tw = Math.ceil(x.measureText(text).width);
    c.width = tw + o.pad * 2; c.height = o.size + o.pad * 2;
    x.font = font; x.textBaseline = "middle";
    if (o.bg) { x.fillStyle = o.bg; x.fillRect(0, 0, c.width, c.height); }
    if (o.border) { x.strokeStyle = o.border; x.lineWidth = 4; x.strokeRect(2, 2, c.width - 4, c.height - 4); }
    x.fillStyle = o.color; x.fillText(text, o.pad, c.height / 2 + 2);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
    s.scale.set(o.h * c.width / c.height, o.h, 1); s.renderOrder = 10;
    return s;
  }

  // HTML 캡션: 3D 점(Vector3 또는 Object3D)을 화면 좌표로 옮겨 그 위에 글자 상자를 띄움
  // add(html, anchor, { color, place: "above"|"below"|"right"|"left"|"center", cls })  anchor 가 null 이면 고정 캡션(place 대신 CSS 클래스로 자리)
  // attach(el, anchor, opts): 이미 있는 요소(예: 로고 목록)를 같은 방식으로 붙임
  function captions(ctx) {
    const host = ctx.host, camera = ctx.camera;
    const layer = document.createElement("div"); layer.className = "scene-caps"; host.appendChild(layer);
    const items = [], v = new THREE.Vector3();
    function attach(el, anchor, o) {
      o = o || {};
      el.classList.add("scene-cap", anchor ? "cap-" + (o.place || "above") : "cap-fixed");
      if (o.color) el.style.setProperty("--cap", o.color);
      layer.appendChild(el); const it = { el, anchor, o }; items.push(it); return it;
    }
    function add(html, anchor, o) {
      const el = document.createElement("div"), box = document.createElement("span");
      box.className = "cap-box" + (o && o.cls ? " " + o.cls : ""); box.innerHTML = html; el.appendChild(box);
      const it = attach(el, anchor, o); it.box = box; return it;
    }
    function update() {
      const w = host.clientWidth, h = host.clientHeight;
      camera.updateMatrixWorld();
      for (const it of items) {
        if (!it.anchor) continue;                          // 고정 캡션 (CSS 로 자리 잡음)
        if (it.anchor.isObject3D) it.anchor.getWorldPosition(v); else v.copy(it.anchor);
        v.project(camera);
        let px = (v.x + 1) / 2 * w; const py = (1 - v.y) / 2 * h, bw = it.el.firstChild ? it.el.firstChild.offsetWidth : 0, place = it.o.place || "above";
        if (place === "right") px = Math.min(px, w - bw - 16); else if (place === "left") px = Math.max(px, bw + 16); else px = Math.max(bw / 2 + 6, Math.min(w - bw / 2 - 6, px));   // 카드 밖으로 잘리지 않게
        it.el.style.transform = "translate(" + px.toFixed(1) + "px," + py.toFixed(1) + "px)";
        it.el.style.visibility = v.z > 1 || it.hidden ? "hidden" : "";
      }
    }
    ctx.after.push(update);
    return { add, attach, update, layer };
  }

  function glowTex(stops, w) {
    w = w || 256; const c = document.createElement("canvas"); c.width = c.height = w; const x = c.getContext("2d");
    const g = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); stops.forEach(([p, col]) => g.addColorStop(p, col));
    x.fillStyle = g; x.fillRect(0, 0, w, w); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }

  // 캔버스로 그린 질감
  function canvasTex(w, h, draw) {
    const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  }

  // 카드가 처음 앞에 올 때 장면을 만듦 (페이지를 열 때 여러 장면을 한꺼번에 만들지 않도록)
  function lazy(host, init) {
    const slide = host.closest(".slide");
    let done = false;
    const go = () => { if (done) return; done = true; try { init(host); } catch (e) { host.classList.add("no-webgl"); } };
    if (!slide) { go(); return; }
    const check = () => { if (slide.classList.contains("is-active")) go(); };
    check();
    if (!done) { const mo = new MutationObserver(() => { check(); if (done) mo.disconnect(); }); mo.observe(slide, { attributes: true, attributeFilter: ["class"] }); }
  }

  window.NCSL3D = { setup, studioEnv, lightStudio, shadows, label, captions, glowTex, canvasTex, lazy, reduce };
})();
