export const stepsCountShowenInEducation = 4;

export const BACKLINK_KEY = 'auth-backlink';

export const PARTICIPANT_STATES = {
  WAITING_FOR_APPROVAL: 1,
  APPROVED: 2,
  REJECTED: 3,
} as const;

export const PROCEEDING_PHASES = {
  INTRO: 1,
  INVESTIGATION: 2,
  INHERITANCE_PROCEDURE: 3,
  FINISHED: 4,
};

export const PROCEEDING_PHASES_TASKS = [
  {
    id: PROCEEDING_PHASES.INTRO,
    title: 'Úvodní fáze',
    description: {
      title: 'Co probíhá v úvodní fázi dědického řízení?',
      text: 'Úvodní fáze dědického řízení začíná okamžikem odeslání úmrtního listu na matriku. V průběhu této fáze je pověřen příslušný notář vedením dědického řízení. Notář si na soudu vyzvedává příslušný spis a začíná na dědickém řízení pracovat.',
    },
    tasks: [
      {
        id: 1,
        text: 'Vyčkejte, až Vás bude kontaktovat notář, který je pověřen vedením dědického řízení.',
      },
    ],
  },
  {
    id: PROCEEDING_PHASES.INVESTIGATION,
    title: 'Předběžné šetření',
    description: {
      title: 'K čemu slouží předběžné šetření?',
      text: 'V rámci tzv. Předběžného šetření notář od vypravitele pohřbu zjišťuje podrobnosti o pozůstalém, o rodinné anamnéze, majetku pozůstalého ale i ostatních účastnících řízení atd. Na základě těchto informací notář připraví potřebné podklady pro pozůstalostní řízení.',
    },
    tasks: [
      {
        id: 2,
        text: 'V rámci této fáze komunikujete s notářem ohledně podrobností o majetku v pozůstalosti.',
      },
      {
        id: 3,
        text: 'Notář Vás požádá o doložení potřebných dokumentů.',
      },
      {
        id: 4,
        text: 'Využijte nachytřovadlo pro zjištění podrobnějších informací o průběhu dědického řízení a možnostech rozdělení majetku.',
      },
    ],
  },
  {
    id: PROCEEDING_PHASES.INHERITANCE_PROCEDURE,
    title: 'Pozůstalostní řízení',
    description: {
      title: 'Co znamená fáze pozůstalostního řízení?',
      text: 'Pozůstalostní řízení je soudním jednáním v prvním stupni. Notář vystupuje v pozici soudního komisaře. Cílem tohoto jednání je aby se účastníci řízení dohodli na rozdělení majetku v pozůstalosti. Během tohoto jednání jsou přítomni všichni dědicové.',
    },
    tasks: [
      {
        id: 5,
        text: 'Notář vás bude kontaktovat o nařízení soudního jednání, na kterém se řeší rozdělení pozůstalosti.',
      },
      {
        id: 6,
        text: 'Cílem pozůstalostního řízení je, aby se všichni dědicové dohodli na rozdělení majetku v pozůstalosti.',
      },
    ],
  },
  {
    id: PROCEEDING_PHASES.FINISHED,
    title: 'Ukončené',
    description: { title: '', text: '' },
    tasks: [],
  },
];
