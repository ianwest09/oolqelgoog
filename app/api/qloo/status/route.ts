import { NextResponse } from 'next/server';
import { isQlooConfigured } from '@/lib/qlooClient';
import { isGeminiConfigured } from '@/lib/geminiClient';

export async function GET() {
  const qlooLive = isQlooConfigured();
  const geminiLive = isGeminiConfigured();

  return NextResponse.json({
    qlooLive,
    geminiLive,
    mode: qlooLive ? 'live' : 'demonstration',
    message: qlooLive
      ? 'Live Qloo Taste Intelligence API connected.'
      : 'DEMONSTRATION MODE — sample results; live Qloo integration is not active.'
  });
}
