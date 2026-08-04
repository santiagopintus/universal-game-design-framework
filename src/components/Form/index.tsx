import { getTranslations } from 'next-intl/server';
import Field from './Field';
import Section from './FormSection';

const MainForm = async () => {
  const t = await getTranslations('form');
  const placeholder = t('placeholder');

  return (
    <main className="max-w-5xl mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-bold mb-2 text-foreground">{t('title')}</h1>
      <p className="text-text-muted mb-8">{t('description')}</p>

      <Section title={t('sections.constraints.title')}>
        <Field
          title={t('sections.constraints.fields.budget.title')}
          guide={t('sections.constraints.fields.budget.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.constraints.fields.teamSize.title')}
          guide={t('sections.constraints.fields.teamSize.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.constraints.fields.technology.title')}
          guide={t('sections.constraints.fields.technology.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.constraints.fields.productionScope.title')}
          guide={t('sections.constraints.fields.productionScope.guide')}
          placeholder={placeholder}
        />
      </Section>

      <Section title={t('sections.concept.title')}>
        <Field
          title={t('sections.concept.fields.pitch.title')}
          guide={t('sections.concept.fields.pitch.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.concept.fields.summary.title')}
          guide={t('sections.concept.fields.summary.guide')}
          placeholder={placeholder}
        />
      </Section>

      <Section title={t('sections.mda.title')}>
        <h3 className="text-xl font-semibold mb-3 text-accent">{t('sections.mda.aesthetics.heading')}</h3>
        <Field
          title={t('sections.mda.aesthetics.fields.emotionalExperience.title')}
          guide={t('sections.mda.aesthetics.fields.emotionalExperience.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.mda.aesthetics.fields.playerFantasy.title')}
          guide={t('sections.mda.aesthetics.fields.playerFantasy.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.mda.aesthetics.fields.desiredExperience.title')}
          guide={t('sections.mda.aesthetics.fields.desiredExperience.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.mda.aesthetics.fields.memorableMoments.title')}
          guide={t('sections.mda.aesthetics.fields.memorableMoments.guide')}
          placeholder={placeholder}
        />
        <h3 className="text-xl font-semibold mb-3 text-accent">{t('sections.mda.mechanics.heading')}</h3>
        <Field
          title={t('sections.mda.mechanics.fields.coreMechanics.title')}
          guide={t('sections.mda.mechanics.fields.coreMechanics.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.mda.mechanics.fields.resources.title')}
          guide={t('sections.mda.mechanics.fields.resources.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.mda.mechanics.fields.rules.title')}
          guide={t('sections.mda.mechanics.fields.rules.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.mda.mechanics.fields.progressionSystems.title')}
          guide={t('sections.mda.mechanics.fields.progressionSystems.guide')}
          placeholder={placeholder}
        />
        <h3 className="text-xl font-semibold mb-3 text-accent">{t('sections.mda.dynamics.heading')}</h3>
        <Field
          title={t('sections.mda.dynamics.fields.playerBehaviors.title')}
          guide={t('sections.mda.dynamics.fields.playerBehaviors.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.mda.dynamics.fields.decisionMaking.title')}
          guide={t('sections.mda.dynamics.fields.decisionMaking.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.mda.dynamics.fields.riskVsReward.title')}
          guide={t('sections.mda.dynamics.fields.riskVsReward.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.mda.dynamics.fields.socialDynamics.title')}
          guide={t('sections.mda.dynamics.fields.socialDynamics.guide')}
          placeholder={placeholder}
        />
      </Section>

      <Section title={t('sections.setting.title')}>
        <Field
          title={t('sections.setting.fields.world.title')}
          guide={t('sections.setting.fields.world.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.setting.fields.theme.title')}
          guide={t('sections.setting.fields.theme.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.setting.fields.environmentalStorytelling.title')}
          guide={t('sections.setting.fields.environmentalStorytelling.guide')}
          placeholder={placeholder}
        />
      </Section>

      <Section title={t('sections.gameLoop.title')}>
        <Field
          title={t('sections.gameLoop.fields.coreLoop.title')}
          guide={t('sections.gameLoop.fields.coreLoop.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.gameLoop.fields.sessionFlow.title')}
          guide={t('sections.gameLoop.fields.sessionFlow.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.gameLoop.fields.longTermProgression.title')}
          guide={t('sections.gameLoop.fields.longTermProgression.guide')}
          placeholder={placeholder}
        />
      </Section>

      <Section title={t('sections.playerGoals.title')}>
        <Field
          title={t('sections.playerGoals.fields.shortTerm.title')}
          guide={t('sections.playerGoals.fields.shortTerm.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.playerGoals.fields.midTerm.title')}
          guide={t('sections.playerGoals.fields.midTerm.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.playerGoals.fields.longTerm.title')}
          guide={t('sections.playerGoals.fields.longTerm.guide')}
          placeholder={placeholder}
        />
      </Section>

      <Section title={t('sections.victoryFailure.title')}>
        <Field
          title={t('sections.victoryFailure.fields.victoryConditions.title')}
          guide={t('sections.victoryFailure.fields.victoryConditions.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.victoryFailure.fields.failureConditions.title')}
          guide={t('sections.victoryFailure.fields.failureConditions.guide')}
          placeholder={placeholder}
        />
      </Section>

      <Section title={t('sections.difficulty.title')}>
        <Field
          title={t('sections.difficulty.fields.learningCurve.title')}
          guide={t('sections.difficulty.fields.learningCurve.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.difficulty.fields.difficultyCurve.title')}
          guide={t('sections.difficulty.fields.difficultyCurve.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.difficulty.fields.mastery.title')}
          guide={t('sections.difficulty.fields.mastery.guide')}
          placeholder={placeholder}
        />
      </Section>

      <Section title={t('sections.replayability.title')}>
        <Field
          title={t('sections.replayability.fields.replayValue.title')}
          guide={t('sections.replayability.fields.replayValue.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.replayability.fields.variability.title')}
          guide={t('sections.replayability.fields.variability.guide')}
          placeholder={placeholder}
        />
      </Section>

      <Section title={t('sections.principles.title')}>
        <Field
          title={t('sections.principles.fields.principle1.title')}
          guide={t('sections.principles.fields.principle1.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.principles.fields.principle2.title')}
          guide={t('sections.principles.fields.principle2.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.principles.fields.principle3.title')}
          guide={t('sections.principles.fields.principle3.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.principles.fields.tradeoffs.title')}
          guide={t('sections.principles.fields.tradeoffs.guide')}
          placeholder={placeholder}
        />
      </Section>

      <Section title={t('sections.successCriteria.title')}>
        <Field
          title={t('sections.successCriteria.fields.playerExperience.title')}
          guide={t('sections.successCriteria.fields.playerExperience.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.successCriteria.fields.gameplay.title')}
          guide={t('sections.successCriteria.fields.gameplay.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.successCriteria.fields.designGoals.title')}
          guide={t('sections.successCriteria.fields.designGoals.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.successCriteria.fields.redFlags.title')}
          guide={t('sections.successCriteria.fields.redFlags.guide')}
          placeholder={placeholder}
        />
      </Section>

      <Section title={t('sections.pillars.title')}>
        <Field
          title={t('sections.pillars.fields.pillar1.title')}
          guide={t('sections.pillars.fields.pillar1.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.pillars.fields.pillar2.title')}
          guide={t('sections.pillars.fields.pillar2.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.pillars.fields.pillar3.title')}
          guide={t('sections.pillars.fields.pillar3.guide')}
          placeholder={placeholder}
        />
        <Field
          title={t('sections.pillars.fields.neverBecome.title')}
          guide={t('sections.pillars.fields.neverBecome.guide')}
          placeholder={placeholder}
        />
      </Section>
    </main>
  );
};

export default MainForm;
