import PokemonIv from '../../../util/PokemonIv';
import { IngredientName } from '../../../data/pokemons';

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

export interface RecipeIngredient {
    name: string;
    amount: number;
}

/**
 * Map Japanese ingredient names to IngredientName
 */
export function mapIngredientName(japaneseName: string): IngredientName {
    const mapping: Record<string, IngredientName> = {
        'つやつやアボカド': 'avocado',
        'ほっこりポテト': 'potato',
        'モーモーミルク': 'milk',
        'ピュアなオイル': 'oil',
        'ふといながねぎ': 'leek',
        'あまいミツ': 'honey',
        'マメミート': 'sausage',
        'とくせんエッグ': 'egg',
        'ワカクサ大豆': 'soy',
        'あんみんトマト': 'tomato',
        'あじわいキノコ': 'mushroom',
        'めざましコーヒー': 'coffee',
        'ずっしりカボチャ': 'pumpkin',
        'げきからハーブ': 'herb',
        'あったかジンジャー': 'ginger',
        'おいしいシッポ': 'tail',
        'とくせんリンゴ': 'apple',
        'リラックスカカオ': 'cacao',
        'ワカクサコーン': 'corn',
    };
    return mapping[japaneseName] || 'unknown';
}

export interface Recipe {
    id: string;
    name: string;
    category: 'curry' | 'salad' | 'dessert';
    energyPerMeal: number;
    ingredients?: RecipeIngredient[];
}

