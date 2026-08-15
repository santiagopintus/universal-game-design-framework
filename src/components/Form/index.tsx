'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { getIdea, saveIdea } from '@/lib/ideaStorage';
import { downloadJson, downloadMarkdown, downloadPdf } from '@/lib/exportIdea';
import Field from './Field';
import Section from './FormSection';
import Sidebar from './Sidebar';

interface FormState {
  ideaTitle: string;
  values: Record<string, string>;
  currentId: string | null;
}

const MainForm = () => {
  const t = useTranslations('form');
  const router = useRouter();
  const placeholder = t('placeholder');

  const [formState, setFormState] = useState<FormState>({
    ideaTitle: '',
    values: {},
    currentId: null,
  });
  const [saved, setSaved] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) return;

    const idea = getIdea(id);
    if (!idea) return;

    setFormState({ ideaTitle: idea.ideaTitle, values: idea.values, currentId: idea.id });
  }, []);

  const setIdeaTitle = (ideaTitle: string) => setFormState((prev) => ({ ...prev, ideaTitle }));

  const field = (key: string) => ({
    value: formState.values[key] ?? '',
    onChange: (value: string) =>
      setFormState((prev) => ({ ...prev, values: { ...prev.values, [key]: value } })),
  });

  const handleSave = () => {
    const id = formState.currentId ?? crypto.randomUUID();

    saveIdea({
      id,
      ideaTitle: formState.ideaTitle,
      updatedAt: new Date().toISOString(),
      values: formState.values,
    });

    if (!formState.currentId) {
      setFormState((prev) => ({ ...prev, currentId: id }));
      router.replace(`/?id=${id}`);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDownloadMd = () => {
    downloadMarkdown(t, formState.ideaTitle, formState.values, t('untitledIdea'), t('noAnswer'));
  };

  const handleDownloadJson = () => {
    downloadJson(t, formState.ideaTitle, formState.values, t('untitledIdea'));
  };

  const handleDownloadPdf = async () => {
    setExportingPdf(true);
    try {
      await downloadPdf(t, formState.ideaTitle, formState.values, t('untitledIdea'), t('noAnswer'));
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto md:flex md:items-start md:gap-8 px-4 md:px-8">
      <Sidebar values={formState.values} />
      <main className="md:w-[60%] mx-auto p-8 pb-28 space-y-8">
        <h1 className="text-4xl font-bold mb-2 text-foreground">{t('title')}</h1>
        <p className="text-text-muted mb-8">{t('description')}</p>

        <div className="mb-6">
          <label htmlFor="ideaTitle" className="block font-semibold mb-1 text-foreground">
            {t('ideaTitleLabel')}
          </label>
          <input
            id="ideaTitle"
            type="text"
            className="w-full bg-background border border-accent-muted rounded-lg p-3 text-foreground placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
            placeholder={t('ideaTitlePlaceholder')}
            value={formState.ideaTitle}
            onChange={(e) => setIdeaTitle(e.target.value)}
          />
        </div>

        <Section id="constraints" title={t('sections.constraints.title')}>
          <Field
            name="constraints.budget"
            title={t('sections.constraints.fields.budget.title')}
            guide={t('sections.constraints.fields.budget.guide')}
            placeholder={placeholder}
            {...field('constraints.budget')}
          />
          <Field
            name="constraints.teamSize"
            title={t('sections.constraints.fields.teamSize.title')}
            guide={t('sections.constraints.fields.teamSize.guide')}
            placeholder={placeholder}
            {...field('constraints.teamSize')}
          />
          <Field
            name="constraints.technology"
            title={t('sections.constraints.fields.technology.title')}
            guide={t('sections.constraints.fields.technology.guide')}
            placeholder={placeholder}
            {...field('constraints.technology')}
          />
          <Field
            name="constraints.productionScope"
            title={t('sections.constraints.fields.productionScope.title')}
            guide={t('sections.constraints.fields.productionScope.guide')}
            placeholder={placeholder}
            {...field('constraints.productionScope')}
          />
        </Section>

        <Section id="concept" title={t('sections.concept.title')}>
          <Field
            name="concept.pitch"
            title={t('sections.concept.fields.pitch.title')}
            guide={t('sections.concept.fields.pitch.guide')}
            placeholder={placeholder}
            {...field('concept.pitch')}
          />
          <Field
            name="concept.summary"
            title={t('sections.concept.fields.summary.title')}
            guide={t('sections.concept.fields.summary.guide')}
            placeholder={placeholder}
            {...field('concept.summary')}
          />
        </Section>

        <Section id="mda" title={t('sections.mda.title')}>
          <h3 id="mda.aesthetics" className="text-xl font-semibold mb-3 text-accent">
            {t('sections.mda.aesthetics.heading')}
          </h3>
          <Field
            name="mda.aesthetics.emotionalExperience"
            title={t('sections.mda.aesthetics.fields.emotionalExperience.title')}
            guide={t('sections.mda.aesthetics.fields.emotionalExperience.guide')}
            placeholder={placeholder}
            {...field('mda.aesthetics.emotionalExperience')}
          />
          <Field
            name="mda.aesthetics.playerFantasy"
            title={t('sections.mda.aesthetics.fields.playerFantasy.title')}
            guide={t('sections.mda.aesthetics.fields.playerFantasy.guide')}
            placeholder={placeholder}
            {...field('mda.aesthetics.playerFantasy')}
          />
          <Field
            name="mda.aesthetics.desiredExperience"
            title={t('sections.mda.aesthetics.fields.desiredExperience.title')}
            guide={t('sections.mda.aesthetics.fields.desiredExperience.guide')}
            placeholder={placeholder}
            {...field('mda.aesthetics.desiredExperience')}
          />
          <Field
            name="mda.aesthetics.memorableMoments"
            title={t('sections.mda.aesthetics.fields.memorableMoments.title')}
            guide={t('sections.mda.aesthetics.fields.memorableMoments.guide')}
            placeholder={placeholder}
            {...field('mda.aesthetics.memorableMoments')}
          />
          <h3 id="mda.mechanics" className="text-xl font-semibold mb-3 text-accent">
            {t('sections.mda.mechanics.heading')}
          </h3>
          <Field
            name="mda.mechanics.coreMechanics"
            title={t('sections.mda.mechanics.fields.coreMechanics.title')}
            guide={t('sections.mda.mechanics.fields.coreMechanics.guide')}
            placeholder={placeholder}
            {...field('mda.mechanics.coreMechanics')}
          />
          <Field
            name="mda.mechanics.resources"
            title={t('sections.mda.mechanics.fields.resources.title')}
            guide={t('sections.mda.mechanics.fields.resources.guide')}
            placeholder={placeholder}
            {...field('mda.mechanics.resources')}
          />
          <Field
            name="mda.mechanics.rules"
            title={t('sections.mda.mechanics.fields.rules.title')}
            guide={t('sections.mda.mechanics.fields.rules.guide')}
            placeholder={placeholder}
            {...field('mda.mechanics.rules')}
          />
          <Field
            name="mda.mechanics.progressionSystems"
            title={t('sections.mda.mechanics.fields.progressionSystems.title')}
            guide={t('sections.mda.mechanics.fields.progressionSystems.guide')}
            placeholder={placeholder}
            {...field('mda.mechanics.progressionSystems')}
          />
          <h3 id="mda.dynamics" className="text-xl font-semibold mb-3 text-accent">
            {t('sections.mda.dynamics.heading')}
          </h3>
          <Field
            name="mda.dynamics.playerBehaviors"
            title={t('sections.mda.dynamics.fields.playerBehaviors.title')}
            guide={t('sections.mda.dynamics.fields.playerBehaviors.guide')}
            placeholder={placeholder}
            {...field('mda.dynamics.playerBehaviors')}
          />
          <Field
            name="mda.dynamics.decisionMaking"
            title={t('sections.mda.dynamics.fields.decisionMaking.title')}
            guide={t('sections.mda.dynamics.fields.decisionMaking.guide')}
            placeholder={placeholder}
            {...field('mda.dynamics.decisionMaking')}
          />
          <Field
            name="mda.dynamics.riskVsReward"
            title={t('sections.mda.dynamics.fields.riskVsReward.title')}
            guide={t('sections.mda.dynamics.fields.riskVsReward.guide')}
            placeholder={placeholder}
            {...field('mda.dynamics.riskVsReward')}
          />
          <Field
            name="mda.dynamics.socialDynamics"
            title={t('sections.mda.dynamics.fields.socialDynamics.title')}
            guide={t('sections.mda.dynamics.fields.socialDynamics.guide')}
            placeholder={placeholder}
            {...field('mda.dynamics.socialDynamics')}
          />
        </Section>

        <Section id="setting" title={t('sections.setting.title')}>
          <Field
            name="setting.world"
            title={t('sections.setting.fields.world.title')}
            guide={t('sections.setting.fields.world.guide')}
            placeholder={placeholder}
            {...field('setting.world')}
          />
          <Field
            name="setting.theme"
            title={t('sections.setting.fields.theme.title')}
            guide={t('sections.setting.fields.theme.guide')}
            placeholder={placeholder}
            {...field('setting.theme')}
          />
          <Field
            name="setting.environmentalStorytelling"
            title={t('sections.setting.fields.environmentalStorytelling.title')}
            guide={t('sections.setting.fields.environmentalStorytelling.guide')}
            placeholder={placeholder}
            {...field('setting.environmentalStorytelling')}
          />
        </Section>

        <Section id="gameLoop" title={t('sections.gameLoop.title')}>
          <Field
            name="gameLoop.coreLoop"
            title={t('sections.gameLoop.fields.coreLoop.title')}
            guide={t('sections.gameLoop.fields.coreLoop.guide')}
            placeholder={placeholder}
            {...field('gameLoop.coreLoop')}
          />
          <Field
            name="gameLoop.sessionFlow"
            title={t('sections.gameLoop.fields.sessionFlow.title')}
            guide={t('sections.gameLoop.fields.sessionFlow.guide')}
            placeholder={placeholder}
            {...field('gameLoop.sessionFlow')}
          />
          <Field
            name="gameLoop.longTermProgression"
            title={t('sections.gameLoop.fields.longTermProgression.title')}
            guide={t('sections.gameLoop.fields.longTermProgression.guide')}
            placeholder={placeholder}
            {...field('gameLoop.longTermProgression')}
          />
        </Section>

        <Section id="playerGoals" title={t('sections.playerGoals.title')}>
          <Field
            name="playerGoals.shortTerm"
            title={t('sections.playerGoals.fields.shortTerm.title')}
            guide={t('sections.playerGoals.fields.shortTerm.guide')}
            placeholder={placeholder}
            {...field('playerGoals.shortTerm')}
          />
          <Field
            name="playerGoals.midTerm"
            title={t('sections.playerGoals.fields.midTerm.title')}
            guide={t('sections.playerGoals.fields.midTerm.guide')}
            placeholder={placeholder}
            {...field('playerGoals.midTerm')}
          />
          <Field
            name="playerGoals.longTerm"
            title={t('sections.playerGoals.fields.longTerm.title')}
            guide={t('sections.playerGoals.fields.longTerm.guide')}
            placeholder={placeholder}
            {...field('playerGoals.longTerm')}
          />
        </Section>

        <Section id="victoryFailure" title={t('sections.victoryFailure.title')}>
          <Field
            name="victoryFailure.victoryConditions"
            title={t('sections.victoryFailure.fields.victoryConditions.title')}
            guide={t('sections.victoryFailure.fields.victoryConditions.guide')}
            placeholder={placeholder}
            {...field('victoryFailure.victoryConditions')}
          />
          <Field
            name="victoryFailure.failureConditions"
            title={t('sections.victoryFailure.fields.failureConditions.title')}
            guide={t('sections.victoryFailure.fields.failureConditions.guide')}
            placeholder={placeholder}
            {...field('victoryFailure.failureConditions')}
          />
        </Section>

        <Section id="difficulty" title={t('sections.difficulty.title')}>
          <Field
            name="difficulty.learningCurve"
            title={t('sections.difficulty.fields.learningCurve.title')}
            guide={t('sections.difficulty.fields.learningCurve.guide')}
            placeholder={placeholder}
            {...field('difficulty.learningCurve')}
          />
          <Field
            name="difficulty.difficultyCurve"
            title={t('sections.difficulty.fields.difficultyCurve.title')}
            guide={t('sections.difficulty.fields.difficultyCurve.guide')}
            placeholder={placeholder}
            {...field('difficulty.difficultyCurve')}
          />
          <Field
            name="difficulty.mastery"
            title={t('sections.difficulty.fields.mastery.title')}
            guide={t('sections.difficulty.fields.mastery.guide')}
            placeholder={placeholder}
            {...field('difficulty.mastery')}
          />
        </Section>

        <Section id="replayability" title={t('sections.replayability.title')}>
          <Field
            name="replayability.replayValue"
            title={t('sections.replayability.fields.replayValue.title')}
            guide={t('sections.replayability.fields.replayValue.guide')}
            placeholder={placeholder}
            {...field('replayability.replayValue')}
          />
          <Field
            name="replayability.variability"
            title={t('sections.replayability.fields.variability.title')}
            guide={t('sections.replayability.fields.variability.guide')}
            placeholder={placeholder}
            {...field('replayability.variability')}
          />
        </Section>

        <Section id="principles" title={t('sections.principles.title')}>
          <Field
            name="principles.principle1"
            title={t('sections.principles.fields.principle1.title')}
            guide={t('sections.principles.fields.principle1.guide')}
            placeholder={placeholder}
            {...field('principles.principle1')}
          />
          <Field
            name="principles.principle2"
            title={t('sections.principles.fields.principle2.title')}
            guide={t('sections.principles.fields.principle2.guide')}
            placeholder={placeholder}
            {...field('principles.principle2')}
          />
          <Field
            name="principles.principle3"
            title={t('sections.principles.fields.principle3.title')}
            guide={t('sections.principles.fields.principle3.guide')}
            placeholder={placeholder}
            {...field('principles.principle3')}
          />
          <Field
            name="principles.tradeoffs"
            title={t('sections.principles.fields.tradeoffs.title')}
            guide={t('sections.principles.fields.tradeoffs.guide')}
            placeholder={placeholder}
            {...field('principles.tradeoffs')}
          />
        </Section>

        <Section id="successCriteria" title={t('sections.successCriteria.title')}>
          <Field
            name="successCriteria.playerExperience"
            title={t('sections.successCriteria.fields.playerExperience.title')}
            guide={t('sections.successCriteria.fields.playerExperience.guide')}
            placeholder={placeholder}
            {...field('successCriteria.playerExperience')}
          />
          <Field
            name="successCriteria.gameplay"
            title={t('sections.successCriteria.fields.gameplay.title')}
            guide={t('sections.successCriteria.fields.gameplay.guide')}
            placeholder={placeholder}
            {...field('successCriteria.gameplay')}
          />
          <Field
            name="successCriteria.designGoals"
            title={t('sections.successCriteria.fields.designGoals.title')}
            guide={t('sections.successCriteria.fields.designGoals.guide')}
            placeholder={placeholder}
            {...field('successCriteria.designGoals')}
          />
          <Field
            name="successCriteria.redFlags"
            title={t('sections.successCriteria.fields.redFlags.title')}
            guide={t('sections.successCriteria.fields.redFlags.guide')}
            placeholder={placeholder}
            {...field('successCriteria.redFlags')}
          />
        </Section>

        <Section id="pillars" title={t('sections.pillars.title')}>
          <Field
            name="pillars.pillar1"
            title={t('sections.pillars.fields.pillar1.title')}
            guide={t('sections.pillars.fields.pillar1.guide')}
            placeholder={placeholder}
            {...field('pillars.pillar1')}
          />
          <Field
            name="pillars.pillar2"
            title={t('sections.pillars.fields.pillar2.title')}
            guide={t('sections.pillars.fields.pillar2.guide')}
            placeholder={placeholder}
            {...field('pillars.pillar2')}
          />
          <Field
            name="pillars.pillar3"
            title={t('sections.pillars.fields.pillar3.title')}
            guide={t('sections.pillars.fields.pillar3.guide')}
            placeholder={placeholder}
            {...field('pillars.pillar3')}
          />
          <Field
            name="pillars.neverBecome"
            title={t('sections.pillars.fields.neverBecome.title')}
            guide={t('sections.pillars.fields.neverBecome.guide')}
            placeholder={placeholder}
            {...field('pillars.neverBecome')}
          />
        </Section>

        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {saved && (
            <span className="px-3 py-1.5 rounded-md bg-surface border border-accent-muted text-accent text-sm shadow-sm">
              {t('savedConfirmation')}
            </span>
          )}
          <button
            type="button"
            onClick={handleDownloadJson}
            className="cursor-pointer px-4 py-3 rounded-lg bg-surface border border-accent-muted text-foreground font-medium shadow-lg hover:border-accent transition-colors"
          >
            {t('downloadJsonButton')}
          </button>
          <button
            type="button"
            onClick={handleDownloadMd}
            className="cursor-pointer px-4 py-3 rounded-lg bg-surface border border-accent-muted text-foreground font-medium shadow-lg hover:border-accent transition-colors"
          >
            {t('downloadMdButton')}
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={exportingPdf}
            className="cursor-pointer px-4 py-3 rounded-lg bg-surface border border-accent-muted text-foreground font-medium shadow-lg hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('downloadPdfButton')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="cursor-pointer px-6 py-3 rounded-lg bg-accent text-background font-medium shadow-lg hover:opacity-90 transition-opacity"
          >
            {t('saveButton')}
          </button>
        </div>
      </main>
    </div>
  );
};

export default MainForm;
