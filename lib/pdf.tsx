import { Document, Page, Text, View, StyleSheet, Image, Svg, Circle } from '@react-pdf/renderer';
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

  coverLogo: { width: 100, marginBottom: 28 },
  coverEyebrow: { fontSize: 10, color: GOLD, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  coverTitle: { fontSize: 24, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 14, lineHeight: 1.3 },
  coverMeta: { fontSize: 11, color: MUTED, marginBottom: 4 },
  coverSummaryBox: { marginTop: 28, padding: 16, backgroundColor: '#f4f6f8', borderRadius: 4 },
  coverSummaryLabel: { fontSize: 9, color: MUTED, textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.5 },
  coverSummaryText: { fontSize: 11, lineHeight: 1.6 },
  coverFooter: { position: 'absolute', bottom: 40, left: 40, right: 40, fontSize: 8, color: MUTED, borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 10 },

  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: BORDER, paddingBottom: 10 },
  headerTitle: { fontSize: 9, color: MUTED },

  phaseHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 18, marginBottom: 6 },
  phaseTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 2 },
  phasePeriod: { fontSize: 9, color: GOLD, textTransform: 'uppercase', letterSpacing: 0.5 },

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
  const phases = guideline.phases ?? [];

  return (
    <Document title={guideline.mission_title} author="Iterium Partners">
      <Page size="A4" style={styles.page}>
        <Image
          style={styles.coverLogo}
          src="https://res.cloudinary.com/dlo1bbmlf/image/upload/v1777481790/logiIP_fzrayp.png"
        />
        <Text style={styles.coverEyebrow}>Guideline de mission — {mission.target_function}</Text>
        <Text style={styles.coverTitle}>{guideline.mission_title}</Text>
        <Text style={styles.coverMeta}>Entreprise cible : {mission.company_url}</Text>
        <Text style={styles.coverMeta}>Durée de mission : {mission.mission_duration_days} jours</Text>
        <Text style={styles.coverMeta}>Document généré le {today}</Text>

        <View style={styles.coverSummaryBox}>
          <Text style={styles.coverSummaryLabel}>Synthèse exécutive</Text>
          <Text style={styles.coverSummaryText}>{guideline.summary}</Text>
        </View>

        <View style={styles.coverFooter}>
          <Text>Document confidentiel — préparé pour un usage interne dans le cadre de la mission de transition.</Text>
        </View>
      </Page>

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

      {phases.map((phase, pIndex) => {
        const pct = getPhaseCompletion(phase, pIndex, progress);
        const color = PHASE_COLORS[pIndex % PHASE_COLORS.length];
        return (
          <Page key={pIndex} size="A4" style={styles.page}>
            <View style={styles.header} fixed>
              <Text style={styles.headerTitle}>{guideline.mission_title}</Text>
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
