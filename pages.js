/* ==========================================================================
   PAGES 2–14 · sketch recipes
   Each renderPageNSketch(S) records ops onto the Sketch recorder S:
   pencil guides → ink → washes → accents. Canvas space is 600 × 800.
   ========================================================================== */
const INK = "#27211d", GRAPH = "#6b655e", SKIN = "#e0ab87", HAIR = "#2b211d", GOLD = "#b8892e";

/* ---------- shared helpers ---------- */
function inPoly([x, y], poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (((yi > y) !== (yj > y)) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
  }
  return c;
}
function scatterIn(S, poly, n, fn) {
  const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  let k = 0, tries = 0;
  while (k < n && tries < n * 40) { tries++; const p = [S.rand(x0, x1), S.rand(y0, y1)]; if (inPoly(p, poly)) { fn(p, k); k++; } }
}
const ink = (S, pts, o = {}) => S.line(pts, { w: 1.4, c: INK, passes: 2, jit: 0.7, ...o });
const inkC = (S, pts, o = {}) => ink(S, pts, { closed: true, ...o });
const guide = (S, pts, o = {}) => S.line(pts, { w: 0.7, c: GRAPH, a: 0.28, jit: 0.8, tremor: 0.3, ...o });
const fine = (S, pts, o = {}) => S.line(pts, { w: 0.8, c: INK, a: 0.6, jit: 0.4, ...o });
function band(a, b, w) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L * w / 2, ny = dx / L * w / 2;
  return [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]];
}
function scallop(S, a, b, n, amp, o = {}) {
  const pts = [], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  for (let i = 0; i <= n * 6; i++) { const t = i / (n * 6), k = Math.abs(Math.sin(t * n * Math.PI)); pts.push([a[0] + dx * t + nx * k * amp, a[1] + dy * t + ny * k * amp]); }
  S.line(pts, { w: 0.9, c: INK, a: 0.7, jit: 0.2, step: 2, tremor: 0.1, ...o });
}
function hand(S, x, y, r, ang = 0) {
  const e = S.ellipse(x, y, r, r * 0.7, ang, 14);
  S.line(e, { w: 1.1, c: INK, a: 0.85, closed: true, jit: 0.4 });
  const a = ang + Math.PI / 2;
  for (let i = -1; i <= 1; i++) {
    const bx = x + Math.cos(ang) * i * r * 0.4, by = y + Math.sin(ang) * i * r * 0.4;
    fine(S, [[bx - Math.cos(a) * r * 0.2, by - Math.sin(a) * r * 0.2], [bx + Math.cos(a) * r * 0.5, by + Math.sin(a) * r * 0.5]], { w: 0.6, step: 1.5 });
  }
  return e;
}
function heartPts(cx, cy, k, n = 60) {
  const p = [];
  for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2; p.push([cx + 16 * Math.pow(Math.sin(t), 3) * k, cy - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * k]); }
  return p;
}
function flame(S, x, y, s) {
  S.wash(S.ellipse(x, y - 6 * s, 9 * s, 11 * s, 0, 10), { c: "#ffd36b", a: 0.2, layers: 1, spread: 0.6, edge: false, mode: "source-over" });
  S.wash([[x, y], [x - 3 * s, y - 5 * s], [x, y - 12 * s], [x + 3 * s, y - 5 * s]], { c: "#f39a1e", a: 0.85, layers: 1, spread: 0.2, edge: false, mode: "source-over" });
  S.wash([[x, y - 1 * s], [x - 1.5 * s, y - 4 * s], [x, y - 8 * s], [x + 1.5 * s, y - 4 * s]], { c: "#fff1b0", a: 0.9, layers: 1, spread: 0.1, edge: false, mode: "source-over" });
}
function diya(S, x, y, s) {
  const bowl = [[x - 11 * s, y - 1 * s], [x - 6 * s, y + 6 * s], [x + 6 * s, y + 6 * s], [x + 11 * s, y - 1 * s], [x, y + 1 * s]];
  S.wash(bowl, { c: "#b5553a", a: 0.75, layers: 1, spread: 0.3, edge: false, mode: "source-over" });
  S.line(bowl, { w: 0.9, c: INK, a: 0.7, closed: true, step: 1.5, jit: 0.2, tremor: 0.1 });
  flame(S, x + 5 * s, y - 1 * s, s);
}
function earring(S, x, y, rx, type) {
  const k = Math.min(rx / 30, 2);
  if (type === "pearl") {
    S.line([[x, y], [x, y + 6 * k]], { w: 0.8, c: GRAPH, step: 1, tremor: 0 });
    S.line(S.ellipse(x, y + 10 * k, 3.5 * k, 3.5 * k, 0, 10), { w: 1, c: INK, closed: true, step: 1, tremor: 0 });
    S.line(S.ellipse(x + 2 * k, y + 19 * k, 4.5 * k, 4.5 * k, 0, 10), { w: 1, c: INK, closed: true, step: 1, tremor: 0 });
  } else if (type === "jhumka") {
    const dome = [[x - 8 * k, y + 26 * k], [x - 6 * k, y + 14 * k], [x, y + 10 * k], [x + 6 * k, y + 14 * k], [x + 8 * k, y + 26 * k]];
    S.line(S.ellipse(x, y + 5 * k, 3.5 * k, 3.5 * k, 0, 8), { w: 1.2, c: GOLD, closed: true, step: 1, tremor: 0 });
    S.line(dome, { w: 1.2, c: GOLD, closed: true, step: 1.5, tremor: 0.1 });
    for (let i = 0; i < 4; i++) S.line(S.ellipse(x - 6 * k + i * 4 * k, y + 30 * k, 1.5 * k, 1.5 * k, 0, 6), { w: 1.2, c: "#8f7a5a", closed: true, step: 1, tremor: 0 });
    S.wash(dome, { c: "#d6a93f", a: 0.4, layers: 1, spread: 0.3, edge: false });
  } else if (type === "drop") {
    S.line([[x, y], [x, y + 12 * k]], { w: 1, c: GOLD, step: 1, tremor: 0 });
    const d = S.ellipse(x, y + 17 * k, 4 * k, 5 * k, 0, 10);
    S.line(d, { w: 1.3, c: "#8a1f2a", closed: true, step: 1, tremor: 0 });
    S.wash(d, { c: "#c0283a", a: 0.5, layers: 1, spread: 0.2, edge: false });
  }
}
/* A face: jaw line, eyes glancing by `look`, brows, nose, lips; optional bindi and earrings. */
function sketchFace(S, cx, cy, rx, ry, o = {}) {
  const look = o.look ?? 0.3, tilt = o.tilt || 0, c = Math.cos(tilt), s = Math.sin(tilt);
  const R = (x, y) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
  const map = pts => pts.map(([x, y]) => R(x, y));
  const U = (u, v) => [cx + u * rx, cy + v * ry];
  const lw = Math.min(Math.max(rx / 34, 0.8), 1.7);
  S.line(map([U(-1, -0.3), U(-0.98, 0.15), U(-0.84, 0.55), U(-0.5, 0.88), U(0.02, 1), U(0.5, 0.88), U(0.84, 0.55), U(0.98, 0.15), U(1, -0.3)]), { w: 1.2 * lw, c: INK, a: 0.85, jit: 0.4 });
  const fx = cx + look * rx * 0.16, ey = cy - ry * 0.02, es = rx * 0.21;
  const st = { c: INK, jit: 0.15, tremor: 0.08, step: 1.5 };
  [-1, 1].forEach(side => {
    const ex = fx + side * rx * 0.4;
    S.line(map([[ex - es, ey], [ex, ey - es * 0.42], [ex + es, ey + es * 0.05]]), { ...st, w: 1.1 * lw });
    S.line(map([[ex - es * 0.75, ey + es * 0.22], [ex, ey + es * 0.32], [ex + es * 0.8, ey + es * 0.12]]), { ...st, w: 0.6 * lw, a: 0.45 });
    const px = ex + look * es * 0.35;
    S.line(map(S.ellipse(px, ey + es * 0.02, es * 0.28, es * 0.26, 0, 8)), { w: 1.8 * lw, c: INK, closed: true, step: 1, tremor: 0 });
    S.line(map([[ex - es * 1.1, ey - es * 1.15], [ex, ey - es * 1.55], [ex + es * 1.1, ey - es * 1.2]]), { ...st, w: 0.9 * lw, a: 0.7 });
  });
  S.line(map([[fx + rx * 0.04, cy + ry * 0.08], [fx + rx * 0.12, cy + ry * 0.34], [fx - rx * 0.06, cy + ry * 0.38]]), { ...st, w: 0.9 * lw, a: 0.6 });
  const ly = cy + ry * 0.6, sm = o.smile ?? 0.5;
  const lip = map([[fx - rx * 0.26, ly - ry * 0.05 * sm], [fx, ly + ry * 0.03], [fx + rx * 0.26, ly - ry * 0.06 * sm], [fx, ly + ry * 0.12]]);
  S.line(lip.slice(0, 3), { ...st, w: 1.1 * lw, c: "#7a2f37", a: 0.85 });
  if (o.bindi) S.line(map(S.ellipse(fx, cy - ry * 0.3, rx * 0.05, rx * 0.05, 0, 8)), { w: 2.2 * lw, c: "#9b1b2a", closed: true, step: 1, tremor: 0 });
  const ears = [R(cx - rx * 1.02, cy + ry * 0.22), R(cx + rx * 1.02, cy + ry * 0.22)];
  if (o.earrings) (o.earSides || [0, 1]).forEach(i => earring(S, ears[i][0], ears[i][1], rx, o.earrings));
  const facePoly = map([U(-1, -0.6), U(-1, -0.3), U(-0.98, 0.15), U(-0.84, 0.55), U(-0.5, 0.88), U(0.02, 1), U(0.5, 0.88), U(0.84, 0.55), U(0.98, 0.15), U(1, -0.3), U(1, -0.6), U(0, -0.95)]);
  return { facePoly, lip, rx, blush: [R(fx - rx * 0.42, cy + ry * 0.3), R(fx + rx * 0.42, cy + ry * 0.3)] };
}
function faceWash(S, f, o = {}) {
  S.wash(f.facePoly, { c: o.skin || SKIN, a: 0.26, layers: 2, spread: 1 });
  f.blush.forEach(([x, y]) => S.wash(S.ellipse(x, y, f.rx * 0.2, f.rx * 0.13, 0, 10), { c: "#e58a8a", a: 0.12, layers: 2, spread: 0.5, edge: false }));
  S.wash(f.lip, { c: o.lipC || "#c0616d", a: 0.45, layers: 2, spread: 0.2, edge: false });
}
function strands(S, n, a0, a1, b0, b1, bend, o = {}) {
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : i / (n - 1);
    const st = [a0[0] + (a1[0] - a0[0]) * t, a0[1] + (a1[1] - a0[1]) * t];
    const en = [b0[0] + (b1[0] - b0[0]) * t + S.rand(-4, 4), b0[1] + (b1[1] - b0[1]) * t + S.rand(-6, 10)];
    const md = [(st[0] + en[0]) / 2 + bend[0] + S.rand(-3, 3), (st[1] + en[1]) / 2 + bend[1]];
    S.line([st, md, en], { w: S.rand(0.5, 1.1), c: o.c || HAIR, a: o.a || 0.5, jit: 1, step: 4, clip: o.clip || null });
  }
}
function tinyFlower(S, x, y, r, col, withInk = true) {
  for (let k = 0; k < 5; k++) {
    const a = k * 1.2566 + S.rand(-0.2, 0.2), e = S.ellipse(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.75, r * 0.55, a, 8);
    if (withInk) S.line(e, { w: 0.7, c: INK, closed: true, a: 0.6, step: 1.5, tremor: 0.1 });
    if (col) S.wash(e, { c: col, a: 0.4, layers: 1, spread: 0.3, edge: false });
  }
}
function brightFlower(S, x, y, r, col) {
  for (let k = 0; k < 5; k++) { const a = k * 1.2566 + S.rand(-0.2, 0.2); S.wash(S.ellipse(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.8, r * 0.5, a, 8), { c: col, a: 0.75, layers: 1, spread: 0.3, edge: false, mode: "source-over" }); }
}
function glow(S, pts, col, w = 3) {
  S.line(pts, { w: w * 5, c: col, a: 0.12, jit: 0.5, step: 4, tremor: 0.2 });
  S.line(pts, { w, c: col, a: 0.85, jit: 0.3, step: 3, tremor: 0.2 });
}
function leafCluster(S, cx, cy, r, n, store, clip = null) {
  for (let i = 0; i < n; i++) {
    const a = S.rand(0, 6.28), d = S.rand(0, r);
    const lf = S.petal(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.8, S.rand(0, 6.28), S.rand(16, 28), S.rand(7, 11), true);
    store.push(lf); S.line(lf, { w: 0.8, c: INK, a: 0.6, closed: true, jit: 0.3, clip });
  }
}
function camoBlobs(S, poly, cols, n, size) {
  scatterIn(S, poly, n, (p) => S.wash(S.ellipse(p[0], p[1], S.rand(size * 0.5, size), S.rand(size * 0.3, size * 0.7), S.rand(0, 3), 9), { c: cols[Math.floor(S.r() * cols.length)], a: 0.35, layers: 1, spread: size * 0.2, clip: [{ poly }], edge: false }));
}
/* Record ops now but replay them later (to ink over opaque fills). */
function deferInk(S, fn) { const m = S.ops.length; const r = fn(); const ops = S.ops.splice(m); return { r, flush: () => S.ops.push(...ops) }; }
const sign = (S, str, x, y, c = "#33407a") => S.text(str, x, y, { size: 20, c, rot: -0.04 });

