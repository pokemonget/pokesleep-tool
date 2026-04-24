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
    { id: 0, name: 'Curry', energyPerMeal: 500, ingredients: [] },
    { id: 1, name: 'Salad', energyPerMeal: 400, ingredients: [] },
    { id: 2, name: 'Pizza', energyPerMeal: 600, ingredients: [] },
    { id: 3, name: 'Gratin', energyPerMeal: 700, ingredients: [] },
    { id: 4, name: 'Fruit Salad', energyPerMeal: 300, ingredients: [] },
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
