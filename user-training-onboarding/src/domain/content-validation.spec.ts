import { validateContent } from './content-validation';
import type { TrainingModule } from '../data/content-types';
import { trainingModules } from '../data/modules';


describe('validateContent — the stay-consistent guarantee (LAW-10.6)', () => {
  it('should report no errors when run against the real training content', () => {
    // THE consistency gate: every LAW-X.Y and WF-* referenced anywhere in the
    // training content must exist in the live registries. An amendment that
    // repeals or renumbers a law turns this red until content is updated.
    expect(validateContent(trainingModules)).toEqual([]);
  });

  it('should flag a lesson law reference that does not exist in the registry', () => {
    const bogus: TrainingModule[] = [
      {
        id: 'bogus',
        title: 'Bogus',
        summary: '',
        lessons: [
          { id: 'bogus-l1', title: 'x', body: 'x', lawRefs: ['LAW-99.9'] },
        ],
        quiz: [
          { id: 'bogus-q1', prompt: 'x', options: ['a', 'b'], correctIndex: 0, explanation: 'x' },
        ],
      },
    ];
    const errors = validateContent(bogus);
    expect(errors.some((message) => message.includes('LAW-99.9'))).toBe(true);
  });

  it('should flag a workflow reference that does not exist in the registry', () => {
    const bogus: TrainingModule[] = [
      {
        id: 'bogus',
        title: 'Bogus',
        summary: '',
        lessons: [
          { id: 'bogus-l1', title: 'x', body: 'x', lawRefs: [], workflowRefs: ['WF-NOPE'] },
        ],
        quiz: [
          { id: 'bogus-q1', prompt: 'x', options: ['a', 'b'], correctIndex: 0, explanation: 'x' },
        ],
      },
    ];
    const errors = validateContent(bogus);
    expect(errors.some((message) => message.includes('WF-NOPE'))).toBe(true);
  });

  it('should flag a quiz with a correctIndex outside its options when malformed', () => {
    const bogus: TrainingModule[] = [
      {
        id: 'bogus',
        title: 'Bogus',
        summary: '',
        lessons: [{ id: 'bogus-l1', title: 'x', body: 'x', lawRefs: [] }],
        quiz: [
          { id: 'bogus-q1', prompt: 'x', options: ['a', 'b'], correctIndex: 5, explanation: 'x' },
          { id: 'bogus-q2', prompt: 'x', options: ['a', 'b'], correctIndex: -1, explanation: 'x' },
        ],
      },
    ];
    const errors = validateContent(bogus);
    expect(errors.filter((message) => message.includes('correctIndex')).length).toBe(2);
  });

  it('should flag a quiz law reference that does not exist in the registry', () => {
    const bogus: TrainingModule[] = [
      {
        id: 'bogus',
        title: 'Bogus',
        summary: '',
        lessons: [{ id: 'bogus-l1', title: 'x', body: 'x', lawRefs: [] }],
        quiz: [
          {
            id: 'bogus-q1',
            prompt: 'x',
            options: ['a', 'b'],
            correctIndex: 0,
            explanation: 'x',
            lawRef: 'LAW-88.8',
          },
        ],
      },
    ];
    const errors = validateContent(bogus);
    expect(errors.some((message) => message.includes('LAW-88.8'))).toBe(true);
  });

  it('should flag duplicate lesson ids when two modules reuse one', () => {
    const lesson = { id: 'dup', title: 'x', body: 'x', lawRefs: [] };
    const quiz = [
      { id: 'q', prompt: 'x', options: ['a', 'b'], correctIndex: 0, explanation: 'x' },
    ];
    const bogus: TrainingModule[] = [
      { id: 'm1', title: 'x', summary: '', lessons: [lesson], quiz },
      { id: 'm2', title: 'x', summary: '', lessons: [{ ...lesson }], quiz },
    ];
    const errors = validateContent(bogus);
    expect(errors.some((message) => message.includes('duplicate lesson id'))).toBe(true);
  });

  it('should require every module to have lessons and a quiz', () => {
    const bogus: TrainingModule[] = [
      { id: 'empty', title: 'x', summary: '', lessons: [], quiz: [] },
    ];
    const errors = validateContent(bogus);
    expect(errors.some((message) => message.includes('no lessons'))).toBe(true);
    expect(errors.some((message) => message.includes('no quiz'))).toBe(true);
  });
});
