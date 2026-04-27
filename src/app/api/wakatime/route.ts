import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.WAKATIME_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
  }

  // Fetch summaries for today for real-time data
  const url = `https://wakatime.com/api/v1/users/current/summaries?start=today&end=today`;

  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(apiKey).toString('base64')}`
      },
      next: { revalidate: 60 } // Cache for 1 minute
    });

    if (!res.ok) {
      console.error(`WakaTime API returned ${res.status}`);
      throw new Error('WakaTime fetch failed');
    }

    const json = await res.json();
    const todayData = json.data?.[0];

    if (!todayData) {
      return NextResponse.json({ data: { grand_total: { text: '0 mins' }, editors: [] } });
    }

    return NextResponse.json({
      data: {
        grand_total: todayData.grand_total,
        editors: todayData.editors
      }
    });
  } catch (err: any) {
    console.error("Server-side WakaTime error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
