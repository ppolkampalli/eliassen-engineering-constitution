import { useSearchParams } from 'react-router-dom';

import { LawBrowser } from '../components/law-browser';
import { CONSTITUTION_VERSION, getAllLaws } from '../domain/registry';

/** The law browser page; supports ?q= deep links from law citation chips. */
export function LawsPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  return (
    <div className="laws-page">
      <h1>Law Browser</h1>
      <p>
        All {getAllLaws().length} laws of constitution v{CONSTITUTION_VERSION}, rendered live from
        the registry — when an amendment is enacted, this page reflects it on the next build.
      </p>
      <LawBrowser initialQuery={initialQuery} />
    </div>
  );
}
