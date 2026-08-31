import Groq from 'groq-sdk';
import type { Mission, Guideline } from './types';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

// Modèle gratuit performant sur Groq pour du texte structuré
// (llama-3.3-70b-versatile a été retiré du catalogue Groq le 17/06/2026)
const MODEL = 'openai/gpt-oss-120b';

/**
 * Résume le site de l'entreprise cible (étape 1 du formulaire).
 * `rawContent` = texte déjà extrait du site par votre étape de scraping.
 */
export async function summarizeCompany(companyUrl: string, rawContent: string): Promise<string> {
  if (!rawContent || rawContent.trim().length < 50) {
    return `Synthèse non disponible : le contenu du site ${companyUrl} n'a pas pu être récupéré automatiquement (site protégé contre le scraping, contenu généré en JavaScript, ou site inaccessible). Le manager peut renseigner manuellement le contexte de l'entreprise.`;
  }

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{
      role: 'user',
      content: `Voici le contenu extrait du site ${companyUrl} :\n\n${rawContent}\n\nRédige une synthèse factuelle en 6-8 lignes maximum à destination d'un manager de transition qui doit prendre ses fonctions rapidement dans cette entreprise : activité, taille approximative, positionnement marché, signaux notables (croissance, tensions, actualité récente). Base-toi UNIQUEMENT sur le contenu fourni ci-dessus, sans jamais indiquer que tu ne peux pas accéder à un lien — le contenu t'a déjà été fourni en texte. Pas de style commercial, uniquement des faits utiles.`
    }],
    max_tokens: 600,
  });
  return completion.choices[0]?.message?.content ?? '';
}

/**
 * Déduit le secteur d'activité à partir de la synthèse déjà générée sur l'entreprise.
 */
export async function detectSector(companySummary: string): Promise<string> {
  if (!companySummary || companySummary.startsWith('Synthèse non disponible')) return '';

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{
      role: 'user',
      content: `Voici une synthèse d'entreprise :\n\n${companySummary}\n\nDonne UNIQUEMENT le secteur d'activité en 2-4 mots (ex: "distribution alimentaire", "SaaS B2B RH", "industrie automobile"). Rien d'autre.`
    }],
    max_tokens: 20,
  });
  return completion.choices[0]?.message?.content?.trim() ?? '';
}

/**
 * Recherche web ciblée sur le secteur d'activité — donne à l'IA du contexte
 * de marché réel (tendances 2026, enjeux) au lieu de rester limitée au site
 * de l'entreprise seul. Utilise Tavily (palier gratuit, sans CB).
 */
export async function searchSectorContext(sector: string): Promise<string> {
  if (!process.env.TAVILY_API_KEY) return '';

  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: `tendances et enjeux 2026 secteur ${sector} France`,
        search_depth: 'basic',
        max_results: 4,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return '';
    const data = await res.json();
    const results = data.results ?? [];

    return results
      .map((r: any) => `- ${r.title} : ${(r.content ?? '').slice(0, 300)}`)
      .join('\n');
  } catch (err) {
    console.error('Erreur de recherche sectorielle', err);
    return '';
  }
}

/**
 * Génère la guideline complète (plan step-by-step) une fois la mission payée.
 */
