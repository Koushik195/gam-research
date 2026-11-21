// Initiating-coverage renderer. Content comes from research/initiation.json (sections of
// paragraphs, callouts and exhibit specs); numbers come from the model + forecast, so the
// report re-prices itself whenever the data refreshes.
//
// Exhibit spec: { type, title, unit, source, x, series:[{name, ref|values|fn, fmt}], from, to,
//                 labels: 'all'|'last'|'ends'|'max'|'none', size: 'tall'|'short', highlight }
// Text tokens: {{path|fmt}} resolved against the context, e.g. {{dcf.tp|inr}}.
const SYMBOL = decodeURIComponent(location.pathname.slice(13).split('/')[2] || '').toUpperCase();
const PAL = ['#2b5ca6', '#cf8f1f', '#16a08a', '#a85fc0']; // validated categorical order
const GREY = '#b8bec9', INK = '#1a2233', INK2 = '#4b5563', GRID = '#ece8dc';
const isNum = v => typeof v === 'number' && isFinite(v);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- formatting ----------
const nf = (v, d = 0) => v.toLocaleString('en-IN', { maximumFractionDigits: d, minimumFractionDigits: d });
const FMT = {
  num: v => nf(v), n1: v => nf(v, 1), n2: v => nf(v, 2),
  cr: v => nf(v), lakhcr: v => `${nf(v / 1e5, 2)}`,
  pct: v => `${nf(v, 1)}%`, pct0: v => `${nf(v, 0)}%`, bps: v => `${v > 0 ? '+' : ''}${nf(v, 0)}bp`,
  x: v => `${nf(v, 1)}x`, inr: v => `₹${nf(v)}`, inr1: v => `₹${nf(v, 1)}`,
  lakh: v => nf(v / 1e5, 1), k: v => `${nf(v / 1e3, 0)}k`, mn: v => nf(v / 1e6, 2), chg: v => `${v > 0 ? '+' : ''}${nf(v, 1)}%`,
};
const fmt = (v, f = 'num') => (isNum(v) ? (FMT[f] || FMT.num)(v) : '–');
const tick = v => (Math.abs(v) >= 1e5 ? `${nf(v / 1e5, 1)}L` : Math.abs(v) >= 1e3 ? `${nf(v / 1e3, v % 1000 ? 1 : 0)}K` : nf(v, Math.abs(v) < 10 && v % 1 ? 1 : 0));

