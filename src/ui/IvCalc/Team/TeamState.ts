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
    /** Team ID */
    id: number;
    /** Team name */
    name: string;
    /** 5 team members */
    members: TeamMember[];
}

export interface TeamState {
    /** All saved teams */
    teams: Team[];
    /** Currently selected team ID */
    selectedTeamId: number;
    /** Team dialog open state */
    teamDialogOpen: boolean;
    /** Team optimization dialog open state */
    optimizationDialogOpen: boolean;
}

export const MAX_TEAM_SIZE = 5;

export function createEmptyTeam(id: number): Team {
    return {
        id,
        name: `Team ${id + 1}`,
        members: Array(MAX_TEAM_SIZE).fill(null).map(() => ({
            iv: new PokemonIv({ pokemonName: "Venusaur" }),
            filled: false,
        })),
    };
}

export function createInitialTeamState(): TeamState {
    return {
        teams: [createEmptyTeam(0)],
        selectedTeamId: 0,
        teamDialogOpen: false,
        optimizationDialogOpen: false,
    };
}