/* ---------- PAGE 2 · festival lights ---------- */
function renderPage2Sketch(S) {
  const WINE = "#7a1f38", DEEPW = "#4a1225", VIOLET = "#a24dff";
  guide(S, [[330, 120], [332, 790]]); guide(S, S.ellipse(332, 250, 54, 68, 0, 20), { closed: true }); guide(S, [[240, 375], [450, 385]]);
  ink(S, [[70, 0], [72, 400], [75, 800]], { w: 1.2 });
  const leaves = [];
  [[130, 110, 80], [500, 90, 90], [545, 300, 60], [110, 300, 70], [545, 540, 50], [120, 520, 55]].forEach(([x, y, r]) => leafCluster(S, x, y, r, 12, leaves));
  glow(S, [[95, 480], [150, 430], [175, 320], [190, 190], [230, 60], [260, 0]], VIOLET, 3);
  glow(S, [[430, 0], [460, 90], [500, 160], [545, 205], [600, 225]], VIOLET, 3);
  glow(S, [[480, 430], [525, 385], [565, 340], [600, 330]], VIOLET, 2.6);
  glow(S, [[600, 640], [545, 670], [495, 715]], VIOLET, 2.6);
  for (let i = 0; i < 8; i++) { const y = 20 + i * 95; glow(S, [[0, y + 40], [36, y + 10], [72, y - 12]], "#3f7fe0", 2); }
  // hair and face
  const cap = [[276, 232], [282, 200], [305, 182], [335, 178], [362, 186], [380, 205], [386, 234], [365, 212], [335, 205], [300, 212]];
  const hairL = [[284, 205], [272, 240], [266, 300], [270, 340], [290, 330], [292, 270]];
  const hairR = [[372, 200], [388, 240], [398, 300], [406, 360], [414, 398], [392, 392], [382, 340], [374, 280]];
  ink(S, [[276, 234], [282, 200], [305, 182], [335, 178], [362, 186], [380, 205], [388, 240], [398, 300], [406, 360], [414, 398]], { w: 1.3 });
  const f = sketchFace(S, 332, 252, 50, 64, { look: 0.55, smile: 0.9, earrings: "jhumka", earSides: [0], tilt: 0.04 });
  ink(S, [[308, 310], [306, 348]]); ink(S, [[356, 308], [360, 346]]);
  const torso = [[248, 372], [304, 350], [332, 445], [362, 350], [442, 378], [468, 470], [480, 800], [210, 800], [218, 470]];
  ink(S, [[304, 350], [332, 445], [362, 350]], { w: 1.3 });
  ink(S, [[362, 350], [442, 378], [468, 470], [480, 800]]);
  const dup = [[252, 368], [228, 440], [210, 560], [198, 800], [250, 800], [246, 600], [256, 470], [272, 390]];
  inkC(S, dup, { w: 1.2 });
  for (let i = 0; i < 3; i++) fine(S, [[250 + i * 6, 400], [230 + i * 8, 600], [215 + i * 10, 790]], { a: 0.45 });
  const upper = [[240, 392], [228, 470], [240, 535], [280, 545], [292, 520], [268, 470], [262, 400]];
  const fore = [[252, 525], [244, 440], [250, 350], [284, 345], [290, 430], [292, 525]];
  inkC(S, upper, { w: 1.3 }); inkC(S, fore, { w: 1.3 });
  const hp = S.ellipse(272, 312, 22, 30, -0.25, 16); inkC(S, hp, { w: 1.2, passes: 1 });
  for (let i = 0; i < 4; i++) fine(S, [[258 + i * 8, 292], [262 + i * 8, 318]], { w: 0.6 });
  S.line(S.ellipse(262, 300, 7, 5, 0, 10), { w: 2, c: GOLD, closed: true, step: 1, tremor: 0 });
  for (let i = 0; i < 6; i++) S.line(S.ellipse(268, 362 + i * 8, 25, 6, -0.05, 16), { w: 1.8, c: i % 2 ? GOLD : "#8a6a2a", closed: true, a: 0.9, jit: 0.3, step: 2, tremor: 0.1 });
  const belt = [[216, 688], [475, 700], [476, 726], [214, 716]];
  inkC(S, belt, { w: 1.3 });
  for (let x = 230; x < 470; x += 16) S.line(S.ellipse(x, 707 + (x - 216) * 0.045, 4, 4, 0, 8), { w: 1.2, c: GOLD, closed: true, step: 1, tremor: 0.1 });
  for (let i = 0; i < 6; i++) { const x = 240 + i * 40; fine(S, [[x, 732], [x - 6 + S.rand(-4, 4), 792]], { a: 0.5 }); }
  const phone = [[440, 735], [470, 730], [476, 800], [446, 800]]; inkC(S, phone, { w: 1.2 });
  const h2 = hand(S, 452, 752, 16, 0.4);
  // washes
  S.wash([[0, 0], [70, 0], [75, 800], [0, 800]], { c: "#d8589a", a: 0.18, layers: 2, spread: 3 });
  leaves.forEach(l => S.wash(l, { c: S.r() > 0.5 ? "#3e5b3c" : "#56724a", a: 0.35, layers: 1, spread: 1 }));
  faceWash(S, f);
  S.wash([[304, 350], [308, 308], [356, 306], [362, 350], [332, 445]], { c: SKIN, a: 0.28, layers: 2, spread: 1 });
  [upper, fore, hp, h2].forEach(p => S.wash(p, { c: SKIN, a: 0.28, layers: 2, spread: 1 }));
  S.wash(torso, { c: WINE, a: 0.3, layers: 3, spread: 2 });
  S.wash(dup, { c: DEEPW, a: 0.25, layers: 2, spread: 2 });
  S.wash(belt, { c: "#d6a93f", a: 0.4, layers: 2, spread: 1 });
  S.wash(phone, { c: "#1d3a6a", a: 0.6, layers: 2, spread: 0.5 });
  S.wash(cap, { c: HAIR, a: 0.4, layers: 3, spread: 1 }); S.wash(hairL, { c: HAIR, a: 0.35, layers: 2, spread: 1 }); S.wash(hairR, { c: HAIR, a: 0.35, layers: 3, spread: 1 });
  strands(S, 14, [335, 182], [384, 215], [395, 300], [412, 392], [6, 0]);
  scatterIn(S, torso, 28, (p) => { if (!inPoly(p, belt)) tinyFlower(S, p[0], p[1], 2.6, "#e0b43a", false); });
  sign(S, "p.2 · festival lights", 140, 40);
}

/* ---------- PAGE 3 · powder-blue saree ---------- */
function renderPage3Sketch(S) {
  const SAREE = "#9fbcd8", LACE = "#7f9dbf", TEAL = "#1f4f5c";
  guide(S, [[300, 100], [301, 790]]); guide(S, S.ellipse(301, 155, 32, 40, 0, 18), { closed: true }); guide(S, [[240, 226], [360, 228]]);
  ink(S, [[20, 690], [580, 688]], { w: 1, a: 0.6, passes: 1 }); ink(S, [[20, 705], [580, 703]], { w: 0.8, a: 0.45, passes: 1 });
  const hair = [[284, 170], [270, 190], [262, 240], [256, 320], [258, 400], [266, 470], [280, 468], [278, 400], [276, 320], [280, 240], [288, 190]];
  const cap = [[270, 152], [272, 125], [290, 110], [312, 110], [328, 124], [332, 152], [320, 132], [300, 126], [282, 132]];
  ink(S, [[270, 152], [272, 125], [290, 110], [312, 110], [328, 124], [332, 152]], { w: 1.2 });
  ink(S, [[270, 190], [262, 240], [256, 320], [258, 400], [266, 470]], { w: 1 });
  const f = sketchFace(S, 301, 155, 29, 37, { look: 0.7, smile: 0.6, bindi: true, earrings: "pearl" });
  ink(S, [[290, 188], [289, 210]]); ink(S, [[313, 188], [315, 210]]);
  const blouse = [[250, 226], [288, 212], [300, 222], [314, 212], [352, 226], [346, 290], [254, 290]];
  const slL = [[250, 226], [232, 310], [262, 318], [268, 250]], slR = [[352, 226], [370, 310], [340, 318], [334, 250]];
  inkC(S, slL); inkC(S, slR); ink(S, [[288, 212], [300, 226], [314, 212]], { w: 1.1 });
  const body = [[256, 290], [346, 290], [352, 420], [362, 560], [372, 700], [380, 775], [220, 775], [228, 700], [238, 560], [250, 420]];
  ink(S, [[256, 330], [250, 420], [238, 560], [228, 700], [220, 775]]); ink(S, [[346, 330], [352, 420], [362, 560], [372, 700], [380, 775]]);
  const pallu = [[338, 232], [362, 232], [388, 420], [396, 640], [360, 646], [352, 420]];
  inkC(S, pallu, { w: 1.2 });
  scallop(S, [362, 236], [396, 640], 14, 5); scallop(S, [360, 646], [396, 640], 3, 4);
  ink(S, [[340, 236], [244, 430]], { w: 1.1 }); ink(S, [[352, 252], [256, 444]], { w: 1.1 }); scallop(S, [352, 252], [256, 444], 12, 5);
  const armL = [[234, 310], [262, 318], [296, 366], [292, 380], [270, 372]], armR = [[368, 312], [342, 318], [308, 366], [312, 380], [336, 372]];
  inkC(S, armL, { w: 1.2 }); inkC(S, armR, { w: 1.2 });
  const hp = hand(S, 302, 374, 13, 0.1);
  S.line(S.ellipse(333, 368, 4, 6, 0.6, 10), { w: 2.4, c: "#8f877a", closed: true, step: 1, tremor: 0 });
  for (let i = 0; i < 7; i++) { const x = 270 + i * 10; fine(S, [[x + 4, 540], [x - 2 + S.rand(-3, 3), 775]], { a: 0.5 }); }
  scallop(S, [220, 775], [380, 775], 12, 5);
  S.wash([[20, 20], [580, 20], [580, 688], [20, 688]], { c: "#d9c7e0", a: 0.12, layers: 2, spread: 6 });
  S.wash([[20, 705], [580, 703], [580, 790], [20, 790]], { c: "#cfc8bd", a: 0.12, layers: 2, spread: 4 });
  faceWash(S, f);
  S.wash([[289, 188], [315, 188], [315, 214], [300, 224], [288, 214]], { c: SKIN, a: 0.28, layers: 2, spread: 0.6 });
  [armL, armR, hp].forEach(p => S.wash(p, { c: SKIN, a: 0.28, layers: 2, spread: 0.8 }));
  [blouse, slL, slR].forEach(p => S.wash(p, { c: TEAL, a: 0.35, layers: 3, spread: 1 }));
  S.wash(body, { c: SAREE, a: 0.3, layers: 3, spread: 2 });
  S.wash(pallu, { c: LACE, a: 0.22, layers: 2, spread: 1.5 });
  S.wash(cap, { c: HAIR, a: 0.4, layers: 3, spread: 0.8 }); S.wash(hair, { c: HAIR, a: 0.35, layers: 3, spread: 0.8 });
  strands(S, 10, [272, 150], [284, 124], [258, 400], [276, 470], [-4, 0]);
  scatterIn(S, body, 60, (p) => S.line(S.ellipse(p[0], p[1], 1.2, 1.2, 0, 5), { w: 1, c: "#f7f7f2", a: 0.8, closed: true, step: 1, tremor: 0 }));
  sign(S, "p.3 · powder-blue saree", 465, 60);
}

