import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ── Cover-fit math ─────────────────────────────────────────────────────────
// Maps a source image/bitmap onto a canvas with object-fit: cover behavior.
function drawCoverFrame(ctx, frame, cw, ch) {
  if (!frame) {
    ctx.fillStyle = '#070d0a';
    ctx.fillRect(0, 0, cw, ch);
    return;
  }

  const fw = frame.width  ?? frame.naturalWidth  ?? cw;
  const fh = frame.height ?? frame.naturalHeight ?? ch;

  if (fw === 0 || fh === 0) return;

  const scale  = Math.max(cw / fw, ch / fh);
  const sw     = fw * scale;
  const sh     = fh * scale;
  const ox     = (cw - sw) / 2;
  const oy     = (ch - sh) / 2;

  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(frame, ox, oy, sw, sh);
}

// ── Hook ───────────────────────────────────────────────────────────────────
// sectionRef   — ref to the outer section element (becomes the ScrollTrigger trigger)
// canvasRef    — ref to the <canvas> element
// frames       — array of preloaded Image | ImageBitmap | null entries
// isReady      — flag from useFramePreloader
// scrollHeight — total px of scroll while pinned (e.g. 1440)
export function useScrollCanvas(sectionRef, canvasRef, frames, isReady, scrollHeight) {
  const rafRef = useRef(null);

  useEffect(() => {
    if (!isReady || !frames || !canvasRef.current || !sectionRef.current) return;

    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d', { alpha: false });

    // ── Frame draw ─────────────────────────────────────────────────────────
    let lastProgress = -1;

    function drawFrame(progress) {
      const clamped = Math.max(0, Math.min(1, progress));
      const idx     = Math.min(
        Math.floor(clamped * (frames.length - 1)),
        frames.length - 1,
      );

      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      drawCoverFrame(ctx, frames[idx], cw, ch);
      lastProgress = progress;
    }

    // ── DPR-aware resize ───────────────────────────────────────────────────
    // Reassigning canvas.width/height clears the canvas, so we must redraw.
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      // setTransform resets the matrix (no compounding on repeated resize)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Redraw the last known frame so canvas isn't blank after resize
      if (lastProgress >= 0) drawFrame(lastProgress);
    }
    resize();
    window.addEventListener('resize', resize);

    // Draw first frame immediately
    drawFrame(0);

    // ── GSAP ScrollTrigger ─────────────────────────────────────────────────
    const st = ScrollTrigger.create({
      trigger:    sectionRef.current,
      start:      'top top',
      end:        `+=${scrollHeight}`,
      pin:        true,
      pinSpacing: true,
      scrub:      0.5,
      onUpdate: (self) => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(self.progress));
      },
    });

    // Refresh after mount so ScrollTrigger recalculates all offsets
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      st.kill();
    };
  }, [isReady, frames, scrollHeight]);
}
