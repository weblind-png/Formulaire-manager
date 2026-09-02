import { Document, Page, Text, View, StyleSheet, Svg, Circle } from '@react-pdf/renderer';
import type { Mission, Guideline } from './types';

const NAVY = '#0b2545';
const GOLD = '#b98d3e';
const MUTED = '#5b6472';
const BORDER = '#dfe3e8';
const PHASE_COLORS = ['#0b2545', '#b98d3e', '#1f5c8a', '#7a5a1f'];

function PdfDonut({ percentage, color, size = 72 }: { percentage: number; color: string; size?: number }) {
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, percentage));
  const arcLength = Math.max(0.01, Math.min(circumference - 0.01, circumference * (pct / 100)));
  const center = size / 2;

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle cx={center} cy={center} r={radius} stroke="#e9edf1" strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${arcLength} ${circumference - arcLength}`}
          strokeLinecap="round"
          transform={`rotate(-90, ${center}, ${center})`}
        />
      </Svg>
      <Text
        style={{
          position: 'absolute',
          top: center - 7,
          left: 0,
          width: size,
          textAlign: 'center',
          fontSize: 13,
          fontFamily: 'Helvetica-Bold',
          color: NAVY,
        }}
      >
        {pct}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10.5, fontFamily: 'Helvetica', color: '#1a1f2b' },

  // Page de garde
  coverBrandBar: { height: 6, backgroundColor: NAVY, marginBottom: 28, borderRadius: 2 },
  coverEyebrow: { fontSize: 10, color: GOLD, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  coverTitle: { fontSize: 24, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 18, lineHeight: 1.3 },
  identityBox: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: BORDER },
  identityItem: { width: '50%', marginBottom: 10 },
  identityLabel: { fontSize: 8, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  identityValue: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#1a1f2b' },
  coverSummaryBox: { marginTop: 20, padding: 16, backgroundColor: '#f4f6f8', borderRadius: 4 },
  coverSummaryLabel: { fontSize: 9, color: MUTED, textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.5 },
  coverSummaryText: { fontSize: 11, lineHeight: 1.6 },
  coverFooter: { position: 'absolute', bottom: 40, left: 40, right: 40, fontSize: 8, color: MUTED, borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 10 },

  // Pages de contenu
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: BORDER, paddingBottom: 10 },
  headerTitle: { fontSize: 9, color: MUTED },

  phaseHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 18, marginBottom: 6 },
  phaseTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 2 },
  phasePeriod: { fontSize: 9, color: GOLD, textTransform: 'uppercase', letterSpacing: 0.5 },

  // Page de synthèse visuelle (grille de camemberts, une par phase)
  overviewTitle: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 4 },
  overviewSubtitle: { fontSize: 10, color: MUTED, marginBottom: 24 },
  overviewGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  overviewCard: { width: '47%', backgroundColor: '#f9fafb', borderRadius: 6, borderWidth: 1, borderColor: BORDER, padding: 14, alignItems: 'center' },
  overviewCardTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginTop: 10, color: '#1a1f2b' },
  overviewCardMeta: { fontSize: 8, color: MUTED, textAlign: 'center', marginTop: 3 },

  sectionLabel: { fontSize: 10, fontFamily: 'Helvetica-Bold', marginTop: 10, marginBottom: 6, color: NAVY },
  itemRow: { flexDirection: 'row', marginBottom: 5, paddingLeft: 4 },
  checkbox: { width: 9, height: 9, borderWidth: 1, borderColor: NAVY, marginRight: 7, marginTop: 1.5, borderRadius: 2 },
  checkboxChecked: { backgroundColor: NAVY },
  itemText: { fontSize: 10, lineHeight: 1.4, flex: 1 },
  itemTextChecked: { color: MUTED, textDecoration: 'line-through' },

  // Risques (page de garde)
  risksBox: { marginTop: 16, padding: 16, backgroundColor: '#fdf6ea', borderRadius: 4, borderLeftWidth: 3, borderLeftColor: GOLD },
  risksLabel: { fontSize: 9, color: GOLD, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5, fontFamily: 'Helvetica-Bold' },
  riskItem: { flexDirection: 'row', marginBottom: 5 },
  riskBullet: { fontSize: 10, color: GOLD, marginRight: 6 },
  riskText: { fontSize: 10, lineHeight: 1.4, flex: 1 },

  // KPIs (fin de page de phase)
  kpiBox: { marginTop: 14, padding: 12, backgroundColor: '#f4f6f8', borderRadius: 4 },
  kpiLabel: { fontSize: 9, color: NAVY, textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.5, fontFamily: 'Helvetica-Bold' },
  kpiItem: { fontSize: 9.5, lineHeight: 1.5, marginBottom: 3 },

  pageNumber: { position: 'absolute', bottom: 24, right: 40, fontSize: 8, color: MUTED },
});

function ChecklistItem({ label, checked }: { label: string; checked: boolean }) {
  return (
    <View style={styles.itemRow}>
      <View style={[styles.checkbox, checked ? styles.checkboxChecked : {}]} />
      <Text style={[styles.itemText, checked ? styles.itemTextChecked : {}]}>{label}</Text>
    </View>
  );
}

function getPhaseCompletion(phase: any, pIndex: number, progress: Record<string, boolean>) {
  const objectives = phase.objectives ?? [];
  const actions = phase.actions ?? [];
  const deliverables = phase.deliverables ?? [];
  const total = objectives.length + actions.length + deliverables.length;
  let checked = 0;
  objectives.forEach((_: string, i: number) => { if (progress[`p${pIndex}-o${i}`]) checked++; });
  actions.forEach((_: string, i: number) => { if (progress[`p${pIndex}-a${i}`]) checked++; });
  deliverables.forEach((_: string, i: number) => { if (progress[`p${pIndex}-d${i}`]) checked++; });
  return total > 0 ? Math.round((checked / total) * 100) : 0;
}

export function GuidelinePdf({ mission, guideline }: { mission: Mission & { progress_json?: Record<string, boolean> }; guideline: Guideline }) {
  const progress = mission.progress_json ?? {};
  const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const startDate = new Date(mission.paid_at ?? mission.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const phases = guideline.phases ?? [];
  const clientLabel = mission.company_name || mission.company_url;

  return (
    <Document title={guideline.mission_title} author={mission.manager_name || 'Manager de transition'}>
      {/* PAGE DE GARDE */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverBrandBar} />
        <Text style={styles.coverEyebrow}>Guideline de mission — {mission.target_function}</Text>
        <Text style={styles.coverTitle}>{guideline.mission_title}</Text>

        <View style={styles.identityBox}>
          <View style={styles.identityItem}>
            <Text style={styles.identityLabel}>Client</Text>
            <Text style={styles.identityValue}>{clientLabel}</Text>
          </View>
          <View style={styles.identityItem}>
            <Text style={styles.identityLabel}>Manager de transition</Text>
            <Text style={styles.identityValue}>{mission.manager_name || 'Non renseigné'}</Text>
          </View>
          <View style={styles.identityItem}>
            <Text style={styles.identityLabel}>Début de mission</Text>
            <Text style={styles.identityValue}>{startDate}</Text>
          </View>
          <View style={styles.identityItem}>
            <Text style={styles.identityLabel}>Durée prévue</Text>
            <Text style={styles.identityValue}>{mission.mission_duration_days} jours</Text>
          </View>
          <View style={styles.identityItem}>
            <Text style={styles.identityLabel}>Document mis à jour le</Text>
            <Text style={styles.identityValue}>{today}</Text>
          </View>
        </View>

        <View style={styles.coverSummaryBox}>
          <Text style={styles.coverSummaryLabel}>Synthèse exécutive</Text>
          <Text style={styles.coverSummaryText}>{guideline.summary}</Text>
        </View>

        {(guideline.risks ?? []).length > 0 && (
          <View style={styles.risksBox}>
            <Text style={styles.risksLabel}>Risques identifiés</Text>
            {(guideline.risks ?? []).map((r, i) => (
              <View key={i} style={styles.riskItem}>
                <Text style={styles.riskBullet}>⚠</Text>
                <Text style={styles.riskText}>{r}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.coverFooter}>
          <Text>Document confidentiel — préparé pour un usage interne dans le cadre de la mission de transition.</Text>
        </View>
      </Page>

      {/* PAGE DE SYNTHÈSE VISUELLE — un camembert par phase, pour une lecture en un coup d'œil */}
      {phases.length > 0 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.overviewTitle}>Avancement par phase</Text>
          <Text style={styles.overviewSubtitle}>Vue synthétique — état d'avancement de chaque phase de la mission</Text>

          <View style={styles.overviewGrid}>
            {phases.map((phase, pIndex) => {
              const pct = getPhaseCompletion(phase, pIndex, progress);
              const color = PHASE_COLORS[pIndex % PHASE_COLORS.length];
              return (
                <View key={pIndex} style={styles.overviewCard}>
                  <PdfDonut percentage={pct} color={color} size={80} />
                  <Text style={styles.overviewCardTitle}>{phase.title}</Text>
                  <Text style={styles.overviewCardMeta}>{phase.period_label}</Text>
                </View>
              );
            })}
          </View>
        </Page>
      )}

      {/* PAGES DE DÉTAIL PAR PHASE */}
      {phases.map((phase, pIndex) => {
        const pct = getPhaseCompletion(phase, pIndex, progress);
        const color = PHASE_COLORS[pIndex % PHASE_COLORS.length];
        return (
          <Page key={pIndex} size="A4" style={styles.page}>
            <View style={styles.header} fixed>
              <Text style={styles.headerTitle}>{clientLabel} · {guideline.mission_title}</Text>
              <Text style={styles.headerTitle}>{mission.target_function}</Text>
            </View>

            <View style={styles.phaseHeaderRow}>
              <PdfDonut percentage={pct} color={color} size={56} />
              <View>
                <Text style={styles.phaseTitle}>{phase.title}</Text>
                <Text style={styles.phasePeriod}>{phase.period_label}</Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>Objectifs</Text>
            {(phase.objectives ?? []).map((o, i) => (
              <ChecklistItem key={i} label={o} checked={!!progress[`p${pIndex}-o${i}`]} />
            ))}

            <Text style={styles.sectionLabel}>Actions</Text>
            {(phase.actions ?? []).map((a, i) => (
              <ChecklistItem key={i} label={a} checked={!!progress[`p${pIndex}-a${i}`]} />
            ))}

            <Text style={styles.sectionLabel}>Livrables</Text>
            {(phase.deliverables ?? []).map((d, i) => (
              <ChecklistItem key={i} label={d} checked={!!progress[`p${pIndex}-d${i}`]} />
            ))}

            {(phase.kpis ?? []).length > 0 && (
              <View style={styles.kpiBox}>
                <Text style={styles.kpiLabel}>Indicateurs de succès (KPIs)</Text>
                {(phase.kpis ?? []).map((k, i) => (
                  <Text key={i} style={styles.kpiItem}>📊 {k}</Text>
                ))}
              </View>
            )}

            <Text
              style={styles.pageNumber}
              render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
              fixed
            />
          </Page>
        );
      })}
    </Document>
  );
}