/* ---------- PAGE 4 · river day ---------- */
function renderPage4Sketch(S) {
  const MAR = "#4a1a22";
  guide(S, [[300, 120], [300, 790]]); guide(S, S.ellipse(300, 198, 42, 52, 0, 18), { closed: true });
  ink(S, [[0, 110], [90, 80], [170, 120], [260, 70], [370, 100], [470, 60], [600, 90]], { w: 1, a: 0.6, passes: 1 });
  const hillL = [[0, 150], [80, 170], [180, 210], [260, 250], [330, 280], [0, 300]];
  const hillR = [[600, 250], [600, 120], [520, 150], [440, 190], [400, 240]];
  ink(S, hillL.slice(0, 5), { w: 1.1, a: 0.7 }); ink(S, hillR.slice(1), { w: 1.1, a: 0.7 });
  S.hatch([0, 140, 330, 300], 1.05, 7, { w: 0.6, c: GRAPH, a: 0.35, clip: [{ poly: hillL }] });
  S.hatch([390, 110, 600, 260], -1.05, 7, { w: 0.6, c: GRAPH, a: 0.35, clip: [{ poly: hillR }] });
  const river = [[0, 300], [330, 280], [600, 245], [600, 395], [330, 430], [0, 470]];
  ink(S, [[0, 470], [330, 430], [600, 395]], { w: 1, a: 0.6, passes: 1 });
  for (let i = 0; i < 14; i++) { const x = S.rand(10, 540), y = 300 + S.rand(10, 130) - x * 0.08; fine(S, [[x, y], [x + S.rand(15, 35), y - 2]], { w: 0.6, a: 0.35 }); }
  const peb = [];
  for (let i = 0; i < 80; i++) {
    const x = S.rand(0, 600), y = S.rand(475 - x * 0.13, 800);
    if (x > 195 && x < 405 && y > 440) continue;
    const e = S.ellipse(x, y, S.rand(5, 14), S.rand(3, 8), S.rand(-0.3, 0.3), 10); peb.push(e);
    S.line(e, { w: 0.7, c: GRAPH, a: 0.55, closed: true, jit: 0.4, step: 2 });
  }
  const hairL = [[262, 160], [244, 200], [236, 260], [240, 330], [250, 385], [275, 378], [268, 320], [262, 260], [262, 200]];
  const hairR = [[338, 160], [356, 200], [364, 260], [360, 330], [352, 385], [327, 378], [334, 320], [340, 260], [340, 200]];
  const cap = [[258, 200], [262, 160], [285, 142], [315, 142], [340, 160], [344, 200], [325, 176], [300, 170], [276, 178]];
  ink(S, [[250, 385], [240, 330], [236, 260], [244, 200], [262, 160], [285, 142], [315, 142], [340, 160], [356, 200], [364, 260], [360, 330], [352, 385]], { w: 1.2 });
  const f = sketchFace(S, 300, 198, 40, 50, { look: 0.05, smile: 1 });
  ink(S, [[285, 245], [284, 280]]); ink(S, [[316, 245], [318, 280]]);
  const slL = [[238, 285], [212, 300], [204, 360], [236, 366]], slR = [[362, 285], [388, 300], [396, 360], [364, 366]];
  inkC(S, slL); inkC(S, slR);
  for (let y = 302; y < 362; y += 9) { S.line([[204, y], [238, y + 1]], { w: 1.4, c: "#2d3050", a: 0.6, jit: 0.3, step: 3, clip: [{ poly: slL }] }); S.line([[362, y], [398, y + 1]], { w: 1.4, c: "#2d3050", a: 0.6, jit: 0.3, step: 3, clip: [{ poly: slR }] }); }
  const jacket = [[240, 280], [284, 284], [300, 335], [316, 284], [360, 280], [372, 400], [370, 522], [230, 522], [228, 400]];
  inkC(S, jacket, { w: 1.5 });
  fine(S, [[300, 335], [300, 520]], { a: 0.7 });
  [395, 452, 508].forEach(y => { S.line([[228, y], [372, y - 2]], { w: 6, c: "#1d1a1a", a: 0.8, jit: 0.4, step: 3 }); S.line([[292, y - 7], [310, y - 8], [310, y + 6], [292, y + 6]], { w: 1.2, c: INK, closed: true, step: 1.5, jit: 0.2 }); });
  ink(S, [[260, 284], [262, 395]], { w: 3, passes: 1, a: 0.7 }); ink(S, [[340, 284], [338, 395]], { w: 3, passes: 1, a: 0.7 });
  const armL = [[206, 360], [200, 440], [204, 520], [214, 560], [228, 556], [232, 500], [236, 420], [236, 366]];
  const armR = [[394, 360], [400, 440], [396, 520], [386, 560], [372, 556], [368, 500], [364, 420], [364, 366]];
  inkC(S, armL, { w: 1.2 }); inkC(S, armR, { w: 1.2 });
  const pants = [[230, 522], [370, 522], [378, 800], [312, 800], [300, 640], [288, 800], [222, 800]];
  inkC(S, pants, { w: 1.3 });
  S.wash([[0, 0], [600, 0], [600, 90], [0, 110]], { c: "#dfe8ea", a: 0.12, layers: 2, spread: 4 });
  S.wash(hillL, { c: "#9b8f6e", a: 0.18, layers: 2, spread: 3 }); S.wash(hillR, { c: "#8d9a6a", a: 0.18, layers: 2, spread: 3 });
  S.wash(river, { c: "#4fc0b0", a: 0.22, layers: 3, spread: 3 });
  peb.forEach(e => S.wash(e, { c: S.r() > 0.5 ? "#bfbab0" : "#d8d2c6", a: 0.35, layers: 1, spread: 0.5, edge: false }));
  faceWash(S, f);
  S.wash([[284, 240], [318, 240], [318, 285], [284, 285]], { c: SKIN, a: 0.28, layers: 2, spread: 0.6 });
  [armL, armR].forEach(p => S.wash(p, { c: SKIN, a: 0.28, layers: 2, spread: 0.8 }));
  [slL, slR].forEach(p => S.wash(p, { c: "#e8dfe3", a: 0.3, layers: 1, spread: 0.5 }));
  S.wash(jacket, { c: "#d8383a", a: 0.35, layers: 3, spread: 1.5 });
  S.wash(pants, { c: "#8fa3a8", a: 0.2, layers: 2, spread: 1.5 });
  camoBlobs(S, pants, ["#2d3b52", "#6f8a86", "#a8b7b1", "#233040"], 28, 18);
  [cap, hairL, hairR].forEach(p => S.wash(p, { c: MAR, a: 0.38, layers: 3, spread: 1.2 }));
  strands(S, 10, [254, 178], [270, 152], [240, 360], [256, 382], [-10, 0], { c: "#3a1218" });
  strands(S, 10, [330, 152], [346, 178], [344, 382], [360, 360], [10, 0], { c: "#3a1218" });
  sign(S, "p.4 · river day", 110, 580);
}

/* ---------- PAGE 5 · by the water ---------- */
function renderPage5Sketch(S) {
  const MAR = "#4a1a22";
  guide(S, S.ellipse(300, 300, 95, 120, 0, 22), { closed: true }); guide(S, [[300, 160], [300, 790]]);
  const hill = [[0, 0], [600, 0], [600, 300], [480, 330], [300, 350], [0, 380]];
  const river = [[0, 380], [300, 350], [600, 300], [600, 340], [300, 390], [0, 420]];
  ink(S, [[0, 380], [140, 368], [300, 350], [480, 330], [600, 300]], { w: 0.9, a: 0.5, passes: 1 });
  ink(S, [[0, 420], [300, 390], [600, 340]], { w: 0.9, a: 0.5, passes: 1 });
  ink(S, [[470, 470], [600, 466]], { w: 3, a: 0.8, passes: 1 }); ink(S, [[500, 470], [502, 800]], { w: 2.4, a: 0.7, passes: 1 });
  for (let i = 0; i < 34; i++) { const x = S.rand(0, 600), y = S.rand(30, 300); if (x > 150 && x < 450) continue; S.line(S.ellipse(x, y, S.rand(6, 16), S.rand(4, 10), 0, 8), { w: 0.7, c: GRAPH, a: 0.4, closed: true, jit: 0.8 }); }
  const hairL = [[215, 200], [180, 280], [160, 380], [150, 480], [160, 560], [210, 540], [205, 440], [208, 340], [214, 260]];
  const hairR = [[385, 200], [420, 280], [440, 380], [455, 480], [462, 560], [410, 545], [400, 440], [394, 340], [388, 260]];
  const cap = [[205, 260], [215, 200], [250, 168], [300, 158], [355, 168], [390, 200], [396, 262], [372, 215], [330, 195], [280, 200], [240, 225]];
  ink(S, [[160, 560], [150, 480], [160, 380], [180, 280], [215, 200], [250, 168], [300, 158], [355, 168], [385, 200], [420, 280], [440, 380], [455, 480], [462, 560]], { w: 1.4 });
  ink(S, [[240, 225], [280, 200], [330, 195], [372, 215]], { w: 1, a: 0.6 });
  const f = sketchFace(S, 300, 300, 92, 118, { look: 0.1, smile: 0.85, earrings: "pearl" });
  ink(S, [[255, 405], [252, 455]]); ink(S, [[347, 405], [350, 455]]);
  const top = [[150, 530], [252, 455], [300, 478], [350, 455], [455, 530], [500, 800], [100, 800]];
  inkC(S, top, { w: 1.5 });
  fine(S, [[300, 478], [298, 560]], { a: 0.7 });
  ink(S, [[290, 490], [280, 560], [276, 620]], { w: 1.6, passes: 1, c: "#2f7f9f" }); ink(S, [[306, 490], [312, 560], [318, 610]], { w: 1.6, passes: 1, c: "#2f7f9f" });
  for (let i = 0; i < 5; i++) { fine(S, [[276, 620], [270 + i * 3, 650]], { w: 0.8, c: "#2f7f9f" }); fine(S, [[318, 610], [314 + i * 3, 640]], { w: 0.8, c: "#2f7f9f" }); }
  const pf = [];
  [[190, 620, 40], [385, 590, 36], [440, 720, 44], [240, 760, 34], [140, 760, 30], [340, 700, 28]].forEach(([x, y, r]) => {
    for (let k = 0; k < 3; k++) { const rr = r * (1 - k * 0.28); const e = S.ellipse(x + S.rand(-3, 3), y + S.rand(-3, 3), rr, rr * 0.8, S.rand(0, 3), 12); S.line(e, { w: 1, c: INK, a: 0.7, closed: true, jit: rr * 0.08, clip: [{ poly: top }] }); pf.push([e, k]); }
    const lf = S.petal(x + r * 0.7, y + r * 0.4, S.rand(0, 1.4), r * 1.1, r * 0.4, true); S.line(lf, { w: 0.9, c: INK, a: 0.6, closed: true, clip: [{ poly: top }] }); pf.push([lf, -1]);
  });
  S.wash(hill, { c: "#a9a077", a: 0.14, layers: 2, spread: 6 });
  S.wash(river, { c: "#8fd0c6", a: 0.25, layers: 2, spread: 3 });
  faceWash(S, f);
  S.wash([[255, 400], [347, 400], [350, 455], [300, 478], [252, 455]], { c: SKIN, a: 0.28, layers: 2, spread: 1 });
  S.wash(top, { c: "#6ec3dc", a: 0.28, layers: 3, spread: 2 });
  pf.forEach(([e, k]) => S.wash(e, { c: k < 0 ? "#3e4a44" : "#e0708f", a: k < 0 ? 0.3 : 0.22, layers: 1, spread: 1, clip: [{ poly: top }] }));
  [cap, hairL, hairR].forEach(p => S.wash(p, { c: MAR, a: 0.38, layers: 3, spread: 1.5 }));
  strands(S, 14, [210, 210], [260, 172], [160, 540], [208, 535], [-10, 0], { c: "#3a1218" });
  strands(S, 14, [340, 172], [388, 205], [410, 540], [460, 555], [10, 0], { c: "#3a1218" });
  S.wash(S.ellipse(425, 330, 26, 120, 0.2, 12), { c: "#c4507a", a: 0.08, layers: 2, spread: 4, edge: false });
  sign(S, "p.5 · by the water", 480, 60);
}

