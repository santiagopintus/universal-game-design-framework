import Field from './Field';
import Section from './FormSection';

const MainForm = () => {
  return (
    <main className="max-w-5xl mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-bold mb-2 text-foreground">Universal Game Design Framework</h1>
      <p className="text-text-muted mb-8">
        High-level framework for designing games before writing a GDD.
      </p>

      <Section title="1. Project Constraints">
        <Field title="Budget" guide="What budget constraints should influence the design?" />
        <Field title="Team Size" guide="Who is building this game? What skills are available?" />
        <Field
          title="Technology"
          guide="What engine, tools, or physical components will be used?"
        />
        <Field
          title="Production Scope"
          guide="How ambitious should this project be? What should intentionally remain out of scope?"
        />
      </Section>

      <Section title="2. Game Concept">
        <Field title="One-Sentence Pitch" guide="Describe the game in one sentence." />
        <Field title="Concept Summary" guide="What is the core idea? Why does this game exist?" />
      </Section>

      <Section title="3. MDA Framework">
        <h3 className="text-xl font-semibold mb-3 text-accent">Aesthetics</h3>
        <Field title="Emotional Experience" guide="What emotions should players feel?" />
        <Field title="Player Fantasy" guide="Who does the player become?" />
        <Field
          title="Desired Experience"
          guide="How should players describe the game after playing?"
        />
        <Field title="Memorable Moments" guide="What moments should players remember?" />
        <h3 className="text-xl font-semibold mb-3 text-accent">Mechanics</h3>
        <Field title="Core Mechanics" guide="What are the primary actions?" />
        <Field title="Resources" guide="What resources are managed?" />
        <Field title="Rules" guide="What fundamental rules define the game?" />
        <Field title="Progression Systems" guide="How does the player become more capable?" />
        <h3 className="text-xl font-semibold mb-3 text-accent">Dynamics</h3>
        <Field title="Player Behaviors" guide="What behaviors should emerge?" />
        <Field title="Decision Making" guide="What meaningful choices recur?" />
        <Field title="Risk vs Reward" guide="How is strategic thinking encouraged?" />
        <Field title="Social Dynamics" guide="How do players cooperate or compete?" />
      </Section>

      <Section title="4. Setting">
        <Field title="World" guide="Where does the game take place?" />
        <Field title="Theme" guide="What is the tone and atmosphere?" />
        <Field
          title="Environmental Storytelling"
          guide="How does the world communicate its history and mood?"
        />
      </Section>

      <Section title="5. Game Loop">
        <Field title="Core Loop" guide="What actions repeat throughout the game?" />
        <Field title="Session Flow" guide="What does a typical play session look like?" />
        <Field title="Long-Term Progression" guide="What keeps players engaged across sessions?" />
      </Section>

      <Section title="6. Player Goals">
        <Field
          title="Short-Term Goals"
          guide="What should players accomplish in the next few minutes?"
        />
        <Field
          title="Mid-Term Goals"
          guide="What should players work toward over several sessions?"
        />
        <Field title="Long-Term Goals" guide="What ultimate objectives motivate continued play?" />
      </Section>

      <Section title="7. Victory & Failure Conditions">
        <Field
          title="Victory Conditions"
          guide="How does the player win? Are there multiple paths?"
        />
        <Field
          title="Failure Conditions"
          guide="How can the player fail? What are the consequences?"
        />
      </Section>

      <Section title="8. Difficulty & Progression">
        <Field title="Learning Curve" guide="How are mechanics introduced?" />
        <Field title="Difficulty Curve" guide="How does challenge increase?" />
        <Field title="Mastery" guide="How can experienced players continue improving?" />
      </Section>

      <Section title="9. Replayability">
        <Field title="Replay Value" guide="Why play again?" />
        <Field title="Variability" guide="What changes between playthroughs?" />
      </Section>

      <Section title="10. Core Design Principles">
        <Field title="Principle 1" guide="What rule should always be followed?" />
        <Field title="Principle 2" guide="What should always be prioritized?" />
        <Field title="Principle 3" guide="What question should designers constantly ask?" />
        <Field
          title="Trade-offs"
          guide="How should conflicts between good design options be resolved?"
        />
      </Section>

      <Section title="11. Success Criteria">
        <Field
          title="Player Experience"
          guide="What should playtesters consistently feel or say?"
        />
        <Field title="Gameplay" guide="What behaviors indicate the mechanics are working?" />
        <Field title="Design Goals" guide="What observable outcomes define success?" />
        <Field title="Red Flags" guide="What indicates the design is failing?" />
      </Section>

      <Section title="12. Design Pillars">
        <Field title="Pillar 1" guide="What is the most important aspect of this game?" />
        <Field title="Pillar 2" guide="What makes this game unique?" />
        <Field title="Pillar 3" guide="What experience must never be compromised?" />
        <Field
          title="Things This Game Should Never Become"
          guide="What directions would betray the game's identity?"
        />
      </Section>
    </main>
  );
};

export default MainForm;
