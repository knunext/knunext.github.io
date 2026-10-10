/*
 * 라인 드로잉 일러스트 (Research 카드, 메인 화면).
 * data 파일에서 illustration: "pim" 처럼 이름으로 지정합니다.
 * 직접 만든 이미지를 쓰려면 data 의 image 필드에 경로를 넣으면 이 그림 대신 표시됩니다.
 */
(function () {
  "use strict";
  const R = (x, y, w, h, rx) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"${rx ? ` rx="${rx}"` : ""}/>`;
  const Ln = (x1, y1, x2, y2, cls) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${cls ? ` class="${cls}"` : ""}/>`;
  const C = (cx, cy, r, cls) => `<circle cx="${cx}" cy="${cy}" r="${r}"${cls ? ` class="${cls}"` : ""}/>`;
  const E = (cx, cy, rx, ry, cls) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"${cls ? ` class="${cls}"` : ""}/>`;
  const P = (d, cls) => `<path d="${d}"${cls ? ` class="${cls}"` : ""}/>`;
  const T = (x, y, s, anchor) => `<text x="${x}" y="${y}"${anchor ? ` text-anchor="${anchor}"` : ""}>${s}</text>`;
  const svg = (vb, body, label) =>
    `<svg class="illus" viewBox="${vb}" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid meet">${body}</svg>`;
  const range = (n) => Array.from({ length: n }, (_, i) => i);

  const I = {};

  /* ---------- Home: side-view drawings (520 x 150) ---------- */
  I.chip = () => {
    let b = "";
    b += P("M50 46 H470 V64 H50 Z", "dash");                       // lid outline
    b += R(60, 104, 400, 14, 2);                                   // substrate
    b += R(80, 96, 360, 8);                                        // interposer
    b += R(190, 72, 140, 24, 2);                                   // logic die
    range(6).forEach((i) => (b += Ln(205 + i * 22, 76, 205 + i * 22, 92, "thin")));
    [[100, 150], [370, 420]].forEach(([x1, x2]) => {
      range(5).forEach((k) => (b += R(x1, 74 + k * 4.4, x2 - x1, 4.4)));
      range(3).forEach((k) => (b += Ln(x1 + 12 + k * 13, 74, x1 + 12 + k * 13, 96, "thin")));
    });
    range(25).forEach((i) => (b += C(72 + i * 15.6, 124, 4)));
    return svg("0 0 520 150", b, "칩 패키지 측면도: 로직 다이와 HBM 스택");
  };

  I.robot = () => {
    let b = "";
    b += Ln(20, 140, 500, 140);
    b += R(50, 120, 90, 20, 2) + P("M70 120 L80 100 H110 L120 120");
    b += C(95, 96, 9) + P("M90 90 L182 28 L192 40 L100 102 Z");
    b += C(187, 34, 9) + P("M190 26 L300 48 L296 62 L186 42 Z");
    b += C(300, 56, 7) + P("M306 56 H322 M322 48 V66 M322 48 H336 M322 66 H336");
    b += R(300, 104, 200, 14, 7);
    range(8).forEach((i) => (b += C(312 + i * 25, 111, 5, "thin")));
    b += R(348, 76, 34, 28) + Ln(348, 86, 382, 86, "thin") + R(410, 82, 28, 22) + R(458, 70, 32, 34) + Ln(474, 70, 474, 104, "thin");
    b += Ln(320, 118, 320, 140) + Ln(480, 118, 480, 140);
    return svg("0 0 520 150", b, "산업용 로봇 팔과 컨베이어");
  };

  I.drone = () => {
    let b = "";
    b += R(205, 62, 110, 28, 6) + Ln(205, 76, 315, 76, "thin");
    b += P("M215 62 L230 50 H290 L305 62");
    b += P("M205 72 L118 60 M315 72 L402 60");
    [[110, 60], [410, 60]].forEach(([x, y]) => {
      b += R(x - 8, y - 4, 16, 14, 2) + Ln(x, y - 4, x, y - 12) + E(x, y - 14, 70, 4);
    });
    b += C(260, 100, 10) + C(260, 100, 4, "thin") + Ln(260, 90, 260, 90);
    b += P("M225 90 L205 128 M295 90 L315 128 M190 128 H230 M290 128 H330");
    b += P("M40 132 C140 120 380 120 480 132", "dash");
    return svg("0 0 520 150", b, "무인 드론 측면도");
  };

  // 국방 AX: 무인 지상차량(UGV) + 드론, 무인-무인 협동
  I.defense = () => {
    let b = "";
    b += Ln(20, 142, 500, 142);
    // tracked UGV
    b += R(50, 112, 176, 28, 14);
    range(7).forEach((i) => (b += C(68 + i * 23.3, 126, 8, "thin")));
    b += P("M62 112 L72 92 H206 L216 112") + Ln(72, 100, 206, 100, "thin");
    b += R(118, 76, 50, 16, 2) + Ln(158, 76, 158, 58) + C(158, 53, 6) + C(158, 53, 2.5, "thin");
    b += Ln(86, 92, 78, 62, "thin");
    // wheeled UGV (small)
    b += R(262, 114, 82, 16, 3) + P("M270 114 L278 102 H322 L330 114") + C(278, 134, 8) + C(328, 134, 8) + Ln(300, 102, 300, 92, "thin");
    // drone
    b += R(356, 34, 84, 20, 5) + P("M356 44 L318 34 M440 44 L478 34");
    [318, 478].forEach((x) => (b += R(x - 6, 30, 12, 10, 2) + Ln(x, 30, x, 24) + E(x, 22, 32, 3)));
    b += C(398, 62, 7) + P("M372 54 L362 74 M424 54 L434 74 M354 74 H370 M426 74 H442");
    // datalink
    b += P("M158 47 C220 0 300 4 356 40", "dash") + P("M300 92 C320 72 340 66 372 60", "dash");
    return svg("0 0 520 150", b, "무인 지상차량과 드론의 협동");
  };

  // 우로보로스 (꼬리를 문 뱀)
  function ouro(cx, cy, ro, ri, ticks) {
    const pt = (r, deg) => { const a = (deg * Math.PI) / 180; return (cx + r * Math.cos(a)).toFixed(1) + " " + (cy + r * Math.sin(a)).toFixed(1); };
    const a = -52, bEnd = 248, mid = (ro + ri) / 2, w = ro - ri;
    let d = "M" + pt(ro, a) + " A" + ro + " " + ro + " 0 1 1 " + pt(ro, bEnd) +
      " L" + pt(mid, bEnd + 14) + " L" + pt(ri, bEnd) +
      " A" + ri + " " + ri + " 0 1 0 " + pt(ri, a) + " Z";
    let head = "M" + pt(ro, a) + " L" + pt(ro + w * 0.55, a - 10) + " L" + pt(ro + w * 0.45, a - 30) + " L" + pt(mid + w * 0.15, a - 46) +
      " L" + pt(mid, a - 42) + " L" + pt(mid - w * 0.15, a - 46) +
      " L" + pt(ri - w * 0.45, a - 30) + " L" + pt(ri - w * 0.55, a - 10) + " L" + pt(ri, a) + " Z";
    let out = P(d) + P(head) + P("M" + pt(mid, a - 42) + " L" + pt(mid, a - 26), "thin");
    out += P("M" + pt(mid + w * 0.35, a - 16) + " m-2.5 0 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0", "eye");
    for (let t = a + 14; t < bEnd - 6; t += ticks) out += P("M" + pt(ri + 2, t) + " L" + pt(ro - 2, t), "thin");
    return out;
  }

  I.ouroboros = () => {
    let b = ouro(260, 75, 56, 40, 13);
    b += Ln(118, 75, 196, 75, "thin") + T(116, 72, "DESIGN", "end");
    b += Ln(324, 75, 402, 75, "thin") + T(404, 72, "FEEDBACK");
    b += T(260, 79, "n + 1", "middle");
    return svg("0 0 520 150", b, "꼬리를 문 뱀 우로보로스: 설계와 피드백이 반복되는 루프");
  };

  // 궤도 데이터센터 (메인 화면용 측면 구도)
  I.orbitSide = () => {
    let b = "";
    b += P("M20 146 Q260 96 500 146");
    b += P("M10 118 Q260 20 510 118", "dash");
    [[60, 30], [470, 22], [420, 58], [130, 70]].forEach(([x, y]) => (b += P(`M${x - 3} ${y} H${x + 3} M${x} ${y - 3} V${y + 3}`, "thin")));
    const sx = 258, sy = 46;
    b += R(sx - 20, sy - 14, 40, 28, 2);
    [0, 1, 2].forEach((k) => (b += Ln(sx - 15, sy - 7 + k * 7, sx + 15, sy - 7 + k * 7, "thin")));
    [[sx - 92, sy - 10], [sx + 28, sy - 10]].forEach(([x, y]) => {
      b += R(x, y, 64, 20, 1) + Ln(x, y + 10, x + 64, y + 10, "thin");
      [1, 2, 3].forEach((k) => (b += Ln(x + k * 16, y, x + k * 16, y + 20, "thin")));
    });
    b += Ln(sx - 28, sy, sx - 20, sy) + Ln(sx + 20, sy, sx + 28, sy);
    b += P(`M${sx} ${sy - 14} V${sy - 24} M${sx - 6} ${sy - 28} Q${sx} ${sy - 22} ${sx + 6} ${sy - 28}`);
    const ax = 96, ay = 84;
    b += R(ax - 9, ay - 7, 18, 14, 2) + R(ax - 34, ay - 5, 22, 10, 1) + R(ax + 12, ay - 5, 22, 10, 1);
    b += P(`M${ax + 34} ${ay - 4} L${sx - 92} ${sy + 4}`, "dash-strong");
    const gx = 404, gy = 128;
    b += P(`M${sx + 8} ${sy + 14} L${gx - 4} ${gy - 12}`, "dash-strong");
    b += P(`M${gx - 11} ${gy - 9} Q${gx} ${gy + 3} ${gx + 11} ${gy - 9}`) + Ln(gx, gy - 3, gx, gy + 5) + Ln(gx - 7, gy + 5, gx + 7, gy + 5);
    return svg("0 0 520 150", b, "궤도를 도는 데이터센터 위성과 지상국");
  };

  /* ---------- Research topics (480 x 300) ---------- */
  I.pim = () => {
    let b = "", a = "", c = "";
    range(201).forEach((i) => {
      const x = 40 + i * 2, s = Math.sin(i / 14);
      a += (i ? "L" : "M") + x + " " + (70 + 26 * s).toFixed(1) + " ";
      c += (i ? "L" : "M") + x + " " + (70 - 26 * s).toFixed(1) + " ";
    });
    b += P(a) + P(c);
    range(21).forEach((i) => {
      const x = 40 + i * 20, s = Math.sin(((x - 40) / 2) / 14);
      b += Ln(x, 70 + 26 * s, x, 70 - 26 * s, "thin");
    });
    b += P("M40 150 H440 V222 H250 V214 H234 V222 H40 Z");
    range(8).forEach((i) => {
      const x = 54 + i * 48;
      b += R(x, 162, 36, 36, 1) + Ln(x + 18, 162, x + 18, 198, "thin") + Ln(x, 180, x + 36, 180, "thin");
    });
    range(64).forEach((i) => { const x = 46 + i * 6.2; if (x < 228 || x > 256) b += Ln(x, 222, x, 234, "thin"); });
    b += Ln(240, 100, 240, 150, "dash") + T(250, 128, "DNA → PIM");
    return svg("0 0 480 300", b, "DNA 이중나선과 PIM 메모리 모듈");
  };

  I.sim = () => {
    let b = "";
    const xs = [60, 170, 280, 390];
    xs.forEach((x, i) => {
      b += C(x, 60, 16);
      range(3).forEach((k) => (b += R(x - 46 + k * 9, 54, 7, 12)));
      if (i < xs.length - 1) b += Ln(x + 16, 60, xs[i + 1] - 50, 60) + P(`M${xs[i + 1] - 56} 55 L${xs[i + 1] - 50} 60 L${xs[i + 1] - 56} 65`);
    });
    b += T(60, 96, "ARRIVE", "middle") + T(390, 96, "DEPART", "middle");
    b += Ln(20, 270, 460, 270);
    b += R(40, 250, 70, 20, 2) + C(75, 240, 8) + P("M70 234 L140 170 L150 180 L80 244 Z") + C(145, 175, 7) + P("M148 170 L210 196 L206 208 L144 182 Z") + P("M212 204 V218 M204 218 H220");
    b += R(200, 226, 240, 14, 7);
    range(9).forEach((i) => (b += C(212 + i * 27, 233, 5, "thin")));
    b += R(250, 200, 30, 26) + R(310, 204, 26, 22) + R(372, 194, 34, 32) + Ln(389, 194, 389, 226, "thin");
    b += Ln(220, 240, 220, 270) + Ln(420, 240, 420, 270);
    b += Ln(60, 112, 60, 160, "dash") + Ln(390, 112, 390, 180, "dash");
    return svg("0 0 480 300", b, "이산 사건 시뮬레이션 흐름과 제조 라인");
  };

  I.wargame = () => {
    let b = "";
    const s = 24, h = Math.sqrt(3) * s;
    const hex = (cx, cy) => "M" + range(6).map((k) => { const a = (Math.PI / 3) * k; return (cx + s * Math.cos(a)).toFixed(1) + " " + (cy + s * Math.sin(a)).toFixed(1); }).join(" L") + " Z";
    const centers = [];
    range(11).forEach((col) => range(5).forEach((row) => {
      const cx = 30 + col * 1.5 * s, cy = 40 + row * h + (col % 2 ? h / 2 : 0);
      if (cy < 270) { b += P(hex(cx, cy), "thin"); centers.push([cx, cy, col, row]); }
    }));
    const at = (c, r) => centers.find((p) => p[2] === c && p[3] === r);
    const unit = (c, r, kind) => {
      const [x, y] = at(c, r);
      let u = R(x - 14, y - 9, 28, 18);
      if (kind === "inf") u += Ln(x - 14, y - 9, x + 14, y + 9) + Ln(x - 14, y + 9, x + 14, y - 9);
      if (kind === "arm") u += E(x, y, 9, 5);
      if (kind === "uav") u += P(`M${x - 8} ${y + 4} L${x} ${y - 4} L${x + 8} ${y + 4}`);
      return u;
    };
    b += unit(1, 3, "inf") + unit(2, 1, "arm") + unit(3, 3, "uav") + unit(8, 1, "inf") + unit(9, 3, "arm");
    const path = [at(3, 3), at(4, 2), at(5, 2), at(6, 1), at(7, 1)].map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" ");
    b += P(path, "dash-strong");
    const [ex, ey] = at(7, 1);
    b += P(`M${ex - 10} ${ey - 6} L${ex} ${ey} L${ex - 10} ${ey + 6}`);
    b += P("M222 20 V280", "dash");
    return svg("0 0 480 300", b, "육각 격자 워게임 지도와 부대 기호, 기동 경로");
  };

  I.nearfar = () => {
    let b = "";
    [40, 170].forEach((y) => {
      b += R(30, y, 160, 80, 3) + C(70, y + 40, 24) + C(70, y + 40, 6, "thin") + R(110, y + 22, 34, 36, 1);
      range(4).forEach((k) => (b += R(152, y + 20 + k * 10, 26, 8)));
      b += T(110, y + 74, "GPU");
      b += Ln(190, y + 40, 250, 150);
    });
    b += R(250, 125, 70, 50, 2) + T(285, 155, "CXL", "middle");
    range(5).forEach((k) => {
      const y = 70 + k * 34;
      b += R(360, y, 100, 24, 2) + Ln(372, y, 372, y + 24, "thin") + Ln(384, y, 384, y + 24, "thin");
      b += Ln(320, 150, 360, y + 12, "thin");
    });
    b += T(410, 60, "FAR MEMORY", "middle") + T(160, 30, "NEAR (HBM)", "middle");
    return svg("0 0 480 300", b, "다중 GPU와 CXL로 연결된 Far Memory 풀");
  };

  I.hetero = () => {
    let b = "";
    b += R(130, 30, 240, 240, 4);
    range(14).forEach((i) => {
      const p = 42 + i * 16.5;
      b += Ln(p, 30, p, 20, "thin") + Ln(p, 270, p, 280, "thin");
      b += Ln(130, p, 120, p, "thin") + Ln(370, p, 380, p, "thin");
    });
    const names = ["CPU", "GPU", "NPU", "PIM", "NoC", "DPU", "GPU", "NPU", "ISC"];
    range(9).forEach((i) => {
      const x = 148 + (i % 3) * 72, y = 48 + Math.floor(i / 3) * 72;
      b += R(x, y, 60, 60, 2) + T(x + 30, y + 35, names[i], "middle");
      if (i % 3 < 2) b += Ln(x + 60, y + 30, x + 72, y + 30);
      if (i < 6) b += Ln(x + 30, y + 60, x + 30, y + 72);
    });
    [[30, 90], [30, 160], [400, 90], [400, 160]].forEach(([x, y]) => {
      range(4).forEach((k) => (b += R(x, y + k * 9, 70, 9)));
      b += Ln(x < 200 ? x + 70 : x, y + 18, x < 200 ? 120 : 380, y + 18, "dash");
    });
    return svg("0 0 480 300", b, "xPU 타일과 메모리로 구성된 이종 컴퓨팅 칩");
  };

  I.provenance = () => {
    let b = "";
    // 콘텐츠 이미지 + AI 생성 판별 박스
    b += R(30, 40, 200, 140, 2) + P("M40 170 L95 100 L128 136 L165 88 L220 170", "thin") + C(192, 70, 11, "thin");
    b += P("M88 82 h12 M88 82 v12 M188 82 h-12 M188 82 v12 M88 158 h12 M88 158 v-12 M188 158 h-12 M188 158 v-12");
    b += R(88, 82, 100, 76, 0).replace("<rect", '<rect class="dash"');
    b += T(88, 76, "AI GEN 0.97");
    b += C(214, 168, 20) + Ln(228, 182, 246, 200);
    b += T(30, 198, "CONTENT");
    // C2PA manifest
    b += T(300, 30, "C2PA MANIFEST");
    [["CLAIM", 40], ["ASSERTIONS", 96], ["SIGNATURE", 152]].forEach(([t, y], i) => {
      b += R(300, y, 150, 36, 2) + T(314, y + 22, t) + Ln(430, y + 12, 438, y + 12, "thin") + Ln(430, y + 18, 438, y + 18, "thin") + Ln(430, y + 24, 438, y + 24, "thin");
      if (i < 2) b += Ln(375, y + 36, 375, y + 56);
    });
    b += Ln(230, 110, 296, 114) + P("M290 109 L297 114 L290 119");
    // 재활용 추적: 원본과 2차 저작물의 특징점 매칭
    const mini = (x, y) => R(x, y, 72, 48, 1) + P(`M${x + 4} ${y + 44} L${x + 24} ${y + 18} L${x + 36} ${y + 32} L${x + 50} ${y + 12} L${x + 68} ${y + 44}`, "thin");
    b += mini(300, 226) + mini(392, 222);
    [[324, 244], [336, 258], [350, 238]].forEach(([x, y], i) => {
      const dx = 92, dy = [-4, -4, -4][i];
      b += C(x, y, 2.5) + C(x + dx, y + dy, 2.5) + Ln(x, y, x + dx, y + dy, "dash");
    });
    b += T(300, 290, "SOURCE") + T(392, 290, "DERIVED");
    return svg("0 0 480 300", b, "콘텐츠의 AI 생성 판별, C2PA 출처 정보, 원본과 2차 저작물의 특징점 매칭");
  };

  // Project Ouroboros: 설계, 실행, 피드백, 개선의 재귀 루프
  I.loop = () => {
    let b = ouro(120, 150, 84, 62, 11);
    b += T(120, 146, "AI AGENT", "middle") + T(120, 162, "GEN n", "middle");
    const steps = ["DESIGN", "BUILD & RUN", "FEEDBACK", "IMPROVE"];
    steps.forEach((t, i) => {
      const y = 36 + i * 62;
      b += R(270, y, 150, 38, 2) + T(286, y + 23, t);
      b += T(410, y + 23, String(i + 1).padStart(2, "0"), "end");
      if (i < 3) b += Ln(345, y + 38, 345, y + 62) + P(`M340 ${y + 56} L345 ${y + 62} L350 ${y + 56}`);
    });
    // 재귀: IMPROVE → DESIGN
    b += P("M420 241 H452 V55 H426") + P("M432 50 L426 55 L432 60");
    b += T(458, 150, "n+1").replace("<text", '<text transform="rotate(90 458 150)"');
    // 에이전트 ↔ 루프 연결
    b += Ln(204, 150, 262, 150, "dash") + Ln(204, 120, 270, 55, "dash");
    return svg("0 0 480 300", b, "AI 에이전트가 설계, 실행, 피드백, 개선을 반복하는 재귀 루프");
  };

  /* ---------- Join us: 액자형 인물 그림 (240 x 300) ----------
     실제 인물의 얼굴 대신 상징적인 모습(방한 후드와 고글, 우주복 헬멧)으로 그립니다. */
  const frame = () =>
    R(8, 8, 224, 284) + R(20, 20, 200, 260, 0).replace("<rect", '<rect class="thin"') +
    P("M8 30 V8 H30 M210 8 H232 V30 M232 270 V292 H210 M30 292 H8 V270", "frame-corner");
  const sparkle = (x, y, r) => P(`M${x - r} ${y} H${x + r} M${x} ${y - r} V${y + r} M${x - r * 0.6} ${y - r * 0.6} L${x + r * 0.6} ${y + r * 0.6} M${x - r * 0.6} ${y + r * 0.6} L${x + r * 0.6} ${y - r * 0.6}`, "thin");

  I.explorer = () => {
    let b = frame();
    b += sparkle(48, 52, 6) + sparkle(190, 66, 5) + sparkle(178, 36, 3) + sparkle(60, 96, 3);
    // 어깨와 파카
    b += P("M24 280 C30 228 56 204 84 198 M216 280 C210 228 184 204 156 198");
    b += Ln(120, 214, 120, 280, "thin");
    range(6).forEach((i) => (b += Ln(116, 222 + i * 10, 124, 222 + i * 10, "thin")));
    b += P("M62 236 C80 246 100 248 112 246 M178 236 C160 246 140 248 128 246", "thin");
    // 후드
    b += E(120, 132, 70, 80);
    // 털 장식
    let fur = "";
    range(36).forEach((i) => {
      const a = (i / 36) * Math.PI * 2, r = i % 2 ? 50 : 58;
      fur += (i ? "L" : "M") + (120 + r * Math.cos(a) * 0.86).toFixed(1) + " " + (134 + r * Math.sin(a)).toFixed(1) + " ";
    });
    b += P(fur + "Z", "thin");
    // 얼굴 자리: 고글과 목도리 (이목구비는 그리지 않음)
    b += E(120, 134, 38, 44);
    b += P("M84 122 H156");
    b += E(104, 124, 13, 9) + E(136, 124, 13, 9) + Ln(117, 124, 123, 124);
    b += P("M90 128 L96 120 M128 128 L134 120", "thin");
    b += P("M84 150 C100 160 140 160 156 150 L158 168 C140 178 100 178 82 168 Z");
    b += P("M92 158 C110 166 130 166 148 158", "thin");
    return svg("0 0 240 300", b, "방한 후드와 고글을 쓴 남극 탐험가 그림");
  };

  I.astronaut = () => {
    let b = frame();
    [[44, 48, 4], [196, 40, 6], [176, 92, 3], [56, 110, 3], [204, 140, 3]].forEach(([x, y, r]) => (b += sparkle(x, y, r)));
    // 멀리 올라가는 로켓
    b += P("M182 70 L190 52 L198 70 Z M184 70 H196 V78 H184 Z") + P("M190 82 C194 110 204 130 206 170", "dash");
    // 어깨와 우주복
    b += P("M22 282 C26 232 50 212 82 206 M218 282 C214 232 190 212 158 206");
    b += E(120, 206, 46, 12);
    b += R(96, 232, 48, 30, 3) + Ln(104, 242, 136, 242, "thin") + Ln(104, 250, 128, 250, "thin") + C(64, 250, 7, "thin") + C(176, 250, 7, "thin");
    // 헬멧과 바이저 (얼굴은 비침 처리)
    b += C(120, 134, 66);
    b += P("M74 128 C74 98 96 84 120 84 C144 84 166 98 166 128 C166 158 146 176 120 176 C94 176 74 158 74 128 Z");
    b += P("M92 104 C100 96 110 92 120 92", "thin") + P("M96 116 L122 92 M104 124 L134 96", "thin");
    b += R(112, 64, 16, 8, 2).replace("<rect", '<rect class="thin"');
    return svg("0 0 240 300", b, "바이저를 내린 우주비행사 헬멧과 로켓 그림");
  };

  // 궤도 데이터센터: 지구 곡면, 궤도, 서버 모듈 위성, 위성 간 광링크, 지상국
  I.orbit = () => {
    let b = "";
    // 별
    [[40, 40], [430, 30], [380, 70], [70, 110], [455, 150], [20, 200]].forEach(([x, y]) => (b += P(`M${x - 3} ${y} H${x + 3} M${x} ${y - 3} V${y + 3}`, "thin")));
    // 지구 곡면과 위도선
    b += P("M0 262 Q240 188 480 262");
    b += P("M40 276 Q240 214 440 276", "dash") + P("M100 292 Q240 244 380 292", "dash");
    // 궤도
    b += E(240, 176, 222, 52, "dash");
    b += T(30, 162, "LEO");
    // 주 위성 (서버 모듈)
    const sx = 292, sy = 104;
    b += R(sx - 26, sy - 18, 52, 36, 2);
    [0, 1, 2].forEach((k) => (b += Ln(sx - 20, sy - 9 + k * 9, sx + 20, sy - 9 + k * 9, "thin") + C(sx + 15, sy - 9 + k * 9 + 0.1, 1.2, "thin")));
    b += Ln(sx - 26, sy, sx - 36, sy) + Ln(sx + 26, sy, sx + 36, sy);
    [[sx - 112, sy - 13], [sx + 36, sy - 13]].forEach(([x, y]) => {
      b += R(x, y, 76, 26, 1);
      [1, 2, 3].forEach((k) => (b += Ln(x + k * 19, y, x + k * 19, y + 26, "thin")));
      b += Ln(x, y + 13, x + 76, y + 13, "thin");
    });
    b += P(`M${sx} ${sy - 18} V${sy - 30} M${sx - 8} ${sy - 36} Q${sx} ${sy - 28} ${sx + 8} ${sy - 36}`);
    b += P(`M${sx - 14} ${sy + 18} L${sx - 18} ${sy + 30} H${sx + 18} L${sx + 14} ${sy + 18}`, "thin");
    // 보조 위성
    const ax = 112, ay = 178;
    b += R(ax - 12, ay - 9, 24, 18, 2) + R(ax - 46, ay - 7, 30, 14, 1) + R(ax + 16, ay - 7, 30, 14, 1);
    b += Ln(ax - 16, ay, ax - 12, ay) + Ln(ax + 12, ay, ax + 16, ay);
    // 위성 간 광링크, 지상 다운링크
    b += P(`M${ax + 46} ${ay - 6} L${sx - 112} ${sy + 10}`, "dash-strong");
    const gx = 392, gy = 236;
    b += P(`M${sx + 10} ${sy + 30} L${gx - 4} ${gy - 16}`, "dash-strong");
    b += P(`M${gx - 14} ${gy - 12} Q${gx} ${gy + 4} ${gx + 14} ${gy - 12}`) + Ln(gx, gy - 4, gx, gy + 6) + Ln(gx - 8, gy + 6, gx + 8, gy + 6);
    b += T(gx + 18, gy + 6, "GROUND");
    return svg("0 0 480 300", b, "지구 궤도를 도는 서버 모듈 위성, 위성 간 광링크, 지상국 다운링크");
  };

  /* ---------- Teaching: 과목별 움직이는 그림 (360 x 110) ---------- */
  // 움직이는 작은 블록(데이터, 명령어)
  const Tok = (w, h, motion, extra) =>
    `<rect class="solid" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="1">${motion}${extra || ""}</rect>`;
  const Move = (path, dur, begin, opts) =>
    `<animateMotion path="${path}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"${opts || ""}/>`;
  const Fade = (dur, begin, values, keyTimes) =>
    `<animate attributeName="opacity" values="${values || "0;1;1;0"}" keyTimes="${keyTimes || "0;0.06;0.9;1"}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>`;

  // 컴퓨터구조: 5단 파이프라인 + 레지스터 파일, 캐시, DRAM. 명령어가 단계를 한 칸씩 이동
  I.courseArch = () => {
    let b = "";
    const st = ["IF", "ID", "EX", "MEM", "WB"], cx = (i) => 38 + i * 68;
    st.forEach((n, i) => {
      b += R(cx(i) - 26, 14, 52, 28, 2) + T(cx(i), 31.5, n, "middle");
      if (i < 4) b += Ln(cx(i) + 26, 28, cx(i + 1) - 26, 28, "thin");
    });
    // 아래: 레지스터 파일, L1 캐시, DRAM
    b += R(80, 70, 52, 26, 2) + T(106, 86.5, "REG", "middle");
    b += R(216, 70, 52, 26, 2) + T(242, 86.5, "L1 $", "middle");
    b += R(296, 70, 56, 26, 2) + T(324, 86.5, "DRAM", "middle");
    b += Ln(106, 42, 106, 70, "thin") + Ln(242, 42, 242, 70, "thin") + Ln(268, 83, 296, 83, "thin");
    b += P("M168 42 Q140 60 112 42", "dash");                                   // 포워딩
    // 명령어 토큰: 1초마다 한 단계씩 (파이프라인)
    const kp = "0;0;0.25;0.25;0.5;0.5;0.75;0.75;1;1", kt = "0;0.14;0.2;0.34;0.4;0.54;0.6;0.74;0.8;1";
    range(3).forEach((k) => {                                                   // 3개만 두어 빈 단계(버블)가 보이게
      b += Tok(12, 8, Move("M38 52 H310", 5, -k * 1.0, ` calcMode="linear" keyPoints="${kp}" keyTimes="${kt}"`), Fade(5, -k, "0;1;1;0", "0;0.04;0.92;1"));
    });
    // 데이터 이동: 레지스터 ↔ ID, 캐시 ↔ MEM, DRAM ↔ 캐시
    b += Tok(6, 6, Move("M106 68 V44 V68", 2, 0));
    b += Tok(6, 6, Move("M242 44 V68 V44", 2.4, -0.6));
    b += Tok(8, 5, Move("M272 83 H292 H272", 1.8, -0.3));
    return svg("0 0 360 110", b, "5단 파이프라인을 따라 이동하는 명령어와 캐시, 메모리 사이의 데이터 이동");
  };

  // 항공드론알고리즘: 경로점을 따라 화물을 나르는 드론, 상자를 들고 걷는 휴머노이드
  I.courseDrone = () => {
    let b = "";
    b += Ln(6, 100, 354, 100);
    // 비행 경로와 경로점
    const route = "M330 34 C292 6 236 46 196 26 C160 8 122 30 92 24 C140 52 268 58 330 34 Z";
    b += P(route, "dash");
    [[196, 26], [92, 24], [330, 34]].forEach(([x, y]) => (b += P(`M${x - 3} ${y} H${x + 3} M${x} ${y - 3} V${y + 3}`, "thin")));
    // 착륙장, 선반
    b += E(250, 99, 18, 3, "thin") + T(250, 96, "H", "middle");
    b += R(304, 72, 22, 14) + R(328, 72, 22, 14) + R(316, 58, 22, 14) + Ln(300, 86, 354, 86, "thin");
    // 드론 (본체, 팔, 프로펠러, 매달린 화물)
    const prop = (x, d) => `<ellipse cx="${x}" cy="-7" rx="9" ry="1.4"><animate attributeName="rx" values="9;2.5;9" dur="0.16s" begin="${d}s" repeatCount="indefinite"/></ellipse>`;
    let dr = R(-11, -4, 22, 7, 2) + Ln(-11, -1, -18, -6) + Ln(11, -1, 18, -6) + Ln(-18, -6, -18, -8) + Ln(18, -6, 18, -8);
    dr += prop(-18, 0) + prop(18, -0.08);
    dr += Ln(0, 3, 0, 11, "thin") + R(-5, 11, 10, 8, 1);
    b += `<g>${dr}${Move(route, 10, 0)}</g>`;
    // 휴머노이드 (G1 형태: 둥근 머리와 바이저, 몸통, 상자를 든 팔, 걷는 다리)
    const leg = (dx, d) =>
      `<g><path d="M${dx} 0 L${dx + 2} 11 L${dx} 21 M${dx - 2} 21 H${dx + 5}"/>` +
      `<animateTransform attributeName="transform" type="rotate" values="16 ${dx} 0;-16 ${dx} 0;16 ${dx} 0" dur="1s" begin="${d}s" repeatCount="indefinite"/></g>`;
    let hm = R(-6, -40, 12, 11, 4) + Ln(-4, -35, 4, -35, "thin");           // 머리, 바이저
    hm += Ln(0, -29, 0, -27) + R(-8, -27, 16, 19, 3);                        // 목, 몸통
    hm += P("M-7 -24 L-3 -15 L8 -16 M7 -24 L11 -16 L8 -16");                 // 팔 (앞으로)
    hm += R(8, -22, 13, 11, 1) + Ln(8, -17, 21, -17, "thin");                // 들고 있는 상자
    hm += `<g transform="translate(0 -8)">${leg(-3, 0)}${leg(3, -0.5)}</g>`;
    b += `<g><g transform="translate(0 92)">${hm}</g>` +
      `<animateTransform attributeName="transform" type="translate" values="24 0;210 0" dur="9s" repeatCount="indefinite"/>` +
      `${Fade(9, 0, "0;1;1;0", "0;0.06;0.9;1")}</g>`;
    return svg("0 0 360 110", b, "경로점을 따라 화물을 나르는 드론과 상자를 들고 걷는 휴머노이드 로봇");
  };

  // 컴퓨터시스템설계론: CPU, GPU(SM 배열, L2), HBM 사이를 오가는 데이터와 작동하는 SM
  I.courseGpu = () => {
    let b = "";
    b += R(6, 38, 40, 34, 2) + T(26, 58, "CPU", "middle");
    b += Ln(46, 55, 70, 55, "thin");
    b += R(70, 6, 284, 98, 4) + T(84, 16, "GPU · SM");
    const sx = (i) => 84 + i * 40, sy = (r) => 22 + r * 40;
    range(2).forEach((r) => range(4).forEach((i) => {
      const x = sx(i), y = sy(r), d = -((i * 2 + r * 3) % 7) * 0.35;
      b += R(x, y, 34, 32, 2);
      range(3).forEach((k) => (b += Ln(x + 6, y + 9 + k * 7, x + 28, y + 9 + k * 7, "thin")));
      b += `<rect class="solid soft" x="${x + 3}" y="${y + 3}" width="28" height="26" rx="1">` +
        `<animate attributeName="opacity" values="0;0.28;0" dur="2.5s" begin="${d}s" repeatCount="indefinite"/></rect>`;
    }));
    b += R(246, 22, 14, 72, 2) + T(253, 18, "L2", "middle");
    [22, 62].forEach((y) => { b += R(282, y, 62, 32, 2); range(3).forEach((k) => (b += Ln(282, y + 8 + k * 8, 344, y + 8 + k * 8, "thin"))); });
    b += T(313, 18, "HBM", "middle");
    b += Ln(260, 38, 282, 38, "thin") + Ln(260, 78, 282, 78, "thin");
    // HBM → L2 → SM 으로 가는 데이터, 결과는 다시 L2 로
    [[38, 0], [78, -0.7], [38, -1.4], [78, -2.1]].forEach(([y, d]) => {
      const tgt = y === 38 ? 38 : 76;
      b += Tok(7, 5, Move(`M280 ${y} H262 M246 ${tgt} H${sx(3) + 36}`, 2.8, d, ` calcMode="linear"`), Fade(2.8, d));
    });
    b += Tok(6, 5, Move(`M${sx(3) + 36} 58 H244`, 2.2, -1), Fade(2.2, -1));
    b += Tok(8, 5, Move("M48 55 H68", 1.4, 0), Fade(1.4, 0));
    return svg("0 0 360 110", b, "HBM에서 L2 캐시를 거쳐 GPU의 SM으로 이동하는 데이터와 CPU 연결");
  };

  /* ---------- Facilities: 서버 와이어프레임 (420 x 240), 은은하게 움직임 ---------- */
  const Blink = (dur, begin, lo, hi) =>
    `<animate attributeName="opacity" values="${lo};${hi};${lo}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>`;
  const Spin = (cx, cy, dur) =>
    `<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="${dur}s" repeatCount="indefinite"/>`;
  const Flow = (dur) => `<animate attributeName="stroke-dashoffset" from="0" to="-24" dur="${dur}s" repeatCount="indefinite"/>`;

  // (1) UPMEM PIM 서버: Xeon CPU, 일반 DIMM 과 PIM DIMM. PIM 칩(DPU)이 번갈아 연산
  I.facPim = () => {
    let b = R(10, 10, 400, 220, 4);
    b += R(30, 78, 92, 92, 3) + R(42, 90, 68, 68, 2) + T(76, 128, "XEON", "middle");
    range(5).forEach((k) => (b += Ln(30 + 14 + k * 16, 78, 30 + 14 + k * 16, 70, "thin") + Ln(30 + 14 + k * 16, 170, 30 + 14 + k * 16, 178, "thin")));
    const dimms = [["DDR", 34], ["DDR", 64], ["PIM", 102], ["PIM", 132], ["DDR", 170], ["DDR", 200]];
    dimms.forEach(([kind, y], di) => {
      b += R(168, y - 10, 226, 20, 2) + T(176, y + 3.5, kind);
      range(8).forEach((k) => {
        const x = 206 + k * 23;
        if (kind === "PIM") {
          b += R(x, y - 6, 17, 12, 1);
          b += `<rect class="solid soft" x="${x + 2}" y="${y - 4}" width="13" height="8">${Blink(1.6, -((k * 3 + di * 5) % 8) * 0.2, 0, 0.9)}</rect>`;
        } else b += R(x, y - 5, 17, 10, 1);
      });
      b += Ln(122, 124, 146, 124, "thin") + Ln(146, 124, 146, y) + Ln(146, y, 168, y, "thin");
    });
    // CPU ↔ PIM 데이터
    [[102, 0], [132, -0.9]].forEach(([y, d]) =>
      (b += Tok(8, 5, Move(`M124 124 H146 V${y} H166`, 1.8, d), Fade(1.8, d))));
    b += T(390, 228, "256 GB DRAM · 16 GB PIM", "end");
    return svg("0 0 420 240", b, "Xeon CPU 옆에 일반 메모리와 PIM 메모리 모듈이 꽂혀 있고, PIM 칩이 번갈아 연산하는 모습");
  };

  // (2) Threadripper PRO + Alveo U50 x3 + SmartSSD: PCIe 로 연결된 FPGA 카드와 연산형 저장장치
  I.facFpga = () => {
    let b = R(10, 10, 400, 220, 4);
    b += R(24, 84, 84, 72, 3) + R(34, 94, 64, 52, 2) + T(66, 118, "TR PRO", "middle") + T(66, 132, "32C", "middle");
    b += Ln(108, 120, 132, 120) + Ln(132, 36, 132, 208) + T(132, 224, "PCIe", "middle");
    const cards = [20, 72, 124];
    cards.forEach((y, i) => {
      b += Ln(132, y + 18, 150, y + 18, "thin");
      b += R(150, y, 246, 36, 2) + Ln(150, y, 150, y + 36) + R(146, y + 4, 4, 28);           // 카드, 브래킷
      b += T(160, y + 22, "ALVEO U50");
      b += R(240, y + 5, 40, 26, 2) + T(260, y + 22, "FPGA", "middle");
      [288, 304].forEach((x, k) => {
        b += R(x, y + 8, 12, 20, 1);
        b += `<rect class="solid soft" x="${x + 2}" y="${y + 10}" width="8" height="16">${Blink(2.2, -(i * 0.6 + k * 0.35), 0.05, 0.75)}</rect>`;
      });
      b += T(388, y + 22, "HBM2", "end");
    });
    // SmartSSD (NAND + FPGA)
    const sy = 176;
    b += Ln(132, sy + 20, 150, sy + 20, "thin") + R(150, sy, 246, 40, 6) + T(160, sy + 24, "SMARTSSD");
    range(5).forEach((k) => (b += R(236 + k * 20, sy + 10, 14, 20, 1)));
    b += R(344, sy + 9, 24, 22, 2) + T(356, sy + 24, "F", "middle");
    // 데이터: SSD 안에서 NAND → FPGA (근접 처리), CPU → 각 카드
    b += Tok(7, 5, Move(`M240 ${sy + 20} H340`, 1.6, 0), Fade(1.6, 0));
    cards.forEach((y, i) => (b += Tok(8, 5, Move(`M110 120 H132 V${y + 18} H148`, 2.4, -i * 0.8, ` calcMode="linear"`), Fade(2.4, -i * 0.8))));
    return svg("0 0 420 240", b, "Threadripper PRO CPU 가 PCIe 로 Alveo U50 FPGA 카드 세 장과 SmartSSD 에 연결된 구성");
  };

  // (2-b) Ryzen 9 9900X3D 서버: 3D V-Cache CPU, DDR5 네 개, 저장장치, C++ → RTL → 비트스트림(HLS) 흐름
  I.facHls = () => {
    let b = R(10, 10, 400, 220, 4);
    // CPU (패키지, 다이, 위에 쌓인 V-Cache)
    b += R(26, 66, 104, 104, 3) + R(40, 80, 76, 76, 2) + T(78, 136, "9900X3D", "middle");
    b += R(46, 88, 64, 22, 1) + T(78, 103, "V-CACHE", "middle");
    b += `<rect class="solid soft" x="48" y="90" width="60" height="18">${Blink(2.6, 0, 0.05, 0.45)}</rect>`;
    range(6).forEach((k) => (b += Ln(36 + k * 17, 66, 36 + k * 17, 58, "thin") + Ln(36 + k * 17, 170, 36 + k * 17, 178, "thin")));
    // DDR5 네 개
    [148, 166, 184, 202].forEach((x, i) => {
      b += R(x, 34, 12, 168, 2);
      range(6).forEach((k) => (b += R(x + 3, 44 + k * 26, 6, 16, 1)));
    });
    b += T(181, 222, "DDR5 256 GB", "middle");
    b += Ln(130, 118, 148, 118, "thin");
    b += Tok(6, 6, Move("M132 118 H146 H132", 1.4, 0));
    // 저장장치 (10 TB)
    [[34, 0], [78, -0.6]].forEach(([y, d]) => {
      b += R(236, y, 158, 34, 3) + T(248, y + 21, "SSD") + Ln(290, y + 8, 290, y + 26, "thin");
      range(4).forEach((k) => (b += R(300 + k * 18, y + 9, 12, 16, 1)));
      b += `<circle class="solid" cx="382" cy="${y + 17}" r="2.4">${Blink(0.9, d, 0.15, 1)}</circle>`;
    });
    b += T(394, 128, "10 TB", "end");
    // HLS: C++ → RTL → BIT
    const hx = [236, 296, 356], hy = 162;
    ["C++", "RTL", "BIT"].forEach((n, i) => {
      b += R(hx[i], hy, 40, 30, 2) + T(hx[i] + 20, hy + 19, n, "middle");
      if (i < 2) b += Ln(hx[i] + 40, hy + 15, hx[i + 1], hy + 15, "thin");
    });
    b += T(236, hy - 8, "HLS");
    b += Tok(8, 5, Move(`M256 ${hy + 40} H376`, 2.4, 0, ` calcMode="linear" keyPoints="0;0;0.5;0.5;1;1" keyTimes="0;0.25;0.4;0.65;0.8;1"`), Fade(2.4, 0, "0;1;1;0", "0;0.05;0.92;1"));
    return svg("0 0 420 240", b, "3D V-Cache CPU, DDR5 메모리 네 개, 저장장치, 그리고 C++ 코드가 RTL을 거쳐 비트스트림으로 합성되는 흐름");
  };

  // (3) RTX PRO 6000 Max-Q x4: 블로어 팬이 도는 GPU 네 장과 뒤로 빠지는 배기
  I.facGpu4 = () => {
    let b = R(10, 10, 400, 220, 4);
    [24, 76, 128, 180].forEach((y, i) => {
      b += R(44, y, 340, 38, 3) + R(40, y + 4, 4, 30);                        // 카드, 브래킷
      b += T(56, y + 16, "RTX PRO 6000") + T(56, y + 30, "96 GB");
      range(13).forEach((k) => (b += Ln(170 + k * 10, y + 8, 170 + k * 10, y + 30, "thin")));   // 방열 핀
      const fx = 350, fy = y + 19;
      b += C(fx, fy, 14);
      b += `<g>${range(6).map((k) => { const a = (k * 60) * Math.PI / 180; return Ln(fx, fy, (fx + 12 * Math.cos(a)).toFixed(1), (fy + 12 * Math.sin(a)).toFixed(1), "thin"); }).join("")}${Spin(fx, fy, 1.1 + i * 0.07)}</g>`;
      b += `<path class="dash" d="M38 ${y + 12} H16 M38 ${y + 26} H16" style="stroke-dasharray:6 6">${Flow(0.9)}</path>`;  // 배기
    });
    return svg("0 0 420 240", b, "블로어 팬이 도는 RTX PRO 6000 그래픽카드 네 장이 꽂힌 워크스테이션");
  };

  // (4) DGX Spark x3: 입체 상자 세 대가 QSFP 케이블로 연결되어 데이터를 주고받음
  I.facSpark = () => {
    let b = "";
    const xs = [22, 152, 282], y = 112, w = 104, h = 58, d = 14;
    xs.forEach((x, i) => {
      b += R(x, y, w, h, 3);
      b += P(`M${x} ${y} L${x + d} ${y - d} H${x + w + d} L${x + w} ${y} M${x + w + d} ${y - d} V${y + h - d} L${x + w} ${y + h}`);
      range(4).forEach((r) => range(8).forEach((c) => (b += C(x + 15 + c * 10.5, y + 12 + r * 9, 1.6, "thin"))));   // 앞면 타공
      b += T(x, y + h + 18, "DGX SPARK") + T(x, y + h + 32, "128 GB");
      b += `<circle class="solid" cx="${x + w - 8}" cy="${y + h - 8}" r="2.2">${Blink(2, -i * 0.7, 0.2, 1)}</circle>`;
    });
    // 뒤쪽 QSFP 케이블 (위로 둥글게)
    const cab = [`M${xs[0] + 84} ${y - 14} C${xs[0] + 104} 34 ${xs[1] + 46} 34 ${xs[1] + 66} ${y - 14}`,
                 `M${xs[1] + 84} ${y - 14} C${xs[1] + 104} 34 ${xs[2] + 46} 34 ${xs[2] + 66} ${y - 14}`];
    cab.forEach((c, i) => {
      b += P(c);
      b += Tok(7, 5, Move(c, 1.6, -i * 0.5), Fade(1.6, -i * 0.5));
      b += Tok(7, 5, Move(c, 1.6, -0.8 - i * 0.5, ` keyPoints="1;0" keyTimes="0;1" calcMode="linear"`), Fade(1.6, -0.8 - i * 0.5));
    });
    b += T(210, 36, "QSFP · 200 Gb/s", "middle");
    return svg("0 0 420 240", b, "QSFP 케이블로 서로 연결된 DGX Spark 세 대");
  };

  /* ---------- Tutorials: 분야별 그림 (420 x 260), 움직이고 마우스를 올리면 부분이 밝아짐 ---------- */
  // 부분 묶음: 마우스를 올리면 강조되고 이름이 툴팁으로 보임
  const Part = (title, body) => `<g class="part"><title>${title}</title>${body}</g>`;
  const polyLen = (pts) => pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

  // Computer Architecture: 4코어 + 링 인터커넥트 + L3 + 메모리 컨트롤러 + HBM + I/O
  I.tutArch = () => {
    let b = "";
    const ring = "M134 78 H286 Q306 78 306 98 V162 Q306 182 286 182 H134 Q114 182 114 162 V98 Q114 78 134 78 Z";
    b += Part("Ring interconnect", P(ring) + [[154, 78], [266, 78], [154, 182], [266, 182], [306, 130], [114, 130]].map(([x, y]) => R(x - 4, y - 4, 8, 8, 1)).join(""));
    b += Part("Shared L3 cache (3 slices)", range(3).map((k) => R(146 + k * 44, 112, 40, 36, 2) + T(166 + k * 44, 134, "L3", "middle") +
      `<rect class="solid soft" x="${149 + k * 44}" y="${115}" width="34" height="30" rx="1">${Blink(3, -k * 1, 0, 0.3)}</rect>`).join(""));
    [[110, 12, 154, 64, 78], [222, 12, 266, 64, 78], [110, 196, 154, 196, 182], [222, 196, 266, 196, 182]].forEach(([x, y, cx, ly, ry], i) => {
      let c = R(x, y, 88, 52, 3) + T(x + 8, y + 16, "CORE " + i) + R(x + 62, y + 6, 20, 14, 1) + T(x + 72, y + 16, "L1", "middle");
      range(5).forEach((k) => {
        c += R(x + 8 + k * 15, y + 26, 11, 18, 1);
        c += `<rect class="solid" x="${x + 9 + k * 15}" y="${y + 27}" width="9" height="16">${Blink(1.5, -((k + i * 2) % 5) * 0.3, 0, 0.85)}</rect>`;
      });
      b += Part("Core " + i + ": 5-stage pipeline + L1", c + Ln(cx, ly, cx, ry, "thin"));
    });
    b += Part("Memory controller", R(326, 106, 34, 48, 2) + T(343, 134, "MC", "middle") + Ln(306, 130, 326, 130, "thin"));
    b += Part("HBM stack", range(4).map((k) => R(374, 92 + k * 20, 36, 16, 1)).join("") + T(392, 186, "HBM", "middle") + Ln(360, 130, 374, 130, "thin"));
    b += Part("I/O · PCIe", R(28, 106, 52, 48, 2) + T(54, 134, "I/O", "middle") + Ln(80, 130, 114, 130, "thin"));
    // 링 위를 도는 패킷, 메모리·I/O 트래픽
    range(4).forEach((k) => (b += Tok(7, 7, Move(ring, 6, -k * 1.5, ' rotate="auto"'))));
    b += Tok(8, 5, Move("M308 130 H324 M362 130 H372", 1.6, 0), Fade(1.6, 0));
    b += Tok(8, 5, Move("M372 140 H362 M324 140 H308", 1.6, -0.8), Fade(1.6, -0.8));
    b += Tok(8, 5, Move("M82 130 H112", 1.8, -0.4), Fade(1.8, -0.4));
    return svg("0 0 420 260", b, "네 개의 코어가 링 인터커넥트로 L3 캐시, 메모리 컨트롤러, HBM, I/O와 연결된 멀티코어 프로세서");
  };

  // Robotics: A* 경로 계획(격자 지도) + 라이다를 단 이동 로봇 + 3관절 로봇팔 역기구학
  I.tutRobot = () => {
    let b = "";
    const gx = 18, gy = 46, cs = 17, cols = 10, rows = 8;
    const obs = [[2, 1], [2, 2], [2, 3], [2, 4], [5, 3], [5, 4], [5, 5], [5, 6], [6, 3], [7, 1], [8, 1], [3, 6], [8, 5], [8, 6]];
    let grid = R(gx, gy, cols * cs, rows * cs);
    range(cols - 1).forEach((c) => (grid += Ln(gx + (c + 1) * cs, gy, gx + (c + 1) * cs, gy + rows * cs, "thin")));
    range(rows - 1).forEach((r) => (grid += Ln(gx, gy + (r + 1) * cs, gx + cols * cs, gy + (r + 1) * cs, "thin")));
    grid += obs.map(([c, r]) => `<rect class="solid soft" x="${gx + c * cs + 1}" y="${gy + r * cs + 1}" width="${cs - 2}" height="${cs - 2}"/>`).join("");
    b += Part("Occupancy grid map", grid) + T(gx, gy - 10, "A* PLANNER");
    const cc = (c, r) => [gx + c * cs + cs / 2, gy + r * cs + cs / 2];
    const route = [[0, 7], [1, 7], [1, 6], [1, 5], [1, 4], [1, 3], [1, 2], [1, 1], [1, 0], [2, 0], [3, 0], [4, 0], [4, 1], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2], [9, 1], [9, 0]].map(([c, r]) => cc(c, r));
    const d = "M" + route.map((p) => p.join(" ")).join(" L"), len = polyLen(route).toFixed(1);
    b += Part("Planned path", `<path d="${d}" style="stroke-dasharray:${len};stroke-dashoffset:${len}"><animate attributeName="stroke-dashoffset" values="${len};0;0;${len}" keyTimes="0;0.45;0.85;1" dur="7s" repeatCount="indefinite"/></path>`);
    const [sx, sy] = cc(0, 7), [ex, ey] = cc(9, 0);
    b += C(sx, sy, 4) + P(`M${ex - 5} ${ey} H${ex + 5} M${ex} ${ey - 5} V${ey + 5}`) + C(ex, ey, 6, "thin");
    // 이동 로봇 (라이다가 회전하며 스캔)
    b += Part("Mobile robot with LiDAR", `<g><circle class="solid" r="4.2"/><path class="thin" d="M0 0 L20 -6 M0 0 L20 6">${Spin(0, 0, 1.2)}</path>${Move(d, 7, 0, ' calcMode="linear" keyPoints="0;0;1;1" keyTimes="0;0.45;0.85;1"')}</g>`);
    // 로봇팔 (기준 좌표계, 관절 3개, 그리퍼)
    const bx = 300, by = 214;
    let arm = R(bx - 28, by, 56, 12, 2) + Ln(bx - 40, by + 12, bx + 40, by + 12);
    arm += P(`M${bx - 54} ${by + 30} H${bx - 30} M${bx - 54} ${by + 30} V${by + 6}`, "thin") + T(bx - 28, by + 34, "x") + T(bx - 58, by + 4, "y");
    const link = (L) => R(0, -5, L, 10, 5) + C(0, 0, 5) + C(0, 0, 1.6, "thin");
    arm += `<g transform="translate(${bx} ${by})"><g>${link(70)}` +
      `<animateTransform attributeName="transform" type="rotate" values="-115;-70;-95;-115" keyTimes="0;0.4;0.7;1" dur="6s" repeatCount="indefinite"/>` +
      `<g transform="translate(70 0)"><g>${link(56)}` +
      `<animateTransform attributeName="transform" type="rotate" values="75;35;95;75" keyTimes="0;0.4;0.7;1" dur="6s" repeatCount="indefinite"/>` +
      `<g transform="translate(56 0)"><g>${link(24)}<path d="M24 -8 V8 M24 -8 H32 M24 8 H32"/>` +
      `<animateTransform attributeName="transform" type="rotate" values="30;-10;20;30" keyTimes="0;0.4;0.7;1" dur="6s" repeatCount="indefinite"/>` +
      `</g></g></g></g></g></g>`;
    b += Part("3-joint robot arm (inverse kinematics)", arm);
    b += P("M248 92 C280 58 340 60 372 96", "dash") + T(330, 40, "INVERSE KINEMATICS", "middle");
    b += Part("Target pose", `<g>${C(352, 74, 7, "thin")}${P("M344 74 H360 M352 66 V82")}${Blink(2, 0, 0.35, 1)}</g>`);
    return svg("0 0 420 260", b, "격자 지도 위 A* 경로를 따라 움직이는 라이다 로봇과, 목표 자세로 움직이는 3관절 로봇팔");
  };

  // Modeling & Simulation: 이산 사건 시뮬레이션(소스 → 대기열 → 서버 2대 → 싱크) + 사건 목록 타임라인 + 대기열 길이 통계
  I.tutMns = () => {
    let b = "";
    b += Part("Source (arrivals)", C(36, 74, 16) + P("M30 74 H42 M36 68 V80") + T(36, 108, "SOURCE", "middle"));
    let q = R(80, 60, 92, 28, 2);
    range(5).forEach((k) => (q += Ln(80 + (k + 1) * 15.3, 60, 80 + (k + 1) * 15.3, 88, "thin") +
      `<rect class="solid soft" x="${157 - k * 15.3 - 12}" y="64" width="11" height="20">${Blink(4, -k * 0.6, 0, 0.75)}</rect>`));
    b += Part("FIFO queue", q + T(126, 108, "QUEUE", "middle"));
    [[232, 44, 0], [232, 104, -1.2]].forEach(([x, y, dd], i) => {
      const r = 15, cir = (2 * Math.PI * r).toFixed(1);
      b += Part("Server " + (i + 1), C(x, y, r) +
        `<circle cx="${x}" cy="${y}" r="${r - 5}" class="thin" style="stroke-dasharray:${cir};stroke-dashoffset:${cir}" transform="rotate(-90 ${x} ${y})">` +
        `<animate attributeName="stroke-dashoffset" values="${cir};0" dur="2.4s" begin="${dd}s" repeatCount="indefinite"/></circle>` + T(x + 22, y + 4, "S" + (i + 1)));
    });
    b += Part("Sink (departures)", C(320, 74, 16) + C(320, 74, 6) + T(320, 108, "SINK", "middle"));
    b += Ln(52, 74, 80, 74, "thin") + P("M172 74 L196 74 L217 46 M196 74 L217 102", "thin") + P("M247 46 L272 74 L247 102 M272 74 H304", "thin");
    // 개체 이동
    [[0, "M52 74 H78"], [-1.0, "M52 74 H78"]].forEach(([dd, pth]) => (b += Tok(7, 7, Move(pth, 2, dd), Fade(2, dd))));
    b += Tok(7, 7, Move("M174 74 L196 74 L216 48", 2.4, -0.3), Fade(2.4, -0.3));
    b += Tok(7, 7, Move("M174 74 L196 74 L216 100", 2.4, -1.5), Fade(2.4, -1.5));
    b += Tok(7, 7, Move("M248 48 L272 74 H302", 2.4, -0.9), Fade(2.4, -0.9));
    b += Tok(7, 7, Move("M248 100 L272 74 H302", 2.4, -2.1), Fade(2.4, -2.1));
    // 대기열 길이 막대 (실시간 통계)
    let bars = R(352, 28, 56, 92, 2) + T(380, 22, "Q LEN", "middle");
    range(5).forEach((k) => {
      const hs = [[30, 62, 44, 30], [50, 24, 70, 50], [20, 46, 34, 20], [64, 40, 22, 64], [36, 70, 50, 36]][k];
      bars += `<rect class="solid soft" x="${358 + k * 10}" width="7" y="${116 - hs[0]}" height="${hs[0]}">` +
        `<animate attributeName="height" values="${hs.join(";")}" dur="5s" repeatCount="indefinite"/>` +
        `<animate attributeName="y" values="${hs.map((h) => 116 - h).join(";")}" dur="5s" repeatCount="indefinite"/></rect>`;
    });
    b += Part("Statistics: queue length", bars);
    // 사건 목록 타임라인 (왼쪽으로 흘러감)
    let tl = Ln(24, 206, 404, 206) + T(24, 236, "EVENT LIST") + T(404, 236, "t →", "end");
    let ev = "";
    const evs = [[10, "A"], [42, "D"], [70, "A"], [96, "A"], [131, "D"], [158, "D"], [186, "A"]];
    [0, 200, 400].forEach((off) => evs.forEach(([x, k]) => {
      const X = 60 + x + off;
      ev += Ln(X, 198, X, 214, "thin") + (k === "A" ? `<rect x="${X - 4}" y="${182}" width="8" height="8" transform="rotate(45 ${X} 186)"/>` : C(X, 186, 4)) + T(X, 176, k, "middle");
    }));
    tl += `<clipPath id="tut-ev-clip"><rect x="24" y="160" width="380" height="60"/></clipPath>` +
      `<g clip-path="url(#tut-ev-clip)"><g>${ev}<animateTransform attributeName="transform" type="translate" from="0 0" to="-200 0" dur="8s" repeatCount="indefinite"/></g></g>`;
    tl += Ln(60, 166, 60, 216) + T(64, 160, "NOW");
    b += Part("Future event list (A = arrival, D = departure)", tl);
    return svg("0 0 420 260", b, "소스에서 대기열과 서버 두 대를 거쳐 싱크로 가는 이산 사건 시뮬레이션, 흘러가는 사건 목록과 대기열 길이 통계");
  };

  // Operational Art: 육각 지도 위 전선(FLOT), 단계선, 작전 축선, 결정적 지점, 목표, 아군·적군 부대 기호
  I.tutOpart = () => {
    let b = "";
    const s = 15, h = Math.sqrt(3) * s;
    const hex = (cx, cy) => "M" + range(6).map((k) => { const a = (Math.PI / 3) * k; return (cx + s * Math.cos(a)).toFixed(1) + " " + (cy + s * Math.sin(a)).toFixed(1); }).join(" L") + " Z";
    let hx = "";
    range(17).forEach((col) => range(10).forEach((row) => {
      const cx = 14 + col * 1.5 * s, cy = 12 + row * h + (col % 2 ? h / 2 : 0);
      if (cy < 250) hx += `<path class="hexbg" d="${hex(cx, cy)}"/>`;
    }));
    b += hx;
    // 단계선, 전선
    b += Part("Phase line ALPHA", Ln(170, 18, 170, 244, "dash") + T(174, 30, "PL ALPHA"));
    b += Part("Phase line BRAVO", Ln(290, 18, 290, 244, "dash") + T(294, 30, "PL BRAVO"));
    b += Part("Forward line of own troops (FLOT)", P("M120 18 C140 70 104 120 128 170 C146 206 118 230 124 248") + T(66, 248, "FLOT"));
    // 작전 축선 (점선이 흐르는 굵은 화살표)
    const axes = [["M70 196 C150 196 190 150 250 128 C300 110 330 90 362 72", "Main effort"], ["M70 80 C140 64 220 70 300 88", "Supporting effort"]];
    axes.forEach(([d, t], i) => {
      b += Part("Axis of advance: " + t, `<path d="${d}" style="stroke-width:${i ? 1.5 : 2.4};stroke-dasharray:10 7">${Flow(i ? 1.6 : 1.1)}</path>`);
    });
    b += P("M356 64 L372 70 L360 82") + P("M292 80 L304 89 L292 96");
    // 결정적 지점, 목표
    b += Part("Decisive point", `<circle cx="250" cy="128" r="10"/><circle class="solid" cx="250" cy="128" r="3"/>` + T(250, 108, "DP", "middle") +
      `<circle cx="250" cy="128" r="10" class="thin"><animate attributeName="r" values="10;24" dur="2.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.9;0" dur="2.2s" repeatCount="indefinite"/></circle>`);
    b += Part("Objective", P("M378 40 V78 M378 40 L398 47 L378 54") + T(388, 92, "OBJ", "middle"));
    // 아군 부대 (보병 X, 기갑 타원), 적군 (마름모)
    const inf = (x, y) => R(x - 12, y - 8, 24, 16) + P(`M${x - 12} ${y - 8} L${x + 12} ${y + 8} M${x + 12} ${y - 8} L${x - 12} ${y + 8}`, "thin");
    const arm = (x, y) => R(x - 12, y - 8, 24, 16) + E(x, y, 8, 4.5, "thin");
    b += Part("Friendly infantry", inf(52, 80) + inf(52, 140));
    b += Part("Friendly armor (main effort)", `<g>${arm(0, 0)}${Move("M70 196 C150 196 190 150 250 128", 9, 0, ' calcMode="spline" keySplines="0.4 0 0.6 1" keyTimes="0;1"')}${Fade(9, 0, "0;1;1;0", "0;0.08;0.9;1")}</g>` + arm(52, 196));
    const hos = (x, y, dd) => `<g><path d="M${x} ${y - 11} L${x + 11} ${y} L${x} ${y + 11} L${x - 11} ${y} Z"/>${P(`M${x - 5} ${y} H${x + 5}`, "thin")}${Blink(2.4, dd, 0.45, 1)}</g>`;
    b += Part("Enemy units", hos(226, 60, 0) + hos(338, 150, -0.8) + hos(214, 214, -1.6));
    return svg("0 0 420 260", b, "육각 지도 위에서 전선, 단계선, 주공과 조공의 작전 축선, 결정적 지점과 목표, 아군과 적군 부대 기호");
  };

  window.ILLUS = I;
})();