// ---------- context & references ----------
let CTX = {};
function get(path) {
  // supports a.b.c, a.b[2], and a.list[].field (maps over array)
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let cur = CTX;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (cur == null) return undefined;
    if (p.endsWith('[]')) { const arr = cur[p.slice(0, -2)] || []; const rest = parts.slice(i + 1).join('.'); return rest ? arr.map(o => rest.split('.').reduce((a, k) => a?.[k], o)) : arr; }
    cur = cur[p];
  }
  return cur;
}
const tokens = s => String(s ?? '').replace(/\{\{([^}|]+)(?:\|([^}]+))?\}\}/g, (_, p, f) => { const v = get(p.trim()); return isNum(v) ? fmt(v, f || 'num') : esc(v ?? '–'); });
const rich = s => tokens(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

function resolveX(spec) {
  let x = Array.isArray(spec.x) ? spec.x : get(spec.x || 'fin.labels') || [];
  return x.map(String);
}
function resolveSeries(spec, x, idx) {
  return (spec.series || []).map((s, k) => {
    let vals;
    if (s.values) vals = s.values;
    else if (s.ref) vals = get(s.ref) || [];
    else if (s.fn) { const f = new Function('i', 'x', 'g', `return (${s.fn});`); vals = resolveX(spec).map((_, i) => { try { const v = f(i, x, get); return isNum(v) ? v : null; } catch { return null; } }); }
    if (s.ref || s.fn) vals = idx.map(i => vals[i]);
    if (s.scale) vals = vals.map(v => (isNum(v) ? v * s.scale : v));
    return { ...s, vals: vals.map(v => (isNum(v) ? v : null)), color: s.color || (s.grey ? GREY : PAL[s.slot ?? k]) };
  });
}
function window_(spec) {
  const full = resolveX(spec);
  let a = 0, b = full.length - 1;
  if (spec.from) a = Math.max(0, full.indexOf(spec.from));
  if (spec.to) b = full.indexOf(spec.to) >= 0 ? full.indexOf(spec.to) : b;
  const idx = []; for (let i = a; i <= b; i++) idx.push(i);
  return { x: idx.map(i => full[i]), idx };
}
const isEst = l => /E$/.test(l);
const fade = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

// ---------- Chart.js defaults ----------
Chart.register(ChartDataLabels);
Object.assign(Chart.defaults, { maintainAspectRatio: false, animation: false });
Chart.defaults.font.family = "'Segoe UI', system-ui, Arial, sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.color = INK2;
Chart.defaults.plugins.legend.display = false; // we draw HTML legends
Chart.defaults.plugins.tooltip.mode = 'index';
Chart.defaults.plugins.tooltip.intersect = false;
Chart.defaults.plugins.datalabels.display = false;

// Shade the estimate region on category axes.
Chart.register({
  id: 'estband',
  beforeDatasetsDraw(c, _a, o) {
    if (!o?.from && o?.from !== 0) return;
    const { ctx, chartArea: a, scales } = c;
    const xs = scales.x || scales.y;
    if (!xs || c.options.indexAxis === 'y') return;
    const x0 = xs.getPixelForValue(o.from) - (xs.getPixelForValue(1) - xs.getPixelForValue(0)) / 2;
    ctx.save(); ctx.fillStyle = 'rgba(207,143,31,.07)'; ctx.fillRect(x0, a.top, a.right - x0, a.bottom - a.top);
    ctx.fillStyle = '#9a6a10'; ctx.font = '600 9.5px Segoe UI'; ctx.fillText('Estimates →', x0 + 4, a.bottom - 4); ctx.restore();
  },
});
// Horizontal reference line (e.g. median multiple) or vertical (bar charts): o.lines=[{v, text, axis}]
Chart.register({
  id: 'reflines',
  afterDatasetsDraw(c, _a, o) {
    if (!o?.lines) return;
    const { ctx, chartArea: a, scales } = c;
    ctx.save();
    for (const l of o.lines) {
      const sc = l.axis === 'x' ? scales.x : scales.y;
      const p = sc.getPixelForValue(l.v);
      ctx.strokeStyle = l.color || '#7a5c12'; ctx.lineWidth = 1; ctx.setLineDash(l.dash || [4, 3]);
      ctx.beginPath();
      if (l.axis === 'x') { ctx.moveTo(p, a.top); ctx.lineTo(p, a.bottom); } else { ctx.moveTo(a.left, p); ctx.lineTo(a.right, p); }
      ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#5c4510'; ctx.font = '600 10px Segoe UI';
      if (l.axis === 'x') ctx.fillText(l.text || '', p + 4, a.top + 10); else ctx.fillText(l.text || '', a.left + 4, p - 4);
    }
    ctx.restore();
  },
});

// Break a long axis label into lines of roughly `w` characters at word boundaries.
function wrapLabel(l, w) {
  if (l.length <= w) return l;
  const lines = [''];
  for (const word of l.split(' ')) {
    const cur = lines[lines.length - 1];
    if (cur && (cur + ' ' + word).length > w) lines.push(word); else lines[lines.length - 1] = cur ? `${cur} ${word}` : word;
  }
  return lines;
}

const charts = [];
function legendHtml(series, type) {
  if (series.length < 2) return '';
  return `<div class="legend">${series.map(s => `<span><i class="${s.line || type === 'line' ? 'l' : ''}" style="background:${s.color}"></i>${esc(s.name)}</span>`).join('')}</div>`;
}

// Value labels: selective by mode; never on every point of a long line.
function labelFn(mode, n, fmtKey, vals) {
  const maxI = vals.reduce((b, v, i) => (isNum(v) && (b < 0 || v > vals[b]) ? i : b), -1);
  const minI = vals.reduce((b, v, i) => (isNum(v) && (b < 0 || v < vals[b]) ? i : b), -1);
  return ctx => {
    const i = ctx.dataIndex, v = ctx.dataset.data[i];
    if (!isNum(v)) return false;
    if (mode === 'all') return true;
    if (mode === 'last') return i === n - 1;
    if (mode === 'ends') return i === 0 || i === n - 1;
    if (mode === 'extremes') return i === n - 1 || i === maxI || i === minI;
    if (mode === 'max') return i === maxI;
    return false;
  };
}

function renderChart(el, spec) {
  const { x, idx } = window_(spec);
  if (spec.lines) spec = { ...spec, lines: spec.lines.map(l => ({ ...l, v: typeof l.v === 'string' ? get(l.v) : l.v, text: tokens(l.text || '') })) };
  const S = resolveSeries(spec, x, idx);
  const estFrom = x.findIndex(isEst);
  const type = spec.type;
  const fk = spec.fmt || S[0]?.fmt || 'num';
  const n = x.length;
  const baseLabels = { color: INK, font: { size: 10.5, weight: 600 }, clamp: true };
  let cfg;
  if (type === 'column' || type === 'stacked' || type === 'hbar') {
    const stacked = type === 'stacked';
    const horizontal = type === 'hbar';
    cfg = { type: 'bar', data: { labels: x, datasets: S.map(s => ({
      label: s.name, data: s.vals,
      backgroundColor: x.map((l, i) => (spec.highlight != null ? (l === spec.highlight || i === spec.highlight ? PAL[1] : s.color) : isEst(l) ? fade(s.color, 0.45) : s.color)),
      borderRadius: stacked ? 0 : 4, borderSkipped: 'start', maxBarThickness: horizontal ? 20 : 24, borderWidth: stacked ? { top: 2 } : 0, borderColor: '#fff',
      stack: stacked ? 's' : undefined,
      datalabels: {
        ...baseLabels,
        display: stacked ? ctx => isNum(ctx.dataset.data[ctx.dataIndex]) && Math.abs(ctx.dataset.data[ctx.dataIndex]) >= (spec.minLabel ?? 6) && spec.labels !== 'none' : spec.labels === 'none' ? false : labelFn(spec.labels || (n > 16 ? 'extremes' : 'all'), n, fk, s.vals),
        anchor: stacked ? 'center' : 'end', align: stacked ? 'center' : horizontal ? 'right' : 'top', offset: 2,
        color: stacked ? '#fff' : INK,
        formatter: (v, ctx) => {
          const base = fmt(v, s.fmt || fk);
          if (s.growth && ctx.dataIndex > 0) { const p = ctx.dataset.data[ctx.dataIndex - 1]; if (isNum(p) && p > 0) return [base, `${v >= p ? '+' : ''}${nf((v / p - 1) * 100, 0)}%`]; }
          return base;
        },
      },
    })) },
      options: { indexAxis: horizontal ? 'y' : 'x', layout: { padding: { top: horizontal ? 0 : 22, right: horizontal ? 50 : 4 } },
        scales: { x: { stacked, grid: { display: horizontal, color: GRID }, ticks: horizontal ? { callback: v => tick(v) } : { maxRotation: 0, autoSkip: true } },
          y: { stacked, grid: { display: !horizontal, color: GRID }, border: { display: false }, ticks: horizontal ? { autoSkip: false } : { callback: v => tick(v), maxTicksLimit: 6 }, min: spec.min, max: spec.max, beginAtZero: spec.min == null } },
        plugins: { estband: { from: estFrom >= 0 ? estFrom : null }, reflines: { lines: spec.lines } } } };
  } else if (type === 'line') {
    cfg = { type: 'line', data: { labels: x, datasets: S.map(s => ({
      label: s.name, data: s.vals, borderColor: s.color, backgroundColor: s.area ? fade(s.color, 0.1) : s.color, fill: !!s.area, borderWidth: s.thin ? 1.5 : 2, tension: 0.25, spanGaps: true,
      pointRadius: ctx => (n > 30 ? 0 : 3), pointBorderColor: '#fff', pointBorderWidth: 1.5, borderDash: s.dash,
      segment: { borderDash: c => (isEst(x[c.p1DataIndex]) ? [5, 4] : s.dash) },
      datalabels: { ...baseLabels, display: spec.labels === 'none' || s.nolabel ? false : labelFn(spec.labels || (n > 16 ? 'extremes' : 'all'), n, fk, s.vals), align: 'top', offset: 4, formatter: v => fmt(v, s.fmt || fk) },
    })) },
      options: { layout: { padding: { top: 18, right: 22 } }, scales: { x: { grid: { display: false }, ticks: spec.yearTicks ? { maxRotation: 0, autoSkip: false, callback(v) { const l = this.getLabelForValue(v), p = v > 0 ? this.getLabelForValue(v - 1) : ''; const y = l.slice(0, 4); return y !== p.slice(0, 4) && (+y % (spec.yearStep || 2) === 0) ? y : null; } } : { maxRotation: 0, autoSkip: true, maxTicksLimit: spec.maxTicks || 14 } },
        y: { grid: { color: GRID }, border: { display: false }, ticks: { callback: v => (fk.startsWith('pct') ? `${v}%` : fk === 'x' ? `${v}x` : tick(v)), maxTicksLimit: 6 }, min: spec.min, max: spec.max } },
        plugins: { estband: { from: estFrom >= 0 ? estFrom : null }, reflines: { lines: spec.lines } } } };
  } else if (type === 'scatter') {
    const pts = (spec.points || get(spec.pointsRef) || []).filter(p => isNum(p.x) && isNum(p.y));
    cfg = { type: 'scatter', data: { datasets: [{ data: pts, backgroundColor: pts.map(p => (p.hl ? PAL[1] : PAL[0])), pointRadius: 6, pointBorderColor: '#fff', pointBorderWidth: 2,
      datalabels: { display: true, ...baseLabels, align: 'right', offset: 6, formatter: (_, c) => pts[c.dataIndex].label } }] },
      options: { layout: { padding: { right: 70, top: 10 } }, plugins: { tooltip: { mode: 'nearest', intersect: true, callbacks: { label: c => `${pts[c.dataIndex].label}: ${fmt(pts[c.dataIndex].x, spec.xfmt)} / ${fmt(pts[c.dataIndex].y, spec.yfmt)}` } } },
        scales: { x: { type: spec.xlog ? 'logarithmic' : 'linear', title: { display: true, text: spec.xtitle }, grid: { color: GRID }, ticks: { callback: v => tick(v) } }, y: { type: spec.ylog ? 'logarithmic' : 'linear', title: { display: true, text: spec.ytitle }, grid: { color: GRID }, ticks: { callback: v => tick(v) } } } } };
  } else if (type === 'waterfall') {
    // series[0].vals = deltas; first & last are totals
    const v = S[0].vals; let run = 0; const bars = v.map((d, i) => { if (i === 0 || i === v.length - 1) { run = d; return [0, d]; } const b = [run, run + d]; run += d; return b; });
    cfg = { type: 'bar', data: { labels: x, datasets: [{ data: bars, backgroundColor: v.map((d, i) => (i === 0 || i === v.length - 1 ? PAL[0] : d >= 0 ? '#1a7f4b' : '#b4232a')), borderRadius: 3, maxBarThickness: 34,
      datalabels: { display: true, ...baseLabels, anchor: 'end', align: 'top', formatter: (_, c) => fmt(v[c.dataIndex], (c.dataIndex === 0 || c.dataIndex === v.length - 1) ? (spec.totalFmt || 'pct') : (spec.fmt || 'bps')) } }] },
      options: { layout: { padding: { top: 20 } }, plugins: { tooltip: { enabled: false } }, scales: { x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: false, font: { size: 10 }, callback(v) { const l = this.getLabelForValue(v); return wrapLabel(l, 12); } } }, y: { grid: { color: GRID }, min: spec.min, max: spec.max } } } };
  }
  charts.push(new Chart(el, cfg));
  return S;
}

