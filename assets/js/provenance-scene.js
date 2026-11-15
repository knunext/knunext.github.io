/*
 * Research 카드 3D 배경: Proven × ance — 저작권과 AI 생성물 (밝은 스튜디오)
 * - 얇은 베젤의 모니터 세 대, 화면은 실제 프로그램처럼 그린 UI
 *   1) SOURCE: 사진 뷰어 + Content Credentials(C2PA) 패널 (촬영 기기 서명, 해시)
 *   2) DERIVED: 웹 브라우저의 쇼핑몰 배너가 원본 사진을 잘라·보정·문구를 얹어 재활용 + 재활용 탐지 패널
 *   3) AI-GENERATED: AI 생성 판별 도구 (열지도 스캔, 판정 점수) + C2PA 의 생성형 AI 표시
 * - 원본 사진 ↔ 배너의 같은 지점을 잇는 대응선, 세 C2PA 패널을 잇는 해시 체인
 * - 사진은 캔버스로 그린 풍경 (하늘·구름·겹친 산맥·눈·숲·호수 반사·물결·입자 노이즈)
 * - C2PA 로고는 사용자가 준 로고 파일(assets/img/logos/c2pa-logo.js, data URI)을 그대로 씀
 */
(function () {
const THREE = window.THREE, K = window.NCSL3D;
if (!THREE || !K) return;


/* ================= 사진: 캔버스로 그린 풍경 ================= */
function rng(seed) { return function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function ridge(R, n, rough) {                       // 중간점 변위로 만든 능선 (0~1)
  const a = new Array(n + 1).fill(0); a[0] = R(); a[n] = R();
  for (let step = n, amp = 1; step > 1; step >>= 1, amp *= rough) for (let i = step / 2; i < n; i += step) a[i] = (a[i - step / 2] + a[i + step / 2]) / 2 + (R() - 0.5) * amp;
  const lo = Math.min(...a), hi = Math.max(...a); return a.map((v) => (v - lo) / (hi - lo || 1));
}
// 한 번만 그리는 사진용 캔버스는 소프트웨어 캔버스로 (흐림 필터를 GPU 캔버스에서 여러 번 쓰면 느린 환경이 있음)
function cv(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; c.getContext("2d", { willReadFrequently: true }); return c; }
let rockTile = null;
function rockPat(x, R) {                              // 바위 결 무늬: 여러 크기의 노이즈를 겹친 타일
  if (!rockTile) {
    rockTile = cv(256, 256); const t = rockTile.getContext("2d");
    t.fillStyle = "#808080"; t.fillRect(0, 0, 256, 256);
    [[40, 22, 0.18], [120, 9, 0.16], [600, 3, 0.14]].forEach(([n, r, a]) => { for (let i = 0; i < n; i++) { t.fillStyle = (R() < 0.5 ? "rgba(0,0,0," : "rgba(255,255,255,") + a + ")"; t.beginPath(); t.ellipse(R() * 256, R() * 256, r * (0.5 + R()), r * (0.2 + R() * 0.5), R() * 3, 0, 7); t.fill(); } });
  }
  return x.createPattern(rockTile, "repeat");
}
function photo(o) {
  const W = o.w, H = o.h, c = cv(W, H), x = c.getContext("2d", { willReadFrequently: true }), R = rng(o.seed), hz = H * 0.66;
  // 하늘
  let g = x.createLinearGradient(0, 0, 0, hz); o.sky.forEach((col, i) => g.addColorStop(i / (o.sky.length - 1), col)); x.fillStyle = g; x.fillRect(0, 0, W, hz);
  g = x.createRadialGradient(o.sun[0] * W, o.sun[1] * H, 0, o.sun[0] * W, o.sun[1] * H, W * 0.55); g.addColorStop(0, o.glow); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.fillRect(0, 0, W, hz);
  x.fillStyle = o.sunCol; x.beginPath(); x.arc(o.sun[0] * W, o.sun[1] * H, W * 0.018, 0, 7); x.fill();
  // 구름: 흐린 타원 여러 겹
  const cl = cv(W, H), cx2 = cl.getContext("2d");                                    // 높은 엷은 구름 (한 층에 모아 한 번만 흐림)
  for (let i = 0; i < 14; i++) { const cx = R() * W, cy = H * (0.05 + R() * 0.2), rw = W * (0.1 + R() * 0.2); cx2.fillStyle = o.cloud.replace("A", (0.12 + R() * 0.18).toFixed(2)); cx2.beginPath(); cx2.ellipse(cx, cy, rw, rw * 0.12, 0, 0, 7); cx2.fill(); }
  x.filter = "blur(" + Math.round(W * 0.02) + "px)"; x.drawImage(cl, 0, 0); x.filter = "none";
  cx2.clearRect(0, 0, W, H);
  { const x = cx2;                                                                    // 뭉게구름: 작은 원 덩어리, 아랫면은 그늘
  for (let k = 0; k < 7; k++) {
    const cx = R() * W, cy = H * (0.12 + R() * 0.2), cw = W * (0.08 + R() * 0.12);
    for (let j = 0; j < 26; j++) { const px = cx + (R() - 0.5) * cw, py = cy - R() * cw * 0.22, pr = cw * (0.08 + R() * 0.12);
      const gg = x.createLinearGradient(0, py - pr, 0, py + pr); gg.addColorStop(0, o.cloud.replace("A", "0.95")); gg.addColorStop(1, o.cloudShade || "rgba(170,182,198,0.85)");
      x.fillStyle = gg; x.beginPath(); x.arc(px, py, pr, 0, 7); x.fill(); }
  } }
  x.filter = "blur(" + Math.max(2, Math.round(W * 0.004)) + "px)"; x.drawImage(cl, 0, 0); x.filter = "none";
  // 산맥: 먼 것부터, 사이사이 대기 원근(옅은 안개)
  const N = 512;
  o.ranges.forEach((L, li) => {
    const h = ridge(R, N, L.rough), yAt = (i) => (L.base - h[i] * L.amp) * H;
    const path = () => { x.beginPath(); x.moveTo(0, hz + 2); for (let i = 0; i <= N; i++) x.lineTo((i / N) * W, yAt(i)); x.lineTo(W, hz + 2); x.closePath(); };
    path(); g = x.createLinearGradient(0, (L.base - L.amp) * H, 0, hz); g.addColorStop(0, L.top); g.addColorStop(1, L.bottom); x.fillStyle = g; x.fill();
    x.save(); path(); x.clip();
    const sw = W / N + 0.6, sunRight = o.sun[0] > 0.5, lay = cv(W, H), lx = lay.getContext("2d");
    const hs = h.map((_, i) => { let a = 0, n = 0; for (let k = -7; k <= 7; k++) { const j = i + k; if (j >= 0 && j <= N) { a += h[j]; n++; } } return a / n; });   // 면 단위 명암을 위해 고른 능선
    for (let i = 0; i < N; i++) {                      // 경사면 명암(해 반대쪽 그늘) + 높은 봉우리의 눈. 별도 층에 그린 뒤 흐리게 합침
      const sl = (hs[Math.min(N, i + 3)] - hs[Math.max(0, i - 3)]) / 6 * N * L.amp * 0.05 * (sunRight ? 1 : -1), sx = (i / N) * W, sy = yAt(i), depth = H * L.amp * (0.5 + h[i] * 0.7);
      let gg = lx.createLinearGradient(0, sy, 0, sy + depth);
      gg.addColorStop(0, sl > 0 ? "rgba(18,24,40," + Math.min(0.38, sl * 1.2).toFixed(3) + ")" : "rgba(255,246,230," + Math.min(0.22, -sl * 0.8).toFixed(3) + ")");
      gg.addColorStop(1, "rgba(0,0,0,0)"); lx.fillStyle = gg; lx.fillRect(sx, sy, sw, depth);
      if (L.snow && hs[i] > 0.72) { const sd = H * L.amp * (hs[i] - 0.72) * 1.1; gg = lx.createLinearGradient(0, sy, 0, sy + sd); gg.addColorStop(0, sl > 0 ? "rgba(225,232,242,0.85)" : "rgba(255,255,255,0.95)"); gg.addColorStop(1, "rgba(255,255,255,0)"); lx.fillStyle = gg; lx.fillRect(sx, sy, sw, sd); }
    }
    x.filter = "blur(" + Math.max(1.5, W / 420).toFixed(1) + "px)"; x.drawImage(lay, 0, 0); x.filter = "none";
    for (let k = 0; k < 50; k++) {                     // 골짜기 몇 줄
      const i = (R() * N) | 0, sx = (i / N) * W, sy = yAt(i) + H * 0.01, len = H * L.amp * (0.2 + R() * 0.5);
      x.strokeStyle = "rgba(20,25,35," + (0.04 + R() * 0.07).toFixed(2) + ")"; x.lineWidth = 0.6 + R() * 1.2;
      x.beginPath(); x.moveTo(sx, sy); x.quadraticCurveTo(sx + (R() - 0.5) * 18, sy + len * 0.5, sx + (R() - 0.5) * 26, sy + len); x.stroke();
    }
    if (L.light) { g = x.createLinearGradient(o.sun[0] * W, 0, o.sun[0] * W - W * 0.5, 0); g.addColorStop(0, L.light); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(0, 0, W, hz); }
    if (L.trees) for (let k = 0; k < 1400; k++) {     // 언덕을 덮은 숲 (아래로 갈수록 어둡게)
      const i = (R() * N) | 0, tx = (i / N) * W + (R() - 0.5) * 3, ty = yAt(i) + R() * (hz - yAt(i)), th = H * (0.008 + R() * 0.014);
      x.fillStyle = R() < 0.25 ? (o.treeHi || "rgba(90,120,80,0.6)") : L.trees; x.beginPath(); x.moveTo(tx - th * 0.25, ty); x.lineTo(tx, ty - th); x.lineTo(tx + th * 0.25, ty); x.fill();
    }
    if (L.trees) for (let i = 0; i <= N; i += 1) {   // 능선 위 침엽수
      const tx = (i / N) * W, ty = yAt(i) + 2, th = H * (0.012 + R() * 0.022);
      x.fillStyle = L.trees; x.beginPath(); x.moveTo(tx - th * 0.22, ty); x.lineTo(tx, ty - th); x.lineTo(tx + th * 0.22, ty); x.fill();
    }
    x.globalCompositeOperation = "soft-light"; x.globalAlpha = 0.35; x.fillStyle = rockPat(x, R); x.fillRect(0, 0, W, hz); x.globalCompositeOperation = "source-over"; x.globalAlpha = 1;
    x.restore();
    if (li < o.ranges.length - 1) { x.fillStyle = o.haze; x.fillRect(0, 0, W, hz); }
  });
  // 호수: 위 장면을 뒤집어 비춤 + 물빛 + 물결
  const top = cv(W, hz); top.getContext("2d").drawImage(c, 0, 0);
  x.save(); x.translate(0, hz * 2); x.scale(1, -1); x.filter = "blur(1.5px)"; x.globalAlpha = 1; x.drawImage(top, 0, 0); x.restore();
  g = x.createLinearGradient(0, hz, 0, H); g.addColorStop(0, o.water[0]); g.addColorStop(1, o.water[1]); x.globalAlpha = 0.5; x.fillStyle = g; x.fillRect(0, hz, W, H - hz); x.globalAlpha = 1;
  for (let i = 0; i < 260; i++) { const yy = hz + Math.pow(R(), 1.6) * (H - hz), ww = W * (0.01 + R() * 0.06) * (1 + (yy - hz) / (H - hz) * 2); x.fillStyle = R() < 0.5 ? "rgba(255,255,255,0.10)" : "rgba(0,10,30,0.10)"; x.fillRect(R() * W, yy, ww, 1 + (yy - hz) / (H - hz) * 2); }
  x.fillStyle = "rgba(255,255,255,0.25)"; x.fillRect(0, hz, W, 1.5);
  // 앞쪽 물가 풀
  x.fillStyle = o.shore; x.beginPath(); x.moveTo(0, H); x.lineTo(0, H * 0.9); x.bezierCurveTo(W * 0.14, H * 0.885, W * 0.3, H * 0.93, W * 0.46, H); x.closePath(); x.fill();
  x.lineCap = "round"; for (let i = 0; i < 520; i++) { const bx = Math.pow(R(), 1.3) * W * 0.44, by = H * (0.9 + (bx / (W * 0.46)) * 0.1) + R() * H * 0.04, ht = H * (0.03 + R() * 0.07) * (1 - bx / (W * 0.5));
    x.strokeStyle = R() < 0.3 ? (o.reed || "rgba(120,130,70,0.8)") : o.shore; x.lineWidth = 0.8 + R() * 1.2; x.beginPath(); x.moveTo(bx, by); x.quadraticCurveTo(bx + (R() - 0.5) * 6, by - ht * 0.6, bx + (R() - 0.3) * 14, by - ht); x.stroke(); }
  // 비네팅 + 입자 노이즈
  g = x.createRadialGradient(W / 2, H * 0.55, W * 0.3, W / 2, H * 0.55, W * 0.75); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,0.28)"); x.fillStyle = g; x.fillRect(0, 0, W, H);
  if (o.grain) {                                         // 작은 노이즈 타일을 덮어 입자감 (getImageData 는 느려서 쓰지 않음)
    const nt = cv(256, 256), nx = nt.getContext("2d"), id = nx.createImageData(256, 256), d = id.data;
    for (let i = 0; i < d.length; i += 4) { const v = (R() * 255) | 0; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } nx.putImageData(id, 0, 0);
    x.save(); x.globalCompositeOperation = "overlay"; x.globalAlpha = o.grain / 100; x.fillStyle = x.createPattern(nt, "repeat"); x.fillRect(0, 0, W, H); x.restore();
  }
  return c;
}
const LAND = {
  w: 960, h: 640, seed: 11, sun: [0.74, 0.3], sunCol: "#fff6df", glow: "rgba(255,236,200,0.75)", cloud: "rgba(255,255,255,A)",
  sky: ["#2f64ad", "#6d9bd2", "#bcd3ea", "#f1e4cf"], haze: "rgba(200,215,232,0.13)", water: ["#5f86ae", "#22405c"], shore: "#26341f", grain: 9,
  ranges: [
    { base: 0.48, amp: 0.34, rough: 0.6, top: "#5f7393", bottom: "#8698b2", snow: true },
    { base: 0.56, amp: 0.26, rough: 0.6, top: "#43586f", bottom: "#62778c", snow: true, light: "rgba(255,226,180,0.12)" },
    { base: 0.62, amp: 0.15, rough: 0.6, top: "#3f5a52", bottom: "#4f6a55", trees: "#22382c" },
    { base: 0.665, amp: 0.07, rough: 0.62, top: "#2c4632", bottom: "#33503a", trees: "#1b2e20" },
  ],
};
// AI 생성물: 같은 구도를 흉내 낸, 지나치게 매끈하고 색이 과한 노을 풍경
const LAND_AI = Object.assign({}, LAND, {
  seed: 11, sun: [0.66, 0.36], sunCol: "#fff1cf", glow: "rgba(255,190,150,0.85)", cloud: "rgba(255,214,226,A)", cloudShade: "rgba(150,110,160,0.85)", treeHi: "rgba(110,100,160,0.6)", reed: "rgba(150,110,170,0.8)",
  sky: ["#3b2f7a", "#8a5fb0", "#e69ab0", "#ffd2a0"], haze: "rgba(236,190,210,0.18)", water: ["#a77fb6", "#3e2f63"], shore: "#2e2440", grain: 3,
  ranges: [
    { base: 0.48, amp: 0.34, rough: 0.52, top: "#8a72a8", bottom: "#b394b8", snow: true },
    { base: 0.56, amp: 0.26, rough: 0.54, top: "#5e4c86", bottom: "#86699c", snow: true, light: "rgba(255,190,150,0.25)" },
    { base: 0.62, amp: 0.15, rough: 0.55, top: "#3e5a6e", bottom: "#4d6676", trees: "#24304a" },
    { base: 0.665, amp: 0.07, rough: 0.55, top: "#2e3f58", bottom: "#36485f", trees: "#1c2438" },
  ],
});

/* ================= 화면 UI ================= */
const UW = 1600, UH = 1000;
const P1 = { x: 30, y: 120, w: 1080, h: 720 };              // 원본 사진 위치 (뷰어)
const P2 = { x: 40, y: 196, w: 1060, h: 470 };              // 쇼핑몰 배너 위치 (브라우저)
const P3 = { x: 30, y: 120, w: 1080, h: 720 };              // AI 판별 대상 위치
const CROP = { u: 0.06, v: 0.18, w: 0.88 };                  // 배너가 원본에서 잘라 쓴 영역 (세로는 비율에 맞춤)
CROP.h = CROP.w * (LAND.w / LAND.h) * (P2.h / P2.w);
const FONT = "'Inter Tight', 'Pretendard Variable', Pretendard, Arial, sans-serif", MONO = "ui-monospace, Menlo, Consolas, monospace";

function rr(x, X, Y, w, h, r) { x.beginPath(); x.roundRect(X, Y, w, h, r); }
function text(x, s, X, Y, size, weight, col, font) { x.font = (weight || 500) + " " + size + "px " + (font || FONT); x.fillStyle = col || "#1d2026"; x.fillText(s, X, Y); }
function windowChrome(x, title) {
  x.fillStyle = "#f6f7f9"; x.fillRect(0, 0, UW, UH);
  x.fillStyle = "#e7e9ed"; x.fillRect(0, 0, UW, 48); x.fillStyle = "#d3d7dd"; x.fillRect(0, 48, UW, 1.5);
  [24, 50, 76].forEach((cx) => { x.fillStyle = "#c3c8cf"; x.beginPath(); x.arc(cx, 24, 8, 0, 7); x.fill(); });
  x.textAlign = "center"; text(x, title, UW / 2, 32, 22, 600, "#3a3f47"); x.textAlign = "left";
}
function toolbar(x, items) {
  x.fillStyle = "#ffffff"; x.fillRect(0, 50, UW, 52); x.fillStyle = "#e1e4e8"; x.fillRect(0, 101, UW, 1.5);
  let X = 24; items.forEach((s) => { x.font = "500 20px " + FONT; const w = x.measureText(s).width + 28; rr(x, X, 62, w, 30, 6); x.fillStyle = "#eef0f3"; x.fill(); text(x, s, X + 14, 84, 20, 500, "#3a3f47"); X += w + 10; });
}
// C2PA 패널: 로고 + 제목 + 항목 + 상태
function c2paPanel(x, X, Y, w, h, o, logo) {
  x.fillStyle = "#ffffff"; rr(x, X, Y, w, h, 14); x.fill(); x.strokeStyle = "#dde1e6"; x.lineWidth = 2; x.stroke();
  if (logo) { const lh = 54, lw = lh * logo.width / logo.height; x.drawImage(logo, X + 22, Y + 20, lw, lh); }
  else { rr(x, X + 22, Y + 20, 68, 54, 8); x.fillStyle = "#eef0f3"; x.fill(); }
  text(x, o.title, X + 104, Y + 44, 25, 700, "#15171a"); text(x, o.sub, X + 104, Y + 72, 18, 500, "#6a707a");
  let yy = Y + 108;
  o.rows.forEach(([k, v, col]) => {
    x.fillStyle = "#eceef1"; x.fillRect(X + 20, yy - 4, w - 40, 1.5);
    text(x, k, X + 22, yy + 26, 17, 600, "#6a707a"); text(x, v, X + 22, yy + 54, 19, 500, col || "#1d2026", /sha|0x|…/.test(v) ? MONO : FONT); yy += 74;
  });
  if (o.status) { rr(x, X + 20, Y + h - 66, w - 40, 46, 10); x.fillStyle = o.statusBg; x.fill(); text(x, o.status, X + 40, Y + h - 36, 20, 700, o.statusCol); }
}
function pin(x, X, Y, logo) {                              // 사진 모서리의 콘텐츠 자격 증명 표시
  x.fillStyle = "rgba(255,255,255,0.94)"; rr(x, X, Y, 132, 48, 24); x.fill();
  if (logo) { const lh = 34, lw = lh * logo.width / logo.height; x.drawImage(logo, X + 12, Y + 7, lw, lh); }
  text(x, "✓", X + 104, Y + 33, 22, 700, "#1a8f55");
}

function drawSource(x, img, logo) {
  windowChrome(x, "IMG_2048.jpg — Photo Viewer");
  toolbar(x, ["Library", "Edit", "Info", "Share"]);
  x.fillStyle = "#1c1f24"; x.fillRect(0, 102, 1128, UH - 102);
  x.drawImage(img, P1.x, P1.y, P1.w, P1.h);
  pin(x, P1.x + P1.w - 150, P1.y + 18, logo);
  text(x, "6000 × 4000   ·   f/8   1/250s   ISO 100   24mm", P1.x, P1.y + P1.h + 50, 20, 500, "#aab0b8");
  c2paPanel(x, 1146, 120, 430, 860, {
    title: "Content Credentials", sub: "C2PA manifest",
    rows: [["Issued by", "Camera Co. (signed)"], ["Created", "2026-03-14  09:12"], ["Device", "Mirrorless · 24–70mm"], ["Actions", "c2pa.created"], ["Ingredients", "none (original)"], ["Content hash", "sha256 9f3a…e21b"], ["Signature", "ES256 · valid", "#1a8f55"]],
    status: "✓  Signature and hash verified", statusBg: "#e6f5ec", statusCol: "#16794a",
  }, logo);
}
function drawDerived(x, img, logo) {
  windowChrome(x, "Summer Sale — Shop");
  x.fillStyle = "#ffffff"; x.fillRect(0, 50, UW, 56); rr(x, 120, 60, 1000, 36, 18); x.fillStyle = "#eef0f3"; x.fill();
  text(x, "🔒  shop.example.com/summer-sale", 142, 85, 19, 500, "#3a3f47");
  [24, 60].forEach((cx) => text(x, cx === 24 ? "←" : "→", cx, 87, 24, 500, "#8a9099"));
  x.fillStyle = "#e1e4e8"; x.fillRect(0, 105, UW, 1.5);
  // 페이지
  x.fillStyle = "#ffffff"; x.fillRect(0, 106, 1128, UH - 106);
  text(x, "TRAILHEAD", 40, 158, 30, 800, "#15171a");
  ["Men", "Women", "Gear", "Sale"].forEach((s, i) => text(x, s, 560 + i * 120, 156, 20, 600, i === 3 ? "#d4402a" : "#3a3f47"));
  // 배너: 원본을 잘라 따뜻하게 보정하고 문구를 얹음
  x.save(); rr(x, P2.x, P2.y, P2.w, P2.h, 12); x.clip();
  x.filter = "saturate(1.35) sepia(0.22) hue-rotate(-12deg) brightness(1.04) contrast(1.06)";
  x.drawImage(img, CROP.u * img.width, CROP.v * img.height, CROP.w * img.width, CROP.h * img.height, P2.x, P2.y, P2.w, P2.h);
  x.filter = "none"; const g = x.createLinearGradient(P2.x, 0, P2.x + P2.w * 0.6, 0); g.addColorStop(0, "rgba(10,12,20,0.55)"); g.addColorStop(1, "rgba(10,12,20,0)"); x.fillStyle = g; x.fillRect(P2.x, P2.y, P2.w, P2.h);
  x.restore();
  text(x, "Summer Sale", P2.x + 46, P2.y + 120, 64, 800, "#ffffff"); text(x, "Up to 50% off outdoor gear", P2.x + 48, P2.y + 168, 28, 500, "#f1f3f6");
  rr(x, P2.x + 48, P2.y + 204, 190, 54, 27); x.fillStyle = "#ffffff"; x.fill(); text(x, "Shop now", P2.x + 86, P2.y + 240, 22, 700, "#15171a");
  // 상품 카드
  for (let i = 0; i < 3; i++) { const X = 40 + i * 360; rr(x, X, 700, 340, 250, 12); x.fillStyle = "#f2f3f5"; x.fill(); rr(x, X + 20, 720, 300, 150, 8); x.fillStyle = ["#c9d3dc", "#d8cfc4", "#cfd8cc"][i]; x.fill(); text(x, ["Trail jacket", "Day pack 22L", "Hiking boots"][i], X + 20, 905, 22, 600); text(x, ["$129", "$64", "$148"][i], X + 20, 934, 20, 500, "#d4402a"); }
  // 재활용 탐지 표시: 배너 위 점선 상자
  x.setLineDash([14, 10]); x.lineWidth = 4; x.strokeStyle = "#e07a1f"; rr(x, P2.x + 6, P2.y + 6, P2.w - 12, P2.h - 12, 10); x.stroke(); x.setLineDash([]);
  rr(x, P2.x + P2.w - 230, P2.y + 22, 208, 42, 21); x.fillStyle = "#e07a1f"; x.fill(); text(x, "Reuse match 92%", P2.x + P2.w - 214, P2.y + 50, 20, 700, "#ffffff");
  // 오른쪽 패널: 재활용 탐지 + C2PA 재료(ingredient)
  c2paPanel(x, 1146, 120, 430, 860, {
    title: "Reuse detection", sub: "C2PA ingredient check",
    rows: [["Matched source", "IMG_2048.jpg", "#1452c8"], ["Region overlap", "92 %  (crop 88 %)"], ["Edits found", "crop · color · text overlay"], ["C2PA ingredient", "sha256 9f3a…e21b"], ["Actions", "c2pa.cropped, c2pa.color_adjusted"], ["License", "not declared", "#c0392b"], ["Signature", "Shop CMS · valid", "#1a8f55"]],
    status: "!  Derived from a credited original", statusBg: "#fdf0e3", statusCol: "#b8600f",
  }, logo);
}
function drawAI(x, img, logo) {
  windowChrome(x, "AI Content Inspector");
  toolbar(x, ["Open", "Detect", "Heatmap", "Report"]);
  x.fillStyle = "#1c1f24"; x.fillRect(0, 102, 1128, UH - 102);
  x.drawImage(img, P3.x, P3.y, P3.w, P3.h);
  pin(x, P3.x + P3.w - 150, P3.y + 18, logo);
  text(x, "sunset_lake_v4.png   1536 × 1024", P3.x, P3.y + P3.h + 50, 20, 500, "#aab0b8");
  c2paPanel(x, 1146, 120, 430, 860, {
    title: "AI detection", sub: "Model + C2PA manifest",
    rows: [["Detector score", "AI-generated  0.97", "#7a3fd0"], ["Artifacts", "frequency peaks · smooth texture"], ["C2PA digitalSourceType", "trainedAlgorithmicMedia"], ["Actions", "c2pa.created (genAI)"], ["Generator", "Image model (signed)"], ["Content hash", "sha256 c21d…07fa"], ["Signature", "ES256 · valid", "#1a8f55"]],
    status: "AI-generated · credentials match", statusBg: "#f1eafb", statusCol: "#6a32b8",
  }, logo);
}

function init(host) {
  const ctx = K.setup(host, { fov: 30, exposure: 1.0 }), { scene, camera, run } = ctx;
  K.lightStudio(ctx, host, { shadow: 11, keyPos: [-6, 12, 9] });
  const M = (color, rough = 0.5, metal = 0, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: rough, metalness: metal }, extra));
  const B = (w, h, d) => new THREE.BoxGeometry(w, h, d);
  const add = (geo, mat, x, y, z, parent) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); (parent || scene).add(m); return m; };
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  /* ---------- 화면 질감 ---------- */
  const src = photo(LAND), ai = photo(LAND_AI);
  const screens = [drawSource, drawDerived, drawAI].map((draw, i) => {
    const c = document.createElement("canvas"); c.width = UW; c.height = UH;
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    const paint = (logo) => { const x = c.getContext("2d"); x.textBaseline = "alphabetic"; draw(x, i === 2 ? ai : src, logo); t.needsUpdate = true; };
    paint(null); return { t, paint };
  });
  const logoSrc = window.NCSL_IMG && window.NCSL_IMG.c2pa;
  if (logoSrc) { const im = new Image(); im.onload = () => screens.forEach((s) => s.paint(im)); im.src = logoSrc; }

  /* ---------- 모니터: 얇은 검은 베젤 + 알루미늄 받침 ---------- */
  const SW = 3.2, SH = SW * UH / UW, CY = 1.95;
  const bezel = M(0x1b1d21, 0.35, 0.4), alu = M(0xc9ced4, 0.28, 0.85), back = M(0xd5d9de, 0.3, 0.8);
  const monitor = (k, x0, z0, ry) => {
    const g = new THREE.Group(); g.position.set(x0, 0, z0); g.rotation.y = ry; scene.add(g);
    add(B(SW + 0.07, SH + 0.07, 0.05), bezel, 0, CY, -0.01, g);                          // 얇은 베젤
    add(B(SW + 0.07, SH + 0.07, 0.04), back, 0, CY, -0.05, g);                           // 뒷면 알루미늄
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), new THREE.MeshBasicMaterial({ map: screens[k].t, toneMapped: false })); scr.position.set(0, CY, 0.017); g.add(scr);
    add(B(0.34, 1.0, 0.05), alu, 0, 0.58, -0.22, g).rotation.x = 0.12;                   // 받침 목
    add(B(1.1, 0.04, 0.62), alu, 0, 0.02, -0.12, g);                                     // 받침
    return { g, scr };
  };
  const F = [monitor(0, -3.6, 0.6, 0.32), monitor(1, 0.1, -0.5, 0.0), monitor(2, 3.8, 0.6, -0.32)];
  // 화면 위 픽셀(UI 좌표) → 장면 좌표
  const at = (fi, px, py, dz) => V((px / UW - 0.5) * SW, CY + (0.5 - py / UH) * SH, 0.03 + (dz || 0)).applyAxisAngle(V(0, 1, 0), F[fi].g.rotation.y).add(F[fi].g.position);

  /* ---------- 재활용 탐지: 원본 사진 ↔ 배너의 같은 지점 ---------- */
  const pairs = [[0.22, 0.42], [0.47, 0.3], [0.7, 0.36], [0.35, 0.62], [0.82, 0.55], [0.58, 0.7]];
  const matchLines = pairs.map(([u, v]) => {
    const a = at(0, P1.x + u * P1.w, P1.y + v * P1.h), b = at(1, P2.x + (u - CROP.u) / CROP.w * P2.w, P2.y + (v - CROP.v) / CROP.h * P2.h);
    const geo = new THREE.BufferGeometry().setFromPoints([a, a.clone()]);
    scene.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xe07a1f, transparent: true, opacity: 0.95 })));
    add(new THREE.SphereGeometry(0.035, 10, 8), new THREE.MeshBasicMaterial({ color: 0xe07a1f }), a.x, a.y, a.z);
    const dotB = add(new THREE.SphereGeometry(0.035, 10, 8), new THREE.MeshBasicMaterial({ color: 0xe07a1f }), b.x, b.y, b.z);
    return { a, b, geo, dotB };
  });

  /* ---------- C2PA 해시 체인: 세 패널의 머리를 이음 ---------- */
  const chain = [];
  for (let i = 0; i < 2; i++) {
    const a = at(i, 1360, 120, 0.02), b = at(i + 1, 1180, 120, 0.02), mid = a.clone().lerp(b, 0.5); mid.y += 0.55; mid.z += 0.4;
    const c = new THREE.QuadraticBezierCurve3(a, mid, b);
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.016, 6, false), new THREE.MeshBasicMaterial({ color: 0x1f6fff, transparent: true, opacity: 0.6 })));
    chain.push(c);
  }
  const hashes = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.06), new THREE.MeshStandardMaterial({ color: 0x1f6fff, roughness: 0.3 }), 6); scene.add(hashes);

  /* ---------- AI 판별: 스캔 막 + 열지도 (판별 대상 사진 위) ---------- */
  const heat = K.canvasTex(540, 360, (x, w, h) => {
    const R = rng(5);
    for (let i = 0; i < 30; i++) { const cx = R() * w, cy = R() * h, r = 20 + R() * 60, g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, "rgba(255,50,40,0.6)"); g.addColorStop(0.5, "rgba(255,190,40,0.32)"); g.addColorStop(1, "rgba(255,190,40,0)"); x.fillStyle = g; x.fillRect(0, 0, w, h); }
  });
  const pw = P3.w / UW * SW, ph = P3.h / UH * SH, pc = V(((P3.x + P3.w / 2) / UW - 0.5) * SW, CY + (0.5 - (P3.y + P3.h / 2) / UH) * SH, 0.022);
  const heatMesh = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), new THREE.MeshBasicMaterial({ map: heat, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
  heatMesh.position.copy(pc); F[2].g.add(heatMesh);
  const scanBar = new THREE.Mesh(new THREE.PlaneGeometry(0.035, ph), new THREE.MeshBasicMaterial({ color: 0x9a5cff, transparent: true, opacity: 0.9, toneMapped: false })); scanBar.position.copy(pc).add(V(0, 0, 0.003)); F[2].g.add(scanBar);

  /* ---------- 캡션 ---------- */
  const caps = K.captions(ctx);
  caps.add("Source<small>signed capture</small>", at(0, UW / 2, UH + 40), { color: "#1f6fff", place: "below" });
  caps.add("Derived · reuse<small>cropped, color-graded, text added</small>", at(1, UW / 2, UH + 40), { color: "#e07a1f", place: "below" });
  caps.add("AI-generated<small>detector + C2PA label</small>", at(2, UW / 2, UH + 40), { color: "#7a3fd0", place: "below" });
  caps.add("C2PA hash chain", chain[0].getPoint(0.5).add(V(0, 0.08, 0)), { color: "#1f6fff" });
  const verdict = caps.add("AI-generated 0.97", at(2, P3.x + P3.w / 2, P3.y - 30), { color: "#7a3fd0" });
  K.shadows(scene);

  const tmp = new THREE.Object3D();
  run((dt, t, cur) => {
    for (let i = 0; i < 6; i++) { const c = chain[i % 2], u = (i / 6 + t * 0.2) % 1; tmp.position.copy(c.getPoint(u)); tmp.rotation.set(t, t * 1.3, 0); tmp.scale.setScalar(1); tmp.updateMatrix(); hashes.setMatrixAt(i, tmp.matrix); }
    hashes.instanceMatrix.needsUpdate = true;
    const cyc = (t % 8) / 8;                                  // 대응선이 하나씩 그려짐
    matchLines.forEach((m, i) => { const st = i * 0.09, u = Math.max(0, Math.min(1, (cyc - st) / 0.18)), e = m.a.clone().lerp(m.b, u); m.geo.setFromPoints([m.a, e]); m.dotB.visible = u >= 1; });
    const su = (t % 6) / 6;                                   // 스캔: 왼쪽에서 오른쪽으로
    scanBar.position.x = pc.x - pw / 2 + su * pw; scanBar.material.opacity = su < 0.95 ? 0.9 : 0;
    heatMesh.material.opacity = Math.min(0.8, su * 1.3) * (su < 0.98 ? 1 : 0.5);
    verdict.el.style.opacity = su > 0.7 ? 1 : 0.25;
    camera.position.set(-0.6 + cur.x * 1.4, 4.2 - cur.y * 0.7, 11.6);
    camera.lookAt(-1.35, 1.7, -0.2);
  });
}
document.querySelectorAll('[data-scene="provenance3d"]').forEach((host) => (K.lazy(host, init)));   // 카드가 앞에 올 때 만듦
})();
