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
    /** Recipe ID */
    id: number;
    /** Recipe name */
    name: string;
    /** Energy per meal */
    energyPerMeal: number;
    /** Required ingredients (simplified) */
    ingredients: string[];
}

export const RECIPES: Recipe[] = [
    // Curry & Stew
    { id: 0, name: 'とくせんリンゴカレー', energyPerMeal: 420, ingredients: [] },
    { id: 1, name: 'あぶりテールカレー', energyPerMeal: 840, ingredients: [] },
    { id: 2, name: 'からくちネギもりカレー', energyPerMeal: 840, ingredients: [] },
    { id: 3, name: 'ニンジャカレー', energyPerMeal: 1260, ingredients: [] },
    { id: 4, name: 'おやこあいカレー', energyPerMeal: 420, ingredients: [] },
    { id: 5, name: 'ぜったいねむりバターカレー', energyPerMeal: 1260, ingredients: [] },
    { id: 6, name: 'れんごくコーンキーマカレー', energyPerMeal: 1260, ingredients: [] },
    { id: 7, name: 'ピヨピヨパンチ辛口カレー', energyPerMeal: 1260, ingredients: [] },
    { id: 8, name: 'じゅうなんコーンシチュー', energyPerMeal: 840, ingredients: [] },
    { id: 9, name: 'なりきりバケッチャシチュー', energyPerMeal: 1260, ingredients: [] },
    { id: 10, name: 'めざめるパワーシチュー', energyPerMeal: 1260, ingredients: [] },
    { id: 11, name: 'いあいぎりすき焼きカレー', energyPerMeal: 1260, ingredients: [] },
    { id: 12, name: 'しんりょくアボカドグラタン', energyPerMeal: 1680, ingredients: [] },
    // Salad
    { id: 20, name: 'クリアアップサラダ', energyPerMeal: 420, ingredients: [] },
    { id: 21, name: 'マメミートサラダ', energyPerMeal: 420, ingredients: [] },
    { id: 22, name: 'とくせんリンゴサラダ', energyPerMeal: 420, ingredients: [] },
    { id: 23, name: 'つやつやアボカドサラダ', energyPerMeal: 1260, ingredients: [] },
    { id: 24, name: 'ワカクサ大豆サラダ', energyPerMeal: 840, ingredients: [] },
    { id: 25, name: 'めざましコーヒーサラダ', energyPerMeal: 1260, ingredients: [] },
    { id: 26, name: 'げんきオールサラダ', energyPerMeal: 1680, ingredients: [] },
    { id: 27, name: 'おてつだいサポートサラダ', energyPerMeal: 1680, ingredients: [] },
    { id: 28, name: 'エナジーチャージSサラダ', energyPerMeal: 1680, ingredients: [] },
    { id: 29, name: 'エナジーチャージMサラダ', energyPerMeal: 2100, ingredients: [] },
    // Dessert & Drink
    { id: 40, name: 'モーモーミルク', energyPerMeal: 420, ingredients: [] },
    { id: 41, name: 'ピュアなオイル', energyPerMeal: 420, ingredients: [] },
    { id: 42, name: 'ほっこりポテト', energyPerMeal: 420, ingredients: [] },
    { id: 43, name: 'つやつやアボカド', energyPerMeal: 840, ingredients: [] },
    { id: 44, name: 'マメミート', energyPerMeal: 420, ingredients: [] },
    { id: 45, name: 'ふといながねぎ', energyPerMeal: 420, ingredients: [] },
    { id: 46, name: 'とくせんエッグ', energyPerMeal: 420, ingredients: [] },
    { id: 47, name: 'あまいミツ', energyPerMeal: 420, ingredients: [] },
    { id: 48, name: 'げきからハーブ', energyPerMeal: 420, ingredients: [] },
    { id: 49, name: 'あったかジンジャー', energyPerMeal: 420, ingredients: [] },
    { id: 50, name: 'あんみんトマト', energyPerMeal: 420, ingredients: [] },
    { id: 51, name: 'あじわいキノコ', energyPerMeal: 420, ingredients: [] },
    { id: 52, name: 'めざましコーヒー', energyPerMeal: 840, ingredients: [] },
    { id: 53, name: 'ワカクサコーン', energyPerMeal: 840, ingredients: [] },
    { id: 54, name: 'ワカクサ大豆', energyPerMeal: 840, ingredients: [] },
    { id: 55, name: 'リラックスカカオ', energyPerMeal: 840, ingredients: [] },
    { id: 56, name: 'ずっしりカボチャ', energyPerMeal: 1260, ingredients: [] },
];

export interface TeamState {
    /** All teams */
    teams: Team[];
    /** Currently selected team ID */
    selectedTeamId: number;
    /** Whether optimization dialog is open */
    optimizationDialogOpen: boolean;
    /** Selected recipe for cooking energy calculation */
    selectedRecipeId: number;
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
        selectedRecipeId: 0,
    };
}