// ---------- tables ----------
function tableHtml(spec) {
  if (spec.list) {
    // rows from an array of objects: list = ref, cols = [{h, f, fmt}]
    const arr = get(spec.list) || [];
    return `<table class="xt"><thead><tr>${spec.cols.map(c => `<th>${esc(c.h)}</th>`).join('')}</tr></thead><tbody>${arr.map(o => `<tr>${spec.cols.map(c => `<td>${c.fmt ? fmt(o[c.f], c.fmt) : esc(o[c.f])}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  if (spec.grid) {
    // 2-D sensitivity: rowsRef/colsRef = axis values, grid = matrix; centre cell highlighted
    const rows = get(spec.rowsRef), cols = get(spec.colsRef), g = get(spec.grid);
    const mr = Math.floor(rows.length / 2), mc = Math.floor(cols.length / 2);
    return `<table class="xt"><thead><tr><th>${esc(spec.corner || '')}</th>${cols.map(c => `<th>${fmt(c, spec.colFmt || 'pct')}</th>`).join('')}</tr></thead><tbody>${rows.map((r, i) => `<tr><td><b>${fmt(r, spec.rowFmt || 'pct')}</b></td>${g[i].map((v, j) => `<td style="${i === mr && j === mc ? 'background:#fbf0d4;font-weight:800' : ''}">${fmt(v, spec.fmt || 'inr')}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  if (spec.ref) { const t = get(spec.ref); spec = { ...spec, head: t.head, rows: t.rows }; }
  if (spec.rowsRef) {
    // rows from refs over fin (or another x): [{name, ref, fmt}]
    const { x, idx } = window_(spec);
    const head = ['', ...x];
    const rows = spec.rowsRef.map(r => (r.section ? { sec: r.section } : { cells: [r.name, ...resolveSeries({ ...spec, series: [r] }, x, idx)[0].vals.map(v => fmt(v, r.fmt || 'num'))], hl: r.hl }));
    return `<table class="xt"><thead><tr>${head.map((h, i) => `<th class="${isEst(h) ? 'e' : ''}">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => (r.sec ? `<tr class="sec"><td colspan="${head.length}">${esc(r.sec)}</td></tr>` : `<tr class="${r.hl ? 'hl' : ''}">${r.cells.map((c, i) => `<td class="${isEst(head[i]) ? 'e' : ''}">${c}</td>`).join('')}</tr>`)).join('')}</tbody></table>`;
  }
  const wide = spec.wide || [];
  return `<table class="xt"><thead><tr>${spec.head.map((h, i) => `<th class="${wide.includes(i) ? 'w' : ''} ${isEst(String(h)) ? 'e' : ''}">${esc(h)}</th>`).join('')}</tr></thead><tbody>${spec.rows.map(r => (r.sec ? `<tr class="sec"><td colspan="${spec.head.length}">${esc(r.sec)}</td></tr>` : `<tr class="${r.hl ? 'hl' : ''}">${(r.cells || r).map((c, i) => `<td class="${wide.includes(i) ? 'w' : ''} ${isEst(String(spec.head[i])) ? 'e' : ''}">${rich(c)}</td>`).join('')}</tr>`)).join('')}</tbody></table>`;
}

// ---------- exhibits ----------
let EXN = 0;
const pending = [];
function exhibit(spec) {
  EXN++;
  const id = `ex${EXN}`;
  const head = `<div class="t"><span class="n">Exhibit ${EXN}:</span>${rich(spec.title)}</div>${spec.unit ? `<div class="u">${esc(spec.unit)}</div>` : ''}`;
  const src = `<div class="s">Source: ${esc(spec.source || 'Company, GAM Research')}</div>`;
  if (spec.type === 'table' || spec.type === 'rows') return `<div class="ex">${head}${tableHtml(spec)}${src}</div>`;
  if (spec.type === 'tiles') return `<div class="ex">${head}<div class="tiles">${spec.tiles.map(t => `<div class="tile"><div class="k">${esc(t.k)}</div><div class="v">${rich(t.v)}</div>${t.d ? `<div class="d">${rich(t.d)}</div>` : ''}</div>`).join('')}</div>${src}</div>`;
  pending.push([id, spec]);
  return `<div class="ex ${spec.size || ''}">${head}<div class="legend" id="${id}-lg"></div><div class="cv"><canvas id="${id}"></canvas></div>${src}</div>`;
}
function drawPending() {
  for (const [id, spec] of pending.splice(0)) {
    try {
      const S = renderChart(document.getElementById(id), spec);
      const lg = document.getElementById(`${id}-lg`);
      if (lg && spec.type !== 'waterfall' && spec.type !== 'scatter') lg.outerHTML = legendHtml(S, spec.type);
      else if (lg) lg.remove();
    } catch (e) { console.error('exhibit', id, spec.title, e); }
  }
}

// ---------- annotated statements ----------
// Auto-flags big moves; explanations come from research notes keyed "<line>@<period>".
function annotated(spec) {
  const notes = get(spec.notesRef || 'R.initiation.statementNotes') || {};
  const T = spec.quarterly ? CTX.Q : CTX.fin;
  const labels = spec.quarterly ? CTX.Q.labels : CTX.fin.labels;
  const rows = spec.rows;
  const nActual = spec.quarterly ? labels.length : CTX.fin.nActual;
  let k = 0; const list = [];
  const head = `<tr><th>${spec.quarterly ? '₹ crore' : '₹ crore, FY'}</th>${labels.map(l => `<th class="${isEst(l) ? 'e' : ''}">${l}</th>`).join('')}</tr>`;
  const body = rows.map(r => {
    if (r.section) return `<tr class="sec"><td colspan="${labels.length + 1}">${esc(r.section)}</td></tr>`;
    const vals = r.fn ? labels.map((_, i) => { try { return new Function('i', 'g', `return (${r.fn});`)(i, get); } catch { return null; } }) : (r.src ? get(r.src) : T[r.key]) || [];
    return `<tr class="${r.hl ? 'hl' : ''}"><td>${esc(r.name)}</td>${labels.map((l, i) => {
      const v = vals[i];
      let flag = null;
      const prev = vals[i - (spec.quarterly && r.yoy ? 4 : 1)];
      if (i < nActual && isNum(v) && isNum(prev) && r.flag) {
        const d = r.flag.type === 'bps' ? (v - prev) * 100 : prev !== 0 ? (v / prev - 1) * 100 : 0;
        if (Math.abs(d) >= r.flag.th) flag = d;
      }
      const note = notes[`${r.key || r.name}@${l}`];
      let cls = isEst(l) ? 'e' : '', mark = '', title = '';
      if (flag != null || note) {
        k++;
        const dir = flag != null ? flag : 0;
        cls += dir > 0 === !r.inverse ? ' up' : ' dn';
        if (!dir) cls = cls.replace(/ (up|dn)/, ' nt');
        const why = note || 'Flagged automatically — explanation to be added.';
        const chg = flag != null ? (r.flag.type === 'bps' ? `${flag > 0 ? '+' : ''}${nf(flag, 0)}bp` : `${flag > 0 ? '+' : ''}${nf(flag, 0)}%`) : '';
        list.push({ k, line: r.name, period: l, chg, why, auto: !note });
        mark = `<sup>${k}</sup>`; title = ` title="${esc(`${r.name} ${l} ${chg}: ${why}`)}"`;
      }
      return `<td class="${cls}"${title}>${fmt(v, r.fmt || 'num')}${mark}</td>`;
    }).join('')}</tr>`;
  }).join('');
  EXN++;
  return `<div class="ex"><div class="t"><span class="n">Exhibit ${EXN}:</span>${rich(spec.title)}</div>
    <div class="u">Highlighted cells moved materially (green = favourable, red = adverse); hover for the reason. Numbered notes below.</div>
    <div class="stwrap"><table class="xt st"><thead>${head}</thead><tbody>${body}</tbody></table></div>
    <ol class="stnotes">${list.map(n => `<li value="${n.k}"><b>${esc(n.line)}, ${esc(n.period)}${n.chg ? ` (${n.chg})` : ''}:</b> ${rich(n.why)}${n.auto ? ' <span class="muted">[auto-flag]</span>' : ''}</li>`).join('')}</ol>
    <div class="s">Source: ${esc(spec.source || 'Company, Screener.in (consolidated), GAM Research')}</div></div>`;
}

// Verdict matrix: rows of {item, verdict, text}; verdict drives the chip colour.
const VCLS = { Yes: 'GREEN', Partly: 'AMBER', No: 'RED', Advantage: 'GREEN', Parity: 'AMBER', Disadvantage: 'RED', Strong: 'GREEN', Moderate: 'AMBER', Weak: 'RED', Tailwind: 'GREEN', Headwind: 'RED', Neutral: 'AMBER' };
function verdictTable(b) {
  EXN++;
  return `<div class="ex"><div class="t"><span class="n">Exhibit ${EXN}:</span>${rich(b.title)}</div><table class="xt vt"><thead><tr>${b.head.map((h, i) => `<th class="${i !== 1 ? 'w' : ''}">${esc(h)}</th>`).join('')}</tr></thead><tbody>${b.verdicts.map(r => `<tr><td class="w"><b>${rich(r[0])}</b></td><td><span class="flag ${VCLS[r[1]] || 'AMBER'}">${esc(r[1])}</span></td>${r.slice(2).map(c => `<td class="w">${rich(c)}</td>`).join('')}</tr>`).join('')}</tbody></table><div class="s">Source: ${esc(b.source || 'GAM Research')}</div></div>`;
}

// ---------- blocks & pages ----------
function block(b) {
  if (b.p) return `<p>${rich(b.p)}</p>`;
  if (b.h) return `<h3>${rich(b.h)}</h3>`;
  if (b.bullets) return `<ul class="b">${b.bullets.map(x => `<li>${rich(x)}</li>`).join('')}</ul>`;
  if (b.callout) return `<div class="callout">${rich(b.callout)}</div>`;
  if (b.exhibit) return exhibit(b.exhibit);
  if (b.pair) return `<div class="exrow">${b.pair.map(exhibit).join('')}</div>`;
  if (b.statement) return annotated(b.statement);
  if (b.svg) { EXN++; return `<div class="ex"><div class="t"><span class="n">Exhibit ${EXN}:</span>${rich(b.title)}</div><div class="svgbox">${b.svg}</div><div class="s">Source: ${esc(b.source || 'GAM Research')}</div></div>`; }
  if (b.verdicts) return verdictTable(b);
  return '';
}

function cover(R) {
  const c = R.cover, d = CTX.dcf, P = CTX.P, F = CTX.F, fin = CTX.fin, m = CTX.meta;
  const nA = fin.nActual;
  const cols = [nA - 2, nA - 1, nA, nA + 1, nA + 2].filter(i => i < fin.labels.length);
  const kfRows = R.cover.keyRows || [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['PAT (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']];
  const pe = cols.map(i => (fin.eps[i] > 0 && P.last / fin.eps[i] < 150 ? P.last / fin.eps[i] : null)); // n.m. for loss years
  const flags = c.flags.map(f => `<tr><td>${esc(f.k)}</td><td><span class="flag ${f.v}">${f.v}</span></td></tr>`).join('');
  // Published call history (coverage log): every rating and target with the price on that day.
  const H = (CTX.R.history?.events || []).filter(e => e.rating);
  const last = H[H.length - 1], label = !last || last.type === 'initiation' ? 'INITIATING COVERAGE' : 'RESULTS UPDATE';
  const dshort = d => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
  const hist = H.length ? `<h5>Rating history</h5><table class="rh"><tr><td><b>Date</b></td><td><b>Rating</b></td><td><b>Target</b></td><td><b>Price</b></td></tr>${H.slice().reverse().map(e => `<tr><td>${dshort(e.date)}</td><td><span class="flag ${e.rating === 'BUY' ? 'GREEN' : e.rating === 'SELL' ? 'RED' : 'AMBER'}">${e.rating}</span></td><td>₹${nf(e.tp)}</td><td>₹${nf(e.price)}</td></tr>`).join('')}</table>
    ${CTX.M.coverage?.flags?.length ? `<div class="src" style="margin-top:4px">${CTX.M.coverage.flags.map(f => esc(f.t)).join('; ')}.</div>` : ''}` : '<h5>Status</h5><div class="src">Draft: not yet published to the coverage library.</div>';
  return `<div class="page" id="cover"><div class="runhead"><span><b>${esc(m.name)}</b> · ${esc(m.sectorPath.slice(-1)[0] || '')}</span><span>${label} · ${esc(R.date)}${m.asOf ? ` · data as of ${esc(dshort(m.asOf))}` : ''}</span></div>
  <div class="cover"><div>
    <div class="coverlogo"><img src="/gam-research/assets/guardian-logo.png" alt="GAM"><div><div class="t1">GAM <b>Research</b></div><div class="t2">Initiating coverage</div></div></div>
    <div class="meta">${esc(R.listing || `${m.symbol} IN`)}</div>
    <div class="company">${esc(m.name.replace(/ Ltd$/, ''))}</div>
    <div><span class="rating ${R.rating}">${R.rating}</span></div>
    <h1>${rich(c.headline)}</h1>
    <div class="lead">${rich(c.lead)}</div>
    ${c.arguments.map(a => `<div class="arg"><h4>${rich(a.h)}</h4><p>${rich(a.p)}</p></div>`).join('')}
    <table class="kf"><thead><tr><th>Year to March</th>${cols.map(i => `<th class="${isEst(fin.labels[i]) ? 'e' : ''}">${fin.labels[i]}</th>`).join('')}</tr></thead><tbody>
      ${kfRows.map(([n, k, f]) => { const src = k.startsWith('kpi.') ? CTX.kpi[k.slice(4)] || [] : fin[k] || []; return `<tr><td>${n}</td>${cols.map(i => `<td class="${isEst(fin.labels[i]) ? 'e' : ''}">${fmt(src[i], f)}</td>`).join('')}</tr>`; }).join('')}
      <tr><td>P/E (x)</td>${pe.map((v, j) => `<td class="${isEst(fin.labels[cols[j]]) ? 'e' : ''}">${fmt(v, 'n1')}</td>`).join('')}</tr></tbody></table>
    <div class="src">Source: Company, GAM Research estimates. ${m.basis === 'standalone' ? 'Standalone' : 'Consolidated'}. P/E at CMP ₹${nf(P.last)}.</div>
  </div>
  <aside class="side">
    <h5>Recommendation</h5><table>
      <tr><td>CMP (${esc(P.lastDate)})</td><td>₹${nf(P.last)}</td></tr>
      <tr><td>Target price (12m)</td><td>₹${nf(d.tp)}</td></tr>
      <tr><td>Upside</td><td class="${d.upside >= 0 ? 'pos' : 'neg'}">${fmt(d.upside, 'chg')}</td></tr>
      <tr><td>Mcap</td><td>${m.marketCap >= 1e5 ? `₹${nf(m.marketCap / 1e5, 2)} lakh cr` : `₹${nf(m.marketCap)} cr`}</td></tr>
      <tr><td>52-week range</td><td>₹${nf(P.low52)}–${nf(P.high52)}</td></tr>
      ${isNum(d.impliedPe) ? `<tr><td>Implied P/E ${esc(d.impliedPeLabel)}</td><td>${fmt(d.impliedPe, 'x')}</td></tr>` : ''}${d.method ? `<tr><td>Valuation method</td><td>${esc(d.method)}</td></tr>` : ''}
      <tr><td>Bull / Bear value</td><td>₹${nf(CTX.scen.bull.tp)} / ₹${nf(CTX.scen.bear.tp)}</td></tr></table>
    ${hist}
    <h5>Flags</h5><table>${flags}</table>
    <h5>Shareholding (latest)</h5><table>${Object.entries(CTX.SH?.rows || {}).filter(([k]) => !/Share/.test(k)).map(([k, v]) => `<tr><td>${esc(k)}</td><td>${fmt(v[v.length - 1], 'pct')}</td></tr>`).join('')}</table>
    <h5>Performance</h5><table>${['1y', '3y', '5y', '10y'].map(k => `<tr><td>${k === '1y' ? '1-year' : `${k} CAGR`}</td><td class="${P.returns[k] >= 0 ? 'pos' : 'neg'}">${fmt(P.returns[k], 'chg')}</td></tr>`).join('')}<tr><td>BSE-500, 1-year</td><td>${fmt(P.relative?.index1y, 'chg')}</td></tr></table>
    <div style="height:150px;margin-top:8px"><canvas id="cover-rel"></canvas></div>
    <h5>Catalysts</h5><ul style="padding-left:16px;margin:0">${c.catalysts.map(x => `<li style="margin-bottom:4px">${rich(x)}</li>`).join('')}</ul>
    <h5>Research team</h5><div>${esc(R.analysts || 'GAM Research')}</div>
  </aside></div></div>`;
}
function coverChart() {
  const R = CTX.P.relative; if (!R) return;
  const s = R.series.filter((_, i) => i % 2 === 0);
  charts.push(new Chart(document.getElementById('cover-rel'), { type: 'line', data: { labels: s.map(r => r[0]), datasets: [
    { data: s.map(r => r[1]), borderColor: PAL[0], borderWidth: 1.6, pointRadius: 0, label: CTX.meta.name.split(' ')[0] },
    { data: s.map(r => r[2]), borderColor: PAL[1], borderWidth: 1.6, pointRadius: 0, label: 'BSE-500' }] },
    options: { plugins: { legend: { display: true, labels: { boxWidth: 10, boxHeight: 2, font: { size: 10 } } } }, scales: { x: { display: false }, y: { grid: { color: GRID }, ticks: { font: { size: 9 } } } } } }));
}

function render(M) {
  const R = M.research.initiation;
  CTX = { M, meta: M.meta, A: M.annual, Q: M.quarterly, LQ: M.longQuarterly, V: M.valuation, P: M.price, SH: M.shareholding, fin: M.fin, F: M.forecast.F, dcf: M.forecast.dcf, scen: M.forecast.scenarios, as: M.forecast.assumptions, R: M.research, peers: M.peers };
  const cons = M.research.street?.consensus || [];
  const rel = (a, b) => (isNum(a) && isNum(b) ? (a / b - 1) * 100 : null);
  CTX.cmp = { rev0: rel(M.forecast.F.sales?.[0], cons[0]?.revenue), rev1: rel(M.forecast.F.sales?.[1], cons[1]?.revenue), eps0: rel(M.forecast.F.eps[0], cons[0]?.eps), eps1: rel(M.forecast.F.eps[1], cons[1]?.eps) };
  CTX.kpi = M.kfin ? { ...M.kfin } : {};
  const ak = M.research.company?.annualKpis || [];
  if (!M.kfin) for (const f of new Set(ak.flatMap(r => Object.keys(r)))) {
    if (f === 'fy' || f === 'src') continue;
    CTX.kpi[f] = M.fin.labels.map(l => ak.find(r => r.fy === l)?.[f] ?? null);
  }
  if (!M.kfin && CTX.kpi.units) CTX.kpi.units = CTX.kpi.units.map((v, i) => v ?? M.forecast.F.volume[i - M.fin.nActual] ?? null);
  document.title = `${M.meta.name} · Initiating Coverage · GAM Research`;
  const pages = R.sections.map(sec => `<section class="page" id="${sec.id}"><div class="runhead"><span><img src="/gam-research/assets/guardian-logo.png" alt=""><b>${esc(M.meta.name)}</b></span><span>${esc(R.date)}</span></div>
    ${sec.kicker ? `<div class="kicker">${esc(sec.kicker)}</div>` : ''}<h2>${rich(sec.title)}</h2>${sec.blocks.map(block).join('')}</section>`).join('');
  document.getElementById('app').innerHTML = `<div class="wrap"><nav class="toc"><a href="#cover"><span class="n">·</span>Cover</a>${R.sections.map((s, i) => `<a href="#${s.id}"><span class="n">${i + 1}</span>${esc(s.nav || s.title.replace(/\*\*/g, '').slice(0, 34))}</a>`).join('')}</nav><main>${cover(R)}${pages}</main></div>`;
  coverChart();
  drawPending();
  const links = [...document.querySelectorAll('nav.toc a')];
  const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`)); }), { rootMargin: '-20% 0px -70% 0px' });
  document.querySelectorAll('.page').forEach(s => obs.observe(s));
}