/* ---------- PAGE 6 · red kurta, pine walls ---------- */
function renderPage6Sketch(S) {
  const RED = "#d6263c";
  guide(S, S.ellipse(285, 255, 54, 68, -0.12, 18), { closed: true }); guide(S, [[230, 385], [380, 370]]);
  for (let x = 40; x < 600; x += 80) ink(S, [[x, 0], [x + 2, 420], [x + 3, 800]], { w: 0.8, a: 0.45, passes: 1 });
  for (let i = 0; i < 16; i++) { const x = S.rand(0, 580), y = S.rand(0, 780); fine(S, [[x, y], [x + 6, y + 20], [x + 2, y + 45]], { w: 0.6, a: 0.3 }); }
  const bench = [[440, 440], [600, 420], [600, 470], [450, 492]]; inkC(S, bench, { w: 1.2 });
  ink(S, [[450, 492], [455, 800]], { w: 1, passes: 1 });
  const hairL = [[240, 215], [222, 280], [214, 360], [218, 430], [245, 420], [240, 350], [238, 290]];
  const cap = [[232, 240], [238, 200], [262, 178], [300, 176], [330, 188], [340, 210], [320, 196], [285, 195], [255, 210]];
  ink(S, [[218, 430], [214, 360], [222, 280], [240, 210], [262, 180], [300, 176], [330, 188], [345, 215], [340, 260]], { w: 1.3 });
  const f = sketchFace(S, 285, 258, 52, 66, { look: 0.1, smile: 0.75, bindi: true, earrings: "jhumka", tilt: -0.12 });
  ink(S, [[262, 322], [262, 352]]); ink(S, [[305, 318], [312, 348]]);
  const upper = [[348, 378], [392, 368], [468, 212], [438, 182]];
  const fore = [[438, 182], [468, 212], [376, 206], [356, 176]];
  inkC(S, upper, { w: 1.4 }); inkC(S, fore, { w: 1.4 });
  const hp = S.ellipse(336, 176, 22, 16, -0.3, 14); inkC(S, hp, { w: 1.2, passes: 1 });
  for (let i = 0; i < 3; i++) fine(S, [[320 + i * 9, 166], [326 + i * 9, 186]], { w: 0.6 });
  const watch = [[362, 176], [376, 174], [380, 206], [366, 208]]; S.line(watch, { w: 1.6, c: GOLD, closed: true, step: 1.5, jit: 0.2 });
  const torso = [[228, 382], [262, 352], [312, 348], [348, 378], [392, 420], [420, 560], [470, 600], [480, 800], [150, 800], [168, 600], [196, 450]];
  ink(S, [[228, 382], [196, 450], [168, 600], [150, 800]]); ink(S, [[392, 420], [420, 560], [470, 600], [480, 800]]);
  ink(S, [[262, 354], [285, 410], [312, 350]], { w: 1.1 });
  const emb = [];
  for (let i = 0; i < 14; i++) { const y = 362 + i * 14, x = 285 + Math.sin(i * 1.3) * 22; const lf = S.petal(x, y, S.rand(0, 6.28), S.rand(9, 14), 5, true); emb.push(lf); S.line(lf, { w: 0.7, c: INK, a: 0.6, closed: true, step: 1.5, jit: 0.2 }); }
  fine(S, [[262, 354], [250, 420], [260, 500], [250, 560]], { c: "#3d7a4a", w: 1, a: 0.7 }); fine(S, [[312, 350], [322, 420], [314, 500], [322, 560]], { c: "#3d7a4a", w: 1, a: 0.7 });
  for (let i = 0; i < 10; i++) S.line(S.ellipse(250 + S.rand(0, 70), 380 + S.rand(0, 180), 3, 3, 0, 6), { w: 1.4, c: "#e0b43a", closed: true, step: 1, tremor: 0.1 });
  const armL = [[228, 390], [200, 470], [196, 560], [250, 600], [300, 610], [300, 585], [245, 555], [240, 470]];
  inkC(S, armL, { w: 1.3 });
  const h2 = hand(S, 314, 598, 18, 0.1);
  const pillow = [[140, 590], [490, 560], [520, 800], [120, 800]];
  inkC(S, pillow, { w: 1.5 });
  const pm = [];
  for (let i = 0; i < 9; i++) {
    const x = S.rand(170, 470), y = S.rand(630, 780);
    if (i % 3 === 0) { const e = S.ellipse(x, y, S.rand(14, 26), S.rand(10, 20), 0, 14); pm.push(e); S.line(e, { w: 1.2, c: INK, closed: true, a: 0.8 }); S.line(S.ellipse(x, y, 6, 5, 0, 8), { w: 1, c: INK, closed: true, a: 0.7, step: 1.5 }); }
    else S.line([[x - 40, y], [x - 15, y - 18], [x + 10, y + 10], [x + 40, y - 12]], { w: 2.6, c: "#1d1a1a", a: 0.75, jit: 1 });
  }
  S.wash([[0, 0], [600, 0], [600, 800], [0, 800]], { c: "#dcae68", a: 0.14, layers: 2, spread: 5 });
  S.wash(bench, { c: "#c8893e", a: 0.25, layers: 2, spread: 1 });
  faceWash(S, f, { lipC: "#d81b5a" });
  S.wash([[262, 320], [305, 318], [312, 350], [285, 410], [262, 354]], { c: SKIN, a: 0.28, layers: 2, spread: 0.8 });
  [hp, h2].forEach(p => S.wash(p, { c: SKIN, a: 0.3, layers: 2, spread: 0.6 }));
  [torso, upper, fore, armL].forEach(p => S.wash(p, { c: RED, a: 0.3, layers: 3, spread: 1.5 }));
  emb.forEach((e, i) => S.wash(e, { c: ["#3d7a4a", "#e0b43a", "#e98a3a"][i % 3], a: 0.45, layers: 1, spread: 0.4, edge: false }));
  S.wash(watch, { c: "#d6a93f", a: 0.5, layers: 1, spread: 0.3 });
  S.wash(pillow, { c: "#efe6d6", a: 0.25, layers: 2, spread: 1.5 });
  pm.forEach(e => S.wash(e, { c: S.r() > 0.5 ? "#e39a3a" : "#c9433a", a: 0.4, layers: 1, spread: 1 }));
  S.wash(cap, { c: HAIR, a: 0.4, layers: 3, spread: 1 }); S.wash(hairL, { c: HAIR, a: 0.38, layers: 3, spread: 1 });
  strands(S, 10, [240, 215], [265, 185], [214, 420], [244, 420], [-6, 0]);
  sign(S, "p.6 · red kurta, pine walls", 150, 60);
}

/* ---------- PAGE 7 · the heart wall ---------- */
function renderPage7Sketch(S) {
  const heart = heartPts(290, 215, 12.5, 70);
  const figure = [[372, 265], [395, 238], [420, 245], [440, 280], [440, 330], [462, 370], [488, 460], [470, 520], [478, 600], [494, 700], [505, 800], [340, 800], [338, 680], [345, 560], [338, 440], [345, 340], [360, 300]];
  guide(S, S.ellipse(405, 290, 38, 48, 0, 18), { closed: true }); guide(S, heart, { closed: true, a: 0.2 });
  inkC(S, heart, { w: 1.3, a: 0.75 });
  inkC(S, heartPts(290, 210, 9.5, 60), { w: 0.8, a: 0.4, passes: 1 });
  inkC(S, heartPts(290, 205, 6.5, 50), { w: 0.7, a: 0.35, passes: 1 });
  for (let i = 0; i < 240; i++) { const x = S.rand(0, 600), y = S.rand(0, 800); if (inPoly([x, y], heart) || inPoly([x, y], figure)) continue; S.line([[x, y], [x + S.rand(-2, 2), y - S.rand(6, 14)]], { w: 0.8, c: "#1f3b1f", a: 0.45, jit: 0.3, step: 3, tremor: 0.1 }); }
  fine(S, [[60, 20], [30, 300], [20, 640]], { w: 0.8, a: 0.5 });
  const hair = [[385, 245], [362, 268], [350, 330], [342, 420], [340, 520], [350, 590], [378, 585], [375, 480], [378, 380], [385, 320]];
  ink(S, [[392, 240], [368, 262], [352, 320], [344, 420], [342, 520], [350, 590]], { w: 1.2 });
  const f = sketchFace(S, 405, 290, 36, 46, { look: -0.4, smile: 0.55, earrings: "drop", earSides: [0], tilt: 0.04 });
  const cap = [[372, 285], [375, 258], [392, 244], [415, 242], [436, 256], [441, 280], [425, 262], [400, 258]];
  ink(S, [[375, 258], [392, 244], [415, 242], [436, 256], [441, 280]], { w: 1, a: 0.7 });
  const dress = [[380, 345], [420, 332], [455, 360], [480, 450], [468, 520], [478, 600], [494, 700], [505, 800], [340, 800], [338, 680], [345, 560], [340, 450], [352, 380]];
  inkC(S, dress, { w: 1.4 });
  ink(S, [[385, 345], [405, 354], [425, 340]], { w: 1.1 });
  const sleeve = S.ellipse(452, 410, 30, 42, 0.3, 16); inkC(S, sleeve, { w: 1.2 });
  const fore = [[440, 440], [476, 446], [486, 520], [458, 528]]; inkC(S, fore, { w: 1.1 });
  const hp = hand(S, 474, 526, 16, 0.2);
  ink(S, [[345, 520], [470, 515]], { w: 1, a: 0.6 });
  scallop(S, [338, 700], [495, 700], 8, 6, { w: 1.1 });
  const grass = [[0, 0], [600, 0], [600, 800], [0, 800]];
  S.wash(grass, { c: "#355f35", a: 0.3, layers: 3, spread: 4, clip: [{ holes: [heart, figure] }] });
  S.wash(heart, { c: "#d9384a", a: 0.8, layers: 1, spread: 1.5, mode: "source-over", edge: false });
  S.wash(heartPts(290, 210, 9.5, 60), { c: "#f2a0b0", a: 0.85, layers: 1, spread: 1, mode: "source-over", edge: false });
  S.wash(heartPts(290, 205, 6.5, 50), { c: "#fbeeee", a: 0.9, layers: 1, spread: 1, mode: "source-over", edge: false });
  scatterIn(S, heart, 110, (p) => S.line(S.ellipse(p[0], p[1], S.rand(3, 5), S.rand(2.5, 4), S.rand(0, 3), 7), { w: 0.8, c: "#9a2032", a: 0.45, closed: true, step: 1.5, tremor: 0.1 }));
  faceWash(S, f);
  [fore, hp].forEach(p => S.wash(p, { c: SKIN, a: 0.3, layers: 2, spread: 0.6 }));
  S.wash(dress, { c: "#23232d", a: 0.42, layers: 3, spread: 1.5 }); S.wash(sleeve, { c: "#23232d", a: 0.42, layers: 3, spread: 1 });
  scatterIn(S, dress, 26, (p) => brightFlower(S, p[0], p[1], S.rand(5, 9), ["#e89ab0", "#b9addf", "#f0e1bd", "#8fa3d6"][Math.floor(S.r() * 4)]));
  S.wash(hair, { c: HAIR, a: 0.4, layers: 3, spread: 1 }); S.wash(cap, { c: HAIR, a: 0.4, layers: 3, spread: 0.8 });
  S.wash(hair, { c: "#7a3a2a", a: 0.15, layers: 1, spread: 2, edge: false });
  strands(S, 12, [372, 262], [392, 244], [340, 580], [372, 585], [-6, 0], { c: "#3a1a14" });
  sign(S, "p.7 · the heart wall", 150, 740, "#f2e8d5");
}

