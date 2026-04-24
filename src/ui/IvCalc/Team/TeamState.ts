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
    { id: 'curry1', name: 'いあいぎりすき焼きカレー', category: 'curry', energyPerMeal: 82839 },
    { id: 'curry2', name: 'めざめるパワーシチュー', category: 'curry', energyPerMeal: 57755 },
    { id: 'curry3', name: 'れんごくコーンキーマカレー', category: 'curry', energyPerMeal: 41481 },
    { id: 'curry4', name: 'ニンジャカレー', category: 'curry', energyPerMeal: 28618 },
    { id: 'curry5', name: 'ぜったいねむりバターカレー', category: 'curry', energyPerMeal: 9010 },
    { id: 'curry6', name: 'からくちネギもりカレー', category: 'curry', energyPerMeal: 5900 },
    { id: 'curry7', name: 'ピヨピヨパンチ辛口カレー', category: 'curry', energyPerMeal: 5702 },
    { id: 'curry8', name: 'じゅうなんコーンシチュー', category: 'curry', energyPerMeal: 4670 },
    { id: 'curry9', name: 'おやこあいカレー', category: 'curry', energyPerMeal: 4523 },
    { id: 'curry10', name: 'キノコのほうしカレー', category: 'curry', energyPerMeal: 4162 },
    { id: 'curry11', name: 'なりきりバケッチャシチュー', category: 'curry', energyPerMeal: 3181 },
    { id: 'curry12', name: 'あぶりテールカレー', category: 'curry', energyPerMeal: 7483 },
    { id: 'curry13', name: 'とくせんリンゴカレー', category: 'curry', energyPerMeal: 748 },

    // Salad (sorted by max energy descending)
    { id: 'salad1', name: 'まけんきコーヒーサラダ', category: 'salad', energyPerMeal: 20218 },
    { id: 'salad2', name: 'りんごさんヨーグルトサラダ', category: 'salad', energyPerMeal: 19293 },
    { id: 'salad3', name: 'はなふぶきミモザサラダ', category: 'salad', energyPerMeal: 11811 },
    { id: 'salad4', name: '忍者サラダ', category: 'salad', energyPerMeal: 11659 },
    { id: 'salad5', name: 'ワカクササラダ', category: 'salad', energyPerMeal: 11393 },
    { id: 'salad6', name: 'クロスチョップドサラダ', category: 'salad', energyPerMeal: 8755 },
    { id: 'salad7', name: 'ヤドンテールペッパーサラダ', category: 'salad', energyPerMeal: 8169 },
    { id: 'salad8', name: 'めいそうスイートサラダ', category: 'salad', energyPerMeal: 7675 },
    { id: 'salad9', name: 'キノコのほうしサラダ', category: 'salad', energyPerMeal: 5859 },
    { id: 'salad10', name: 'オーバーヒートサラダ', category: 'salad', energyPerMeal: 5225 },

    // Dessert & Drink (sorted by max energy descending)
    { id: 'dessert1', name: 'ドオーのエクレア', category: 'dessert', energyPerMeal: 20885 },
    { id: 'dessert2', name: 'スパークスパイスコーラ', category: 'dessert', energyPerMeal: 17494 },
    { id: 'dessert3', name: 'フラワーギフトマカロン', category: 'dessert', energyPerMeal: 13834 },
    { id: 'dessert4', name: 'おちゃかいコーンスコーン', category: 'dessert', energyPerMeal: 10925 },
    { id: 'dessert5', name: 'プリンのプリンアラモード', category: 'dessert', energyPerMeal: 7594 },
    { id: 'dessert6', name: 'かたやぶりコーンティラミス', category: 'dessert', energyPerMeal: 7152 },
    { id: 'dessert7', name: 'はやおきコーヒーゼリー', category: 'dessert', energyPerMeal: 6793 },
    { id: 'dessert8', name: 'だいばくはつポップコーン', category: 'dessert', energyPerMeal: 6048 },
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
