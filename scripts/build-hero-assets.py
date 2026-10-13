"""
build-hero-assets.py — turn a raw talking-to-camera intro into the hero assets.

    python -I scripts/build-hero-assets.py <intro.mp4> [--crop W:H:X:Y] [--seconds 10]

Outputs (relative to the project root):
    public/hero/hero.mp4     H.264 yuv420p, CRF 24, AAC 96k, +faststart
    public/hero/hero.webm    VP9 CRF 36, Opus 80k
    public/hero/poster.webp  first frame of the loop (video poster / LCP)
    public/portrait-bust.webp  480x600 head-to-shirt crop of the sharpest frame
    public/og.jpg            1200x630 social card

Pipeline
    1. Detect the person (non-white pixels across sampled frames) and crop a
       768:960 (4:5) box around them, head to toe, centred. Or pass --crop.
    2. Whiten the backdrop with colorlevels so it multiplies away on the page.
    3. Seamless loop: the clip plays from 0.5 s to T and its last 0.5 s
       cross-fades into the first 0.5 s (ffmpeg xfade). The audio is cross-faded
       the same way, sample-accurately in numpy. Nothing is stretched or retimed,
       so lips stay in sync.

Requires ffmpeg on PATH, or the binary bundled with `pip install imageio-ffmpeg`.
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_W, OUT_H = 768, 960
FADE = 0.5
SR = 48000
WHITEN = "colorlevels=rimax=0.98:gimax=0.98:bimax=0.98"


def ffmpeg_bin() -> str:
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg  # type: ignore

        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("ffmpeg not found. Install it or `pip install imageio-ffmpeg`.")


FF = ffmpeg_bin()


def run(args: list[str], **kw) -> subprocess.CompletedProcess:
    return subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-y", *args], check=True, **kw)


def probe(src: str) -> tuple[int, int, float, float]:
    """Return width, height, fps, duration by parsing ffmpeg's banner."""
    p = subprocess.run([FF, "-hide_banner", "-i", src], capture_output=True, text=True)
    import re

    info = p.stderr
    dur = re.search(r"Duration: (\d+):(\d+):([\d.]+)", info)
    vid = re.search(r"Video: .*?, (\d{3,5})x(\d{3,5}).*?, ([\d.]+) fps", info)
    if not dur or not vid:
        sys.exit("Could not probe " + src)
    h, m, s = dur.groups()
    return int(vid[1]), int(vid[2]), float(vid[3]), int(h) * 3600 + int(m) * 60 + float(s)