/* ---------- PAGE 8 · rangoli night ---------- */
function renderPage8Sketch(S) {
  guide(S, S.ellipse(300, 620, 300, 185, 0, 30), { closed: true });
  ink(S, [[0, 420], [600, 410]], { w: 1, a: 0.5, passes: 1 });
  for (let x = 40; x < 600; x += 56) {
    const figZone = x > 270 && x < 530;
    fine(S, [[x, 0], [x + S.rand(-3, 3), figZone ? 200 : 260]], { w: 0.6, a: 0.4 });
    for (let y = 20; y < (figZone ? 210 : 260); y += 46) { S.wash(S.ellipse(x, y, 9, 9, 0, 10), { c: "#ffe7a3", a: 0.4, layers: 1, spread: 1, edge: false }); S.line(S.ellipse(x, y, 2, 2, 0, 6), { w: 1.5, c: "#c9a13a", closed: true, step: 1, tremor: 0 }); }
  }
  const hair = [[318, 232], [302, 244], [298, 280], [300, 330], [312, 372], [330, 372], [322, 320], [322, 270]];
  const f = sketchFace(S, 334, 252, 20, 26, { look: -0.6, smile: 0.5, tilt: 0.1 });
  ink(S, [[314, 240], [332, 226], [352, 232], [357, 248]], { w: 1.1 });
  ink(S, [[302, 244], [298, 280], [300, 330], [312, 372]], { w: 1 });
  const kurta = [[312, 282], [352, 280], [370, 330], [378, 385], [300, 392], [298, 330]];
  const legs = [[340, 380], [460, 388], [500, 402], [498, 418], [460, 420], [340, 410]];
  const arm = [[320, 300], [300, 350], [286, 398], [296, 402], [312, 356], [332, 310]];
  inkC(S, kurta, { w: 1.3 }); inkC(S, legs, { w: 1.2 }); inkC(S, arm, { w: 1.1 });
  ink(S, [[498, 404], [520, 398], [528, 414], [500, 420]], { w: 1.1, passes: 1 });
  tinyFlower(S, 358, 300, 7, "#e0508a");
  const step = [[520, 330], [600, 325], [600, 420], [522, 420]]; inkC(S, step, { w: 1 });
  const mg = []; for (let i = 0; i < 7; i++) { const e = S.ellipse(S.rand(530, 592), S.rand(296, 330), 7, 6, 0, 10); mg.push(e); S.line(e, { w: 1, c: INK, closed: true, a: 0.7, step: 1.5 }); }
  S.wash([[0, 0], [600, 0], [600, 410], [0, 420]], { c: "#c9d3ee", a: 0.14, layers: 2, spread: 5 });
  faceWash(S, f); S.wash(arm, { c: SKIN, a: 0.28, layers: 2, spread: 0.6 });
  S.wash(kurta, { c: "#f0d9c8", a: 0.35, layers: 2, spread: 1 }); S.wash(legs, { c: "#f0d9c8", a: 0.35, layers: 2, spread: 1 });
  S.wash(hair, { c: HAIR, a: 0.4, layers: 3, spread: 0.8 }); S.wash([[314, 242], [332, 226], [352, 232], [357, 248], [334, 238]], { c: HAIR, a: 0.4, layers: 2, spread: 0.5 });
  mg.forEach(e => S.wash(e, { c: "#ef8a1e", a: 0.55, layers: 1, spread: 0.5 }));
  // the rangoli
  const rings = [[1, "#e8a33a"], [0.9, "#8cc152"], [0.82, "#2f5fc7"], [0.5, "#3a9a4a"], [0.43, "#e05a9a"], [0.36, "#f08a2a"], [0.28, "#7a3ab0"], [0.14, "#c5d93a"]];
  rings.forEach(([k, c]) => S.wash(S.ellipse(300, 620, 300 * k, 185 * k, 0, 40), { c, a: 0.6, layers: 2, spread: 1.5, edge: false, mode: "source-over" }));
  rings.forEach(([k]) => S.line(S.ellipse(300, 620, 300 * k, 185 * k, 0, 40), { w: 1.8, c: "#fbf7ee", a: 0.85, closed: true, jit: 0.8, step: 3 }));
  for (let i = 0; i < 10; i++) {
    const a = i / 10 * Math.PI * 2 + 0.3, cx = 300 + Math.cos(a) * 300 * 0.66, cy = 620 + Math.sin(a) * 185 * 0.66;
    const out = Math.atan2(Math.sin(a) * 185, Math.cos(a) * 300);
    [-0.55, -0.27, 0, 0.27, 0.55].forEach((d, j) => { const p = S.petal(cx, cy, out + d, j === 2 ? 44 : 36, 16, true); S.wash(p, { c: "#d82828", a: 0.85, layers: 1, spread: 0.4, edge: false, mode: "source-over" }); S.line(p, { w: 1.2, c: "#fbf7ee", a: 0.9, closed: true, step: 2, jit: 0.3 }); });
  }
  for (let i = 0; i < 10; i++) {
    const a = (i + 0.5) / 10 * Math.PI * 2 + 0.3, cx = 300 + Math.cos(a) * 300 * 0.72, cy = 620 + Math.sin(a) * 185 * 0.72, pts = [];
    for (let t = 0; t < 14; t++) { const r = 12 - t * 0.8, ang = t * 0.7; pts.push([cx + Math.cos(ang) * r, cy + Math.sin(ang) * r * 0.6]); }
    S.line(pts, { w: 1.4, c: "#fbf7ee", a: 0.85, jit: 0.2, step: 2 });
  }
  for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2; S.line(S.ellipse(300 + Math.cos(a) * 285, 620 + Math.sin(a) * 176, 2.4, 2.4, 0, 6), { w: 2, c: "#fbf7ee", closed: true, step: 1, tremor: 0 }); }
  S.line([[300, 620], [300, 505]], { w: 3, c: "#b8892e", step: 3, tremor: 0.2 });
  [[585, 46, 10], [552, 32, 7], [520, 18, 5]].forEach(([y, rx, ry]) => {
    const e = S.ellipse(300, y, rx, ry, 0, 16);
    S.wash(e, { c: "#d9a640", a: 0.9, layers: 1, spread: 0.4, edge: false, mode: "source-over" }); S.line(e, { w: 1, c: INK, closed: true, a: 0.7 });
    const n = Math.max(2, Math.round(rx / 9)); for (let k = 0; k < n; k++) flame(S, 300 - rx + 2 * rx * (k + 0.5) / n, y - ry * 0.3, 0.9);
  });
  for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + 0.1, x = 300 + Math.cos(a) * 300 * 1.04, y = 620 + Math.sin(a) * 185 * 1.04; if (y > 790 || x < 12 || x > 588) continue; diya(S, x, y, 1.1); }
  sign(S, "p.8 · rangoli night", 140, 330);
}

/* ---------- PAGE 9 · diyas, three ways ---------- */
function renderPage9Sketch(S) {
  for (let k = 0; k < 3; k++) {
    const y0 = 12 + k * 258, H = 246, dx = [0, 10, -6][k];
    const frame = [[18, y0], [582, y0], [582, y0 + H], [18, y0 + H]], clip = [{ poly: frame }];
    inkC(S, frame, { w: 1, a: 0.6, passes: 1, jit: 1.2 });
    for (let gx = 440; gx < 590; gx += 48) fine(S, [[gx, y0 + 40], [gx, y0 + H]], { w: 0.8, a: 0.45, clip });
    for (let i = 0; i < 3; i++) S.line(S.ellipse(465 + i * 48, y0 + 110 + (i % 2) * 40, 16, 20, 0, 14), { w: 0.8, c: GRAPH, a: 0.45, closed: true, clip });
    const ty = y0 + 22, mari = [];
    for (let x = 26; x < 580; x += 20) mari.push([x, ty + Math.sin(x * 0.05) * 3]);
    mari.forEach(([x, y], i) => {
      S.line(S.ellipse(x, y, 9, 8, 0, 10), { w: 0.9, c: INK, a: 0.65, closed: true, jit: 0.8, step: 2, clip });
      if (i % 3 === 0) { const lf = S.petal(x, y + 6, Math.PI / 2 + S.rand(-0.3, 0.3), 20, 8, true); S.line(lf, { w: 0.8, c: INK, a: 0.55, closed: true, clip }); S.wash(lf, { c: "#4f7a3a", a: 0.4, layers: 1, spread: 0.4, clip, edge: false }); }
    });
    const beads = [];
    [60, 108, 410, 520, 568].forEach(sx => { for (let y = ty + 14; y < y0 + H; y += 13) { const e = S.ellipse(sx + S.rand(-1.5, 1.5), y, 6.5, 6, 0, 8); beads.push(e); S.line(e, { w: 0.8, c: INK, a: 0.55, closed: true, jit: 0.5, step: 2, clip }); } });
    const cx = 232 + dx, hy = y0 + 100;
    const cap = [[cx - 25, hy - 8], [cx - 22, hy - 26], [cx, hy - 34], [cx + 22, hy - 26], [cx + 25, hy - 8], [cx + 12, hy - 22], [cx - 12, hy - 22]];
    const hl = [[cx - 24, hy - 10], [cx - 34, hy + 30], [cx - 36, hy + 90], [cx - 30, hy + 135], [cx - 20, hy + 130], [cx - 24, hy + 50]];
    const hr = [[cx + 24, hy - 10], [cx + 32, hy + 30], [cx + 32, hy + 80], [cx + 22, hy + 80], [cx + 24, hy + 40]];
    ink(S, [[cx - 30, hy + 135], [cx - 36, hy + 90], [cx - 34, hy + 30], [cx - 24, hy - 12], [cx - 22, hy - 26], [cx, hy - 34], [cx + 22, hy - 26], [cx + 32, hy + 30], [cx + 32, hy + 80]], { w: 1.1, clip });
    const f = sketchFace(S, cx, hy, 23, 30, { look: 0.05, smile: 0.9, bindi: true, earrings: "jhumka" });
    ink(S, [[cx - 9, hy + 29], [cx - 9, hy + 42]], { clip }); ink(S, [[cx + 9, hy + 29], [cx + 10, hy + 42]], { clip });
    const body = [[cx - 60, hy + 62], [cx - 12, hy + 44], [cx + 12, hy + 44], [cx + 58, hy + 60], [cx + 70, y0 + H], [cx - 72, y0 + H]];
    const blouse = [[cx - 60, hy + 62], [cx - 38, hy + 50], [cx - 30, hy + 100], [cx - 62, hy + 100]];
    inkC(S, body, { w: 1.2, clip });
    ink(S, [[cx + 10, hy + 44], [cx - 40, y0 + H]], { w: 1, clip }); ink(S, [[cx + 22, hy + 50], [cx - 22, y0 + H]], { w: 1, clip });
    const plate = S.ellipse(cx + 30, y0 + H - 34, 74, 18, 0, 24);
    inkC(S, plate, { w: 1.2, clip }); S.line(S.ellipse(cx + 30, y0 + H - 34, 62, 13, 0, 24), { w: 0.8, c: GRAPH, a: 0.5, closed: true, clip });
    const hA = hand(S, cx - 40, y0 + H - 30, 12, 0.3);
    for (let i = 0; i < 3; i++) S.line(S.ellipse(cx - 52, y0 + H - 44 - i * 6, 12, 4, 0, 10), { w: 1.6, c: "#2f7a3a", closed: true, step: 1.5, tremor: 0.1, clip });
    faceWash(S, f);
    S.wash([[cx - 9, hy + 28], [cx + 9, hy + 28], [cx + 12, hy + 44], [cx - 12, hy + 44]], { c: SKIN, a: 0.28, layers: 2, spread: 0.5 });
    S.wash(hA, { c: SKIN, a: 0.3, layers: 2, spread: 0.5 });
    S.wash(body, { c: "#a7b84e", a: 0.3, layers: 3, spread: 1.5, clip });
    S.wash(blouse, { c: "#e2c27a", a: 0.35, layers: 2, spread: 0.8, clip });
    S.wash(plate, { c: "#b8bcc2", a: 0.4, layers: 2, spread: 0.8, clip });
    for (let d = 0; d < 7; d++) diya(S, cx + 30 + (d - 3) * 17, y0 + H - 36 + (d % 2 ? 6 : -2), 0.9);
    mari.forEach(([x, y], i) => S.wash(S.ellipse(x, y, 9, 8, 0, 8), { c: i % 4 === 3 ? "#f3d34a" : "#ef8a1e", a: 0.55, layers: 1, spread: 0.8, clip, edge: false }));
    beads.forEach((e, i) => S.wash(e, { c: i % 5 === 0 ? "#f3d34a" : "#ef8a1e", a: 0.5, layers: 1, spread: 0.4, clip, edge: false }));
    [cap, hl, hr].forEach(p => S.wash(p, { c: HAIR, a: 0.4, layers: 3, spread: 0.8, clip }));
  }
  S.text("p.9 · diyas, three ways", 300, 796, { size: 17, c: "#33407a" });
}

