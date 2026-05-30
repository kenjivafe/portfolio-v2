'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useLanyard } from '@/hooks/use-lanyard';
import { Antigravity } from '@lobehub/icons';
import styles from './lanyard.module.css';

const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.305c-.215.352-.676.463-1.028.249-2.813-1.718-6.353-2.106-10.523-1.155-.404.091-.812-.16-.903-.564-.092-.404.16-.812.564-.903 4.564-1.042 8.49-.6 11.642 1.325.352.215.463.676.249 1.028zm1.472-3.253c-.271.44-.848.578-1.288.307-3.218-1.977-8.125-2.548-11.93-1.393-.497.151-1.024-.132-1.176-.628-.151-.497.132-1.024.628-1.176 4.348-1.32 9.757-.678 13.459 1.593.44.271.578.848.307 1.288zm.139-3.393c-3.856-2.29-10.222-2.5-13.938-1.371-.592.18-1.218-.155-1.398-.747-.18-.592.155-1.218.747-1.398 4.269-1.297 11.306-1.053 15.74 1.579.532.316.705 1.001.389 1.532-.316.532-1.001.705-1.532.389z" />
  </svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.091 14.091 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.23 10.23 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

interface WakaData {
  text: string;
  editor: string;
}

interface LastFMData {
  song: string;
  artist: string;
  nowPlaying: boolean;
}

interface GameData {
  name: string;
}

function getLastGameSnapshot() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(LAST_GAME_STORAGE_KEY);
}

function subscribeToLastGameStore(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener('last-game-played-change', onStoreChange);

  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener('last-game-played-change', onStoreChange);
  };
}

function parseLastGame(snapshot: string | null): GameData | null {
  if (!snapshot) return null;

  try {
    const parsed = JSON.parse(snapshot) as Partial<GameData>;
    return typeof parsed.name === 'string' ? { name: parsed.name } : null;
  } catch {
    return null;
  }
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg className={`${styles['animateSpin']} ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

const LAST_GAME_STORAGE_KEY = 'portfolio:last-game-played';

export default function LanyardStatus() {
  const { data } = useLanyard();
  const [wakaData, setWakaData] = useState<WakaData | null>(null);
  const [wakaLoading, setWakaLoading] = useState(true);
  const [wakaError, setWakaError] = useState(false);
  const [lastFM, setLastFM] = useState<LastFMData | null>(null);
  const lastGameSnapshot = useSyncExternalStore(
    subscribeToLastGameStore,
    getLastGameSnapshot,
    () => null
  );

  useEffect(() => {
    const fetchWaka = async () => {
      try {
        setWakaLoading(true);
        setWakaError(false);
        const res = await fetch('/api/wakatime');
        if (!res.ok) throw new Error('WakaTime API failed');
        const json = await res.json();
        if (json.data) {
          const stats = json.data;
          const text = stats.grand_total?.text || '0 mins';
          const topEditor = stats.editors?.[0]?.name || 'Antigravity';
          setWakaData({ text, editor: topEditor });
        } else {
          setWakaData({ text: '0 mins', editor: 'Antigravity' });
        }
      } catch (err) {
        console.error("WakaTime error:", err);
        setWakaError(true);
      } finally {
        setWakaLoading(false);
      }
    };

    const fetchLastFM = async () => {
      try {
        const res = await fetch('/api/lastfm');
        if (!res.ok) throw new Error('Last.fm API failed');
        const json = await res.json();
        if (json.recenttracks?.track?.[0]) {
          const track = json.recenttracks.track[0];
          setLastFM({
            song: track.name,
            artist: track.artist['#text'],
            nowPlaying: track['@attr']?.nowplaying === 'true'
          });
        }
      } catch (err) {
        console.error("Last.fm error:", err);
      }
    };

    fetchWaka();
    fetchLastFM();
    const interval = setInterval(() => {
      fetchWaka();
      fetchLastFM();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const gameActivity = data?.activities.find(a => a.type === 0) || data?.activities.find(a => a.name !== "Custom Status" && a.name !== "Spotify" && a.type !== 4);
  const isPlayingGame = !!gameActivity;
  const lastGame = parseLastGame(lastGameSnapshot);
  const displayedGame = isPlayingGame ? gameActivity : lastGame;

  useEffect(() => {
    if (!gameActivity?.name) return;

    const nextLastGame = { name: gameActivity.name };

    try {
      window.localStorage.setItem(LAST_GAME_STORAGE_KEY, JSON.stringify(nextLastGame));
      window.dispatchEvent(new Event('last-game-played-change'));
    } catch (err) {
      console.error("Last game save error:", err);
    }
  }, [gameActivity?.name]);

  return (
    <div className={styles['status-container']}>
      {/* Antigravity */}
      <div className={styles['status-item']}>
        <div className={styles['status-icon-wrap']}>
          <Antigravity.Color size={24} />
        </div>
        <div className={styles['status-text']}>
          <div className={styles['status-top']}>
            <span className={styles['status-title']}>Last active in {wakaData?.editor || 'Antigravity'}</span>
            <span className={styles['status-dot-sep']}>•</span>
            <span className={styles['status-time']}>Just now</span>
          </div>
          <div className={`${styles['status-detail']} ${styles['coding-status']}`}>
            {wakaLoading ? (
              <span className={styles['loading-state']}>
                <LoadingSpinner className={styles['spinner']} />
                Fetching stats...
              </span>
            ) : wakaError ? (
              <span className={styles['error-state']}>Unable to load stats</span>
            ) : (
              <>{wakaData?.text} coded today</>
            )}
          </div>
        </div>
      </div>

      {/* Music */}
      <div className={styles['status-item']}>
        <div className={styles['status-icon-wrap']}>
          <SpotifyIcon className={`${styles['status-icon']} ${lastFM?.nowPlaying ? styles['icon-spotify'] : ''}`} />
        </div>
        <div className={styles['status-text']}>
          <div className={styles['status-top']}>
            <span className={styles['status-title']}>Music</span>
            {lastFM && (
              <>
                <span className={styles['status-dot-sep']}>•</span>
                <span className={styles['status-time']}>{lastFM.nowPlaying ? 'Listening' : 'Last played'}</span>
              </>
            )}
          </div>
          <div className={styles['status-detail']}>
            {lastFM ? `${lastFM.song} — ${lastFM.artist}` : 'Not listening'}
          </div>
        </div>
      </div>

      {/* Games */}
      <div className={styles['status-item']}>
        <div className={styles['status-icon-wrap']}>
          <DiscordIcon className={`${styles['status-icon']} ${isPlayingGame ? styles['icon-activity'] : ''}`} />
        </div>
        <div className={styles['status-text']}>
          <div className={styles['status-top']}>
            <span className={styles['status-title']}>Games</span>
            {displayedGame && (
              <>
                <span className={styles['status-dot-sep']}>•</span>
                <span className={styles['status-time']}>{isPlayingGame ? 'Playing' : 'Last played'}</span>
              </>
            )}
          </div>
          <div className={styles['status-detail']}>
            {displayedGame ? displayedGame.name : 'No game activity yet'}
          </div>
        </div>
      </div>
    </div>
  );
}
