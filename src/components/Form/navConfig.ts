export type NavSubsection = {
  id: string;
  headingKey: string;
  fields: string[];
};

export type NavSection = {
  id: string;
  titleKey: string;
  fields: string[];
  subsections?: NavSubsection[];
};

// Must stay in sync with the Field `name` props rendered in ./index.tsx
export const NAV_SECTIONS: NavSection[] = [
  {
    id: 'constraints',
    titleKey: 'sections.constraints.title',
    fields: [
      'constraints.budget',
      'constraints.teamSize',
      'constraints.technology',
      'constraints.productionScope',
    ],
  },
  {
    id: 'concept',
    titleKey: 'sections.concept.title',
    fields: ['concept.pitch', 'concept.summary'],
  },
  {
    id: 'mda',
    titleKey: 'sections.mda.title',
    fields: [],
    subsections: [
      {
        id: 'mda.aesthetics',
        headingKey: 'sections.mda.aesthetics.heading',
        fields: [
          'mda.aesthetics.emotionalExperience',
          'mda.aesthetics.playerFantasy',
          'mda.aesthetics.desiredExperience',
          'mda.aesthetics.memorableMoments',
        ],
      },
      {
        id: 'mda.mechanics',
        headingKey: 'sections.mda.mechanics.heading',
        fields: [
          'mda.mechanics.coreMechanics',
          'mda.mechanics.resources',
          'mda.mechanics.rules',
          'mda.mechanics.progressionSystems',
        ],
      },
      {
        id: 'mda.dynamics',
        headingKey: 'sections.mda.dynamics.heading',
        fields: [
          'mda.dynamics.playerBehaviors',
          'mda.dynamics.decisionMaking',
          'mda.dynamics.riskVsReward',
          'mda.dynamics.socialDynamics',
        ],
      },
    ],
  },
  {
    id: 'setting',
    titleKey: 'sections.setting.title',
    fields: ['setting.world', 'setting.theme', 'setting.environmentalStorytelling'],
  },
  {
    id: 'gameLoop',
    titleKey: 'sections.gameLoop.title',
    fields: ['gameLoop.coreLoop', 'gameLoop.sessionFlow', 'gameLoop.longTermProgression'],
  },
  {
    id: 'playerGoals',
    titleKey: 'sections.playerGoals.title',
    fields: ['playerGoals.shortTerm', 'playerGoals.midTerm', 'playerGoals.longTerm'],
  },
  {
    id: 'victoryFailure',
    titleKey: 'sections.victoryFailure.title',
    fields: ['victoryFailure.victoryConditions', 'victoryFailure.failureConditions'],
  },
  {
    id: 'difficulty',
    titleKey: 'sections.difficulty.title',
    fields: ['difficulty.learningCurve', 'difficulty.difficultyCurve', 'difficulty.mastery'],
  },
  {
    id: 'replayability',
    titleKey: 'sections.replayability.title',
    fields: ['replayability.replayValue', 'replayability.variability'],
  },
  {
    id: 'principles',
    titleKey: 'sections.principles.title',
    fields: [
      'principles.principle1',
      'principles.principle2',
      'principles.principle3',
      'principles.tradeoffs',
    ],
  },
  {
    id: 'successCriteria',
    titleKey: 'sections.successCriteria.title',
    fields: [
      'successCriteria.playerExperience',
      'successCriteria.gameplay',
      'successCriteria.designGoals',
      'successCriteria.redFlags',
    ],
  },
  {
    id: 'pillars',
    titleKey: 'sections.pillars.title',
    fields: ['pillars.pillar1', 'pillars.pillar2', 'pillars.pillar3', 'pillars.neverBecome'],
  },
];
