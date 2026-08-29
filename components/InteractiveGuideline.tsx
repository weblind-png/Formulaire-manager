'use client';

import { useMemo, useState } from 'react';
import type { Guideline } from '@/lib/types';

type ProgressMap = Record<string, boolean>;

interface Props {
  missionId: string;
  guideline: Guideline;
  initialProgress: ProgressMap;
  missionDurationDays: number;
  startedAt: string; // paid_at ou created_at — date de départ de la mission
}

export default function InteractiveGuideline({
  missionId,
  guideline,
  initialProgress,
  missionDurationDays,
  startedAt,
}: Props) {
  const [progress, setProgress] = useState<ProgressMap>(initialProgress ?? {});

  // Construit la liste complète des items cochables, chacun avec une clé stable
  const items = useMemo(() => {
    const list: { key: string; label: string; phaseIndex: number; type: string }[] = [];
    guideline.phases.forEach((phase, pIndex) => {
      phase.objectives.forEach((o, i) => list.push({ key: `p${pIndex}-o${i}`, label: o, phaseIndex: pIndex, type: 'Objectif' }));
      phase.actions.forEach((a, i) => list.push({ key: `p${pIndex}-a${i}`, label: a, phaseIndex: pIndex, type: 'Action' }));
      phase.deliverables.forEach((d, i) => list.push({ key: `p${pIndex}-d${i}`, label: d, phaseIndex: pIndex, type: 'Livrable' }));
    });
    return list;
  }, [guideline]);

  const totalItems = items.length;
  const checkedCount = items.filter((it) => progress[it.key]).length;
  const completionPct = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  // % du délai de mission déjà écoulé
  const elapsedPct = useMemo(() => {
    const start = new Date(startedAt).getTime();
    const now = Date.now();
    const totalMs = missionDurationDays * 24 * 60 * 60 * 1000;
    const elapsedMs = Math.max(0, now - start);
    return Math.min(100, Math.round((elapsedMs / totalMs) * 100));
  }, [startedAt, missionDurationDays]);

  const gap = completionPct - elapsedPct; // positif = en avance, négatif = en retard

  async function toggleItem(key: string) {
    const next = !progress[key];
    setProgress((p) => ({ ...p, [key]: next })); // optimiste

    try {
      await fetch('/api/mission/progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId, itemKey: key, checked: next }),
      });
    } catch {
      setProgress((p) => ({ ...p, [key]: !next })); // rollback si échec
    }
  }

  const statusLabel = gap >= 5 ? 'En avance' : gap <= -5 ? 'En retard' : 'Dans les temps';
  const statusClass = gap >= 5 ? 'status-ahead' : gap <= -5 ? 'status-behind' : 'status-ontrack';

  return (
    <div>
      <div className="progress-summary">
        <div className="progress-block">
          <div className="progress-label">
            <span>Avancement des tâches</span>
            <strong>{completionPct}%</strong>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${completionPct}%` }} />
          </div>
          <p className="progress-detail">{checkedCount} / {totalItems} éléments validés</p>
        </div>

        <div className="progress-block">
          <div className="progress-label">
            <span>Délai de mission écoulé</span>
            <strong>{elapsedPct}%</strong>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill progress-bar-time" style={{ width: `${elapsedPct}%` }} />
          </div>
          <p className={`progress-detail status-tag ${statusClass}`}>
            {statusLabel} {gap !== 0 && `(${gap > 0 ? '+' : ''}${gap} pts)`}
          </p>
        </div>
      </div>

      {guideline.phases.map((phase, pIndex) => {
        const phaseItems = items.filter((it) => it.phaseIndex === pIndex);
        const phaseChecked = phaseItems.filter((it) => progress[it.key]).length;

        return (
          <section key={pIndex} className="phase-card">
            <h2>{phase.period_label} — {phase.title}</h2>
            <p className="phase-progress">{phaseChecked} / {phaseItems.length} validés</p>

            {['Objectif', 'Action', 'Livrable'].map((type) => {
              const typeItems = phaseItems.filter((it) => it.type === type);
              if (!typeItems.length) return null;
              return (
                <div key={type}>
                  <h4>{type}s</h4>
                  <ul className="checklist">
                    {typeItems.map((it) => (
                      <li key={it.key}>
                        <label className="checklist-item">
                          <input
                            type="checkbox"
                            checked={!!progress[it.key]}
                            onChange={() => toggleItem(it.key)}
                          />
                          <span className={progress[it.key] ? 'checked-text' : ''}>{it.label}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
