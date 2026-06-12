import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Layout } from './components/layout';
import { GetStartedPage } from './pages/get-started';
import { HomePage } from './pages/home';
import { LawsPage } from './pages/laws';
import { LearningPathPage } from './pages/learning-path';
import { PersonasPage } from './pages/personas';
import { WhyPage } from './pages/why';
import { WorkflowsPage } from './pages/workflows';

/** Route table without a router — testable under MemoryRouter (LAW-3.4). */
export function AppRoutes(): JSX.Element {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<WhyPage />} />
        <Route path="why" element={<WhyPage />} />
        <Route path="learn" element={<HomePage />} />
        <Route path="personas" element={<PersonasPage />} />
        <Route path="start" element={<GetStartedPage />} />
        <Route path="path/:moduleId" element={<LearningPathPage />} />
        <Route path="laws" element={<LawsPage />} />
        <Route path="workflows" element={<WorkflowsPage />} />
      </Route>
    </Routes>
  );
}

/** App entry: browser router around the shared route table. */
export function App(): JSX.Element {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
