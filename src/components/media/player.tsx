import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { Episode, Title } from "@/lib/types";
import { formatClock, parseYoutubeId } from "@/lib/utils";
import { useLibrary } from "@/lib/library-store";

export function Player({
  title,
  episodeId,
}: {
  title: Title;
  episodeId?: string;
}) {
  const episodes = title.episodes;
  const currentEpisode: Episode | undefined =
    episodes.find((e) => e.id === episodeId) ?? episodes[0];
  const src = currentEpisode?.videoUrl || title.videoUrl;
  const label = currentEpisode
    ? `${title.name} · S${currentEpisode.season} E${currentEpisode.episode}`
    : title.name;
  const youtubeId = parseYoutubeId(src);
  const next = currentEpisode
    ? episodes.find(
        (e) =>
          e.season === currentEpisode.season &&
          e.episode === currentEpisode.episode + 1,
      ) ??
      episodes.find((e) => e.season === currentEpisode.season + 1 && e.episode === 1)
    : undefined;

  if (youtubeId) {
    return (
      <YoutubePlayer
        title={title}
        youtubeId={youtubeId}
        label={label}
        episodeName={currentEpisode?.name}
        next={next}
      />
    );
  }

  return (
    <Html5Player
      title={title}
      src={src}
      label={label}
      episodeId={currentEpisode?.id}
      episodeName={currentEpisode?.name}
      next={next}
    />
  );
}

