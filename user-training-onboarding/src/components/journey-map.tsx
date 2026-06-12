import type { JourneyStage } from '../data/journeys-content';

/**
 * A horizontal journey-map graphic: timeline track with mood-colored milestone
 * nodes (pain → shift → win) connected by a gradient rail. Pure CSS/SVG —
 * crisp at any size, screenshot-ready for client decks.
 */
export function JourneyMap({ stages }: { stages: JourneyStage[] }): JSX.Element {
  return (
    <div className="journey-map" role="img" aria-label="Client journey timeline">
      <div className="journey-rail" />
      <ol className="journey-stages">
        {stages.map((stage) => (
          <li key={stage.phase} className={`journey-stage mood-${stage.mood}`}>
            <span className="journey-node">
              <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
                {stage.mood === 'win' ? (
                  <path
                    d="M5 13l4 4L19 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <circle cx="12" cy="12" r="5.5" fill="currentColor" />
                )}
              </svg>
            </span>
            <span className="journey-phase">{stage.phase}</span>
            <h4>{stage.title}</h4>
            <p>{stage.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
