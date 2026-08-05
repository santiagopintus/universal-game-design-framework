export type FormFieldSchema = {
  valueKey: string;
  titleKey: string;
  guideKey: string;
};

export type FormGroupSchema = {
  headingKey?: string;
  fields: FormFieldSchema[];
};

export type FormSectionSchema = {
  titleKey: string;
  groups: FormGroupSchema[];
};

const fields = (section: string, names: string[]): FormFieldSchema[] =>
  names.map((name) => ({
    valueKey: `${section}.${name}`,
    titleKey: `sections.${section}.fields.${name}.title`,
    guideKey: `sections.${section}.fields.${name}.guide`,
  }));

const mdaGroupFields = (subgroup: string, names: string[]): FormFieldSchema[] =>
  names.map((name) => ({
    valueKey: `mda.${subgroup}.${name}`,
    titleKey: `sections.mda.${subgroup}.fields.${name}.title`,
    guideKey: `sections.mda.${subgroup}.fields.${name}.guide`,
  }));

export const FORM_SCHEMA: FormSectionSchema[] = [
  {
    titleKey: 'sections.constraints.title',
    groups: [{ fields: fields('constraints', ['budget', 'teamSize', 'technology', 'productionScope']) }],
  },
  {
    titleKey: 'sections.concept.title',
    groups: [{ fields: fields('concept', ['pitch', 'summary']) }],
  },
  {
    titleKey: 'sections.mda.title',
    groups: [
      {
        headingKey: 'sections.mda.aesthetics.heading',
        fields: mdaGroupFields('aesthetics', [
          'emotionalExperience',
          'playerFantasy',
          'desiredExperience',
          'memorableMoments',
        ]),
      },
      {
        headingKey: 'sections.mda.mechanics.heading',
        fields: mdaGroupFields('mechanics', ['coreMechanics', 'resources', 'rules', 'progressionSystems']),
      },
      {
        headingKey: 'sections.mda.dynamics.heading',
        fields: mdaGroupFields('dynamics', [
          'playerBehaviors',
          'decisionMaking',
          'riskVsReward',
          'socialDynamics',
        ]),
      },
    ],
  },
  {
    titleKey: 'sections.setting.title',
    groups: [{ fields: fields('setting', ['world', 'theme', 'environmentalStorytelling']) }],
  },
  {
    titleKey: 'sections.gameLoop.title',
    groups: [{ fields: fields('gameLoop', ['coreLoop', 'sessionFlow', 'longTermProgression']) }],
  },
  {
    titleKey: 'sections.playerGoals.title',
    groups: [{ fields: fields('playerGoals', ['shortTerm', 'midTerm', 'longTerm']) }],
  },
  {
    titleKey: 'sections.victoryFailure.title',
    groups: [{ fields: fields('victoryFailure', ['victoryConditions', 'failureConditions']) }],
  },
  {
    titleKey: 'sections.difficulty.title',
    groups: [{ fields: fields('difficulty', ['learningCurve', 'difficultyCurve', 'mastery']) }],
  },
  {
    titleKey: 'sections.replayability.title',
    groups: [{ fields: fields('replayability', ['replayValue', 'variability']) }],
  },
  {
    titleKey: 'sections.principles.title',
    groups: [{ fields: fields('principles', ['principle1', 'principle2', 'principle3', 'tradeoffs']) }],
  },
  {
    titleKey: 'sections.successCriteria.title',
    groups: [
      { fields: fields('successCriteria', ['playerExperience', 'gameplay', 'designGoals', 'redFlags']) },
    ],
  },
  {
    titleKey: 'sections.pillars.title',
    groups: [{ fields: fields('pillars', ['pillar1', 'pillar2', 'pillar3', 'neverBecome']) }],
  },
];
