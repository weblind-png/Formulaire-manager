import Anthropic from '@anthropic-ai/sdk';
import type { Mission, Guideline } from './types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

/**
 * Résume le site de l'entreprise cible (étape 1 du formulaire).
 * `rawContent` = texte déjà extrait du site par votre étape de scraping.
 */
export async function summarizeCompany(companyUrl: string, rawContent: string): Promise<string> {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 600,
    messages: [{
      role: 'user',
      content: `Voici le contenu extrait du site ${companyUrl} :\n\n${rawContent}\n\nRédige une synthèse factuelle en 6-8 lignes maximum à destination d'un manager de transition qui doit prendre ses fonctions rapidement dans cette entreprise : activité, taille approximative, positionnement marché, signaux notables (croissance, tensions, actualité récente). Pas de style commercial, uniquement des faits utiles.`
    }]
  });
  const block = msg.content[0];
  return block.type === 'text' ? block.text : '';
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

  const userPrompt = `
Contexte entreprise :
${mission.company_summary ?? 'Non renseigné'}

Fonction occupée : ${mission.target_function}
Mission attendue : ${mission.mission_description}
Durée de la mission : ${mission.mission_duration_days} jours (~${durationWeeks} semaines)
Contexte d'entrée : ${mission.entry_context ?? 'Non précisé'}
Mandat du sponsor : ${mission.sponsor_mandate ?? 'Non précisé'}
Taille de l'équipe concernée : ${mission.team_size ?? 'Non précisée'}
Contraintes connues : ${mission.known_constraints ?? 'Aucune signalée'}

Génère un plan d'action découpé en phases cohérentes avec la durée totale de la mission (par exemple 3 à 5 phases pour une mission de 90 jours, moins pour une mission courte). Pour chaque phase, donne : un titre, la période concernée, des objectifs, des actions concrètes (audit, consultation interne, rapport, directive, projet...), et les livrables attendus.

Réponds UNIQUEMENT en JSON valide, sans texte autour, au format suivant :
{
  "mission_title": "string",
  "summary": "string (3-4 lignes)",
  "phases": [
    {
      "title": "string",
      "period_label": "string (ex: Semaines 1-2)",
      "objectives": ["string", "..."],
      "actions": ["string", "..."],
      "deliverables": ["string", "..."]
    }
  ]
}`;

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 4000,
    system: systemPrompts[mission.target_function],
    messages: [{ role: 'user', content: userPrompt }],
  });

  const block = msg.content[0];
  const text = block.type === 'text' ? block.text : '{}';
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned) as Guideline;
}
