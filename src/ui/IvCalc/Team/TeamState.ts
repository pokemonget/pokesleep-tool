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
    // Curry & Stew (based on wiki data - approximate values for Lv60 with recipe bonus)
    { id: 'curry1', name: 'とくせんリンゴカレー', category: 'curry', energyPerMeal: 15000 },
    { id: 'curry2', name: 'あぶりテールカレー', category: 'curry', energyPerMeal: 18000 },
    { id: 'curry3', name: 'ニンジャカレー', category: 'curry', energyPerMeal: 20000 },
    { id: 'curry4', name: 'ぜったいねむりバターカレー', category: 'curry', energyPerMeal: 17000 },
    { id: 'curry5', name: 'おやこあいカレー', category: 'curry', energyPerMeal: 14000 },
    { id: 'curry6', name: 'キノコのほうしカレー', category: 'curry', energyPerMeal: 13000 },
    { id: 'curry7', name: 'からくちネギもりカレー', category: 'curry', energyPerMeal: 14500 },
    { id: 'curry8', name: 'ピヨピヨパンチ辛口カレー', category: 'curry', energyPerMeal: 12000 },
    { id: 'curry9', name: 'れんごくコーンキーマカレー', category: 'curry', energyPerMeal: 16000 },
    { id: 'curry10', name: 'いあいぎりすき焼きカレー', category: 'curry', energyPerMeal: 22000 },
    { id: 'stew1', name: 'めざめるパワーシチュー', category: 'curry', energyPerMeal: 17500 },
    { id: 'stew2', name: 'じゅうなんコーンシチュー', category: 'curry', energyPerMeal: 15000 },
    { id: 'stew3', name: 'なりきりバケッチャシチュー', category: 'curry', energyPerMeal: 15500 },

    // Salad
    { id: 'salad1', name: 'あぶりテールサラダ', category: 'salad', energyPerMeal: 17000 },
    { id: 'salad2', name: 'げきからハーブサラダ', category: 'salad', energyPerMeal: 14000 },
    { id: 'salad3', name: 'あじわいキノコサラダ', category: 'salad', energyPerMeal: 13000 },
    { id: 'salad4', name: 'モーモーミルクサラダ', category: 'salad', energyPerMeal: 12000 },
    { id: 'salad5', name: 'ほっこりポテトサラダ', category: 'salad', energyPerMeal: 13500 },
    { id: 'salad6', name: 'とくせんエッグサラダ', category: 'salad', energyPerMeal: 14500 },
    { id: 'salad7', name: 'ワカクサ大豆サラダ', category: 'salad', energyPerMeal: 12500 },
    { id: 'salad8', name: 'マメミートサラダ', category: 'salad', energyPerMeal: 14000 },
    { id: 'salad9', name: 'あったかジンジャーサラダ', category: 'salad', energyPerMeal: 13000 },
    { id: 'salad10', name: 'あんみんトマトサラダ', category: 'salad', energyPerMeal: 12000 },

    // Dessert & Drink
    { id: 'dessert1', name: 'まけんきコーヒー', category: 'dessert', energyPerMeal: 25000 },
    { id: 'dessert2', name: 'ドオーのエクレア', category: 'dessert', energyPerMeal: 23000 },
    { id: 'dessert3', name: 'めざましコーヒー', category: 'dessert', energyPerMeal: 18000 },
    { id: 'dessert4', name: 'とくせんリンゴパイ', category: 'dessert', energyPerMeal: 16000 },
    { id: 'dessert5', name: 'おいしいシッポプリン', category: 'dessert', energyPerMeal: 19000 },
    { id: 'dessert6', name: 'げきからハーブティー', category: 'dessert', energyPerMeal: 14000 },
    { id: 'dessert7', name: 'あまいミツスイーツ', category: 'dessert', energyPerMeal: 13000 },
    { id: 'dessert8', name: 'リラックスカカオドリンク', category: 'dessert', energyPerMeal: 15000 },
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
