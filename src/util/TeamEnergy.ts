import PokemonIv from './PokemonIv';
import PokemonStrength, { StrengthParameter, StrengthResult } from './PokemonStrength';
import { IngredientName } from '../data/pokemons';
import { Recipe } from '../ui/IvCalc/Team/TeamState';

export interface TeamEnergyResult {
    /** Total berry energy for the team (weekly) */
    berryEnergy: number;
    /** Total skill energy for the team (weekly) */
    skillEnergy: number;
    /** Total cooking energy (3 meals per day × 7 days = 21 meals per week) */
    cookingEnergy: number;
    /** Total weekly energy */
    totalEnergy: number;
    /** Individual member results */
    memberResults: StrengthResult[];
    /** Total ingredients produced by the team (weekly) */
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
 * Calculate total energy for a team of 5 Pokemon (weekly)
 */
export function calculateTeamEnergy(
    members: PokemonIv[],
    parameter: StrengthParameter,
    recipe: Recipe
): TeamEnergyResult {
    const memberResults: StrengthResult[] = [];
    let totalBerryEnergy = 0;
    let totalSkillEnergy = 0;
    const ingredients = new Map<IngredientName, number>();

    for (const member of members) {
        const strength = new PokemonStrength(member, parameter);
        const result = strength.calculate();
        memberResults.push(result);

        totalBerryEnergy += result.berryTotalStrength;
        totalSkillEnergy += result.skillStrength;

        // Accumulate ingredients
        for (const ing of result.ingredients) {
            const current = ingredients.get(ing.name) || 0;
            ingredients.set(ing.name, current + ing.count);
        }
    }

    // Multiply by 7 for weekly calculation
    totalBerryEnergy *= 7;
    totalSkillEnergy *= 7;

    // Multiply ingredients by 7 for weekly
    for (const [name, count] of ingredients) {
        ingredients.set(name, count * 7);
    }

    // Calculate cooking energy based on selected recipe (21 meals per week)
    const cookingEnergy = calculateCookingEnergy(recipe, parameter);

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
 * Calculate cooking energy from recipe (weekly: 21 meals)
 * This is a simplified calculation - actual game logic is more complex
 */
function calculateCookingEnergy(
    recipe: Recipe,
    parameter: StrengthParameter
): number {
    // Use recipe's energy per meal, apply recipe bonus and field bonus, multiply by 21 meals per week
    const recipeBonus = parameter.recipeBonus / 100;
    const fieldBonus = parameter.fieldBonus / 100;
    return recipe.energyPerMeal * 21 * (1 + recipeBonus + fieldBonus);
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
