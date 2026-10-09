/*
 * 공통 헤더/푸터와 각 페이지 내용을 data/*.js 에서 읽어 그립니다.
 * 내용 수정은 data 폴더에서 하시고, 이 파일은 구조를 바꿀 때만 수정하면 됩니다.
 */
(function () {
  "use strict";

  const L = window.LAB || {};
  const S = L.site || {};
  const ILLUS = window.ILLUS || {};
  const page = document.body.dataset.page;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const setHTML = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html; };
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-|-$/g, "");
  const pad = (n) => String(n).padStart(2, "0");

  // 별표 기호 (워드마크 가운데)
  const STAR =
    '<svg class="star" viewBox="-50 -50 100 100" aria-hidden="true">' +
    '<line x1="0" y1="-50" x2="0" y2="50"/><line x1="-50" y1="-30" x2="50" y2="30"/><line x1="-50" y1="30" x2="50" y2="-30"/>' +
    '<path d="M0 -9 L4 0 L0 9 L-4 0 Z" class="star-core"/></svg>';
  const wordmark = (w) => (w && w.length === 2 ? "<span>" + esc(w[0]) + "</span>" + STAR + "<span>" + esc(w[1]) + "</span>" : "");
  const art = (o) => (o.image ? '<img src="' + esc(o.image) + '" alt="" loading="lazy">' : ILLUS[o.illustration] ? ILLUS[o.illustration]() : "");

  // 메일 주소는 링크 없이 이미지로만 보여줍니다 (스크래핑 방지). 방문자가 보고 직접 입력합니다.
  function email(o, cls) {
    if (!o || !o.emailImage) return "";
    return '<span class="email' + (cls ? " " + cls : "") + '"><img src="' + esc(o.emailImage) + '" alt="이메일 주소 (이미지)" decoding="async"></span>';
  }

  /* ================= Header ================= */
  const NAV = [
    ["home", "Home", "index.html"],
    ["news", "News", "news.html"],
    ["research", "Research", "research.html"],
    ["people", "People", "people.html"],
    ["publications", "Publications", "publications.html"],
    ["teaching", "Teaching", "teaching.html"]
  ];
  (function header() {
    const joinHref = page === "home" ? "#join" : "index.html#join";
    $("#site-header").innerHTML =
      '<div class="wrap header-inner">' +
      '<a class="brand" href="index.html"><img src="assets/img/logo/logo-horizontal-light.svg" alt="NextGen Lab, ' + esc(S.shortName || "") + ' 홈" width="755" height="105"></a>' +
      '<button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>' +
      '<nav class="site-nav" id="site-nav" aria-label="Main"><ul>' +
      NAV.map(([key, label, href]) => '<li><a href="' + href + '"' + (key === page ? ' aria-current="page"' : "") + ">" + label + "</a></li>").join("") +
      '<li><a class="nav-cta" href="' + joinHref + '">Join us</a></li>' +
      "</ul></nav></div>";

    const hdr = $("#site-header");
    const onScroll = () => hdr.classList.toggle("is-scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const toggle = $("#nav-toggle"), nav = $("#site-nav");
    const setMenu = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Close" : "Menu";
    };
    toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  })();

  /* ================= Footer ================= */
  (function footer() {
    const c = L.contact || {};
    $("#site-footer").innerHTML =
      '<div class="wrap"><div class="hatch" aria-hidden="true"></div><div class="footer-inner">' +
      '<div><img class="footer-logo" src="assets/img/logo/logo-horizontal-light.svg" alt="NextGen Lab" width="755" height="105"><p>' + esc(S.name) + "<br>" + esc(S.department) + ", " + esc(S.university) + "</p></div>" +
      '<div><p class="caps">Visit</p>' + (c.address ? "<p>" + c.address + "</p>" : "") + "</div>" +
      '<div><p class="caps">Contact</p>' + (c.emailImage ? "<p>" + email(c) + "</p>" : "") +
      '<p class="footer-copy">&copy; ' + new Date().getFullYear() + " " + esc(S.shortName) + "</p></div>" +
      "</div></div>";
  })();

  /* ================= Helpers ================= */
  function initials(name) {
    const n = String(name).replace(/\(.*?\)/g, "").trim();
    if (/[\uAC00-\uD7A3]/.test(n)) {
      const c = n.replace(/\s+/g, "");
      return c.length >= 3 ? c.slice(1, 3) : c.slice(0, 2);
    }
    const parts = n.split(/[\s-]+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  function avatar(p) {
    if (p.photo) return '<img class="avatar' + (p.photoFit === "contain" ? " avatar-line" : "") + '" src="' + esc(p.photo) + '" alt="" loading="lazy">';
    return '<span class="avatar" aria-hidden="true">' + esc(initials(p.name)) + "</span>";
  }
  const fmtDate = (d) => String(d).split("-").filter(Boolean).join(".");
  function arrowList(items) {
    return '<ul class="arrow-list">' + items.map((i) => "<li>" + i + "</li>").join("") + "</ul>";
  }
  function lists(arr) {
    return (arr || [])
      .filter((l) => l.items && l.items.length)
      .map((l) => '<div class="info-block"><p class="caps">' + esc(l.label) + "</p>" + arrowList(l.items) + "</div>")
      .join("");
  }
  // Sponsors 로고 칸 (연구 주제, 뉴스 공용). showEmpty 가 true 면 로고가 없을 때 빈 칸을 보여줌
  function sponsorBlock(list, showEmpty, cls, label) {
    const items = (list || []).filter((x) => x && (x.logo || x.name));
    if (!items.length && !showEmpty) return "";
    const one = (x) => {
      const inner = x.logo ? '<img src="' + esc(x.logo) + '" alt="' + esc(x.name || "") + '" loading="lazy">' : '<span class="caps">' + esc(x.name) + "</span>";
      return "<li>" + (x.url ? '<a class="sponsor" href="' + esc(x.url) + '">' + inner + "</a>" : '<span class="sponsor">' + inner + "</span>") + "</li>";
    };
    return '<div class="info-block sponsor-block' + (cls ? " " + cls : "") + '"><p class="caps">' + esc(label || "Sponsors") + '</p><ul class="sponsor-logos">' +
      (items.length ? items.map(one).join("") : '<li><span class="sponsor sponsor-empty caps" aria-label="로고 자리">Logo</span></li>') +
      "</ul></div>";
  }
  // Partners (공동연구기관·협력 대학) 로고 칸: 지정된 항목에만 표시
  function partnerBlock(list, cls) {
    return sponsorBlock(list, false, "partner-block" + (cls ? " " + cls : ""), "Partners");
  }
  // 연구실 위치 안내: 로고와 호실(위), 약도와 표(왼쪽), 항공사진(오른쪽). 사진의 건물과 표의 행이 서로 연결되어 강조됨
  function locationBlock(Lc) {
    if (!Lc || !Lc.rows || !Lc.rows.length) return "";
    const cols = Lc.columns || ["Key", "Building", "Description"];
    const id = (r) => "k" + String(r.key || "").replace(/[^0-9A-Za-z]/g, "");
    const rows = Lc.rows.map((r) => r.gap
      ? '<tr class="loc-gap" aria-hidden="true"><td colspan="3"></td></tr>'
      : '<tr data-key="' + id(r) + '"' + (r.shape ? ' tabindex="0"' : "") + "><td>" + esc(r.key || "") + "</td><td>" + esc(r.building || "") +
        (r.ko ? '<span class="loc-ko">' + esc(r.ko) + "</span>" : "") + "</td><td>" + esc(r.desc || "") + "</td></tr>").join("");
    const [W, H] = Lc.aerialSize || [1483, 1125];
    const vb = (Lc.aerialView || [0, 0, W, H]).join(" ");
    const hot = Lc.rows.filter((r) => r.shape).map((r) =>
      '<polygon class="loc-hot" data-key="' + id(r) + '" tabindex="0" role="button" aria-label="' + esc((r.key || "") + " " + (r.building || "")) + '" points="' +
      r.shape.map((p) => p.join(",")).join(" ") + '"/>').join("");
    const room = Array.isArray(Lc.room) ? Lc.room : Lc.room ? [Lc.room] : [];
    return '<section class="loc" aria-label="' + esc(Lc.title || "Location") + '">' +
      (Lc.logo ? '<img class="loc-logo" src="' + esc(Lc.logo) + '" alt="NextGen Lab">' : "") +
      (room.length ? '<p class="loc-room" aria-label="연구실 위치 ' + esc(room.join("-")) + '">' + room.map(esc).join("<br>") + "</p>" : "") +
      (Lc.minimap ? '<img class="loc-mini" src="' + esc(Lc.minimap) + '" alt="IT & AI Cluster, 경북대학교 대구캠퍼스 약도" loading="lazy">' : "") +
      '<table class="loc-table"><thead><tr>' + cols.map((c) => '<th scope="col">' + esc(c) + "</th>").join("") + "</tr></thead><tbody>" + rows + "</tbody></table>" +
      (Lc.aerial
        ? '<figure class="loc-aerial"><svg class="loc-map" viewBox="' + vb + '" preserveAspectRatio="xMidYMid slice" role="group" aria-label="경북대학교 IT·AI 클러스터 항공사진. 번호 건물에 마우스를 올리면 표와 연결됩니다">' +
          '<defs><mask id="loc-dim-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '">' +
          '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="#fff"/><polygon class="loc-hole" points="" fill="#000"/></mask></defs>' +
          '<image href="' + esc(Lc.aerial) + '" x="0" y="0" width="' + W + '" height="' + H + '"/>' +
          '<rect class="loc-dim" x="0" y="0" width="' + W + '" height="' + H + '" mask="url(#loc-dim-mask)"/>' +
          (Lc.callout ? calloutSvg(Lc.callout) : "") + hot +
          "</svg></figure>"
        : "") +
      '<svg class="loc-link" aria-hidden="true"><path d=""/><circle r="3.5"/><circle r="3.5"/></svg>' +
      "</section>";
  }
  // 사진 위 안내 문구와 화살표 (예: WE ARE HERE. → 1번 건물)
  function calloutSvg(c) {
    const [tx, ty] = c.at, [ax, ay] = c.to, [sx, sy] = c.from || [tx + 40, ty + 16];
    const mx = (sx + ax) / 2 + (c.bend || 30), my = (sy + ay) / 2;
    const ang = Math.atan2(ay - my, ax - mx), L = 22, Wd = 11;
    const p1 = [ax - L * Math.cos(ang) + Wd * Math.sin(ang), ay - L * Math.sin(ang) - Wd * Math.cos(ang)];
    const p2 = [ax - L * Math.cos(ang) - Wd * Math.sin(ang), ay - L * Math.sin(ang) + Wd * Math.cos(ang)];
    return '<g class="loc-callout" aria-hidden="true">' +
      '<text x="' + tx + '" y="' + ty + '">' + esc(c.text) + "</text>" +
      '<path d="M' + sx + " " + sy + " Q" + mx + " " + my + " " + ax + " " + ay + '"/>' +
      '<polygon points="' + ax + "," + ay + " " + p1.map((v) => v.toFixed(1)).join(",") + " " + p2.map((v) => v.toFixed(1)).join(",") + '"/>' +
      "</g>";
  }
  function initLocation() {
    const root = $(".loc");
    if (!root) return;
    const hole = $(".loc-hole", root), link = $(".loc-link", root), path = $("path", link), dots = $$("circle", link);
    const aerial = $(".loc-aerial", root), table = $(".loc-table", root);
    let active = null, pinned = false;
    function drawLink() {
      if (!active) { link.classList.remove("is-on"); return; }
      const tr = $('tr[data-key="' + active + '"]', table), poly = $('.loc-hot[data-key="' + active + '"]', root);
      const R = root.getBoundingClientRect(), t = tr.getBoundingClientRect(), b = poly.getBoundingClientRect(), a = aerial.getBoundingClientRect();
      if (a.left < t.right) { link.classList.remove("is-on"); return; }    // 사진이 표 오른쪽에 있을 때만 선을 그림
      const sx = t.right - R.left, sy = t.top + t.height / 2 - R.top;
      const ex = b.left - R.left, ey = b.top + b.height / 2 - R.top;        // 건물 왼쪽 가장자리 가운데
      const mx = (t.right + a.left) / 2 - R.left;
      path.setAttribute("d", "M" + sx + " " + sy + " H" + mx + " L" + ex + " " + ey);
      dots[0].setAttribute("cx", sx); dots[0].setAttribute("cy", sy);
      dots[1].setAttribute("cx", ex); dots[1].setAttribute("cy", ey);
      link.setAttribute("width", R.width); link.setAttribute("height", R.height);
      link.classList.add("is-on");
    }
    function setActive(key) {
      active = key;
      root.classList.toggle("has-active", !!key);
      $$("[data-key]", root).forEach((el) => el.classList.toggle("is-active", el.dataset.key === key));
      const poly = key ? $('.loc-hot[data-key="' + key + '"]', root) : null;
      hole.setAttribute("points", poly ? poly.getAttribute("points") : "");
      drawLink();
    }
    $$("[data-key]", root).forEach((el) => {
      if (!$('.loc-hot[data-key="' + el.dataset.key + '"]', root)) return;
      el.addEventListener("mouseenter", () => { if (!pinned) setActive(el.dataset.key); });
      el.addEventListener("mouseleave", () => { if (!pinned) setActive(null); });
      el.addEventListener("focus", () => setActive(el.dataset.key));
      el.addEventListener("blur", () => { if (!pinned) setActive(null); });
      el.addEventListener("click", () => {          // 터치 화면: 눌러서 고정, 다시 누르면 해제
        if (pinned && active === el.dataset.key) { pinned = false; setActive(null); }
        else { pinned = true; setActive(el.dataset.key); }
      });
    });
    let rt = 0;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(drawLink, 80); });
  }
  function newsIds(all) {
    const seen = {};
    return all.map((n) => { const k = n.date; seen[k] = (seen[k] || 0) + 1; return "n-" + String(k).replace(/\D/g, "") + (seen[k] > 1 ? "-" + (seen[k] - 1) : ""); });
  }
  function newsRow(n, id, mode) {
    const body = n.body
      ? mode === "full"
        ? '<div class="news-body">' + n.body + "</div>"
        : '<details class="news-details"><summary>자세히 보기</summary><div class="news-body">' + n.body + "</div></details>"
      : "";
    const media = n.image
      ? '<figure class="news-media' + (n.imageFit === "contain" ? " is-contain" : "") + (n.imageHover ? " has-hover" : "") + '"><div class="media-stack">' +
        '<img class="media-base" src="' + esc(n.image) + '" alt="' + esc(n.imageAlt || "") + '" loading="lazy">' +
        (n.imageHover ? '<img class="media-hover" src="' + esc(n.imageHover) + '" alt="" aria-hidden="true" loading="lazy">' : "") +
        "</div></figure>"
      : "";
    return '<article class="news-row' + (n.image ? " has-media" : "") + '" id="' + id + '">' +
      '<div class="news-side"><p class="caps news-date"><time datetime="' + esc(n.date) + '">' + esc(fmtDate(n.date)) + "</time></p>" + media + "</div>" +
      '<div class="news-main"><h3>' + esc(n.title) + "</h3>" +
      (n.summary ? '<p class="news-summary">' + n.summary + "</p>" : "") +
      body + sponsorBlock(n.sponsors, false, "news-sponsors") + partnerBlock(n.partners, "news-sponsors") + "</div>" +
      '<p class="caps news-tag">' + esc(n.tag || "") + "</p></article>";
  }
  const band = (label, num, tag) => '<div class="band"><' + (tag || "p") + ' class="band-label">' + label + "</" + (tag || "p") + '><p class="band-num">' + num + "</p></div>";

  /* ================= Home ================= */
  if (page === "home") {
    const H = S.hero || {};
    setHTML("#hero-label", esc(H.label || S.shortName));
    setHTML("#hero-headline", (S.tagline || esc(S.name)) + ' <span class="ne" aria-hidden="true">&#8599;</span>');
    const ex = (S.explore && S.explore.items) || [];
    setHTML("#hero-drawings", ex.map((i) =>
      '<a class="drawing" href="' + esc(i.link || "research.html") + '"><span class="drawing-label">' + esc(i.name) + "</span>" +
      '<span class="drawing-art">' + art(i) + "</span></a>").join(""));
    setHTML("#hero-info", (H.info || []).map((c) =>
      '<div class="info' + (c.label ? " info-split" : "") + '">' + (c.label ? '<p class="caps info-key">' + esc(c.label) + (c.text ? " &rarr;" : "") + "</p>" : "") +
      (c.items ? '<ul class="caps arrow-list">' + c.items.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ul>" : "") +
      (c.text ? '<p class="caps">' + esc(c.text) + "</p>" : "") + "</div>").join(""));
    setHTML("#hero-wordmark", wordmark(H.wordmark));

    const all = L.news || [];
    const ids = newsIds(all);
    const limit = L.newsLimit || 4;
    setHTML("#news-list", all.slice(0, limit).map((n, i) => newsRow(n, ids[i], "short")).join("") ||
      '<p class="empty">아직 등록된 소식이 없습니다. data/news.js 에 항목을 추가해 주세요.</p>');
    if (all.length > limit) {
      setHTML("#news-foot", '<a class="btn-box btn-wide" href="news.html"><span>이전 소식 보기 (전체 ' + all.length + '건)</span><span aria-hidden="true">&rarr;</span></a>');
    }

    // Join us
    (function join() {
      const J = L.join || {};
      const c = L.contact || {};
      const quotes = J.quotes || [];
      setHTML("#join-title", esc(J.title || "Join us"));
      let html = "";

      if (quotes.length) {
        // 같은 인물은 그림을 한 번만 만들고, 인용문이 바뀔 때 해당 인물 그림으로 전환
        const people = [];
        quotes.forEach((q) => { if (!people.some((p) => p.by === q.by)) people.push(q); });
        const pic = (q) =>
          q.portraitImage
            ? (/\.svg$/i.test(q.portraitImage)
                ? '<img class="portrait-line" src="' + esc(q.portraitImage) + '" alt="' + esc(q.by) + ' 외곽선 그림">'
                : '<div class="portrait-ink"><img src="' + esc(q.portraitImage) + '" alt="' + esc(q.by) + ' 초상 그림"></div>')
          : q.photo ? '<img src="' + esc(q.photo) + '" alt="' + esc(q.by) + '">'
          : ILLUS[q.portrait] ? ILLUS[q.portrait]() : "";
        html += '<div class="quote-grid">' +
          '<div class="portraits">' + people.map((q, i) =>
            '<figure class="portrait fade' + (i === 0 ? " is-active" : "") + '" data-by="' + esc(q.by) + '">' + pic(q) +
            '<figcaption class="caps">' + esc(q.by) + (q.years ? "<br><span>" + esc(q.years) + "</span>" : "") +
            (q.credit ? '<br><span class="portrait-credit">' + esc(q.credit) + "</span>" : "") + "</figcaption></figure>").join("") +
          "</div>" +
          '<div class="quote-side">' +
          '<div class="quote-stage">' + quotes.map((q, i) =>
            '<figure class="quote fade' + (i === 0 ? " is-active" : "") + '"' + (i ? ' aria-hidden="true"' : "") + '><blockquote lang="en"><p>' + esc(q.text) + "</p></blockquote>" +
            '<figcaption class="caps">&rarr; ' + esc(q.by) + (q.note ? " / " + esc(q.note) : "") + "</figcaption></figure>").join("") +
          "</div>" +
          (quotes.length > 1
            ? '<div class="quote-controls"><div class="quote-dots" role="group" aria-label="인용문 선택">' +
              quotes.map((q, i) => '<button type="button" class="caps" data-q="' + i + '" aria-label="인용문 ' + (i + 1) + '"' + (i === 0 ? ' aria-current="true"' : "") + ">" + pad(i + 1) + "</button>").join("") +
              '</div><button type="button" class="caps quote-pause" id="quote-pause" aria-pressed="false">Pause</button></div>'
            : "") +
          "</div></div>";
      }

      const block = (b) => b && b.items && b.items.length
        ? '<div class="info-block"><p class="caps">' + esc(b.title) + "</p>" + arrowList(b.items) + "</div>" : "";
      html += '<div class="req-grid"><div class="req-intro"><p>' + (J.intro || "") + "</p></div>" + block(J.required) + block(J.preferred) + "</div>";
      html += '<div class="contact-row"><p>' + (J.contact || "") + "</p>" + email(c, "email-box") + "</div>";
      html += locationBlock(L.location);
      setHTML("#join-body", html);
      initLocation();

      if (quotes.length < 2) return;
      const qEls = $$(".quote-stage .quote"), pEls = $$(".portraits .portrait"), dots = $$(".quote-dots button");
      const pauseBtn = $("#quote-pause"), root = $(".quote-grid");
      let i = 0, timer = 0, userPaused = reduceMotion, hoverPaused = false;
      const delay = Math.max(4, Number(J.rotateSeconds) || 8) * 1000;

      function show(n) {
        i = (n + quotes.length) % quotes.length;
        qEls.forEach((el, k) => { el.classList.toggle("is-active", k === i); el.toggleAttribute("aria-hidden", k !== i); });
        pEls.forEach((el) => el.classList.toggle("is-active", el.dataset.by === quotes[i].by));
        dots.forEach((d, k) => d.toggleAttribute("aria-current", k === i));
      }
      function schedule() {
        clearTimeout(timer);
        if (!userPaused && !hoverPaused) timer = setTimeout(() => { show(i + 1); schedule(); }, delay);
      }
      function setPaused(p) {
        userPaused = p;
        pauseBtn.textContent = p ? "Play" : "Pause";
        pauseBtn.setAttribute("aria-pressed", String(p));
        schedule();
      }
      dots.forEach((d) => d.addEventListener("click", () => { show(Number(d.dataset.q)); schedule(); }));
      pauseBtn.addEventListener("click", () => setPaused(!userPaused));
      // 마우스를 올리거나 키보드로 들어오면 잠시 멈춤
      root.addEventListener("mouseenter", () => { hoverPaused = true; schedule(); });
      root.addEventListener("mouseleave", () => { hoverPaused = false; schedule(); });
      root.addEventListener("focusin", () => { hoverPaused = true; schedule(); });
      root.addEventListener("focusout", (e) => { if (!root.contains(e.relatedTarget)) { hoverPaused = false; schedule(); } });
      document.addEventListener("visibilitychange", () => { hoverPaused = document.hidden; schedule(); });
      setPaused(userPaused);
    })();
  }

  /* ================= News archive ================= */
  if (page === "news") {
    const all = L.news || [];
    const ids = newsIds(all);
    setHTML("#page-intro", "연구실 소식 & 성과 (" + all.length + "건)");
    const years = [...new Set(all.map((n) => String(n.date).slice(0, 4)))];
    setHTML("#news-archive", years.map((y) => {
      const items = all.map((n, i) => [n, i]).filter(([n]) => String(n.date).startsWith(y));
      return '<section class="section" id="y' + y + '" aria-labelledby="yt' + y + '">' + band(y, pad(items.length) + " items", "h2").replace('class="band-label"', 'class="band-label" id="yt' + y + '"') +
        '<div class="news-list">' + items.map(([n, i]) => newsRow(n, ids[i], "full")).join("") + "</div></section>";
    }).join("") || '<p class="empty">아직 등록된 소식이 없습니다.</p>');
  }

  /* ================= Research ================= */
  if (page === "research") {
    const R = L.research || {};
    const topics = R.topics || [];
    setHTML("#page-intro", R.intro || "");

    const track = $("#topic-track"), chips = $("#topic-chips"), detail = $("#topic-detail");
    const section = $("#topics");

    track.innerHTML = topics.map((t, i) => {
      const firstList = (t.lists || []).find((l) => l.items && l.items.length);
      return '<article class="slide" data-i="' + i + '" aria-label="' + (i + 1) + " / " + topics.length + ": " + esc(t.short || t.title) + '">' +
        '<div class="slide-top"><div class="slide-copy">' +
        '<p class="label">' + esc(t.category || "") + "</p>" +
        '<h3 class="slide-title"><a href="#detail-' + esc(t.id) + '" data-detail="' + i + '">' + esc(t.subtitle || t.title) + ' <span class="ne" aria-hidden="true">&#8599;</span></a></h3>' +
        "</div>" +
        '<div class="slide-art">' +
        (t.labels && t.labels.length ? '<ul class="art-labels">' + t.labels.map((l) => "<li>" + esc(l) + "</li>").join("") + "</ul>" : "") +
        '<div class="art">' + art(t) + "</div></div></div>" +
        '<div class="info-row">' +
        '<div class="info"><p class="caps">' + esc(t.title) + "</p></div>" +
        (firstList ? '<div class="info info-split"><p class="caps info-key">' + esc(firstList.label) + ':</p><ul class="caps arrow-list clamp">' + firstList.items.slice(0, 3).map((x) => "<li>" + x + "</li>").join("") + "</ul></div>" : '<div class="info"></div>') +
        '<div class="info info-split"><p class="caps info-key">' + esc(S.shortName || "") + ' &rarr;</p><p class="caps clamp">' + (t.description || "") + "</p></div>" +
        "</div>" +
        '<p class="wordmark wordmark-sm" aria-hidden="true">' + wordmark(t.wordmark) + "</p>" +
        "</article>";
    }).join("");

    chips.innerHTML = topics.map((t, i) => '<button type="button" class="chip" data-i="' + i + '">' + esc(t.short || t.title) + "</button>").join("");

    detail.innerHTML = topics.map((t, i) =>
      '<article class="detail" id="detail-' + esc(t.id) + '">' +
      '<div class="detail-side"><p class="label">' + pad(i + 1) + " / " + esc(t.category || "") + '</p><div class="detail-art">' + art(t) + "</div>" +
      (t.imageCredit && t.image ? '<p class="credit">' + esc(t.imageCredit) + "</p>" : "") + "</div>" +
      '<div class="detail-main"><h3>' + esc(t.subtitle || t.title) + '</h3><p class="detail-en">' + esc(t.title) + "</p>" +
      (t.description ? '<p class="prose">' + t.description + "</p>" : "") +
      (t.note ? '<p class="note"><span class="caps">Notice</span> ' + t.note + "</p>" : "") +
      lists(t.lists) + sponsorBlock(t.sponsors, R.showEmptySponsor !== false) + partnerBlock(t.partners) + "</div></article>"
    ).join("");

    const slides = $$(".slide", track);
    const chipEls = $$(".chip", chips);
    let current = -1;

    function setActive(i) {
      if (i === current) return;
      current = i;
      slides.forEach((s, k) => s.classList.toggle("is-active", k === i));
      chipEls.forEach((c, k) => c.setAttribute("aria-current", k === i ? "true" : "false"));
      if (chips.scrollWidth > chips.clientWidth) {
        chips.scrollTo({ left: chipEls[i].offsetLeft - chips.clientWidth / 2 + chipEls[i].offsetWidth / 2, behavior: reduceMotion ? "auto" : "smooth" });
      }
      $("#topic-counter").textContent = pad(i + 1) + " / " + pad(slides.length);
      $("#topic-prev").disabled = i === 0;
      $("#topic-next").disabled = i === slides.length - 1;
    }
    function go(i, instant) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      const s = slides[i];
      track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2, behavior: instant || reduceMotion ? "auto" : "smooth" });
      setActive(i);
    }
    function nearest() {
      const mid = track.scrollLeft + track.clientWidth / 2;
      let best = 0, bd = Infinity;
      slides.forEach((s, i) => { const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = i; } });
      return best;
    }
    let raf = 0;
    track.addEventListener("scroll", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setActive(nearest())); }, { passive: true });
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); go(current + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(current - 1); }
    });
    // 옆 카드를 누르면 그 카드로 이동
    track.addEventListener("click", (e) => {
      const s = e.target.closest(".slide");
      if (s && !s.classList.contains("is-active") && !e.target.closest("a")) go(Number(s.dataset.i));
    });
    $("#topic-prev").addEventListener("click", () => go(current - 1));
    $("#topic-next").addEventListener("click", () => go(current + 1));

    chips.addEventListener("click", (e) => {
      const c = e.target.closest(".chip");
      if (c) go(Number(c.dataset.i));
    });

    // research.html#ai-accelerator 처럼 들어오면 해당 카드로
    const fromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const i = topics.findIndex((t) => t.id === id);
      if (i >= 0) { go(i, true); section.scrollIntoView({ block: "start" }); }
    };
    window.addEventListener("hashchange", fromHash);
    requestAnimationFrame(() => {
      go(0, true);
      if (location.hash) fromHash();
    });
    let rt = 0;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => go(current, true), 120); });

    // Projects
    const projects = R.projects || [];
    const show = 4;
    setHTML("#project-list", projects.map((p, i) => {
      const meta = [p.period, p.sponsor].filter(Boolean).map(esc).join(" / ");
      return '<article class="cut-card project' + (i >= show ? " is-extra" : "") + '"><div class="cut-inner">' +
        '<p class="caps project-meta">' + (meta || "&nbsp;") + "</p>" +
        "<h3>" + esc(p.title) + "</h3>" +
        (p.subtitle ? '<p class="project-sub">' + esc(p.subtitle) + "</p>" : "") +
        (p.description ? '<p class="prose">' + p.description + "</p>" : "") +
        lists(p.lists) + "</div></article>";
    }).join(""));
    if (projects.length > show) {
      setHTML("#project-foot", '<button type="button" class="btn-box btn-wide" id="project-more" aria-expanded="false"><span>Expand list</span><span class="chev" aria-hidden="true"></span></button>');
      const btn = $("#project-more"), grid = $("#project-list");
      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") !== "true";
        btn.setAttribute("aria-expanded", String(open));
        grid.classList.toggle("is-expanded", open);
        btn.firstChild.textContent = open ? "Collapse list" : "Expand list";
      });
    }
  }

  /* ================= People ================= */
  if (page === "people") {
    const P = L.people || {};
    setHTML("#page-intro", P.intro || "");
    let html = "";
    let n = 0;
    if (P.pi) {
      const pi = P.pi;
      const links = (pi.links || []).map((l) => '<li><a href="' + esc(l.url) + '">' + esc(l.label) + "</a></li>");
      if (pi.emailImage) links.unshift("<li>" + email(pi) + "</li>");
      html += '<section class="section" id="g-pi" aria-labelledby="gt-pi">' + band("Professor", pad(++n), "h2").replace('class="band-label"', 'class="band-label" id="gt-pi"') +
        '<div class="pi">' + avatar(pi) + '<div class="pi-main">' +
        "<h3>" + esc(pi.name) + (pi.nameEn ? ' <span class="name-en">' + esc(pi.nameEn) + "</span>" : "") + "</h3>" +
        (pi.title ? '<p class="caps pi-title">' + esc(pi.title) + "</p>" : "") +
        (pi.bio ? '<p class="prose">' + pi.bio + "</p>" : "") +
        (pi.research && pi.research.length ? '<div class="info-block"><p class="caps">Research interests</p>' + arrowList(pi.research.map(esc)) + "</div>" : "") +
        (links.length ? '<ul class="inline-links">' + links.join("") + "</ul>" : "") +
        "</div></div></section>";
    }
    // 그룹은 members 하나로 쓰거나, subgroups: [{ title, members }] 로 소제목별로 나눌 수 있음
    const subsOf = (g) => (g.subgroups && g.subgroups.length ? g.subgroups : [{ title: "", members: g.members || [] }])
      .filter((sg) => sg.members && sg.members.length);
    const badgeRow = (m) => (m.badges && m.badges.length
      ? '<ul class="member-badges">' + m.badges.map((x) =>
          '<li title="' + esc(x.name || "") + '"><img src="' + esc(x.logo) + '" alt="' + esc(x.name || "") + '" loading="lazy"' + (x.height ? ' style="height:' + Number(x.height) + 'px"' : "") + "></li>").join("") + "</ul>"
      : "");
    const compactList = (ms) => '<ul class="alumni">' + ms.map((m) =>
      '<li><p class="member-name">' + esc(m.name) + "</p>" +
      '<p class="caps member-meta">' + [m.period, m.now].filter(Boolean).map(esc).join(" / ") + "</p>" +
      (m.research && m.research.length ? '<p class="member-research">' + m.research.map(esc).join(", ") + "</p>" : "") +
      "</li>").join("") + "</ul>";
    const cardList = (ms) => '<ul class="members">' + ms.map((m) =>
      '<li class="cut-card member"><div class="cut-inner">' + avatar(m) + "<div>" +
      (m.role ? '<p class="caps role">' + esc(m.role) + "</p>" : "") +
      '<p class="member-name">' + (m.url ? '<a href="' + esc(m.url) + '">' + esc(m.name) + "</a>" : esc(m.name)) + "</p>" +
      (m.period ? '<p class="caps member-meta">' + esc(m.period) + "</p>" : "") +
      (m.research && m.research.length ? '<p class="member-research">' + m.research.map(esc).join(", ") + "</p>" : "") +
      (m.extra && m.extra.length ? '<p class="member-extra">' + m.extra.map(esc).join("<br>") + "</p>" : "") +
      (m.emailImage ? '<p class="member-extra">' + email(m) + "</p>" : "") +
      badgeRow(m) +
      "</div></div></li>").join("") + "</ul>";
    (P.groups || []).forEach((g) => {
      const subs = subsOf(g);
      const total = subs.reduce((k, sg) => k + sg.members.length, 0);
      if (!total) return;
      const id = "g-" + slug(g.title);
      html += '<section class="section" id="' + id + '" aria-labelledby="t' + id + '">' +
        band(esc(g.title) + ' <span class="band-count">' + total + "</span>", pad(++n), "h2").replace('class="band-label"', 'class="band-label" id="t' + id + '"');
      subs.forEach((sg) => {
        if (sg.title) html += '<h3 class="caps subgroup-title">' + esc(sg.title) + ' <span class="band-count">' + sg.members.length + "</span></h3>";
        html += g.compact ? compactList(sg.members) : cardList(sg.members);
      });
      html += "</section>";
    });
    setHTML("#people-list", html);
  }

  /* ================= Publications ================= */
  if (page === "publications") {
    setHTML("#page-intro", L.publicationsIntro || "");
    const pubs = (L.publications || []).slice().sort((a, b) => b.year - a.year);
    // 진행 중 연구 (심사 중, 프리프린트 등): 상태 순서대로
    const STATUS_ORDER = ["Major Revision", "Minor Revision", "Under Review", "Preprint", "In Preparation"];
    const rank = (st) => { const i = STATUS_ORDER.indexOf(st); return i < 0 ? STATUS_ORDER.length : i; };
    const ongoing = (L.ongoingWork || []).filter((p) => p && p.title).slice().sort((a, b) => rank(a.status) - rank(b.status));

    const names = new Set();
    const P = L.people || {};
    const addP = (p) => { if (!p) return; names.add(String(p.name).replace(/\(.*?\)/g, "").trim()); (p.aliases || []).forEach((a) => names.add(a)); };
    addP(P.pi);
    (P.groups || []).forEach((g) => (g.members || []).concat(...(g.subgroups || []).map((sg) => sg.members || [])).forEach(addP));

    const SCOPES = [["all", "All"], ["international", "International"], ["domestic", "Domestic"]]
      .filter(([k]) => k === "all" || pubs.concat(ongoing).some((p) => p.scope === k));
    const LINKS = { pdf: "PDF", doi: "DOI", code: "Code", slides: "Slides", video: "Video", project: "Project" };
    const TAGC = L.tagColors || {};
    let scope = "all", query = "";

    const filterEl = $("#pub-filter");
    const drawFilter = () => {
      filterEl.innerHTML = SCOPES.map(([k, l]) => '<button type="button" class="chip" data-scope="' + k + '" aria-pressed="' + (k === scope) + '">' + l + "</button>").join("");
    };
    drawFilter();
    filterEl.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      scope = b.dataset.scope;
      drawFilter();
      render();
    });
    const search = $("#pub-search");
    search.addEventListener("input", () => { query = search.value.trim().toLowerCase(); render(); });

    const authorsHtml = (list) => list.map((a) => {
      const bare = a.replace(/[*†‡]+$/, "").trim();
      return names.has(bare) ? "<strong>" + esc(a) + "</strong>" : esc(a);
    }).join(", ");
    const match = (p) => {
      if (scope !== "all" && p.scope !== scope) return false;
      if (!query) return true;
      return [p.title, p.venue, p.details, p.status, (p.authors || []).join(" "), (p.tags || []).join(" "), p.year].join(" ").toLowerCase().includes(query);
    };
    function pubItem(p) {
      const links = Object.entries(p.links || {}).filter(([, u]) => u).map(([k, u]) => '<a href="' + esc(u) + '">' + esc(LINKS[k] || k) + "</a>");
      return '<li class="pub">' +
        '<div class="pub-tags">' + (p.tags || []).map((t) => '<span class="badge' + (TAGC[t] ? " tag-" + TAGC[t] : "") + '">' + esc(t) + "</span>").join("") + "</div>" +
        '<div class="pub-main"><p class="pub-title">' + esc(p.title) + "</p>" +
        '<p class="pub-authors">' + authorsHtml(p.authors || []) + "</p>" +
        '<p class="pub-venue">' + [p.venue ? '<span class="venue">' + esc(p.venue) + "</span>" : "", p.details ? esc(p.details) : ""].filter(Boolean).join(", ") +
        (p.status ? ' <span class="caps pub-status' + (p.ongoing ? " is-ongoing" : "") + '">' + esc(p.status) + "</span>" : "") + "</p>" +
        (p.note ? '<p class="pub-note">' + esc(p.note) + "</p>" : "") +
        (links.length ? '<p class="pub-links">' + links.join("") + "</p>" : "") +
        "</div></li>";
    }
    ongoing.forEach((p) => (p.ongoing = true));
    function scopeGroups(list) {
      const groups = [["international", "International"], ["domestic", "Domestic"]]
        .map(([k, label]) => [label, list.filter((p) => p.scope === k)]).filter(([, a]) => a.length);
      const other = list.filter((p) => p.scope !== "international" && p.scope !== "domestic");
      if (other.length) groups.push([list === other || !groups.length ? "" : "Other", other]);
      return groups;
    }
    function render() {
      const shown = pubs.filter(match);
      const shownOn = ongoing.filter(match);
      $("#pub-count").textContent = (shown.length === pubs.length ? pubs.length + " papers" : shown.length + " / " + pubs.length + " papers") +
        (ongoing.length ? " · " + (shownOn.length === ongoing.length ? ongoing.length : shownOn.length + " / " + ongoing.length) + " ongoing" : "");
      if (!shown.length && !shownOn.length) {
        $("#pub-list").innerHTML = '<p class="empty">조건에 맞는 논문이 없습니다. <button type="button" class="text-btn" id="pub-reset">검색 조건 지우기</button></p>';
        $("#pub-reset").addEventListener("click", () => { search.value = ""; query = ""; scope = "all"; drawFilter(); render(); search.focus(); });
        return;
      }
      const years = [...new Set(shown.map((p) => p.year))];
      const ongoingHtml = shownOn.length
        ? '<section class="pub-year-block pub-ongoing" id="pyongoing" aria-label="Ongoing work">' +
          '<h2 class="pub-year">Ongoing</h2><div>' +
          scopeGroups(shownOn).map(([label, arr]) => (label ? '<h3 class="caps pub-scope">' + label + "</h3>" : "") + '<ul class="pubs">' + arr.map(pubItem).join("") + "</ul>").join("") +
          "</div></section>"
        : "";
      $("#pub-list").innerHTML = ongoingHtml + years.map((y) => {
        const inYear = shown.filter((p) => p.year === y);
        const groups = [["international", "International"], ["domestic", "Domestic"]]
          .map(([k, label]) => [label, inYear.filter((p) => p.scope === k)]).filter(([, a]) => a.length);
        const other = inYear.filter((p) => p.scope !== "international" && p.scope !== "domestic");
        if (other.length) groups.push(["Other", other]);
        return '<section class="pub-year-block" id="py' + y + '" aria-label="' + y + '">' +
          '<h2 class="pub-year">' + y + "</h2><div>" +
          groups.map(([label, arr]) => '<h3 class="caps pub-scope">' + label + '</h3><ul class="pubs">' + arr.map(pubItem).join("") + "</ul>").join("") +
          "</div></section>";
      }).join("");
    }
    render();
  }

  /* ================= Teaching ================= */
  if (page === "teaching") {
    const T = L.teaching || {};
    setHTML("#page-intro", T.intro || "");
    const C = T.courses || {};
    const TAGC = T.tagColors || {};
    const LEVELS = [["undergrad", "Undergraduate"], ["grad", "Graduate"]];
    const termKey = (t) => { const [y, s] = String(t).split("-").map(Number); return y * 10 + (s || 0); };
    const termLong = (t) => { const [y, s] = String(t).split("-"); return y + "학년도 " + s + "학기"; };
    const termShort = (t) => String(t);
    const cur = termKey(T.currentTerm || "0-0");
    // 학기별 개설 목록 → { term, id, link }
    const offerings = [];
    (T.terms || []).forEach((tm) => (tm.courses || []).forEach((c) => {
      const id = typeof c === "string" ? c : c.id;
      if (C[id]) offerings.push({ term: tm.term, id, link: typeof c === "string" ? "" : c.link || "" });
    }));
    offerings.sort((a, b) => termKey(b.term) - termKey(a.term));
    const allTags = Object.keys(TAGC).filter((t) => Object.values(C).some((c) => (c.tags || []).includes(t)));
    let view = "term", tag = "all";

    const tagBadges = (c) => (c.tags || []).map((t) => '<span class="badge' + (TAGC[t] ? " tag-" + TAGC[t] : "") + '">' + esc(t) + "</span>").join("");
    const courseName = (c, link) =>
      '<p class="course-name">' + (link ? '<a href="' + esc(link) + '">' + esc(c.name) + "</a>" : esc(c.name)) + "</p>" +
      (c.nameEn ? '<p class="course-en">' + esc(c.nameEn) + "</p>" : "");
    // 이번 학기 과목 옆 움직이는 그림 (누르면 과목 사이트로)
    const courseArt = (c, link) => {
      const f = c.illustration && window.ILLUS && window.ILLUS[c.illustration];
      if (!f) return "";
      return link
        ? '<a class="course-art" href="' + esc(link) + '" aria-label="' + esc(c.name) + ' 과목 사이트">' + f() + "</a>"
        : '<div class="course-art">' + f() + "</div>";
    };
    const levelGroups = (items, getCourse) => LEVELS
      .map(([k, label]) => [label, items.filter((x) => getCourse(x).level === k)]).filter(([, a]) => a.length);

    const viewEl = $("#teach-view"), tagEl = $("#teach-tags");
    const drawChips = () => {
      viewEl.innerHTML = [["term", "By term"], ["course", "By course"]]
        .map(([k, l]) => '<button type="button" class="chip" data-view="' + k + '" aria-pressed="' + (k === view) + '">' + l + "</button>").join("");
      tagEl.innerHTML = [["all", "All"]].concat(allTags.map((t) => [t, t]))
        .map(([k, l]) => '<button type="button" class="chip chip-tag" data-tag="' + esc(k) + '" aria-pressed="' + (k === tag) + '">' + esc(l) + "</button>").join("");
    };
    viewEl.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; view = b.dataset.view; drawChips(); render(); });
    tagEl.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; tag = b.dataset.tag; drawChips(); render(); });

    function termView(list) {
      const terms = [...new Set(list.map((o) => o.term))];
      const block = (t) => {
        const inTerm = list.filter((o) => o.term === t);
        const isNow = termKey(t) >= cur;
        return '<section class="pub-year-block teach-term' + (isNow ? " is-current" : "") + '" aria-label="' + esc(termLong(t)) + '">' +
          '<h3 class="pub-year teach-term-label">' + esc(t.split("-")[0]) + '<span>' + esc(t.split("-")[1]) + "학기</span></h3><div>" +
          levelGroups(inTerm, (o) => C[o.id]).map(([label, arr]) =>
            '<h4 class="caps pub-scope">' + label + '</h4><ul class="pubs">' +
            arr.map((o) => {
              const c = C[o.id], link = o.link || c.link, art = isNow ? courseArt(c, link) : "";
              return '<li class="pub course' + (art ? " has-art" : "") + '"><div class="pub-tags">' + tagBadges(c) + '</div><div class="pub-main">' + courseName(c, link) + "</div>" + art + "</li>";
            }).join("") +
            "</ul>").join("") +
          "</div></section>";
      };
      const now = terms.filter((t) => termKey(t) >= cur), past = terms.filter((t) => termKey(t) < cur);
      return (now.length ? '<h2 class="caps teach-section">Current Courses</h2>' + now.map(block).join("") : "") +
        (past.length ? '<h2 class="caps teach-section">Past Courses</h2>' + past.map(block).join("") : "");
    }
    function courseView(list) {
      const ids = [...new Set(list.map((o) => o.id))];   // 최근 개설 순
      return levelGroups(ids, (id) => C[id]).map(([label, arr]) =>
        '<section class="pub-year-block teach-course-block" aria-label="' + label + '">' +
        '<h3 class="pub-year teach-level">' + label + '</h3><div><ul class="pubs">' +
        arr.map((id) => {
          const c = C[id], terms = list.filter((o) => o.id === id);
          const isCur = terms.some((o) => termKey(o.term) >= cur);
          const art = isCur ? courseArt(c, c.link) : "";
          return '<li class="pub course' + (art ? " has-art" : "") + '"><div class="pub-tags">' + tagBadges(c) + '</div><div class="pub-main">' +
            courseName(c, c.link) +
            '<p class="course-terms">(' + terms.map((o) => {
              const label = termShort(o.term) + "학기";
              const inner = termKey(o.term) >= cur ? '<strong>' + esc(label) + "</strong>" : esc(label);
              return o.link ? '<a href="' + esc(o.link) + '">' + inner + "</a>" : inner;
            }).join(", ") + ")" + (isCur ? ' <span class="caps pub-status">Now</span>' : "") + "</p>" +
            "</div>" + art + "</li>";
        }).join("") + "</ul></div></section>").join("");
    }
    function render() {
      const list = offerings.filter((o) => tag === "all" || (C[o.id].tags || []).includes(tag));
      const nCourses = new Set(list.map((o) => o.id)).size, nTerms = new Set(list.map((o) => o.term)).size;
      $("#teach-count").textContent = nCourses + " courses · " + nTerms + " terms";
      $("#teach-list").innerHTML = list.length ? (view === "term" ? termView(list) : courseView(list)) : '<p class="empty">해당 분야의 강의가 없습니다.</p>';
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.querySelectorAll(".course-art svg").forEach((el) => el.pauseAnimations && el.pauseAnimations());
      }
    }
    drawChips();
    render();
  }
})();
