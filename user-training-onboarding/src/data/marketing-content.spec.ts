import { startSteps } from './get-started-content';
import { clientJourneys } from './journeys-content';
import { personaProfiles } from './personas-content';
import { getLaw, getWorkflow } from '../domain/registry';

describe('marketing content — the stay-consistent guarantee (LAW-10.6)', () => {
  it('should reference only laws that exist when listing persona-owned laws', () => {
    const missing = personaProfiles.flatMap((profile) =>
      profile.ownedLaws.filter((lawRef) => getLaw(lawRef) === undefined)
    );
    expect(missing).toEqual([]);
  });

  it('should cover all eight personas with non-empty pitches and invocations', () => {
    expect(personaProfiles.length).toBe(8);
    for (const profile of personaProfiles) {
      expect(profile.pitch.length).toBeGreaterThan(50);
      expect(profile.invocation.length).toBeGreaterThan(10);
      expect(profile.ownedLaws.length).toBeGreaterThan(0);
    }
  });

  it('should reference only laws and workflows that exist in the start-here steps', () => {
    const missingLaws = startSteps.flatMap((step) =>
      step.lawRefs.filter((lawRef) => getLaw(lawRef) === undefined)
    );
    const missingWorkflows = startSteps.flatMap((step) =>
      (step.workflowRefs ?? []).filter((workflowRef) => getWorkflow(workflowRef) === undefined)
    );
    expect(missingLaws).toEqual([]);
    expect(missingWorkflows).toEqual([]);
  });

  it('should give every step a checkpoint so progress is verifiable (LAW-10.2 spirit)', () => {
    for (const step of startSteps) {
      expect(step.checkpoint.length).toBeGreaterThan(10);
    }
  });

  it('should reference only laws and workflows that exist in the client journeys', () => {
    const missingLaws = clientJourneys.flatMap((journey) =>
      journey.lawRefs.filter((lawRef) => getLaw(lawRef) === undefined)
    );
    const missingWorkflows = clientJourneys.flatMap((journey) =>
      journey.workflowRefs.filter((workflowRef) => getWorkflow(workflowRef) === undefined)
    );
    expect(missingLaws).toEqual([]);
    expect(missingWorkflows).toEqual([]);
  });

  it('should give every journey five stages that travel from pain to win', () => {
    expect(clientJourneys.length).toBe(3);
    for (const journey of clientJourneys) {
      expect(journey.stages.length).toBe(5);
      expect(journey.stages[0]?.mood).toBe('pain');
      expect(journey.stages[journey.stages.length - 1]?.mood).toBe('win');
      expect(journey.before.length).toBeGreaterThan(2);
      expect(journey.after.length).toBeGreaterThan(2);
    }
  });
});
