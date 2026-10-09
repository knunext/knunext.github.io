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

  window.ILLUS = I;
})();