function Chrome({
  titleId,
  label,
  kicker,
  next,
}: {
  titleId: string;
  label: string;
  kicker?: string;
  next?: Episode;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-bg/80 to-transparent">
      <div className="pointer-events-auto flex items-center gap-3 px-4 py-4 sm:px-6">
        <Link
          to="/title/$id"
          params={{ id: titleId }}
          className="grid size-11 place-items-center rounded-full bg-bg/40 text-fg"
          aria-label="Back"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold sm:text-base">{label}</p>
          {kicker ? <p className="text-xs text-muted">{kicker}</p> : null}
        </div>
        {next ? (
          <Link
            to="/watch/$id"
            params={{ id: titleId }}
            search={{ e: next.id }}
            className="ml-auto hidden h-9 items-center rounded-md bg-fg/15 px-3 text-xs font-semibold sm:inline-flex"
          >
            Next episode
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function YoutubePlayer({
  title,
  youtubeId,
  label,
  episodeName,
  next,
}: {
  title: Title;
  youtubeId: string;
  label: string;
  episodeName?: string;
  next?: Episode;
}) {
  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3`;
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-bg">
      <iframe
        title={label}
        src={src}
        className="absolute inset-0 size-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <Chrome
        titleId={title.id}
        label={label}
        kicker={episodeName ? episodeName : "Official trailer"}
        next={next}
      />
    </div>
  );
}

function Html5Player({
  title,
  src,
  label,
  episodeId,
  episodeName,
  next,
}: {
  title: Title;
  src: string;
  label: string;
  episodeId?: string;
  episodeName?: string;
  next?: Episode;
}) {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<number | null>(null);
  const setProgress = useLibrary((s) => s.setProgress);
  const saved = useLibrary((s) => s.progress[title.id]);

  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controls, setControls] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [failed, setFailed] = useState(false);
  const [activeSrc, setActiveSrc] = useState(src);

  useEffect(() => {
    setActiveSrc(src);
    setFailed(false);
  }, [src]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const resume = saved && (!episodeId || saved.episodeId === episodeId);
    if (resume && saved.position > 8) {
      v.currentTime = saved.position;
    }
    void v.play().catch(() => setPlaying(false));
  }, [activeSrc]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  function bumpControls() {
    setControls(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setControls(false);
    }, 2800);
  }

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
    bumpControls();
  }

  function persist() {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress(title.id, {
      position: v.currentTime,
      duration: v.duration,
      episodeId,
      updatedAt: Date.now(),
    });
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const v = videoRef.current;
      if (!v) return;
      if (e.key === " " || e.key === "k") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "f") {
        void toggleFs();
      } else if (e.key === "m") {
        v.muted = !v.muted;
        setMuted(v.muted);
      } else if (e.key === "ArrowRight") {
        v.currentTime = Math.min(v.duration || 0, v.currentTime + 10);
      } else if (e.key === "ArrowLeft") {
        v.currentTime = Math.max(0, v.currentTime - 10);
      } else if (e.key === "Escape") {
        void navigate({ to: "/title/$id", params: { id: title.id } });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  async function toggleFs() {
    const root = videoRef.current?.parentElement;
    if (!root) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await root.requestFullscreen().catch(() => undefined);
  }

  const pct = duration > 0 ? (time / duration) * 100 : 0;

  return (
    <div
      className="relative h-dvh w-full overflow-hidden bg-bg"
      onMouseMove={bumpControls}
      onTouchStart={bumpControls}
    >
      <video
        ref={videoRef}
        src={activeSrc}
        className="size-full object-contain bg-bg"
        autoPlay
        playsInline
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => {
          setPlaying(false);
          persist();
        }}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          setTime(v.currentTime);
          if (Math.floor(v.currentTime) % 5 === 0) persist();
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onEnded={() => {
          persist();
          if (next) {
            void navigate({
              to: "/watch/$id",
              params: { id: title.id },
              search: { e: next.id },
            });
          }
        }}
        onError={() => setFailed(true)}
      />

      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/50 transition-opacity duration-200 ${
          controls ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`absolute inset-x-0 top-0 z-10 transition-[opacity,transform] duration-200 ${
          controls ? "opacity-100" : "pointer-events-none opacity-0 -translate-y-2"
        }`}
      >
        <Chrome titleId={title.id} label={label} kicker={episodeName} next={undefined} />
      </div>

      {!playing && controls ? (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 z-10 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-play text-play-fg"
          aria-label="Play"
        >
          <Play className="size-8 fill-current" />
        </button>
      ) : null}

      {failed ? (
        <div className="absolute inset-0 z-20 grid place-items-center bg-bg px-6 text-center">
          <div>
            <p className="font-display text-2xl">This title could not start.</p>
            <p className="mt-2 text-muted">Try another film, or come back in a moment.</p>
            <Link
              to="/title/$id"
              params={{ id: title.id }}
              className="mt-6 inline-flex h-11 items-center rounded-md bg-play px-5 font-semibold text-play-fg"
            >
              Back to details
            </Link>
          </div>
        </div>
      ) : null}

      <div
        className={`absolute inset-x-0 bottom-0 z-10 px-4 pb-5 transition-[opacity,transform] duration-200 sm:px-6 ${
          controls ? "opacity-100" : "pointer-events-none opacity-0 translate-y-2"
        }`}
      >
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={time}
          aria-label="Seek"
          onChange={(e) => {
            const v = videoRef.current;
            const nextT = Number(e.target.value);
            if (v) v.currentTime = nextT;
            setTime(nextT);
          }}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-fg/20 accent-accent"
          style={{
            background: `linear-gradient(to right, var(--color-accent) ${pct}%, rgb(245 245 245 / 0.2) ${pct}%)`,
          }}
        />
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            className="grid size-11 place-items-center"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <Pause className="size-5 fill-current" />
            ) : (
              <Play className="size-5 fill-current" />
            )}
          </button>
          <button
            type="button"
            className="grid size-11 place-items-center"
            onClick={() => {
              const v = videoRef.current;
              if (!v) return;
              v.muted = !v.muted;
              setMuted(v.muted);
            }}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </button>
          <span className="text-xs tabular-nums text-muted">
            {formatClock(time)} / {formatClock(duration)}
          </span>
          <span className="ml-auto" />
          {next ? (
            <Link
              to="/watch/$id"
              params={{ id: title.id }}
              search={{ e: next.id }}
              className="hidden h-9 items-center rounded-md bg-fg/15 px-3 text-xs font-semibold sm:inline-flex"
            >
              Next episode
            </Link>
          ) : null}
          <button
            type="button"
            className="grid size-11 place-items-center"
            onClick={() => void toggleFs()}
            aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {fullscreen ? <Minimize className="size-5" /> : <Maximize className="size-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
