import PokemonIv from './PokemonIv';
import PokemonStrength, { StrengthParameter, StrengthResult } from './PokemonStrength';
import { IngredientName } from '../data/pokemons';

export interface TeamEnergyResult {
    /** Total berry energy for the team */
    berryEnergy: number;
    /** Total skill energy for the team */
    skillEnergy: number;
    /** Total cooking energy (3 meals per day) */
    cookingEnergy: number;
    /** Total daily energy */
    totalEnergy: number;
    /** Individual member results */
    memberResults: StrengthResult[];
    /** Total ingredients produced by the team */
    ingredients: Map<IngredientName, number>;
}

export interface IngredientRequirement {
    /** Ingredient name */
    name: IngredientName;
    /** Required amount for 3 meals */
    amount: number;
    /** Current inventory */
    inventory: number;
    /** Need to stock from previous week */
    needToStock: number;
}

/**
 * Calculate total energy for a team of 5 Pokemon
 */
export function calculateTeamEnergy(
    members: PokemonIv[],
    parameter: StrengthParameter
): TeamEnergyResult {
    const memberResults: StrengthResult[] = [];
    let totalBerryEnergy = 0;
    let totalSkillEnergy = 0;
    const ingredients = new Map<IngredientName, number>();

    for (const member of members) {
        const result = PokemonStrength.calc(member, parameter);
        memberResults.push(result);
        
        totalBerryEnergy += result.berryTotalStrength;
        totalSkillEnergy += result.skillStrength;
        
        // Accumulate ingredients
        for (const ing of result.ingredients) {
            const current = ingredients.get(ing.name) || 0;
            ingredients.set(ing.name, current + ing.count);
        }
    }

    // Calculate cooking energy (simplified: 3 meals * average recipe bonus)
    const cookingEnergy = calculateCookingEnergy(ingredients, parameter);

    const totalEnergy = totalBerryEnergy + totalSkillEnergy + cookingEnergy;

    return {
        berryEnergy: totalBerryEnergy,
        skillEnergy: totalSkillEnergy,
        cookingEnergy,
        totalEnergy,
        memberResults,
        ingredients,
    };
}

/**
 * Calculate cooking energy from ingredients
 * This is a simplified calculation - actual game logic is more complex
 */
function calculateCookingEnergy(
    ingredients: Map<IngredientName, number>,
    parameter: StrengthParameter
): number {
    // Simplified: assume each meal provides energy based on recipe bonus
    // In actual game, this depends on specific recipes
    const recipeBonus = parameter.recipeBonus / 100;
    const baseEnergyPerMeal = 1000; // Placeholder value
    return baseEnergyPerMeal * 3 * (1 + recipeBonus);
}

/**
 * Calculate ingredient requirements for optimal cooking
 */
export function calculateIngredientRequirements(
    ingredients: Map<IngredientName, number>,
    currentInventory: Map<IngredientName, number>
): IngredientRequirement[] {
    const requirements: IngredientRequirement[] = [];
    
    // Assume we need 2x of each ingredient for 3 meals (simplified)
    for (const [name, produced] of ingredients) {
        const required = produced * 2;
        const inventory = currentInventory.get(name) || 0;
        const needToStock = Math.max(0, required - inventory);
        
        requirements.push({
            name,
            amount: required,
            inventory,
            needToStock,
        });
    }
    
    return requirements;
}