def gray_frames(src: str, w: int, h: int, n: int, dur: float) -> np.ndarray:
    """Sample n grayscale frames evenly across the clip."""
    fps = n / max(dur, 0.1)
    p = run(["-i", src, "-vf", f"fps={fps:.4f},format=gray", "-f", "rawvideo", "-"], capture_output=True)
    buf = np.frombuffer(p.stdout, np.uint8)
    return buf[: (buf.size // (w * h)) * w * h].reshape(-1, h, w)


def detect_crop(frames: np.ndarray, w: int, h: int) -> tuple[int, int, int, int]:
    """Bounding box of the person (anything darker than the backdrop), padded to 4:5."""
    mask = (frames < 200).any(axis=0)
    rows, cols = np.where(mask.any(axis=1))[0], np.where(mask.any(axis=0))[0]
    if rows.size == 0:
        return w // 2 - h * 4 // 10, 0, h * 4 // 5, h
    top, bottom = rows[0], rows[-1]
    # horizontal centre = centroid of the person's columns (robust to stray hands)
    col_weight = mask.sum(axis=0).astype(float)
    cx = int((col_weight * np.arange(w)).sum() / col_weight.sum())
    pad = int((bottom - top) * 0.04)
    ch = min(h, (bottom - top) + 2 * pad)
    ch -= ch % 2
    cw = int(ch * OUT_W / OUT_H)
    cw -= cw % 2
    y = max(0, min(h - ch, top - pad))
    x = max(0, min(w - cw, cx - cw // 2))
    return cw, ch, x, y


def read_audio(src: str, t: float) -> np.ndarray:
    p = run(["-i", src, "-t", f"{t:.6f}", "-vn", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True)
    return np.frombuffer(p.stdout, np.float32).reshape(-1, 2).copy()


def loop_audio(a: np.ndarray, t: float) -> np.ndarray:
    """Body = [FADE, T); its last FADE seconds equal-power fade into [0, FADE)."""
    n = int(round(FADE * SR))
    total = int(round(t * SR))
    if a.shape[0] < total:
        a = np.vstack([a, np.zeros((total - a.shape[0], 2), np.float32)])
    body = a[n:total].copy()
    head = a[:n]
    ramp = np.linspace(0.0, 1.0, n, dtype=np.float32)[:, None]
    fade_out, fade_in = np.cos(ramp * np.pi / 2), np.sin(ramp * np.pi / 2)
    body[-n:] = body[-n:] * fade_out + head * fade_in
    return np.clip(body, -1.0, 1.0)


def write_wav(path: str, a: np.ndarray) -> None:
    pcm = (a * 32767).astype("<i2")
    with wave.open(path, "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(pcm.tobytes())


def sharpest_index(frames: np.ndarray, box: tuple[int, int, int, int]) -> int:
    x, y, w, h = box
    best, idx = -1.0, 0
    for i, f in enumerate(frames):
        roi = f[y : y + h, x : x + w].astype(np.float32)
        lap = roi[1:-1, 1:-1] * 4 - roi[:-2, 1:-1] - roi[2:, 1:-1] - roi[1:-1, :-2] - roi[1:-1, 2:]
        v = float(lap.var())
        if v > best:
            best, idx = v, i
    return idx


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--crop", help="W:H:X:Y override")
    ap.add_argument("--seconds", type=float, default=10.0)
    args = ap.parse_args()

    src = os.path.abspath(args.src)
    w, h, fps, dur = probe(src)
    # whole frames only, so audio and video lengths agree exactly
    t = int(min(dur, args.seconds) * fps) / fps
    print(f"source {w}x{h} @ {fps}fps, {dur:.2f}s -> using {t:.3f}s")

    frames = gray_frames(src, w, h, 24, dur)
    if args.crop:
        cw, ch, cx, cy = (int(v) for v in args.crop.split(":"))
    else:
        cw, ch, cx, cy = detect_crop(frames, w, h)
    print(f"crop={cw}:{ch}:{cx}:{cy}")

    tmp = tempfile.mkdtemp()
    wav = os.path.join(tmp, "loop.wav")
    write_wav(wav, loop_audio(read_audio(src, t), t))

    vf = (
        f"[0:v]crop={cw}:{ch}:{cx}:{cy},scale={OUT_W}:{OUT_H}:flags=lanczos,{WHITEN},setsar=1,split[a][b];"
        f"[a]trim={FADE}:{t:.6f},setpts=PTS-STARTPTS,settb=AVTB,fps={fps:g}[body];"
        f"[b]trim=0:{FADE},setpts=PTS-STARTPTS,settb=AVTB,fps={fps:g}[head];"
        f"[body][head]xfade=transition=fade:duration={FADE}:offset={t - 2 * FADE:.6f},format=yuv420p[v]"
    )
    hero = os.path.join(ROOT, "public", "hero")
    os.makedirs(hero, exist_ok=True)
    common = ["-i", src, "-i", wav, "-filter_complex", vf, "-map", "[v]", "-map", "1:a", "-shortest"]
    run([*common, "-c:v", "libx264", "-crf", "24", "-preset", "slow", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", os.path.join(hero, "hero.mp4")])
    print("wrote public/hero/hero.mp4")
    run([*common, "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1",
         "-c:a", "libopus", "-b:a", "80k", os.path.join(hero, "hero.webm")])
    print("wrote public/hero/hero.webm")
    # Poster = first frame of the finished loop, so the swap to video is invisible.
    run(["-i", os.path.join(hero, "hero.mp4"), "-frames:v", "1", "-c:v", "libwebp", "-quality", "72",
         os.path.join(hero, "poster.webp")])
    print("wrote public/hero/poster.webp")

    # Portrait: head-to-shirt crop (top ~45 % of the person) from the sharpest frame.
    full = (frames < 200).any(axis=0)
    rows = np.where(full.any(axis=1))[0]
    top, bottom = (rows[0], rows[-1]) if rows.size else (0, h)
    head_rows = full[top : top + max(1, (bottom - top) // 10)]
    hc = np.where(head_rows.any(axis=0))[0]
    hx = int(hc.mean()) if hc.size else w // 2
    ph = int((bottom - top) * 0.42)
    ph -= ph % 2
    pw = int(ph * 480 / 600)
    pw -= pw % 2
    py = max(0, top - int(ph * 0.08))
    px = max(0, min(w - pw, hx - pw // 2))
    best = sharpest_index(frames, (px, py, pw, ph))
    ts = best * dur / len(frames)
    run(["-ss", f"{ts:.3f}", "-i", src, "-frames:v", "1", "-vf",
         f"crop={pw}:{ph}:{px}:{py},scale=480:600:flags=lanczos,{WHITEN}",
         "-c:v", "libwebp", "-quality", "86", os.path.join(ROOT, "public", "portrait-bust.webp")])
    print(f"wrote public/portrait-bust.webp (frame @ {ts:.2f}s)")

    # OG card: whitened frame, person centred, 1200x630.
    oh = h
    ow = int(oh * 1200 / 630)
    if ow > w:
        ow, oh = w, int(w * 630 / 1200)
    ox = max(0, min(w - ow, cx + cw // 2 - ow // 2))
    run(["-ss", f"{ts:.3f}", "-i", src, "-frames:v", "1", "-vf",
         f"crop={ow}:{oh}:{ox}:0,scale=1200:630:flags=lanczos,{WHITEN}",
         "-q:v", "3", os.path.join(ROOT, "public", "og.jpg")])
    print("wrote public/og.jpg")
    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
