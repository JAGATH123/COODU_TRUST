/* ==========================================================================
   COODU — planet dot-globe
   Ported from the Claude-design "Planet Globe Section". Pure 2D <canvas>:
   samples an Earth texture into land dots and renders a slowly rotating
   wireframe-dot globe with a graticule + an amber highlight over India.
   Tuned for a green band. Honors prefers-reduced-motion (one static frame).
   ========================================================================== */
(function () {
  'use strict';
  var DEG = Math.PI / 180;

  function hexToRgb(hex) {
    hex = (hex || '').replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function makeOpts(W, H) {
    var hl = hexToRgb('#f4a623'); // amber highlight
    return {
      cx: W / 2, cy: H / 2, R: Math.min(W, H) * 0.44, tilt: 18,
      speed: (2 * Math.PI) / 80,                 // ~80s per rotation — calm
      showGrat: true,
      limb: [104, 150, 120], front: [236, 248, 240],   // dim green-gray -> near white
      baseAlpha: [0.16, 0.82], dotSize: [0.8, 1.8],
      grat: 'rgba(214,240,222,0.12)', gratLine: 0.9,
      rim: 'rgba(' + hl[0] + ',' + hl[1] + ',' + hl[2] + ',0.30)',
      glow: 'rgba(110,200,150,0.16)', glow2: 'rgba(' + hl[0] + ',' + hl[1] + ',' + hl[2] + ',0.14)',
      highlight: { lat: 22, lng: 79, radius: 15 },     // India
      hlColor: hl
    };
  }

  function computeHl(o, dots) {
    if (!o || !o.highlight || !dots) return null;
    var lat = o.highlight.lat, lng = o.highlight.lng, radius = o.highlight.radius;
    var sH = Math.sin(lat * DEG), cH = Math.cos(lat * DEG), cosR = Math.cos(radius * DEG);
    return dots.map(function (p) {
      var cd = sH * Math.sin(p.lat * DEG) + cH * Math.cos(p.lat * DEG) * Math.cos((p.lng - lng) * DEG);
      return cd > cosR;
    });
  }

  function loadDots() {
    return new Promise(function (resolve) {
      var urls = [
        'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-water.png',
        'https://unpkg.com/three-globe/example/img/earth-water.png'
      ];
      var idx = 0;
      (function tryNext() {
        if (idx >= urls.length) { resolve(null); return; }
        var url = urls[idx++], img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
          try {
            var c = document.createElement('canvas');
            c.width = img.naturalWidth; c.height = img.naturalHeight;
            var x = c.getContext('2d', { willReadFrequently: true });
            x.drawImage(img, 0, 0);
            var W = c.width, H = c.height, d = x.getImageData(0, 0, W, H).data, dots = [], latStep = 1.8;
            for (var lat = -88; lat <= 88; lat += latStep) {
              var nLng = Math.max(1, Math.round((360 / latStep) * Math.cos(lat * DEG)));
              for (var k = 0; k < nLng; k++) {
                var lng = -180 + (360 * k) / nLng;
                var px = Math.min(W - 1, Math.max(0, Math.round(((lng + 180) / 360) * W)));
                var py = Math.min(H - 1, Math.max(0, Math.round(((90 - lat) / 180) * H)));
                var i = (py * W + px) * 4, lum = (d[i] + d[i + 1] + d[i + 2]) / 3;
                if (lum < 100) {
                  var phi = lat * DEG, lam = lng * DEG, cp = Math.cos(phi);
                  dots.push({ x: cp * Math.sin(lam), y: Math.sin(phi), z: cp * Math.cos(lam), lat: lat, lng: lng });
                }
              }
            }
            resolve(dots);
          } catch (e) { tryNext(); }
        };
        img.onerror = tryNext;
        img.src = url;
      })();
    });
  }

  function initCanvas(cv) {
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var cssW = cv.clientWidth || parseInt(cv.getAttribute('width'), 10) || 420;
    var cssH = cv.clientHeight || parseInt(cv.getAttribute('height'), 10) || 420;
    cv.width = Math.round(cssW * dpr);
    cv.height = Math.round(cssH * dpr);
    var ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { cv: cv, ctx: ctx, cssW: cssW, cssH: cssH, opts: makeOpts(cssW, cssH), hl: null };
  }

  function draw(g, dots, t, fade) {
    var ctx = g.ctx, cssW = g.cssW, cssH = g.cssH, o = g.opts, hl = g.hl;
    var cx = o.cx, cy = o.cy, R = o.R, theta = t * o.speed;
    var cT = Math.cos(theta), sT = Math.sin(theta), cf = Math.cos(o.tilt * DEG), sf = Math.sin(o.tilt * DEG);
    ctx.clearRect(0, 0, cssW, cssH);
    function proj(x, y, z) {
      var xr = x * cT + z * sT, zr = -x * sT + z * cT, y2 = y * cf - zr * sf, z2 = y * sf + zr * cf;
      return { sx: cx + R * xr, sy: cy - R * y2, z: z2 };
    }
    var grd = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R * 1.4);
    grd.addColorStop(0, o.glow); grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, cssW, cssH);
    if (o.glow2) {
      var g2 = ctx.createRadialGradient(cx, cy, R * 0.15, cx, cy, R * 1.25);
      g2.addColorStop(0, o.glow2); g2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g2; ctx.fillRect(0, 0, cssW, cssH);
    }
    var sph = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, R * 0.05, cx, cy, R);
    sph.addColorStop(0, 'rgba(255,255,255,0.05)');
    sph.addColorStop(0.75, 'rgba(255,255,255,0.012)');
    sph.addColorStop(1, 'rgba(6,40,20,0.18)');
    ctx.fillStyle = sph; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.fill();

    if (o.showGrat) {
      ctx.lineWidth = o.gratLine; ctx.strokeStyle = o.grat;
      for (var lng = -180; lng < 180; lng += 15) {
        ctx.beginPath(); var pen = false;
        for (var lat = -90; lat <= 90; lat += 3) {
          var phi = lat * DEG, lam = lng * DEG, cp = Math.cos(phi);
          var p = proj(cp * Math.sin(lam), Math.sin(phi), cp * Math.cos(lam));
          if (p.z > 0) { if (!pen) { ctx.moveTo(p.sx, p.sy); pen = true; } else ctx.lineTo(p.sx, p.sy); } else pen = false;
        }
        ctx.stroke();
      }
      for (var lat2 = -75; lat2 <= 75; lat2 += 15) {
        ctx.beginPath(); var pen2 = false;
        for (var lng2 = -180; lng2 <= 180; lng2 += 3) {
          var phi2 = lat2 * DEG, lam2 = lng2 * DEG, cp2 = Math.cos(phi2);
          var p2 = proj(cp2 * Math.sin(lam2), Math.sin(phi2), cp2 * Math.cos(lam2));
          if (p2.z > 0) { if (!pen2) { ctx.moveTo(p2.sx, p2.sy); pen2 = true; } else ctx.lineTo(p2.sx, p2.sy); } else pen2 = false;
        }
        ctx.stroke();
      }
    }

    if (dots && fade > 0) {
      var a0 = o.baseAlpha[0], a1 = o.baseAlpha[1], s0 = o.dotSize[0], s1 = o.dotSize[1];
      var lr = o.limb[0], lg = o.limb[1], lb = o.limb[2], fr = o.front[0], fg = o.front[1], fb = o.front[2];
      for (var i = 0; i < dots.length; i++) {
        if (hl && hl[i]) continue;
        var d = dots[i], pp = proj(d.x, d.y, d.z);
        if (pp.z <= 0) continue;
        var z = pp.z;
        var r = (lr + (fr - lr) * z) | 0, gg = (lg + (fg - lg) * z) | 0, b = (lb + (fb - lb) * z) | 0;
        var al = (a0 + (a1 - a0) * z) * fade, sz = s0 + (s1 - s0) * z;
        ctx.fillStyle = 'rgba(' + r + ',' + gg + ',' + b + ',' + al.toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(pp.sx, pp.sy, sz, 0, 6.2832); ctx.fill();
      }
      if (hl && o.hlColor) {
        var hr = o.hlColor[0], hg = o.hlColor[1], hb = o.hlColor[2];
        ctx.save(); ctx.shadowColor = 'rgba(' + hr + ',' + hg + ',' + hb + ',0.9)'; ctx.shadowBlur = 6;
        for (var j = 0; j < dots.length; j++) {
          if (!hl[j]) continue;
          var dd = dots[j], q = proj(dd.x, dd.y, dd.z);
          if (q.z <= 0) continue;
          var zz = q.z, al2 = (0.5 + 0.5 * zz) * fade, sz2 = (s0 + (s1 - s0) * zz) + 0.6;
          ctx.fillStyle = 'rgba(' + hr + ',' + hg + ',' + hb + ',' + al2.toFixed(3) + ')';
          ctx.beginPath(); ctx.arc(q.sx, q.sy, sz2, 0, 6.2832); ctx.fill();
        }
        ctx.restore();
      }
    }

    ctx.lineWidth = 1.2; ctx.strokeStyle = o.rim;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.stroke();
  }

  function start() {
    var cv = document.querySelector('canvas[data-globe-coodu]');
    if (!cv || cv.__cooduGlobe) return;
    cv.__cooduGlobe = true;
    var g = initCanvas(cv);
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var dots = null, dotsReadyT = null, t0 = performance.now();

    loadDots().then(function (d) {
      dots = d; dotsReadyT = (performance.now() - t0) / 1000; g.hl = computeHl(g.opts, dots);
      if (reduce) draw(g, dots, 12, 1);     // static frame, partly rotated, with land
    });

    if (reduce) { draw(g, null, 12, 0); return; }   // graticule now; land fills in above
    (function loop(now) {
      var t = (now - t0) / 1000;
      var fade = dots ? Math.min(1, Math.max(0, (t - (dotsReadyT || t)) / 1.0)) : 0;
      draw(g, dots, t, fade);
      requestAnimationFrame(loop);
    })(t0);
  }

  if (document.readyState !== 'loading') start();
  else document.addEventListener('DOMContentLoaded', start);
})();
