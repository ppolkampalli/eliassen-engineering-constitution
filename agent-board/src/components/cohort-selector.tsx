import { ToggleButton, ToggleButtonGroup } from '@mui/material';

export type CohortType = 'workflow' | 'laws' | 'personas';

const COHORT_OPTIONS: { id: CohortType; label: string }[] = [
  { id: 'workflow', label: 'Workflow' },
  { id: 'laws', label: 'Laws' },
  { id: 'personas', label: 'Personas' },
];

interface CohortSelectorProps {
  active: CohortType;
  onChange: (cohortType: CohortType) => void;
}

export function CohortSelector({ active, onChange }: CohortSelectorProps): JSX.Element {
  return (
    <ToggleButtonGroup
      value={active}
      exclusive
      onChange={(_event, value: CohortType | null) => {
        if (value) onChange(value);
      }}
      aria-label="Cohort type"
    >
      {COHORT_OPTIONS.map((option) => (
        <ToggleButton key={option.id} value={option.id} aria-label={option.label}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
