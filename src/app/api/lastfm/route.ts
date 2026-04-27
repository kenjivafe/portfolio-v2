import { NextResponse } from 'next/server';

export async function GET() {
  const LASTFM_USER = "kenjivafe";
  const LASTFM_API_KEY = "30f5d272443c3274143006142c935cea";
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;

  try {
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error('Last.fm fetch failed');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch Last.fm stats' }, { status: 500 });
  }
}
