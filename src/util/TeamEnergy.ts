import PokemonIv from './PokemonIv';
import PokemonStrength, { StrengthParameter, StrengthResult } from './PokemonStrength';
import { IngredientName } from '../data/pokemons';
import { ingredientStrength } from './PokemonRp';
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
    /** Required amount for 21 meals */
    required: number;
    /** Produced amount (weekly) */
    produced: number;
    /** Shortage (if positive) or surplus (if negative) */
    shortage: number;
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
        totalSkillEnergy += result.skillStrength + result.skillStrength2;

        // Accumulate ingredients from help
        for (const ing of result.ingredients) {
            const current = ingredients.get(ing.name) || 0;
            ingredients.set(ing.name, current + ing.count);
        }

        // Accumulate ingredients from skills
        const skillIngredients = calculateSkillIngredients(result, member);
        for (const [name, count] of skillIngredients) {
            const current = ingredients.get(name) || 0;
            ingredients.set(name, current + count);
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
    // Use recipe's energy per meal, apply field bonus, multiply by 21 meals per week
    const fieldBonus = parameter.fieldBonus / 100;
    return recipe.energyPerMeal * 21 * (1 + fieldBonus);
}

/**
 * Calculate ingredient requirements for 21 meals based on recipe
 */
export function calculateIngredientRequirements(
    recipe: Recipe,
    producedIngredients: Map<IngredientName, number>
): IngredientRequirement[] {
    const requirements: IngredientRequirement[] = [];

    if (!recipe.ingredients) {
        return requirements;
    }

    // Calculate required ingredients for 21 meals
    const requiredMap = new Map<IngredientName, number>();
    for (const ing of recipe.ingredients) {
        const ingredientName = mapIngredientName(ing.name);
        const requiredForOneMeal = ing.amount;
        const requiredFor21Meals = requiredForOneMeal * 21;
        const current = requiredMap.get(ingredientName) || 0;
        requiredMap.set(ingredientName, current + requiredFor21Meals);
    }

    // Compare with produced ingredients
    for (const [name, required] of requiredMap) {
        const produced = producedIngredients.get(name) || 0;
        const shortage = Math.max(0, required - produced);

        requirements.push({
            name,
            required,
            produced,
            shortage,
        });
    }

    return requirements;
}

/**
 * Map Japanese ingredient names to IngredientName
 */
function mapIngredientName(japaneseName: string): IngredientName {
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

/**
 * Calculate ingredients obtained from skills
 * @param result Strength result from PokemonStrength
 * @param member Pokemon member
 * @returns Map of ingredient name to count
 */
function calculateSkillIngredients(
    result: StrengthResult,
    member: PokemonIv
): Map<IngredientName, number> {
    const skillIngredients = new Map<IngredientName, number>();
    
    // Get the main skill name
    const mainSkill = member.pokemon.skill === "Versatile" 
        ? member.versatileSkill 
        : member.pokemon.skill;
    
    // Get the Pokemon's actual ingredients (based on level)
    const pokemonIngredients = member.getIngredients(true);
    
    // Ingredient Magnet S (Plus) - specific ingredient
    if (mainSkill === "Ingredient Magnet S (Plus)") {
        const ingCount = result.skillValue2; // skillValue2 contains the additional ingredient count
        const ingName = member.pokemon.ing1.name;
        const current = skillIngredients.get(ingName) || 0;
        skillIngredients.set(ingName, current + ingCount);
    }
    
    // Ingredient Magnet S (Present) - random ingredients (candy)
    // Candy is not a regular ingredient, so we skip it for now
    
    // Ingredient Magnet S - completely random ingredients (average across all ingredients)
    if (mainSkill === "Ingredient Magnet S") {
        const ingCount = result.skillValue; // skillValue contains the number of ingredients
        // Distribute evenly across all ingredients for average calculation
        const allIngredients = Object.keys(ingredientStrength) as IngredientName[];
        const avgPerIngredient = ingCount / allIngredients.length;
        for (const ingName of allIngredients) {
            if (ingName !== 'unknown' && !ingName.startsWith('unknown')) {
                const current = skillIngredients.get(ingName) || 0;
                skillIngredients.set(ingName, current + avgPerIngredient);
            }
        }
    }
    
    // Ingredient Draw S - random from Pokemon's ingredients (average)
    if (mainSkill === "Ingredient Draw S") {
        const ingCount = result.skillValue; // skillValue contains the number of ingredients
        // Distribute evenly across the Pokemon's actual ingredients
        const avgPerIngredient = ingCount / pokemonIngredients.length;
        for (const ingName of pokemonIngredients) {
            const current = skillIngredients.get(ingName) || 0;
            skillIngredients.set(ingName, current + avgPerIngredient);
        }
    }
    
    // Ingredient Draw S (Super Luck) - random from Pokemon's ingredients (average)
    if (mainSkill === "Ingredient Draw S (Super Luck)") {
        const ingCount = result.skillValue; // skillValue contains the number of ingredients
        // Distribute evenly across the Pokemon's actual ingredients
        const avgPerIngredient = ingCount / pokemonIngredients.length;
        for (const ingName of pokemonIngredients) {
            const current = skillIngredients.get(ingName) || 0;
            skillIngredients.set(ingName, current + avgPerIngredient);
        }
    }
    
    // Ingredient Draw S (Hyper Cutter) - random from Pokemon's ingredients (average)
    if (mainSkill === "Ingredient Draw S (Hyper Cutter)") {
        const ingCount = result.skillValue; // skillValue contains the number of ingredients
        // Distribute evenly across the Pokemon's actual ingredients
        const avgPerIngredient = ingCount / pokemonIngredients.length;
        for (const ingName of pokemonIngredients) {
            const current = skillIngredients.get(ingName) || 0;
            skillIngredients.set(ingName, current + avgPerIngredient);
        }
    }
    
    return skillIngredients;
}