async function load() {
  document.getElementById('dlXls').href = `/gam-research/api/excel/${encodeURIComponent(SYMBOL)}.xlsx`;
  const pdf = document.getElementById('dlPdf');
  pdf.href = `/gam-research/api/pdf/${encodeURIComponent(SYMBOL)}.pdf`;
  pdf.onclick = () => { pdf.textContent = '⏳ Preparing PDF…'; setTimeout(() => (pdf.textContent = '⬇ Download PDF'), 25000); };
  const r = await fetch(`/gam-research/api/model/${encodeURIComponent(SYMBOL)}.json`, { cache: 'no-cache' });
  const M = await r.json();
  if (!r.ok) { document.getElementById('app').innerHTML = `<div class="loading">Couldn't build ${esc(SYMBOL)}: ${esc(M.error)}</div>`; return; }
  if (!M.research?.initiation || !M.forecast) { document.getElementById('app').innerHTML = `<div class="loading"><h2 style="font-family:Georgia,serif;color:#0d1f44;font-weight:normal">${esc(M.meta.name)}</h2><p>GAM Research has not yet published an initiating-coverage report on this company.</p><p><a class="btn primary" href="/gam-research/">← Back to coverage list</a></p></div>`; return; }
  render(M);
}

// header search
let U = [];
fetch('/gam-research/api/universe.json', { cache: 'no-cache' }).then(r => r.json()).then(u => (U = u.companies));
const hq = document.getElementById('hq'), hdd = document.getElementById('hdd');
hq.oninput = () => {
  const q = hq.value.trim().toLowerCase();
  const hits = q ? U.filter(c => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)).slice(0, 12) : [];
  hdd.innerHTML = hits.map(c => `<a href="/gam-research/company/${encodeURIComponent(c.symbol)}/initiation/"><span>${esc(c.name)}</span><span class="muted">${esc(c.symbol)}</span></a>`).join('');
  hdd.style.display = hits.length ? 'block' : 'none';
};
document.addEventListener('click', e => { if (!e.target.closest('.hsearch')) hdd.style.display = 'none'; });
load();
