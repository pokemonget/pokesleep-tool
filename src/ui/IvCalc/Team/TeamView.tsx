import React from 'react';
import { styled } from '@mui/system';
import { Card, CardContent, Typography, Box, Select, MenuItem, Accordion, AccordionSummary, AccordionDetails, Switch, FormControlLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IvState, { IvAction } from '../IvState';
import { calculateTeamEnergy, TeamEnergyResult } from '../../../util/TeamEnergy';
import PokemonIcon from '../PokemonIcon';
import TeamSlotDialog from './TeamSlotDialog';
import { RECIPES } from './TeamState';
import { useTranslation } from 'react-i18next';

const StyledSlot = styled(Box)({
    border: '2px dashed #ccc',
    borderRadius: '8px',
    padding: '1rem',
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
        borderColor: '#1976d2',
        backgroundColor: '#e3f2fd',
    },
});

const StyledEnergyCard = styled(Card)({
    marginTop: '1rem',
    backgroundColor: '#e8f5e9',
});

const TeamView = React.memo(({ state, dispatch }: {
    state: IvState,
    dispatch: React.Dispatch<IvAction>,
}) => {
    const { t } = useTranslation();
    const selectedTeam = state.team.teams.find(t => t.id === state.team.selectedTeamId);
    const [slotDialogOpen, setSlotDialogOpen] = React.useState(false);
    const [selectedSlotIndex, setSelectedSlotIndex] = React.useState<number | null>(null);
    
    const onSlotClick = React.useCallback((slotIndex: number) => {
        setSelectedSlotIndex(slotIndex);
        setSlotDialogOpen(true);
    }, []);

    const onPokemonSelect = React.useCallback((boxItemId: number) => {
        if (selectedSlotIndex === null) return;
        
        const boxItem = state.box.getById(boxItemId);
        if (!boxItem) return;
        
        dispatch({
            type: 'updateTeamMember',
            payload: {
                slotIndex: selectedSlotIndex,
                member: {
                    iv: boxItem.iv.clone(),
                    nickname: boxItem.nickname,
                    filled: true,
                },
            },
        });
    }, [selectedSlotIndex, state.box, dispatch]);

    const onSlotDialogClose = React.useCallback(() => {
        setSlotDialogOpen(false);
        setSelectedSlotIndex(null);
    }, []);

    // Calculate team energy
    const teamEnergy: TeamEnergyResult = React.useMemo(() => {
        if (!selectedTeam) {
            return {
                berryEnergy: 0,
                skillEnergy: 0,
                cookingEnergy: 0,
                totalEnergy: 0,
                memberResults: [],
                ingredients: new Map(),
            };
        }
        const members = selectedTeam.members.filter(m => m.filled).map(m => m.iv);
        if (members.length === 0) {
            return {
                berryEnergy: 0,
                skillEnergy: 0,
                cookingEnergy: 0,
                totalEnergy: 0,
                memberResults: [],
                ingredients: new Map(),
            };
        }
        const selectedRecipe = RECIPES.find(r => r.id === state.team.selectedRecipeId) || RECIPES[0];
        return calculateTeamEnergy(members, state.parameter, selectedRecipe);
    }, [selectedTeam, state.parameter, state.team.selectedRecipeId]);

    if (!selectedTeam) {
        return <Typography>No team selected</Typography>;
    }

    return (
        <>
            <div style={{ padding: '0.5rem' }}>
                <Typography variant="h6" gutterBottom>
                    {selectedTeam.name}
                </Typography>

                <Box mb={2}>
                    <Typography variant="body2" gutterBottom>
                        {t('select recipe')}:
                    </Typography>
                    <Select
                        value={state.team.selectedRecipeId}
                        onChange={(e) => dispatch({ 
                            type: 'selectRecipe', 
                            payload: { recipeId: e.target.value as number } 
                        })}
                        fullWidth
                    >
                        {RECIPES.map((recipe) => (
                            <MenuItem key={recipe.id} value={recipe.id}>
                                {recipe.name} ({recipe.energyPerMeal} energy/meal)
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                <Box display="flex" flexWrap="wrap" gap={1}>
                    {selectedTeam.members.map((member, index) => (
                        <Box key={index} flex="1 0 18%" minWidth="80px">
                            <StyledSlot onClick={() => onSlotClick(index)}>
                                {member.filled ? (
                                    <>
                                        <PokemonIcon idForm={member.iv.idForm} size={60} />
                                        <Typography variant="caption" style={{ marginTop: '0.5rem' }}>
                                            Lv{member.iv.level}
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography variant="body2" color="textSecondary">
                                        {t('empty slot')}
                                    </Typography>
                                )}
                            </StyledSlot>
                        </Box>
                    ))}
                </Box>

                {teamEnergy.totalEnergy > 0 && (
                    <StyledEnergyCard>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {t('daily energy')}
                            </Typography>
                            <Box display="flex" justifyContent="space-around" flexWrap="wrap">
                                <Box textAlign="center" m={1}>
                                    <Typography variant="body2" color="textSecondary">
                                        {t('berry energy')}
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                        {Math.round(teamEnergy.berryEnergy).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Box textAlign="center" m={1}>
                                    <Typography variant="body2" color="textSecondary">
                                        {t('skill energy')}
                                    </Typography>
                                    <Typography variant="h6" color="secondary">
                                        {Math.round(teamEnergy.skillEnergy).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Box textAlign="center" m={1}>
                                    <Typography variant="body2" color="textSecondary">
                                        {t('cooking energy')}
                                    </Typography>
                                    <Typography variant="h6" style={{ color: '#ff9800' }}>
                                        {Math.round(teamEnergy.cookingEnergy).toLocaleString()}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box textAlign="center" mt={2}>
                                <Typography variant="body2" color="textSecondary">
                                    {t('total')}
                                </Typography>
                                <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                                    {Math.round(teamEnergy.totalEnergy).toLocaleString()}
                                </Typography>
                            </Box>
                        </CardContent>
                    </StyledEnergyCard>
                )}

                <Box mt={2}>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="body1">{t('parameter settings')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Box>
                                    <Typography variant="body2" gutterBottom>
                                        {t('calc with evolved')}:
                                    </Typography>
                                    <Switch
                                        checked={state.parameter.evolved}
                                        onChange={(e) => dispatch({
                                            type: 'changeParameter',
                                            payload: { parameter: { ...state.parameter, evolved: e.target.checked } }
                                        })}
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="body2" gutterBottom>
                                        {t('calc with max skill level')}:
                                    </Typography>
                                    <Switch
                                        checked={state.parameter.maxSkillLevel}
                                        onChange={(e) => dispatch({
                                            type: 'changeParameter',
                                            payload: { parameter: { ...state.parameter, maxSkillLevel: e.target.checked } }
                                        })}
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="body2" gutterBottom>
                                        {t('helping bonus')}:
                                    </Typography>
                                    <Select
                                        variant="standard"
                                        value={state.parameter.helpBonusCount.toString()}
                                        onChange={(e) => dispatch({
                                            type: 'changeParameter',
                                            payload: { parameter: { ...state.parameter, helpBonusCount: parseInt(e.target.value) as 0|1|2|3|4 } }
                                        })}
                                        fullWidth
                                    >
                                        <MenuItem value="0">×1</MenuItem>
                                        <MenuItem value="1">×2</MenuItem>
                                        <MenuItem value="2">×3</MenuItem>
                                        <MenuItem value="3">×4</MenuItem>
                                        <MenuItem value="4">×5</MenuItem>
                                    </Select>
                                </Box>
                                <Box>
                                    <Typography variant="body2" gutterBottom>
                                        {t('recipe bonus')}:
                                    </Typography>
                                    <Select
                                        variant="standard"
                                        value={state.parameter.recipeBonus.toString()}
                                        onChange={(e) => dispatch({
                                            type: 'changeParameter',
                                            payload: { parameter: { ...state.parameter, recipeBonus: parseInt(e.target.value) } }
                                        })}
                                        fullWidth
                                    >
                                        <MenuItem value="0">0%</MenuItem>
                                        <MenuItem value="19">19%</MenuItem>
                                        <MenuItem value="20">20%</MenuItem>
                                        <MenuItem value="21">21%</MenuItem>
                                        <MenuItem value="25">25%</MenuItem>
                                        <MenuItem value="35">35%</MenuItem>
                                        <MenuItem value="48">48%</MenuItem>
                                        <MenuItem value="61">61%</MenuItem>
                                        <MenuItem value="78">78%</MenuItem>
                                    </Select>
                                </Box>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </div>
            <TeamSlotDialog
                open={slotDialogOpen}
                onClose={onSlotDialogClose}
                onSelect={onPokemonSelect}
                state={state}
            />
        </>
    );
});

export default TeamView;
