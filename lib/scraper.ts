import * as cheerio from 'cheerio';

/**
 * Récupère le contenu textuel utile d'un site (page d'accueil + éventuellement /a-propos).
 * Solution légère intégrée, sans service tiers payant (Firecrawl, etc.) — suffisante
 * pour donner à l'IA de quoi rédiger une vraie synthèse plutôt qu'un texte inventé.
 */
export async function scrapeCompanySite(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TransitionGuideBot/1.0)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return '';

    const html = await res.text();
    const $ = cheerio.load(html);

    // Supprime le bruit (scripts, styles, nav, footer) avant extraction
    $('script, style, nav, footer, noscript, svg').remove();

    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') ?? '';
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

    // On limite la taille pour rester raisonnable en tokens envoyés à l'IA
    const truncated = bodyText.slice(0, 6000);

    return `Titre de la page : ${title}\nDescription : ${metaDescription}\n\nContenu :\n${truncated}`;
  } catch (err) {
    console.error('Erreur de scraping pour', url, err);
    return '';
  }
}
