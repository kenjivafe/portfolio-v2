'use client';

import { useEffect, useState } from 'react';

const DISCORD_ID = "647059646179180554";

export interface LanyardData {
  spotify: {
    song: string;
    artist: string;
  } | null;
  activities: Array<{
    name: string;
    type: number;
    details?: string;
    state?: string;
    assets?: {
      large_text?: string;
    };
  }>;
  discord_status: string;
}

export function useLanyard() {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanyard = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error("Lanyard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLanyard();
    const interval = setInterval(fetchLanyard, 30000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading };
}
