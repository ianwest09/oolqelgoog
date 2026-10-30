import { QlooEntity, QlooInsight } from './types';
import { DEMO_QLOO_ENTITIES, DEMO_QLOO_INSIGHTS } from './demonstrationData';

const QLOO_BASE_URL = 'https://hackathon.api.qloo.com';

export interface QlooSearchResult {
  isLive: boolean;
  entities: QlooEntity[];
  error?: string;
  source: 'live_qloo_api' | 'demonstration_fixtures' | 'general_fallback';
}

export interface QlooInsightsResult {
  isLive: boolean;
  insights: QlooInsight[];
  error?: string;
  source: 'live_qloo_api' | 'demonstration_fixtures' | 'general_fallback';
}

export function isQlooConfigured(): boolean {
  const key = process.env.QLOO_API_KEY;
  return Boolean(key && key.trim() !== '' && key !== 'MY_QLOO_API_KEY');
}

/**
 * Entity Resolution via Qloo Search API (/search)
 * Finds cultural entities and retains their verified ID, name, category, and metadata.
 */
export async function resolveQlooEntity(query: string): Promise<QlooSearchResult> {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return { isLive: false, entities: [], source: 'general_fallback', error: 'Empty query' };
  }

  const apiKey = process.env.QLOO_API_KEY;
  const hasLiveKey = isQlooConfigured();

  if (!hasLiveKey) {
    // Demonstration mode fallback: Look up in demo fixtures
    const normalized = cleanQuery.toLowerCase();
    const demoMatch = Object.entries(DEMO_QLOO_ENTITIES).find(([k]) => normalized.includes(k) || k.includes(normalized));

    if (demoMatch) {
      return {
        isLive: false,
        entities: [demoMatch[1]],
        source: 'demonstration_fixtures'
      };
    }

    // Generic demonstration entity
    return {
      isLive: false,
      entities: [{
        id: `demo:entity:${encodeURIComponent(cleanQuery.toLowerCase().replace(/\s+/g, '_'))}`,
        name: cleanQuery,
        category: 'cultural_interest',
        description: 'Demonstration cultural reference (live Qloo API key not configured)',
        verified: false
      }],
      source: 'demonstration_fixtures'
    };
  }

  // Live Qloo API call
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const searchUrl = new URL(`${QLOO_BASE_URL}/search`);
    searchUrl.searchParams.append('query', cleanQuery);

    const response = await fetch(searchUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': apiKey as string
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      return {
        isLive: false,
        entities: [],
        error: `Qloo API search returned HTTP ${response.status}: ${errText.slice(0, 100)}`,
        source: 'general_fallback'
      };
    }

    const data = await response.json();
    const rawResults = data.results || data.data || (Array.isArray(data) ? data : []);

    const entities: QlooEntity[] = rawResults.slice(0, 5).map((item: Record<string, unknown>) => {
      const id = String(item.id || item.entity_id || item.urn || '');
      const name = String(item.name || item.title || cleanQuery);
      const category = String(item.category || item.type || 'cultural');
      const subculture = item.subculture ? String(item.subculture) : undefined;
      const popularity = typeof item.popularity === 'number' ? item.popularity : undefined;

      return {
        id,
        name,
        category,
        subculture,
        popularity,
        description: typeof item.description === 'string' ? item.description : undefined,
        verified: Boolean(id)
      };
    });

    return {
      isLive: true,
      entities,
      source: 'live_qloo_api'
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown network failure';
    return {
      isLive: false,
      entities: [],
      error: `Failed to connect to Qloo search endpoint: ${message}`,
      source: 'general_fallback'
    };
  }
}

/**
 * Taste Exploration via Qloo Insights API (/v2/insights)
 * Requests supported cross-domain taste recommendations using verified entity IDs as signals.
 */
export async function getQlooInsights(seedEntity: QlooEntity): Promise<QlooInsightsResult> {
  const apiKey = process.env.QLOO_API_KEY;
  const hasLiveKey = isQlooConfigured();

  if (!hasLiveKey || !seedEntity.verified || seedEntity.id.startsWith('demo:')) {
    // Demonstration mode fallback
    const demoInsights = DEMO_QLOO_INSIGHTS[seedEntity.id];
    if (demoInsights && demoInsights.length > 0) {
      return {
        isLive: false,
        insights: demoInsights,
        source: 'demonstration_fixtures'
      };
    }

    // Return synthetic demonstration insight
    return {
      isLive: false,
      insights: [
        {
          id: `demo:rec:${encodeURIComponent(seedEntity.name.toLowerCase().replace(/\s+/g, '_'))}_shared`,
          name: `${seedEntity.name} (Demonstration Cultural Companion)`,
          category: seedEntity.category || 'cultural_melody',
          relationship: `Demonstration taste pairing linked to ${seedEntity.name}`,
          seedEntityName: seedEntity.name,
          affinityScore: 0.90,
          isDemonstration: true
        }
      ],
      source: 'demonstration_fixtures'
    };
  }

  // Live Qloo /v2/insights API call
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const insightsUrl = new URL(`${QLOO_BASE_URL}/v2/insights`);
    insightsUrl.searchParams.append('signal.interests.entities', seedEntity.id);

    const response = await fetch(insightsUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': apiKey as string
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      return {
        isLive: false,
        insights: [],
        error: `Qloo Insights API returned HTTP ${response.status}: ${errText.slice(0, 100)}`,
        source: 'general_fallback'
      };
    }

    const data = await response.json();
    const rawEntities = data.results || data.insights || data.entities || (Array.isArray(data) ? data : []);

    const insights: QlooInsight[] = rawEntities.slice(0, 5).map((item: Record<string, unknown>, idx: number) => {
      const id = String(item.id || item.entity_id || `insight_${idx}`);
      const name = String(item.name || item.title || 'Related Cultural Item');
      const category = String(item.category || item.type || 'cultural');
      const affinityScore = typeof item.affinity === 'number' 
        ? item.affinity 
        : typeof item.score === 'number' 
          ? item.score 
          : undefined;

      return {
        id,
        name,
        category,
        relationship: `Qloo Taste Graph affinity linked to ${seedEntity.name}`,
        seedEntityName: seedEntity.name,
        affinityScore,
        isDemonstration: false
      };
    });

    return {
      isLive: true,
      insights,
      source: 'live_qloo_api'
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown network failure';
    return {
      isLive: false,
      insights: [],
      error: `Failed to fetch Qloo insights: ${message}`,
      source: 'general_fallback'
    };
  }
}
