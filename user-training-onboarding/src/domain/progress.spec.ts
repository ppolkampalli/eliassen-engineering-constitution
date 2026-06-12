import {
  completeLesson,
  loadProgress,
  moduleProgressPct,
  overallProgressPct,
  passQuiz,
} from './progress';
import type { TrainingModule } from '../data/content-types';


/** In-memory Storage fake (LAW-3.4: no real browser storage in unit tests). */
function fakeStorage(initial: Record<string, string> = {}): Storage {
  const store = new Map(Object.entries(initial));
  return {
    get length(): number {
      return store.size;
    },
    clear: (): void => store.clear(),
    getItem: (key: string): string | null => store.get(key) ?? null,
    key: (index: number): string | null => [...store.keys()][index] ?? null,
    removeItem: (key: string): void => {
      store.delete(key);
    },
    setItem: (key: string, value: string): void => {
      store.set(key, value);
    },
  };
}

function moduleWith(id: string, lessonIds: string[]): TrainingModule {
  return {
    id,
    title: id,
    summary: '',
    lessons: lessonIds.map((lessonId) => ({
      id: lessonId,
      title: lessonId,
      body: '',
      lawRefs: [],
    })),
    quiz: [
      { id: `${id}-q1`, prompt: '', options: ['a', 'b'], correctIndex: 0, explanation: '' },
    ],
  };
}

describe('loadProgress', () => {
  it('should return empty progress when storage has no saved state', () => {
    const state = loadProgress(fakeStorage());
    expect(state).toEqual({ completedLessons: [], passedQuizzes: [] });
  });

  it('should return saved progress when storage holds valid state', () => {
    const storage = fakeStorage();
    completeLesson(storage, 'greenfield-install');
    const state = loadProgress(storage);
    expect(state.completedLessons).toEqual(['greenfield-install']);
  });

  it('should return empty progress when storage holds corrupt JSON', () => {
    const storage = fakeStorage({ 'constitution-training-progress': '{not json' });
    expect(loadProgress(storage)).toEqual({ completedLessons: [], passedQuizzes: [] });
  });

  it('should return empty progress when storage holds JSON of the wrong shape', () => {
    const storage = fakeStorage({ 'constitution-training-progress': '{"completedLessons": "nope"}' });
    expect(loadProgress(storage)).toEqual({ completedLessons: [], passedQuizzes: [] });
  });

  it('should return empty progress when storage holds JSON null', () => {
    const storage = fakeStorage({ 'constitution-training-progress': 'null' });
    expect(loadProgress(storage)).toEqual({ completedLessons: [], passedQuizzes: [] });
  });

  it('should return empty progress when storage holds a JSON primitive', () => {
    const storage = fakeStorage({ 'constitution-training-progress': '42' });
    expect(loadProgress(storage)).toEqual({ completedLessons: [], passedQuizzes: [] });
  });

  it('should return empty progress when arrays contain non-string items', () => {
    const storage = fakeStorage({
      'constitution-training-progress': '{"completedLessons": [1], "passedQuizzes": []}',
    });
    expect(loadProgress(storage)).toEqual({ completedLessons: [], passedQuizzes: [] });
  });
});

describe('completeLesson', () => {
  it('should persist a completed lesson when called the first time', () => {
    const storage = fakeStorage();
    const state = completeLesson(storage, 'orientation-citations');
    expect(state.completedLessons).toContain('orientation-citations');
    expect(loadProgress(storage).completedLessons).toContain('orientation-citations');
  });

  it('should not duplicate a lesson when completed twice', () => {
    const storage = fakeStorage();
    completeLesson(storage, 'l1');
    const state = completeLesson(storage, 'l1');
    expect(state.completedLessons).toEqual(['l1']);
  });
});

describe('passQuiz', () => {
  it('should persist a passed quiz when recorded', () => {
    const storage = fakeStorage();
    const state = passQuiz(storage, 'greenfield');
    expect(state.passedQuizzes).toEqual(['greenfield']);
  });

  it('should not duplicate a quiz pass when recorded twice', () => {
    const storage = fakeStorage();
    passQuiz(storage, 'greenfield');
    expect(passQuiz(storage, 'greenfield').passedQuizzes).toEqual(['greenfield']);
  });
});

describe('moduleProgressPct', () => {
  it('should report 0 when nothing in the module is complete', () => {
    const mod = moduleWith('m', ['a', 'b', 'c']);
    expect(moduleProgressPct({ completedLessons: [], passedQuizzes: [] }, mod)).toBe(0);
  });

  it('should count the quiz as one unit alongside lessons when computing percent', () => {
    // 3 lessons + 1 quiz = 4 units; 2 lessons done = 50%
    const mod = moduleWith('m', ['a', 'b', 'c']);
    const state = { completedLessons: ['a', 'b'], passedQuizzes: [] };
    expect(moduleProgressPct(state, mod)).toBe(50);
  });

  it('should report 100 when all lessons and the quiz are complete', () => {
    const mod = moduleWith('m', ['a', 'b', 'c']);
    const state = { completedLessons: ['a', 'b', 'c'], passedQuizzes: ['m'] };
    expect(moduleProgressPct(state, mod)).toBe(100);
  });

  it('should ignore completed lessons from other modules when computing percent', () => {
    const mod = moduleWith('m', ['a']);
    const state = { completedLessons: ['other-lesson'], passedQuizzes: [] };
    expect(moduleProgressPct(state, mod)).toBe(0);
  });
});

describe('overallProgressPct', () => {
  it('should average across all modules weighted by unit count when computing overall percent', () => {
    const m1 = moduleWith('m1', ['a']); // 2 units
    const m2 = moduleWith('m2', ['b', 'c', 'd']); // 4 units
    const state = { completedLessons: ['a'], passedQuizzes: ['m1'] }; // 2 of 6 units
    expect(overallProgressPct(state, [m1, m2])).toBe(33);
  });

  it('should report 0 when the module list is empty', () => {
    expect(overallProgressPct({ completedLessons: [], passedQuizzes: [] }, [])).toBe(0);
  });
});
