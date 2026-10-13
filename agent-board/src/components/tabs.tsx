import { Tab, Tabs as MuiTabs } from '@mui/material';

export interface TabDef {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabDef[];
  active: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, active, onChange }: TabsProps): JSX.Element {
  return (
    <MuiTabs value={active} onChange={(_event, value: string) => onChange(value)} aria-label="Board view">
      {tabs.map((tab) => (
        <Tab key={tab.id} value={tab.id} label={tab.label} />
      ))}
    </MuiTabs>
  );
}