export const RECIPES: Recipe[] = [
    // Curry & Stew (sorted by max energy descending)
    { id: 'curry1', name: 'しんりょくアボカドグラタン', category: 'curry', energyPerMeal: 82839, ingredients: [{ name: 'つやつやアボカド', amount: 22 }, { name: 'ほっこりポテト', amount: 20 }, { name: 'モーモーミルク', amount: 41 }, { name: 'ピュアなオイル', amount: 32 }] },
    { id: 'curry2', name: 'いあいぎりすき焼きカレー', category: 'curry', energyPerMeal: 68989, ingredients: [{ name: 'ふといながねぎ', amount: 27 }, { name: 'あまいミツ', amount: 26 }, { name: 'マメミート', amount: 26 }, { name: 'とくせんエッグ', amount: 22 }] },
    { id: 'curry3', name: 'めざめるパワーシチュー', category: 'curry', energyPerMeal: 63644, ingredients: [{ name: 'ワカクサ大豆', amount: 28 }, { name: 'あんみんトマト', amount: 25 }, { name: 'あじわいキノコ', amount: 23 }, { name: 'めざましコーヒー', amount: 16 }] },
    { id: 'curry4', name: 'なりきりバケッチャシチュー', category: 'curry', energyPerMeal: 52174, ingredients: [{ name: 'あじわいキノコ', amount: 25 }, { name: 'ほっこりポテト', amount: 18 }, { name: 'マメミート', amount: 16 }, { name: 'ずっしりカボチャ', amount: 10 }] },
    { id: 'curry5', name: 'れんごくコーンキーマカレー', category: 'curry', energyPerMeal: 45725, ingredients: [{ name: 'げきからハーブ', amount: 27 }, { name: 'マメミート', amount: 24 }, { name: 'ワカクサコーン', amount: 14 }, { name: 'あったかジンジャー', amount: 12 }] },
    { id: 'curry6', name: 'ニンジャカレー', category: 'curry', energyPerMeal: 31546, ingredients: [{ name: 'ワカクサ大豆', amount: 24 }, { name: 'ふといながねぎ', amount: 12 }, { name: 'マメミート', amount: 9 }, { name: 'あじわいキノコ', amount: 5 }] },
    { id: 'curry7', name: 'ぜったいねむりバターカレー', category: 'curry', energyPerMeal: 30093, ingredients: [{ name: 'ほっこりポテト', amount: 18 }, { name: 'リラックスカカオ', amount: 12 }, { name: 'あんみんトマト', amount: 15 }, { name: 'モーモーミルク', amount: 10 }] },
    { id: 'curry8', name: 'あぶりテールカレー', category: 'curry', energyPerMeal: 24993, ingredients: [{ name: 'おいしいシッポ', amount: 8 }, { name: 'げきからハーブ', amount: 25 }] },
    { id: 'curry9', name: 'からくちネギもりカレー', category: 'curry', energyPerMeal: 19706, ingredients: [{ name: 'ふといながねぎ', amount: 14 }, { name: 'あったかジンジャー', amount: 10 }, { name: 'げきからハーブ', amount: 8 }] },
    { id: 'curry10', name: 'ピヨピヨパンチ辛口カレー', category: 'curry', energyPerMeal: 19045, ingredients: [{ name: 'めざましコーヒー', amount: 11 }, { name: 'げきからハーブ', amount: 11 }, { name: 'あまいミツ', amount: 11 }] },
    { id: 'curry11', name: 'じゅうなんコーンシチュー', category: 'curry', energyPerMeal: 15598, ingredients: [{ name: 'ワカクサコーン', amount: 14 }, { name: 'モーモーミルク', amount: 8 }, { name: 'ほっこりポテト', amount: 8 }] },
    { id: 'curry12', name: 'おやこあいカレー', category: 'curry', energyPerMeal: 15107, ingredients: [{ name: 'あまいミツ', amount: 12 }, { name: 'とくせんエッグ', amount: 8 }, { name: 'とくせんリンゴ', amount: 11 }, { name: 'ほっこりポテト', amount: 4 }] },
    { id: 'curry13', name: 'キノコのほうしカレー', category: 'curry', energyPerMeal: 13901, ingredients: [{ name: 'あじわいキノコ', amount: 14 }, { name: 'ほっこりポテト', amount: 9 }] },
    { id: 'curry14', name: 'とくせんリンゴカレー', category: 'curry', energyPerMeal: 2498, ingredients: [{ name: 'とくせんリンゴ', amount: 7 }] },

    // Salad (sorted by max energy descending)
    { id: 'salad1', name: 'じならしワカモレチップス', category: 'salad', energyPerMeal: 84041, ingredients: [{ name: 'つやつやアボカド', amount: 28 }, { name: 'ワカクサコーン', amount: 25 }, { name: 'げきからハーブ', amount: 30 }, { name: 'ワカクサ大豆', amount: 22 }] },
    { id: 'salad2', name: 'まけんきコーヒーサラダ', category: 'salad', energyPerMeal: 67528, ingredients: [{ name: 'めざましコーヒー', amount: 28 }, { name: 'マメミート', amount: 28 }, { name: 'ピュアなオイル', amount: 22 }, { name: 'ほっこりポテト', amount: 22 }] },
    { id: 'salad3', name: 'りんごさんヨーグルトサラダ', category: 'salad', energyPerMeal: 64399, ingredients: [{ name: 'とくせんエッグ', amount: 35 }, { name: 'とくせんリンゴ', amount: 28 }, { name: 'あんみんトマト', amount: 23 }, { name: 'モーモーミルク', amount: 18 }] },
    { id: 'salad4', name: 'はなふぶきミモザサラダ', category: 'salad', energyPerMeal: 39449, ingredients: [{ name: 'とくせんエッグ', amount: 25 }, { name: 'ピュアなオイル', amount: 17 }, { name: 'ほっこりポテト', amount: 15 }, { name: 'マメミート', amount: 12 }] },
    { id: 'salad5', name: '忍者サラダ', category: 'salad', energyPerMeal: 38941, ingredients: [{ name: 'あったかジンジャー', amount: 11 }, { name: 'ワカクサ大豆', amount: 19 }, { name: 'あじわいキノコ', amount: 12 }, { name: 'ふといながねぎ', amount: 15 }] },
    { id: 'salad6', name: 'ワカクササラダ', category: 'salad', energyPerMeal: 38053, ingredients: [{ name: 'ピュアなオイル', amount: 22 }, { name: 'ワカクサコーン', amount: 17 }, { name: 'あんみんトマト', amount: 14 }, { name: 'ほっこりポテト', amount: 9 }] },
    { id: 'salad7', name: 'クロスチョップドサラダ', category: 'salad', energyPerMeal: 29242, ingredients: [{ name: 'とくせんエッグ', amount: 20 }, { name: 'マメミート', amount: 15 }, { name: 'ワカクサコーン', amount: 11 }, { name: 'あんみんトマト', amount: 10 }] },
    { id: 'salad8', name: 'ヤドンテールペッパーサラダ', category: 'salad', energyPerMeal: 27285, ingredients: [{ name: 'げきからハーブ', amount: 10 }, { name: 'ピュアなオイル', amount: 15 }, { name: 'おいしいシッポ', amount: 10 }] },
    { id: 'salad9', name: 'めいそうスイートサラダ', category: 'salad', energyPerMeal: 25635, ingredients: [{ name: 'とくせんリンゴ', amount: 21 }, { name: 'あまいミツ', amount: 16 }, { name: 'ワカクサコーン', amount: 12 }] },
    { id: 'salad10', name: 'くだけるアボカドサラダ', category: 'salad', energyPerMeal: 23798, ingredients: [{ name: 'つやつやアボカド', amount: 14 }, { name: 'ワカクサ大豆', amount: 18 }, { name: 'ピュアなオイル', amount: 10 }] },
    { id: 'salad11', name: 'キノコのほうしサラダ', category: 'salad', energyPerMeal: 19569, ingredients: [{ name: 'あじわいキノコ', amount: 17 }, { name: 'ピュアなオイル', amount: 8 }, { name: 'あんみんトマト', amount: 8 }] },
    { id: 'salad12', name: 'オーバーヒートサラダ', category: 'salad', energyPerMeal: 17452, ingredients: [{ name: 'げきからハーブ', amount: 17 }, { name: 'あったかジンジャー', amount: 10 }, { name: 'あんみんトマト', amount: 8 }] },

    // Dessert & Drink (sorted by max energy descending)
    { id: 'dessert1', name: 'みつあつめチョコワッフル', category: 'dessert', energyPerMeal: 85117, ingredients: [{ name: 'あまいミツ', amount: 38 }, { name: 'ワカクサコーン', amount: 28 }, { name: 'ピュアなオイル', amount: 28 }, { name: 'リラックスカカオ', amount: 21 }] },
    { id: 'dessert2', name: 'ドキドキこわいかおパンケーキ', category: 'dessert', energyPerMeal: 81342, ingredients: [{ name: 'あまいミツ', amount: 32 }, { name: 'あんみんトマト', amount: 29 }, { name: 'とくせんエッグ', amount: 24 }, { name: 'ずっしりカボチャ', amount: 18 }] },
    { id: 'dessert3', name: 'ドオーのエクレア', category: 'dessert', energyPerMeal: 69756, ingredients: [{ name: 'リラックスカカオ', amount: 30 }, { name: 'モーモーミルク', amount: 26 }, { name: 'めざましコーヒー', amount: 24 }, { name: 'あまいミツ', amount: 22 }] },
    { id: 'dessert4', name: 'スパークスパイスコーラ', category: 'dessert', energyPerMeal: 58430, ingredients: [{ name: 'とくせんリンゴ', amount: 35 }, { name: 'あったかジンジャー', amount: 20 }, { name: 'ふといながねぎ', amount: 20 }, { name: 'めざましコーヒー', amount: 12 }] },
    { id: 'dessert5', name: 'フラワーギフトマカロン', category: 'dessert', energyPerMeal: 46206, ingredients: [{ name: 'リラックスカカオ', amount: 25 }, { name: 'とくせんエッグ', amount: 25 }, { name: 'あまいミツ', amount: 17 }, { name: 'モーモーミルク', amount: 10 }] },
    { id: 'dessert6', name: 'おちゃかいコーンスコーン', category: 'dessert', energyPerMeal: 36490, ingredients: [{ name: 'とくせんリンゴ', amount: 20 }, { name: 'あったかジンジャー', amount: 20 }, { name: 'ワカクサコーン', amount: 18 }, { name: 'モーモーミルク', amount: 9 }] },
    { id: 'dessert7', name: 'プリンのプリンアラモード', category: 'dessert', energyPerMeal: 25364, ingredients: [{ name: 'あまいミツ', amount: 20 }, { name: 'とくせんエッグ', amount: 15 }, { name: 'とくせんリンゴ', amount: 10 }, { name: 'モーモーミルク', amount: 10 }] },
    { id: 'dessert8', name: 'かたやぶりコーンティラミス', category: 'dessert', energyPerMeal: 23798, ingredients: [{ name: 'めざましコーヒー', amount: 14 }, { name: 'ワカクサコーン', amount: 14 }, { name: 'モーモーミルク', amount: 12 }] },
    { id: 'dessert9', name: 'はやおきコーヒーゼリー', category: 'dessert', energyPerMeal: 22685, ingredients: [{ name: 'めざましコーヒー', amount: 16 }, { name: 'モーモーミルク', amount: 14 }, { name: 'あまいミツ', amount: 12 }] },
    { id: 'dessert10', name: 'だいばくはつポップコーン', category: 'dessert', energyPerMeal: 20200, ingredients: [{ name: 'ワカクサコーン', amount: 15 }, { name: 'ピュアなオイル', amount: 14 }, { name: 'モーモーミルク', amount: 7 }] },
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
