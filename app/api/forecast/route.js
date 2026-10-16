import { NextResponse } from 'next/server';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL ?? 'http://localhost:8000';

export async function POST(req) {
  let upstream;
  try {
    upstream = await fetch(`${ML_SERVICE_URL}/forecast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: await req.text(),
    });
  } catch {
    return NextResponse.json(
      {
        detail: {
          code: 'ML_SERVICE_DOWN',
          message:
            'The forecast service is not running. Start it with: uvicorn main:app --reload --port 8000',
        },
      },
      { status: 503 }
    );
  }

  const json = await upstream.json();
  return NextResponse.json(json, { status: upstream.status });
}
