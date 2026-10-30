import { NextRequest, NextResponse } from 'next/server';
import { CulturalProfile } from '@/lib/types';
import { runKinshipAgent } from '@/lib/agentOrchestrator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile = body.profile as CulturalProfile;

    if (!profile || !profile.primaryInterest) {
      return NextResponse.json(
        { success: false, error: 'A primary cultural interest or name is required.' },
        { status: 400 }
      );
    }

    const result = await runKinshipAgent(profile);

    return NextResponse.json({
      success: true,
      moment: result.moment,
      workflowSteps: result.steps,
      isDemonstration: result.isDemonstration,
      qlooLiveActive: result.qlooLiveActive
    });
  } catch (error: unknown) {
    console.error('Error running Kinship agent:', error);
    const errMessage = error instanceof Error ? error.message : 'Unknown generation failure';

    return NextResponse.json(
      {
        success: false,
        error: `Could not complete the connection moment: ${errMessage}`
      },
      { status: 500 }
    );
  }
}
