import { PLUGIN_NAMESPACE, skillCatalog } from '../data/skills-catalog';
import type { CatalogSkill, SkillCategory } from '../data/skills-catalog';

const CATEGORY_ORDER: SkillCategory[] = ['Persona', 'Orchestration', 'Enforcement'];

const CATEGORY_BLURB: Record<SkillCategory, string> = {
  Persona: 'Assume a role with a mandate, owned laws, and real authority. Every decision arrives as a citation.',
  Orchestration: 'Coordinate the personas — drive workflows, convene the council, look up and amend laws.',
  Enforcement: 'Apply the laws as you work — review, test discipline, security scans, docs, and AI provenance.',
};

function SkillRow({ skill }: { skill: CatalogSkill }): JSX.Element {
  return (
    <article className="catalog-skill">
      <div className="catalog-skill-head">
        <h4>{skill.displayName}</h4>
        <code className="catalog-cmd">
          /{PLUGIN_NAMESPACE}:{skill.command}
        </code>
      </div>
      <p className="catalog-summary">{skill.summary}</p>
      <p className="catalog-when">
        <span className="catalog-label">When</span> {skill.whenToUse}
      </p>
      <ul className="catalog-examples">
        {skill.examples.map((example) => (
          <li key={example}>{example}</li>
        ))}
      </ul>
    </article>
  );
}

/** The full, grouped catalog of installable skill commands and how to use them. */
export function SkillCatalog(): JSX.Element {
  return (
    <div className="skill-catalog">
      {CATEGORY_ORDER.map((category) => {
        const skills = skillCatalog.filter((skill) => skill.category === category);
        return (
          <section key={category} className="catalog-group">
            <header className="catalog-group-head">
              <h3>
                {category}
                <span className="catalog-count">{skills.length}</span>
              </h3>
              <p>{CATEGORY_BLURB[category]}</p>
            </header>
            <div className="catalog-grid">
              {skills.map((skill) => (
                <SkillRow key={skill.command} skill={skill} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