/* ---------- PAGE 10 · rath in the rain ---------- */
function renderPage10Sketch(S) {
  const SO = { layers: 1, edge: false, mode: "source-over" };
  const block = [[14, 14], [586, 12], [588, 786], [12, 788]], clip = [{ poly: block }];
  S.wash(block, { ...SO, c: "#1c2230", a: 0.92, spread: 3 });
  S.wash([[14, 14], [586, 12], [586, 300], [14, 330]], { ...SO, c: "#2a3345", a: 0.45, spread: 8, clip });
  for (let i = 5; i >= 1; i--) S.wash(S.ellipse(150, 110, 22 * i, 20 * i, 0, 18), { ...SO, c: "#fff4c8", a: 0.07, spread: 2, clip });
  S.wash(S.ellipse(150, 110, 12, 9, 0, 10), { ...SO, c: "#ffffff", a: 0.95, spread: 0.5 });
  S.line([[150, 120], [152, 380]], { w: 2, c: "#8a93a6", a: 0.7, step: 4 });
  S.wash(S.ellipse(80, 270, 80, 55, 0, 16), { ...SO, c: "#15201a", a: 0.85, spread: 6, clip });
  S.wash([[470, 330], [586, 300], [586, 420], [470, 420]], { ...SO, c: "#3a3a3a", a: 0.7, spread: 2 });
  for (let i = 0; i < 8; i++) S.wash(S.ellipse(482 + i * 13, 318 - i * 2.5, 3, 3, 0, 6), { ...SO, c: "#ffd27a", a: 0.9, spread: 0.3 });
  const canopy = [[270, 150], [290, 108], [430, 104], [452, 150]];
  const tier = [[250, 228], [470, 224], [476, 300], [244, 304]];
  const base = [[236, 300], [484, 296], [490, 342], [230, 346]];
  S.wash(canopy, { ...SO, c: "#c0283a", a: 0.92, spread: 0.5 });
  [270, 450].forEach(x => S.line([[x, 150], [x, 228]], { w: 2.2, c: "#d8c9a6", a: 0.8, step: 3 }));
  for (let i = 0; i < 6; i++) { const x = 295 + i * 26; S.wash(S.ellipse(x, 198, 5, 6, 0, 8), { ...SO, c: "#3a3040", a: 0.95, spread: 0.3 }); S.wash([[x - 7, 204], [x + 7, 204], [x + 8, 228], [x - 8, 228]], { ...SO, c: i === 2 ? "#9a7ac0" : "#2d3140", a: 0.95, spread: 0.4 }); }
  for (let x = 275; x < 450; x += 8) S.line([[x, 150], [x + S.rand(-1, 1), 150 + S.rand(20, 36)]], { w: 1.3, c: "#e8b84a", a: 0.9, step: 3, tremor: 0.2 });
  for (let x = 282; x < 445; x += 24) S.wash(S.ellipse(x, 152, 8, 4, 0, 8), { ...SO, c: "#f08a2a", a: 0.95, spread: 0.3 });
  S.wash(tier, { ...SO, c: "#c0283a", a: 0.92, spread: 0.6 });
  [[244, "#2a3fa0"], [262, "#e8b84a"], [276, "#2a3fa0"]].forEach(([y, c]) => S.wash([[248, y], [472, y - 3], [473, y + 7], [247, y + 10]], { ...SO, c, a: 0.95, spread: 0.3 }));
  S.wash(base, { ...SO, c: "#3a52b0", a: 0.9, spread: 0.6 });
  S.wash([[236, 318], [484, 314], [484, 323], [236, 327]], { ...SO, c: "#e8b84a", a: 0.95, spread: 0.3 });
  [canopy, tier, base].forEach(p => S.line(p, { w: 1, c: "#0e0f14", a: 0.7, closed: true, jit: 0.5 }));
  S.wash([[14, 400], [586, 395], [588, 786], [12, 788]], { ...SO, c: "#2b3346", a: 0.8, spread: 3 });
  [[150, "#fff4c8"], [360, "#c0283a"], [330, "#3a52b0"], [525, "#ffd27a"]].forEach(([x, c]) => { for (let i = 0; i < 4; i++) S.line([[x + S.rand(-25, 25), 420 + i * 10], [x + S.rand(-20, 20), 640 + S.rand(0, 120)]], { w: S.rand(3, 8), c, a: 0.12, jit: 2, step: 5, clip }); });
  const umbC = ["#15161c", "#2a2e3a", "#8a2a3a", "#3a4a7a", "#20242e"];
  for (let i = 0; i < 34; i++) {
    const x = S.rand(200, 580), y = S.rand(355, 440), s = S.rand(0.7, 1.1) * (0.8 + (y - 355) / 200);
    S.wash(S.ellipse(x, y, 5 * s, 6 * s, 0, 8), { ...SO, c: "#15161c", a: 0.95, spread: 0.3 });
    S.wash([[x - 8 * s, y + 6 * s], [x + 8 * s, y + 6 * s], [x + 9 * s, y + 52 * s], [x - 9 * s, y + 52 * s]], { ...SO, c: S.r() > 0.8 ? "#d7a0b4" : "#1b1d25", a: 0.95, spread: 0.4 });
    if (S.r() > 0.45) { const u = S.ellipse(x, y - 6 * s, 22 * s, 12 * s, 0, 14, Math.PI, Math.PI * 2); u.push([x + 22 * s, y - 6 * s]); S.wash(u, { ...SO, c: umbC[i % 5], a: 0.95, spread: 0.3 }); S.line(u, { w: 0.8, c: "#8a93a6", a: 0.5, closed: true, step: 2 }); }
  }
  // her umbrella
  const dome = S.ellipse(185, 440, 150, 78, 0, 30, Math.PI, Math.PI * 2).concat([[335, 440]]);
  const rim = []; for (let i = 0; i <= 40; i++) { const t = i / 40; rim.push([35 + 300 * t, 440 + Math.abs(Math.sin(t * 8 * Math.PI)) * 8]); }
  const umb = dome.concat(rim.slice().reverse());
  S.wash(umb, { ...SO, c: "#5d5670", a: 0.96, spread: 0.6 });
  for (let i = 0; i <= 8; i++) S.line([[185, 364], [35 + 300 * i / 8, 444]], { w: 0.8, c: "#a9a3bd", a: 0.6, step: 4 });
  S.line([[185, 364], [185, 350]], { w: 2, c: "#c8c8d0", step: 2 });
  // her
  const kurta = [[112, 600], [150, 585], [200, 585], [238, 600], [262, 800], [92, 800]];
  S.wash(kurta, { ...SO, c: "#141418", a: 0.97, spread: 0.6 });
  const neck = [[160, 548], [190, 548], [192, 588], [175, 600], [158, 588]];
  const d = deferInk(S, () => sketchFace(S, 175, 520, 26, 33, { look: 0.3, smile: 0.8 }));
  S.wash(d.r.facePoly, { ...SO, c: "#d9a484", a: 0.95, spread: 0.4 }); S.wash(neck, { ...SO, c: "#d9a484", a: 0.95, spread: 0.4 });
  S.wash([[146, 515], [150, 492], [175, 482], [200, 492], [204, 515], [190, 498], [160, 498]], { ...SO, c: "#15120f", a: 0.95, spread: 0.4 });
  S.wash(S.ellipse(203, 500, 10, 14, 0, 10), { ...SO, c: "#15120f", a: 0.95, spread: 0.4 });
  d.flush(); S.wash(d.r.lip, { c: "#c0616d", a: 0.5, layers: 2, spread: 0.2, edge: false });
  const slL = [[114, 602], [96, 690], [122, 700], [170, 622], [156, 598]], slR = [[236, 602], [252, 690], [226, 700], [190, 622], [196, 598]];
  [slL, slR].forEach(p => { S.wash(p, { ...SO, c: "#141418", a: 0.97, spread: 0.4 }); S.line(p, { w: 0.8, c: "#4a4a58", a: 0.8, closed: true, jit: 0.4 }); });
  S.line([[185, 440], [183, 612], [176, 624], [168, 616]], { w: 2.6, c: "#c8c8d0", a: 0.9, step: 3 });
  [[182, 612], [184, 630]].forEach(([x, y]) => S.wash(S.ellipse(x, y, 13, 9, 0.1, 12), { ...SO, c: "#d9a484", a: 0.95, spread: 0.3 }));
  [[[150, 592], [175, 640], [200, 592]], [[110, 690], [120, 700]], [[240, 690], [228, 700]]].forEach(line => { for (let t = 0; t < 1; t += 0.12) { const i = Math.min(Math.floor(t * (line.length - 1)), line.length - 2), u = t * (line.length - 1) - i; const x = line[i][0] + (line[i + 1][0] - line[i][0]) * u, y = line[i][1] + (line[i + 1][1] - line[i][1]) * u; brightFlower(S, x, y, 3.2, "#d98aa6"); } });
  scatterIn(S, kurta, 18, (p) => S.wash(S.ellipse(p[0], p[1], 1.4, 1.4, 0, 6), { ...SO, c: "#9a8aa0", a: 0.8, spread: 0.1 }));
  for (let i = 0; i < 160; i++) { const x = S.rand(14, 586), y = S.rand(14, 786), l = S.rand(12, 30); S.line([[x, y], [x - l * 0.25, y + l]], { w: 0.6, c: "#c9d4ea", a: 0.35, jit: 0, step: 6, tremor: 0, clip }); }
  sign(S, "p.10 · rath in the rain", 450, 60, "#f2e8d5");
}

