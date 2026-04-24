import PokemonIv from '../../../util/PokemonIv';

export interface TeamMember {
    /** Pokemon IV data */
    iv: PokemonIv;
    /** Nickname (optional) */
    nickname?: string;
    /** Whether this slot is filled */
    filled: boolean;
}

export interface Team {
    /** Unique team ID */
    id: number;
    /** Team name */
    name: string;
    /** Team members (5 slots) */
    members: TeamMember[];
}

export interface Recipe {
    id: string;
    name: string;
    category: 'curry' | 'salad' | 'dessert';
    energyPerMeal: number;
}

export const RECIPES: Recipe[] = [
    // Curry & Stew (sorted by max energy descending)
    { id: 'curry1', name: 'しんりょくアボカドグラタン', category: 'curry', energyPerMeal: 82839 },
    { id: 'curry2', name: 'いあいぎりすき焼きカレー', category: 'curry', energyPerMeal: 68989 },
    { id: 'curry3', name: 'めざめるパワーシチュー', category: 'curry', energyPerMeal: 63644 },
    { id: 'curry4', name: 'なりきりバケッチャシチュー', category: 'curry', energyPerMeal: 52174 },
    { id: 'curry5', name: 'れんごくコーンキーマカレー', category: 'curry', energyPerMeal: 45725 },
    { id: 'curry6', name: 'ニンジャカレー', category: 'curry', energyPerMeal: 31546 },
    { id: 'curry7', name: 'ぜったいねむりバターカレー', category: 'curry', energyPerMeal: 30093 },
    { id: 'curry8', name: 'あぶりテールカレー', category: 'curry', energyPerMeal: 24993 },
    { id: 'curry9', name: 'からくちネギもりカレー', category: 'curry', energyPerMeal: 19706 },
    { id: 'curry10', name: 'ピヨピヨパンチ辛口カレー', category: 'curry', energyPerMeal: 19045 },
    { id: 'curry11', name: 'じゅうなんコーンシチュー', category: 'curry', energyPerMeal: 15598 },
    { id: 'curry12', name: 'おやこあいカレー', category: 'curry', energyPerMeal: 15107 },
    { id: 'curry13', name: 'キノコのほうしカレー', category: 'curry', energyPerMeal: 13901 },
    { id: 'curry14', name: 'とくせんリンゴカレー', category: 'curry', energyPerMeal: 2498 },

    // Salad (sorted by max energy descending)
    { id: 'salad1', name: 'じならしワカモレチップス', category: 'salad', energyPerMeal: 84041 },
    { id: 'salad2', name: 'まけんきコーヒーサラダ', category: 'salad', energyPerMeal: 67528 },
    { id: 'salad3', name: 'りんごさんヨーグルトサラダ', category: 'salad', energyPerMeal: 64399 },
    { id: 'salad4', name: 'はなふぶきミモザサラダ', category: 'salad', energyPerMeal: 39449 },
    { id: 'salad5', name: '忍者サラダ', category: 'salad', energyPerMeal: 38941 },
    { id: 'salad6', name: 'ワカクササラダ', category: 'salad', energyPerMeal: 38053 },
    { id: 'salad7', name: 'クロスチョップドサラダ', category: 'salad', energyPerMeal: 29242 },
    { id: 'salad8', name: 'ヤドンテールペッパーサラダ', category: 'salad', energyPerMeal: 27285 },
    { id: 'salad9', name: 'めいそうスイートサラダ', category: 'salad', energyPerMeal: 25635 },
    { id: 'salad10', name: 'くだけるアボカドサラダ', category: 'salad', energyPerMeal: 23798 },
    { id: 'salad11', name: 'キノコのほうしサラダ', category: 'salad', energyPerMeal: 19569 },
    { id: 'salad12', name: 'オーバーヒートサラダ', category: 'salad', energyPerMeal: 17452 },

    // Dessert & Drink (sorted by max energy descending)
    { id: 'dessert1', name: 'みつあつめチョコワッフル', category: 'dessert', energyPerMeal: 85117 },
    { id: 'dessert2', name: 'ドキドキこわいかおパンケーキ', category: 'dessert', energyPerMeal: 81342 },
    { id: 'dessert3', name: 'ドオーのエクレア', category: 'dessert', energyPerMeal: 69756 },
    { id: 'dessert4', name: 'スパークスパイスコーラ', category: 'dessert', energyPerMeal: 58430 },
    { id: 'dessert5', name: 'フラワーギフトマカロン', category: 'dessert', energyPerMeal: 46206 },
    { id: 'dessert6', name: 'おちゃかいコーンスコーン', category: 'dessert', energyPerMeal: 36490 },
    { id: 'dessert7', name: 'プリンのプリンアラモード', category: 'dessert', energyPerMeal: 25364 },
    { id: 'dessert8', name: 'かたやぶりコーンティラミス', category: 'dessert', energyPerMeal: 23798 },
    { id: 'dessert9', name: 'はやおきコーヒーゼリー', category: 'dessert', energyPerMeal: 22685 },
    { id: 'dessert10', name: 'だいばくはつポップコーン', category: 'dessert', energyPerMeal: 20200 },
];

export interface TeamState {
    /** All teams */
    teams: Team[];
    /** Currently selected team ID */
    selectedTeamId: number;
    /** Whether optimization dialog is open */
    optimizationDialogOpen: boolean;
    /** Selected recipe for cooking energy calculation */
    selectedRecipeId: string;
}

export function createEmptyTeam(id: number, name: string): Team {
    return {
        id,
        name,
        members: Array(5).fill(null).map(() => ({
            iv: new PokemonIv({ pokemonName: "Venusaur" }),
            filled: false,
        })),
    };
}

export function createInitialTeamState(): TeamState {
    return {
        teams: [createEmptyTeam(0, 'Team 1')],
        selectedTeamId: 0,
        optimizationDialogOpen: false,
        selectedRecipeId: 'curry1',
    };
}
