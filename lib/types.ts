export type TargetFunction = 'CIO' | 'DSI' | 'DG' | 'DAF' | 'DRH';

export interface Mission {
  id: string;
  created_at: string;
  paid_at?: string | null;
  company_url: string;
  company_name?: string;
  manager_name?: string;
  company_summary?: string;
  target_function: TargetFunction;
  mission_description: string;
  mission_duration_days: number;
  entry_context?: string;
  sponsor_mandate?: string;
  team_size?: number;
  known_constraints?: string;
  strategic_axes?: string[];
  sector?: string;
  sector_context?: string;
  status: 'draft' | 'ready_for_payment' | 'paid' | 'generated';
  guideline_json?: Guideline;
}

export interface GuidelinePhase {
  title: string;
  period_label: string;
  objectives: string[];
  actions: string[];
  deliverables: string[];
  kpis: string[];
}

export interface Guideline {
  mission_title: string;
  summary: string;
  risks: string[];
  phases: GuidelinePhase[];
}