/* ---------- PAGE 11 · monsoon lookout ---------- */
function renderPage11Sketch(S) {
  const L = [30, 700], R = [570, 300];
  const topEdge = S.spline([L, [110, 560], [230, 420], [390, 320], R], 6);
  const rimPts = S.spline([R, [520, 380], [430, 450], [320, 520], [190, 610], L], 4);
  const rim = rimPts.map((p, i) => [p[0], p[1] + Math.abs(Math.sin(i * 0.35)) * 10]);
  const canopy = topEdge.concat(rim.slice(1));
  const fig = [[236, 592], [290, 590], [292, 664], [320, 700], [335, 745], [330, 800], [200, 800], [205, 700], [228, 640]];
  const bgClip = [{ holes: [canopy, fig] }];
  guide(S, canopy, { closed: true, a: 0.18 });
  ink(S, [[0, 480], [80, 462], [160, 472], [260, 452], [360, 462], [460, 444], [600, 452]], { w: 0.9, a: 0.5, passes: 1, clip: bgClip });
  ink(S, [[0, 530], [600, 512]], { w: 0.8, a: 0.4, passes: 1, clip: bgClip });
  const wagons = [];
  [548, 572, 596].forEach((y, r) => { for (let x = 10 + r * 20; x < 590; x += 46) { const w = [[x, y], [x + 38, y - 1], [x + 38, y + 12], [x, y + 13]]; wagons.push(w); S.line(w, { w: 0.7, c: GRAPH, a: 0.5, closed: true, step: 2, clip: bgClip }); } });
  const trees = []; [[560, 600, 60], [80, 620, 50], [500, 650, 40]].forEach(([x, y, r]) => leafCluster(S, x, y, r, 10, trees, bgClip));
  const railClip = [{ holes: [fig] }];
  [[0, 690, 600, 684], [0, 746, 600, 740]].forEach(([a, b, c, d]) => ink(S, [[a, b], [c, d]], { w: 1.2, clip: railClip }));
  [[120, 688], [470, 686]].forEach(([x, y]) => ink(S, [[x, y], [x + 2, 800]], { w: 1.2, clip: railClip }));
  S.line(canopy, { w: 1.5, c: INK, closed: true, passes: 2, jit: 0.6, step: 4 });
  const hub = [330, 455];
  for (let i = 0; i <= 9; i++) { const p = rimPts[Math.floor(i * (rimPts.length - 1) / 9)]; S.line([hub, p], { w: 0.9, c: INK, a: 0.6, jit: 0.4 }); }
  S.line([[405, 318], hub], { w: 2.4, c: INK, a: 0.8, jit: 0.3 });
  S.line([hub, [320, 722]], { w: 3.4, c: "#1d1a1a", a: 0.9, jit: 0.3 });
  const cap = [[238, 615], [242, 595], [262, 588], [282, 594], [288, 612], [270, 600], [250, 604]];
  const hl = [[240, 600], [232, 640], [228, 700], [226, 800], [248, 800], [246, 700], [248, 640]];
  ink(S, [[226, 800], [228, 700], [232, 640], [240, 600], [244, 594], [262, 588], [282, 594], [288, 612]], { w: 1.1 });
  const f = sketchFace(S, 262, 622, 24, 30, { look: 0.7, smile: 0.6, earrings: "jhumka", earSides: [0] });
  const neck = [[252, 648], [272, 648], [274, 668], [250, 668]];
  const kurta = [[205, 700], [240, 664], [290, 664], [320, 700], [330, 800], [200, 800]];
  const sleeve = [[290, 668], [318, 690], [328, 735], [306, 742], [292, 705]];
  inkC(S, kurta, { w: 1.3 }); inkC(S, sleeve, { w: 1.1 });
  const hp = hand(S, 322, 724, 12, 1.4);
  fine(S, [[262, 668], [262, 780]], { a: 0.5 });
  for (let y = 676; y < 780; y += 10) S.line(S.ellipse(262 + S.rand(-4, 4), y, 1.6, 1.6, 0, 6), { w: 1.2, c: "#b39a3a", closed: true, step: 1, tremor: 0 });
  S.wash([[0, 0], [600, 0], [600, 452], [0, 480]], { c: "#c7ccd3", a: 0.12, layers: 3, spread: 8, clip: bgClip });
  S.wash([[0, 480], [80, 462], [160, 472], [260, 452], [360, 462], [460, 444], [600, 452], [600, 520], [0, 535]], { c: "#8d9bad", a: 0.2, layers: 2, spread: 2, clip: bgClip });
  S.wash([[0, 535], [600, 520], [600, 690], [0, 690]], { c: "#9a6a52", a: 0.12, layers: 2, spread: 3, clip: bgClip });
  wagons.forEach(w => S.wash(w, { c: "#3f5f9a", a: 0.3, layers: 1, spread: 0.3, clip: bgClip, edge: false }));
  trees.forEach(l => S.wash(l, { c: S.r() > 0.5 ? "#5e8a3e" : "#7aa04a", a: 0.35, layers: 1, spread: 1, clip: bgClip }));
  [[0, 684, 600, 678], [0, 740, 600, 734]].forEach(([a, b, c, d]) => S.wash([[a, b], [c, d], [c, d + 12], [a, b + 12]], { c: "#e8c22a", a: 0.55, layers: 2, spread: 0.6, clip: railClip }));
  S.wash(canopy, { c: "#c9ced4", a: 0.2, layers: 2, spread: 1 });
  camoBlobs(S, canopy, ["#5c6470", "#8a929c", "#2e3440", "#a9b0b8"], 46, 24);
  faceWash(S, f);
  [neck, hp].forEach(p => S.wash(p, { c: SKIN, a: 0.3, layers: 2, spread: 0.5 }));
  S.wash(kurta, { c: "#f0de6a", a: 0.35, layers: 3, spread: 1 }); S.wash(sleeve, { c: "#f0de6a", a: 0.35, layers: 3, spread: 0.8 });
  S.wash(cap, { c: HAIR, a: 0.4, layers: 3, spread: 0.6 }); S.wash(hl, { c: HAIR, a: 0.4, layers: 3, spread: 0.8 });
  strands(S, 8, [238, 600], [250, 592], [228, 790], [246, 790], [-3, 0]);
  sign(S, "p.11 · monsoon lookout", 150, 60);
}

/* ---------- PAGE 12 · the giant haul truck ---------- */
function renderPage12Sketch(S) {
  const fig = [[152, 560], [188, 560], [192, 612], [208, 735], [196, 795], [144, 795], [132, 738], [148, 612]], hole = [{ holes: [fig] }];
  ink(S, [[0, 40], [600, 20]], { w: 1.4 }); ink(S, [[0, 95], [600, 80]], { w: 1.4 });
  for (let x = 0; x < 600; x += 50) { fine(S, [[x, 40 - x / 30], [x + 25, 95 - (x + 25) / 40]], { w: 1, a: 0.6 }); fine(S, [[x + 25, 95 - (x + 25) / 40], [x + 50, 40 - (x + 50) / 30]], { w: 1, a: 0.6 }); }
  const sky = []; for (let x = 20; x < 560; x += 110) { const p = [[x, 105], [x + 70, 103], [x + 70, 138], [x, 140]]; sky.push(p); S.line(p, { w: 0.9, c: INK, a: 0.6, closed: true, jit: 0.4 }); }
  for (let x = 546; x < 600; x += 8) fine(S, [[x, 150], [x, 700]], { w: 0.6, a: 0.3 });
  const dump = [[230, 150], [600, 120], [600, 300], [250, 330]];
  const cab = [[330, 190], [500, 180], [505, 320], [335, 330]];
  const win = [[350, 205], [480, 198], [484, 260], [352, 266]];
  const deck = [[40, 390], [600, 350], [600, 420], [40, 460]];
  const grille = [[0, 300], [120, 290], [125, 470], [0, 480]];
  inkC(S, dump, { w: 1.5 }); S.hatch([230, 120, 600, 330], 0.4, 9, { w: 0.6, c: INK, a: 0.3, clip: [{ poly: dump }] });
  inkC(S, cab, { w: 1.4 }); inkC(S, win, { w: 1.1 });
  inkC(S, deck, { w: 1.5 });
  ink(S, [[60, 390], [64, 330], [300, 312], [330, 300]], { w: 1.8, passes: 1 }); ink(S, [[200, 380], [200, 322]], { w: 1.4, passes: 1 });
  inkC(S, grille, { w: 1.4 }); for (let y = 305; y < 470; y += 12) fine(S, [[4, y], [120, y - 4]], { w: 0.7, a: 0.5 });
  const lights = [[250, 382], [272, 380], [294, 378]].map(([x, y]) => [[x - 8, y - 8], [x + 8, y - 9], [x + 8, y + 7], [x - 8, y + 8]]);
  lights.forEach(p => S.line(p, { w: 1, c: INK, closed: true, step: 1.5, jit: 0.2 }));
  S.text("90009", 64, 515, { size: 18, c: INK, rot: -0.02, weight: 700 });
  ink(S, [[70, 470], [110, 300]], { w: 1.4, passes: 1 }); ink(S, [[100, 475], [140, 305]], { w: 1.4, passes: 1 });
  for (let i = 0; i < 7; i++) { const t = i / 6; fine(S, [[70 + 40 * t, 470 - 170 * t], [100 + 40 * t, 475 - 170 * t]], { w: 1.1, a: 0.8 }); }
  const W = [440, 610];
  const tire = S.ellipse(W[0], W[1], 175, 175, 0, 48), rimC = S.ellipse(W[0], W[1], 95, 95, 0, 32);
  inkC(S, tire, { w: 1.8 }); inkC(S, rimC, { w: 1.4 }); inkC(S, S.ellipse(W[0], W[1], 42, 42, 0, 20), { w: 1.2 });
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; S.line(S.ellipse(W[0] + Math.cos(a) * 64, W[1] + Math.sin(a) * 64, 4, 4, 0, 8), { w: 1.3, c: INK, closed: true, step: 1, tremor: 0 }); }
  for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2; S.line([[W[0] + Math.cos(a) * 148, W[1] + Math.sin(a) * 148], [W[0] + Math.cos(a + 0.05) * 176, W[1] + Math.sin(a + 0.05) * 176]], { w: 3.2, c: "#1d1a1a", a: 0.7, step: 3, jit: 0.3 }); }
  ink(S, [[0, 700], [600, 690]], { w: 1, a: 0.6, passes: 1, clip: hole });
  const cap = [[155, 582], [158, 566], [170, 562], [183, 566], [186, 582], [176, 572], [164, 572]];
  const hl = [[155, 580], [150, 612], [158, 620], [160, 598]];
  ink(S, [[150, 612], [155, 580], [158, 566], [170, 562], [183, 566], [186, 582]], { w: 1 });
  S.line([[156, 568], [168, 566], [172, 568], [184, 566]], { w: 2.2, c: "#1d1a1a", step: 1.5 });
  const f = sketchFace(S, 170, 587, 15, 19, { look: 0.05, smile: 0.8, bindi: true });
  const kurta = [[148, 612], [192, 612], [208, 735], [132, 738]], pants = [[146, 735], [194, 735], [190, 782], [150, 782]];
  inkC(S, kurta, { w: 1.2 }); inkC(S, pants, { w: 1 });
  ink(S, [[146, 782], [162, 790]], { w: 2, passes: 1 }); ink(S, [[178, 782], [195, 790]], { w: 2, passes: 1 });
  const hp = hand(S, 170, 652, 9, 0);
  fine(S, [[152, 618], [148, 650], [162, 655]], { w: 0.8 }); fine(S, [[188, 618], [192, 650], [178, 655]], { w: 0.8 });
  S.wash([[0, 690], [600, 680], [600, 800], [0, 800]], { c: "#b0552d", a: 0.25, layers: 3, spread: 3, clip: hole });
  sky.forEach(p => S.wash(p, { c: "#f5e7a0", a: 0.4, layers: 1, spread: 0.5 }));
  S.wash(dump, { c: "#8a3f24", a: 0.3, layers: 3, spread: 1.5 });
  S.wash(cab, { c: "#d9a53a", a: 0.3, layers: 3, spread: 1 }); S.wash(win, { c: "#6a8aa8", a: 0.35, layers: 2, spread: 0.6 });
  S.wash(deck, { c: "#d9a53a", a: 0.35, layers: 3, spread: 1.5 }); S.wash(grille, { c: "#8a5a3a", a: 0.3, layers: 2, spread: 1 });
  lights.forEach(p => S.wash(p, { c: "#f5e39a", a: 0.6, layers: 1, spread: 0.3, edge: false }));
  S.wash(tire, { c: "#2a2522", a: 0.45, layers: 3, spread: 2, clip: [{ holes: [rimC] }] });
  S.wash(rimC, { c: "#a86a3a", a: 0.35, layers: 2, spread: 1 });
  S.wash([[265, 610], [615, 610], [615, 800], [265, 800]], { c: "#b0552d", a: 0.16, layers: 2, spread: 4, edge: false });
  faceWash(S, f);
  S.wash(hp, { c: SKIN, a: 0.3, layers: 2, spread: 0.4 });
  S.wash(kurta, { c: "#eef08a", a: 0.4, layers: 3, spread: 0.8 }); S.wash(pants, { c: "#d6d2c6", a: 0.25, layers: 2, spread: 0.5 });
  S.wash(cap, { c: HAIR, a: 0.4, layers: 3, spread: 0.5 }); S.wash(hl, { c: HAIR, a: 0.4, layers: 2, spread: 0.5 });
  sign(S, "p.12 · the giant haul truck", 130, 210);
}