export async function generateGuideline(mission: Mission): Promise<Guideline> {
  const systemPrompts: Record<string, string> = {
    DSI: "Tu es un manager de transition senior spécialisé en direction des systèmes d'information (DSI/CIO). Tu conçois des plans d'action réalistes, orientés terrain, pour des missions de transition.",
    CIO: "Tu es un manager de transition senior spécialisé CIO. Tu conçois des plans d'action réalistes, orientés terrain, pour des missions de transition.",
    DG: "Tu es un manager de transition senior ayant occupé des postes de direction générale. Tu conçois des plans d'action réalistes, orientés gouvernance et pilotage, pour des missions de transition.",
    DAF: "Tu es un manager de transition senior spécialisé direction administrative et financière. Tu conçois des plans d'action réalistes, orientés contrôle de gestion et fiabilisation financière.",
    DRH: "Tu es un manager de transition senior spécialisé ressources humaines. Tu conçois des plans d'action réalistes, orientés climat social, organisation et talents.",
  };

  const durationWeeks = Math.round(mission.mission_duration_days / 7);
  const axesText = mission.strategic_axes?.length
    ? mission.strategic_axes.map((a) => `- ${a}`).join('\n')
    : 'Aucun axe spécifique sélectionné — base-toi sur la description de mission.';

  const sectorBlock = mission.sector_context
    ? `\nSecteur d'activité identifié : ${mission.sector ?? 'non précisé'}\nContexte et tendances du secteur (recherche web récente) :\n${mission.sector_context}\n`
    : '';

  const userPrompt = `
Contexte entreprise :
${mission.company_summary ?? 'Non renseigné'}
${sectorBlock}
Fonction occupée : ${mission.target_function}
Mission attendue : ${mission.mission_description}
Durée de la mission : ${mission.mission_duration_days} jours (~${durationWeeks} semaines)
Contexte d'entrée : ${mission.entry_context ?? 'Non précisé'}
Mandat du sponsor : ${mission.sponsor_mandate ?? 'Non précisé'}
Taille de l'équipe concernée : ${mission.team_size ?? 'Non précisée'}
Contraintes connues : ${mission.known_constraints ?? 'Aucune signalée'}

Axes stratégiques prioritaires sélectionnés par le manager (à traiter en priorité et à structurer explicitement dans le plan) :
${axesText}

Génère un plan d'action découpé en phases cohérentes avec la durée totale de la mission (par exemple 3 à 5 phases pour une mission de 90 jours, moins pour une mission courte). Le plan doit couvrir concrètement chacun des axes stratégiques listés ci-dessus, en plus des étapes classiques de prise de poste. Quand un contexte sectoriel est fourni ci-dessus, ancre certaines actions dans ces tendances réelles du marché plutôt que de rester générique. Pour chaque phase, donne : un titre, la période concernée, des objectifs, des actions concrètes (audit, consultation interne, rapport, directive, projet...), les livrables attendus, et 2 à 3 indicateurs de succès mesurables (KPIs) qui permettront de prouver que la phase a atteint son but. Identifie aussi 3 à 5 risques majeurs de la mission dans son ensemble (résistance au changement, dépendance à une personne clé, délai serré, budget contraint, etc.), formulés de façon concrète et actionnable pour une direction.

Réponds UNIQUEMENT en JSON valide, sans texte autour, au format suivant :
{
  "mission_title": "string",
  "summary": "string (3-4 lignes)",
  "risks": ["string", "..."],
  "phases": [
    {
      "title": "string",
      "period_label": "string (ex: Semaines 1-2)",
      "objectives": ["string", "..."],
      "actions": ["string", "..."],
      "deliverables": ["string", "..."],
      "kpis": ["string", "..."]
    }
  ]
}`;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompts[mission.target_function] },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const text = completion.choices[0]?.message?.content ?? '{}';
  const raw = JSON.parse(text);

  // Normalisation défensive : l'IA (sans schéma strict imposé) peut parfois
  // omettre un tableau sur une phase — on garantit une structure toujours valide.
  const normalized: Guideline = {
    mission_title: raw.mission_title ?? `Guideline ${mission.target_function}`,
    summary: raw.summary ?? '',
    risks: Array.isArray(raw.risks) ? raw.risks : [],
    phases: Array.isArray(raw.phases)
      ? raw.phases.map((p: any) => ({
          title: p.title ?? 'Phase',
          period_label: p.period_label ?? '',
          objectives: Array.isArray(p.objectives) ? p.objectives : [],
          actions: Array.isArray(p.actions) ? p.actions : [],
          deliverables: Array.isArray(p.deliverables) ? p.deliverables : [],
          kpis: Array.isArray(p.kpis) ? p.kpis : [],
        }))
      : [],
  };

  return normalized;
}
