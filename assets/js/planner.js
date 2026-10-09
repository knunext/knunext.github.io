/*
 * Hero visual: A* search on a random grid.
 * 처음 로드될 때 한 번 탐색 과정을 보여주고, 클릭하면 목표점을 옮겨 다시 탐색합니다.
 * prefers-reduced-motion 이 켜져 있으면 애니메이션 없이 결과만 그립니다.
 */
(function () {
  "use strict";

  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Minimal binary heap keyed by priority
  function Heap() { this.k = []; this.v = []; }
  Heap.prototype.push = function (val, key) {
    const K = this.k, V = this.v;
    let i = K.length;
    K.push(key); V.push(val);
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (K[p] <= K[i]) break;
      [K[p], K[i]] = [K[i], K[p]];
      [V[p], V[i]] = [V[i], V[p]];
      i = p;
    }
  };
  Heap.prototype.pop = function () {
    const K = this.k, V = this.v;
    const top = V[0];
    const lk = K.pop(), lv = V.pop();
    if (K.length) {
      K[0] = lk; V[0] = lv;
      let i = 0;
      const n = K.length;
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < n && K[l] < K[m]) m = l;
        if (r < n && K[r] < K[m]) m = r;
        if (m === i) break;
        [K[m], K[i]] = [K[i], K[m]];
        [V[m], V[i]] = [V[i], V[m]];
        i = m;
      }
    }
    return top;
  };

  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];

  function init(canvas, opts) {
    opts = opts || {};
    const ctx = canvas.getContext("2d");
    const statsEl = opts.statsEl;
    const CELL = opts.cell || 17;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let W = 0, H = 0, cols = 0, rows = 0, cell = 0, ox = 0, oy = 0;
    let grid, start, goal, result, raf = 0;
    let seed = Math.floor(Math.random() * 1e9);

    function readColors() {
      const cs = getComputedStyle(document.documentElement);
      const v = (n) => cs.getPropertyValue(n).trim();
      return { ink: v("--ink"), ink2: v("--ink-2"), rule: v("--rule"), accent: v("--accent"), surface: v("--surface") };
    }
    let C = readColors();

    function layout() {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.max(10, Math.floor(W / CELL));
      rows = Math.max(8, Math.floor(H / CELL));
      cell = Math.min(W / cols, H / rows);
      ox = (W - cols * cell) / 2;
      oy = (H - rows * cell) / 2;
    }

    const idx = (x, y) => y * cols + x;

    function clearAround(p) {
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const x = p.x + dx, y = p.y + dy;
          if (x >= 0 && y >= 0 && x < cols && y < rows) grid[idx(x, y)] = 0;
        }
    }

    function makeMap() {
      const r = rng(seed);
      grid = new Uint8Array(cols * rows);
      const walls = Math.round((cols * rows) / 20);
      for (let i = 0; i < walls; i++) {
        const horiz = r() < 0.5;
        const len = 3 + Math.floor(r() * 8);
        let x = Math.floor(r() * cols), y = Math.floor(r() * rows);
        for (let k = 0; k < len; k++) {
          if (x >= 0 && y >= 0 && x < cols && y < rows) grid[idx(x, y)] = 1;
          if (horiz) x++; else y++;
        }
      }
      start = { x: 1, y: rows - 2 };
      goal = { x: cols - 2, y: 1 };
      clearAround(start);
      clearAround(goal);
    }

    function astar() {
      const N = cols * rows;
      const g = new Float32Array(N).fill(Infinity);
      const came = new Int32Array(N).fill(-1);
      const closed = new Uint8Array(N);
      const s = idx(start.x, start.y), t = idx(goal.x, goal.y);
      const h = (i) => {
        const dx = Math.abs((i % cols) - goal.x), dy = Math.abs(((i / cols) | 0) - goal.y);
        return dx + dy + (Math.SQRT2 - 2) * Math.min(dx, dy);
      };
      const open = new Heap();
      const order = [];
      g[s] = 0;
      open.push(s, h(s));
      while (open.k.length) {
        const cur = open.pop();
        if (closed[cur]) continue;
        closed[cur] = 1;
        order.push(cur);
        if (cur === t) break;
        const cx = cur % cols, cy = (cur / cols) | 0;
        for (const [dx, dy] of DIRS) {
          const nx = cx + dx, ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
          const ni = idx(nx, ny);
          if (grid[ni] || closed[ni]) continue;
          if (dx && dy && (grid[idx(nx, cy)] || grid[idx(cx, ny)])) continue; // no corner cutting
          const ng = g[cur] + (dx && dy ? Math.SQRT2 : 1);
          if (ng < g[ni]) {
            g[ni] = ng;
            came[ni] = cur;
            open.push(ni, ng + h(ni) * 1.0001);
          }
        }
      }
      const path = [];
      if (closed[t]) for (let c = t; c !== -1; c = came[c]) path.push(c);
      path.reverse();
      return { order, path, cost: g[t] };
    }

    function solveFreshMap() {
      for (let tries = 0; tries < 30; tries++) {
        makeMap();
        const r = astar();
        if (r.path.length) return r;
        seed++;
      }
      return astar();
    }

    const cx = (i) => ox + ((i % cols) + 0.5) * cell;
    const cy = (i) => oy + (((i / cols) | 0) + 0.5) * cell;

    function draw(nExplored, pathT) {
      ctx.clearRect(0, 0, W, H);

      // grid dots
      ctx.fillStyle = C.rule;
      for (let i = 0; i < cols * rows; i++) {
        if (!grid[i]) ctx.fillRect(cx(i) - 1, cy(i) - 1, 2, 2);
      }

      // explored cells
      ctx.fillStyle = C.accent;
      ctx.globalAlpha = 0.14;
      const inset = Math.max(1, cell * 0.06);
      for (let k = 0; k < nExplored; k++) {
        const i = result.order[k];
        ctx.fillRect(ox + (i % cols) * cell + inset, oy + ((i / cols) | 0) * cell + inset, cell - inset * 2, cell - inset * 2);
      }
      ctx.globalAlpha = 1;

      // obstacles
      ctx.fillStyle = C.ink;
      ctx.globalAlpha = 0.82;
      const wi = Math.max(1.5, cell * 0.08);
      for (let i = 0; i < cols * rows; i++) {
        if (grid[i]) ctx.fillRect(ox + (i % cols) * cell + wi, oy + ((i / cols) | 0) * cell + wi, cell - wi * 2, cell - wi * 2);
      }
      ctx.globalAlpha = 1;

      // path
      const p = result.path;
      if (p.length > 1 && pathT > 0) {
        let total = 0;
        const seg = [];
        for (let k = 1; k < p.length; k++) {
          const d = Math.hypot(cx(p[k]) - cx(p[k - 1]), cy(p[k]) - cy(p[k - 1]));
          seg.push(d);
          total += d;
        }
        let remain = total * pathT;
        ctx.strokeStyle = C.accent;
        ctx.lineWidth = Math.max(2.5, cell * 0.14);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(cx(p[0]), cy(p[0]));
        for (let k = 1; k < p.length && remain > 0; k++) {
          const f = Math.min(1, remain / seg[k - 1]);
          const x0 = cx(p[k - 1]), y0 = cy(p[k - 1]);
          ctx.lineTo(x0 + (cx(p[k]) - x0) * f, y0 + (cy(p[k]) - y0) * f);
          remain -= seg[k - 1];
        }
        ctx.stroke();
      }

      // start and goal
      const si = idx(start.x, start.y), gi = idx(goal.x, goal.y);
      ctx.fillStyle = C.ink;
      ctx.beginPath();
      ctx.arc(cx(si), cy(si), cell * 0.28, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = C.accent;
      ctx.lineWidth = Math.max(2, cell * 0.1);
      ctx.beginPath();
      ctx.arc(cx(gi), cy(gi), cell * 0.34, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = C.accent;
      ctx.beginPath();
      ctx.arc(cx(gi), cy(gi), cell * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }

    function report() {
      if (!statsEl) return;
      if (result.path.length) {
        statsEl.textContent = "Expanded " + result.order.length + " cells, path length " + result.cost.toFixed(1) + ".";
      } else {
        statsEl.textContent = "No path to that cell. Pick another spot.";
      }
    }

    function animate() {
      cancelAnimationFrame(raf);
      if (motion.matches) {
        draw(result.order.length, 1);
        report();
        return;
      }
      if (statsEl) statsEl.textContent = "";
      const total = result.order.length;
      const perFrame = Math.max(2, Math.ceil(total / 80));
      let n = 0, t = 0;
      const step = () => {
        if (n < total) n = Math.min(total, n + perFrame);
        else t = Math.min(1, t + 0.045);
        draw(n, t);
        if (n < total || (t < 1 && result.path.length)) raf = requestAnimationFrame(step);
        else report();
      };
      step();
    }

    function newMap(animated) {
      layout();
      result = solveFreshMap();
      if (animated) animate();
      else { draw(result.order.length, 1); report(); }
    }

    canvas.addEventListener("click", (e) => {
      const r = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - r.left - ox) / cell);
      const y = Math.floor((e.clientY - r.top - oy) / cell);
      if (x < 0 || y < 0 || x >= cols || y >= rows) return;
      if (grid[idx(x, y)] || (x === start.x && y === start.y)) return;
      goal = { x, y };
      result = astar();
      animate();
    });

    // Redraw (without replaying) when the canvas size changes
    let lastW = 0, timer = 0;
    new ResizeObserver(() => {
      const w = canvas.getBoundingClientRect().width;
      if (Math.abs(w - lastW) < 2) return;
      const first = lastW === 0;
      lastW = w;
      if (first) return;
      clearTimeout(timer);
      timer = setTimeout(() => { cancelAnimationFrame(raf); newMap(false); }, 150);
    }).observe(canvas);

    // Repaint with new colors when the OS theme flips
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      C = readColors();
      cancelAnimationFrame(raf);
      draw(result.order.length, 1);
    });

    lastW = canvas.getBoundingClientRect().width;
    newMap(true);

    return {
      regenerate() { seed = Math.floor(Math.random() * 1e9); newMap(true); }
    };
  }

  window.Planner = { init };
})();