/* ---------- PAGE 13 · black and red ---------- */
function renderPage13Sketch(S) {
  const fig = [[266, 122], [334, 122], [336, 212], [362, 255], [380, 330], [372, 400], [378, 600], [388, 800], [212, 800], [222, 600], [228, 400], [220, 330], [240, 255], [264, 212]], hole = [{ holes: [fig] }];
  guide(S, [[300, 110], [301, 790]]); guide(S, S.ellipse(300, 165, 36, 46, 0, 18), { closed: true });
  const trees = []; [[60, 240, 70], [160, 220, 55], [470, 230, 60], [560, 260, 55]].forEach(([x, y, r]) => leafCluster(S, x, y, r, 12, trees, hole));
  ink(S, [[0, 330], [600, 325]], { w: 1, a: 0.6, passes: 1, clip: hole });
  [390, 440, 510, 560].forEach(y => S.line([[0, y], [600, y - 4]], { w: 2, c: "#8a8f96", a: 0.8, jit: 0.4, clip: hole }));
  [60, 540].forEach(x => S.line([[x, 380], [x, 610]], { w: 2.4, c: "#8a8f96", a: 0.8, jit: 0.3, clip: hole }));
  ink(S, [[0, 610], [600, 606]], { w: 1, a: 0.6, passes: 1, clip: hole });
  const cap = [[266, 172], [268, 138], [300, 122], [332, 138], [334, 172], [318, 146], [300, 140], [282, 146]];
  ink(S, [[266, 172], [268, 138], [300, 122], [332, 138], [334, 172]], { w: 1.2 }); fine(S, [[300, 122], [300, 140]], { w: 0.7 });
  const f = sketchFace(S, 300, 168, 33, 43, { look: 0, smile: 0.6, bindi: true, earrings: "drop" });
  ink(S, [[287, 208], [286, 234]]); ink(S, [[314, 208], [316, 234]]);
  const braid = []; const bp = S.spline([[268, 175], [262, 230], [255, 300], [252, 400], [256, 480], [262, 545]], 18);
  bp.forEach((p, i) => { if (i === 0) return; const a = Math.atan2(p[1] - bp[i - 1][1], p[0] - bp[i - 1][0]); const e = S.ellipse(p[0] + (i % 2 ? 3 : -3), p[1], 10, 7, a + (i % 2 ? 0.5 : -0.5), 10); braid.push(e); S.line(e, { w: 0.9, c: INK, a: 0.7, closed: true, step: 2, jit: 0.3 }); });
  const slL = [[240, 255], [222, 330], [256, 338], [262, 270]], slR = [[360, 255], [378, 330], [344, 338], [338, 270]];
  inkC(S, slL); inkC(S, slR);
  const body = [[240, 250], [360, 250], [370, 400], [376, 600], [386, 795], [214, 795], [224, 600], [230, 400]];
  ink(S, [[230, 400], [224, 600], [214, 795]]); ink(S, [[370, 400], [376, 600], [386, 795]]);
  ink(S, [[272, 236], [300, 262], [328, 236]], { w: 1.1 });
  S.line([[276, 240], [300, 270], [324, 240]], { w: 0.8, c: GOLD, a: 0.8, step: 2 });
  const bA = band([262, 250], [352, 540], 16), bB = band([364, 262], [382, 795], 14), bC = band([236, 610], [292, 795], 14);
  [bA, bB, bC].forEach(b => S.line(b, { w: 0.9, c: INK, a: 0.6, closed: true, jit: 0.4 }));
  const armL = [[224, 330], [256, 338], [292, 448], [282, 462]], armR = [[376, 330], [344, 338], [310, 448], [320, 462]];
  inkC(S, armL, { w: 1.1 }); inkC(S, armR, { w: 1.1 });
  const hp = hand(S, 300, 458, 14, 0.1);
  S.line(S.ellipse(320, 442, 4, 6, 0.6, 10), { w: 2.4, c: GOLD, closed: true, step: 1, tremor: 0 });
  S.line(S.ellipse(283, 444, 8, 3, 0.9, 10), { w: 2, c: GOLD, closed: true, step: 1, tremor: 0 });
  trees.forEach(l => S.wash(l, { c: S.r() > 0.5 ? "#4f7a34" : "#6e9a44", a: 0.35, layers: 1, spread: 1, clip: hole }));
  S.wash([[0, 330], [600, 325], [600, 606], [0, 610]], { c: "#8fbf5a", a: 0.2, layers: 2, spread: 3, clip: hole });
  S.wash([[0, 610], [600, 606], [600, 800], [0, 800]], { c: "#d8d8d2", a: 0.15, layers: 2, spread: 2, clip: hole });
  faceWash(S, f);
  S.wash([[287, 206], [314, 206], [316, 236], [300, 262], [286, 236]], { c: SKIN, a: 0.28, layers: 2, spread: 0.5 });
  [armL, armR, hp].forEach(p => S.wash(p, { c: SKIN, a: 0.28, layers: 2, spread: 0.6 }));
  [bA, bB, bC].forEach(b => S.wash(b, { c: "#d8262e", a: 0.5, layers: 2, spread: 0.5 }));
  [[[222, 318], [256, 326], [256, 338], [222, 330]], [[378, 318], [344, 326], [344, 338], [378, 330]]].forEach(b => S.wash(b, { c: "#d8262e", a: 0.55, layers: 2, spread: 0.3 }));
  S.wash(body, { c: "#1f1d22", a: 0.38, layers: 3, spread: 1.5, clip: [{ holes: [bA, bB, bC] }] });
  [slL, slR].forEach(p => S.wash(p, { c: "#1f1d22", a: 0.38, layers: 3, spread: 0.8 }));
  S.wash(cap, { c: HAIR, a: 0.42, layers: 3, spread: 0.6 });
  braid.forEach(e => S.wash(e, { c: HAIR, a: 0.4, layers: 2, spread: 0.5 }));
  sign(S, "p.13 · black and red", 470, 60);
}

/* ---------- PAGE 14 · at Chitrakote ---------- */
function renderPage14Sketch(S) {
  const fig = [[274, 212], [326, 212], [330, 280], [340, 298], [420, 455], [402, 480], [352, 380], [362, 600], [350, 790], [250, 790], [238, 600], [248, 380], [198, 480], [180, 455], [260, 298], [270, 280]], hole = [{ holes: [fig] }];
  guide(S, [[300, 200], [301, 790]]); guide(S, S.ellipse(300, 248, 28, 36, 0, 18), { closed: true });
  for (let i = 0; i < 7; i++) { const y = 30 + i * 36; fine(S, [[S.rand(0, 80), y], [S.rand(150, 250), y + S.rand(-8, 8)], [S.rand(350, 450), y + S.rand(-6, 10)], [S.rand(520, 600), y]], { w: 0.7, a: 0.3, clip: hole }); }
  const treeLine = [[0, 300], [60, 288], [140, 298], [220, 288], [330, 296], [420, 286], [520, 294], [600, 290]];
  ink(S, treeLine, { w: 1, a: 0.6, passes: 1, clip: hole });
  const lip = [[330, 332], [420, 322], [520, 320], [600, 326]];
  ink(S, lip, { w: 1.2, clip: hole });
  const curtain = [];
  for (let x = 334; x < 600; x += 6) { if ((x > 395 && x < 410) || (x > 492 && x < 504)) continue; const y0 = 332 - (x - 330) * 0.07; curtain.push([x, y0]); S.line([[x, y0], [x + S.rand(-2, 2), 405 + S.rand(0, 22)]], { w: 0.8, c: "#8a6a44", a: 0.5, jit: 0.5, step: 4, clip: hole }); }
  const pool = [[0, 335], [330, 338], [600, 425], [600, 470], [0, 470]];
  ink(S, [[0, 470], [600, 470]], { w: 0.8, a: 0.4, passes: 1, clip: hole });
  const bush = []; [[90, 540, 80], [60, 690, 70], [510, 540, 80], [550, 690, 60], [200, 620, 40], [410, 630, 40]].forEach(([x, y, r]) => leafCluster(S, x, y, r, 16, bush, hole));
  const railL = band([0, 510], [250, 455], 10), railR = band([350, 455], [600, 520], 10);
  [railL, railR].forEach(r => S.line(r, { w: 1.1, c: INK, a: 0.8, closed: true, jit: 0.4, clip: hole }));
  ink(S, [[0, 548], [250, 492]], { w: 1.1, passes: 1, clip: hole }); ink(S, [[350, 492], [600, 556]], { w: 1.1, passes: 1, clip: hole });
  const stump = [[272, 470], [328, 470], [330, 600], [270, 600]];
  S.line(stump, { w: 1, c: INK, a: 0.7, closed: true, clip: hole });
  [705, 740, 780].forEach(y => fine(S, [[0, y], [600, y - 3]], { a: 0.35, clip: hole }));
  for (let x = -100; x < 700; x += 70) fine(S, [[300 + (x - 300) * 0.8, 705], [x, 800]], { a: 0.3, clip: hole });
  const cap = [[274, 245], [276, 222], [300, 210], [324, 222], [326, 245], [312, 228], [288, 228]];
  const pony = [[318, 245], [330, 280], [338, 360], [336, 470], [322, 470], [322, 360], [316, 280]];
  ink(S, [[274, 245], [276, 222], [300, 210], [324, 222], [330, 280], [338, 360], [336, 470]], { w: 1.1 });
  const f = sketchFace(S, 300, 250, 26, 33, { look: 0, smile: 0.75, bindi: true });
  ink(S, [[290, 280], [290, 298]]); ink(S, [[310, 280], [311, 298]]);
  const kurta = [[262, 298], [338, 298], [350, 420], [360, 600], [240, 600], [250, 420]];
  const slL = [[266, 300], [250, 330], [180, 460], [198, 472], [270, 360]], slR = [[334, 300], [350, 330], [420, 460], [402, 472], [330, 360]];
  inkC(S, kurta, { w: 1.3 }); inkC(S, slL, { w: 1.2 }); inkC(S, slR, { w: 1.2 });
  const h1 = hand(S, 184, 472, 12, 0.6), h2 = hand(S, 416, 472, 12, -0.6);
  const pants = [[250, 600], [350, 600], [346, 760], [256, 760]];
  inkC(S, pants, { w: 1.1 }); fine(S, [[300, 610], [300, 760]], { a: 0.4 });
  const shoes = [S.ellipse(274, 772, 22, 9, 0, 14), S.ellipse(326, 772, 22, 9, 0, 14)];
  shoes.forEach(e => S.line(e, { w: 1.1, c: INK, closed: true, a: 0.8 }));
  S.wash([[0, 0], [600, 0], [600, 290], [0, 300]], { c: "#7d8794", a: 0.16, layers: 3, spread: 8, clip: hole });
  S.wash([[0, 0], [600, 0], [600, 110], [0, 130]], { c: "#5f6a78", a: 0.14, layers: 2, spread: 10, clip: hole, edge: false });
  S.wash(treeLine.concat([[600, 330], [0, 336]]), { c: "#3d5a36", a: 0.35, layers: 2, spread: 2, clip: hole });
  S.wash(pool, { c: "#a88b6a", a: 0.25, layers: 3, spread: 3, clip: hole });
  S.wash([[330, 330], [600, 322], [600, 430], [330, 410]], { c: "#c7a57a", a: 0.3, layers: 2, spread: 2, clip: hole });
  S.wash(S.ellipse(470, 420, 150, 30, 0, 16), { c: "#f3f1ec", a: 0.55, layers: 2, spread: 6, clip: hole, mode: "source-over", edge: false });
  bush.forEach(l => S.wash(l, { c: S.r() > 0.5 ? "#5e8a3e" : "#86ad4a", a: 0.38, layers: 1, spread: 1, clip: hole }));
  [railL, railR].forEach(r => S.wash(r, { c: "#4a3c33", a: 0.5, layers: 2, spread: 0.4, clip: hole }));
  S.wash(stump, { c: "#8a6a4a", a: 0.3, layers: 2, spread: 1, clip: hole });
  S.wash([[0, 700], [600, 697], [600, 800], [0, 800]], { c: "#cfc8bd", a: 0.2, layers: 2, spread: 2, clip: hole });
  faceWash(S, f);
  [h1, h2].forEach(p => S.wash(p, { c: SKIN, a: 0.3, layers: 2, spread: 0.4 }));
  S.wash([[290, 278], [311, 278], [311, 298], [290, 298]], { c: SKIN, a: 0.28, layers: 2, spread: 0.4 });
  [kurta, slL, slR, pants].forEach(p => S.wash(p, { c: "#c9d0dc", a: 0.14, layers: 2, spread: 1 }));
  for (let y = 312; y < 590; y += 16) { const x = 300 + S.rand(-8, 8); tinyFlower(S, x, y, 4, S.r() > 0.35 ? "#e98a8a" : "#f0a07a", true); const lf = S.petal(x + 5, y + 6, S.rand(0, 6.28), 11, 5, true); S.wash(lf, { c: "#6e9a4a", a: 0.45, layers: 1, spread: 0.3, edge: false }); }
  [[190, 462], [410, 462]].forEach(([x, y]) => tinyFlower(S, x, y - 12, 3, "#e98a8a", false));
  shoes.forEach(e => { S.wash(e, { c: "#e0b43a", a: 0.4, layers: 1, spread: 0.3 }); S.line(e, { w: 2, c: "#3a8a8a", a: 0.5, closed: true, step: 3, clip: [{ poly: e }] }); });
  S.wash(cap, { c: HAIR, a: 0.42, layers: 3, spread: 0.5 }); S.wash(pony, { c: HAIR, a: 0.4, layers: 3, spread: 0.6 });
  S.wash(pony, { c: "#7a3030", a: 0.12, layers: 1, spread: 1, edge: false });
  sign(S, "p.14 · at Chitrakote", 140, 40);
}
