import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import type { Mission, Guideline } from './types';

const NAVY = '#0b2545';
const GOLD = '#b98d3e';
const MUTED = '#5b6472';
const BORDER = '#dfe3e8';

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

  phaseTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 2, marginTop: 18 },
  phasePeriod: { fontSize: 9, color: GOLD, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },

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

export function GuidelinePdf({ mission, guideline }: { mission: Mission & { progress_json?: Record<string, boolean> }; guideline: Guideline }) {
  const progress = mission.progress_json ?? {};
  const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

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

      {guideline.phases.map((phase, pIndex) => (
        <Page key={pIndex} size="A4" style={styles.page}>
          <View style={styles.header} fixed>
            <Text style={styles.headerTitle}>{guideline.mission_title}</Text>
            <Text style={styles.headerTitle}>{mission.target_function}</Text>
          </View>

          <Text style={styles.phaseTitle}>{phase.title}</Text>
          <Text style={styles.phasePeriod}>{phase.period_label}</Text>

          <Text style={styles.sectionLabel}>Objectifs</Text>
          {phase.objectives.map((o, i) => (
            <ChecklistItem key={i} label={o} checked={!!progress[`p${pIndex}-o${i}`]} />
          ))}

          <Text style={styles.sectionLabel}>Actions</Text>
          {phase.actions.map((a, i) => (
            <ChecklistItem key={i} label={a} checked={!!progress[`p${pIndex}-a${i}`]} />
          ))}

          <Text style={styles.sectionLabel}>Livrables</Text>
          {phase.deliverables.map((d, i) => (
            <ChecklistItem key={i} label={d} checked={!!progress[`p${pIndex}-d${i}`]} />
          ))}

          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
            fixed
          />
        </Page>
      ))}
    </Document>
  );
}
