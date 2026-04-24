import React from 'react';
import { styled } from '@mui/system';
import { Card, CardContent, Typography, Box, Select, MenuItem, Accordion, AccordionSummary, AccordionDetails, Switch, ToggleButton, ToggleButtonGroup, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IvState, { IvAction } from '../IvState';
import { calculateTeamEnergy, TeamEnergyResult, calculateIngredientRequirements } from '../../../util/TeamEnergy';
import PokemonIcon from '../PokemonIcon';
import IngredientIcon from '../IngredientIcon';
import TeamSlotDialog from './TeamSlotDialog';
import { RECIPES, mapIngredientName } from './TeamState';
import PeriodSelect from '../Strength/PeriodSelect';
import FixedLevelSelect from '../Strength/FixedLevelSelect';
import AreaControlGroup from '../Strength/AreaControlGroup';
import EventConfigDialog from '../Strength/EventConfigDialog';
import { LevelInput } from '../IvForm/LevelControl';
import { whistlePeriod, createStrengthParameter } from '../../../util/PokemonStrength';
import { getActiveHelpBonus } from '../../../data/events';
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
    const [eventDetailOpen, setEventDetailOpen] = React.useState(false);
    const [initializeConfirmOpen, setInitializeConfirmOpen] = React.useState(false);
    const [snackBarVisible, setSnackBarVisible] = React.useState(false);

    const scheduledEvents = getActiveHelpBonus(new Date())
        .map(x => x.name)
        .reverse();
    let prevEventName = "";
    const eventToggles = ['none', ...scheduledEvents, 'advanced'].map(x => {
        let curEventName = t(`events.${x}`);
        if (prevEventName.replace(/\(.*/, '') === curEventName.replace(/\(.*/, '')) {
            curEventName = curEventName
                .replace(/.*\(/, '')
                .replace(')', '');
        }
        prevEventName = curEventName;
        return <ToggleButton key={x} value={x} style={{ textTransform: 'none' }}>{curEventName}</ToggleButton>
    });
    const eventName = ['none', ...scheduledEvents]
        .includes(state.parameter.event) ? state.parameter.event : 'advanced';

    const isNotWhistle = (state.parameter.period !== whistlePeriod);

    const onEventChange = React.useCallback((_: React.MouseEvent, val: string|null) => {
        if (val === null) {
            return;
        }
        if (val === "advanced") {
            val = "custom";
        }
        dispatch({type: "changeParameter", payload: {parameter: {...state.parameter, event: val}}});
    }, [dispatch, state.parameter]);

    const onEventDetailClose = React.useCallback(() => {
        setEventDetailOpen(false);
    }, []);

    const onEditEnergyClick = React.useCallback(() => {
        dispatch({type: 'openEnergyDialog'});
    }, [dispatch]);

    const onInitializeClick = React.useCallback(() => {
        setInitializeConfirmOpen(true);
    }, []);

    const onInitializeConfirmClose = React.useCallback(() => {
        setInitializeConfirmOpen(false);
    }, []);

    const onInitialize = React.useCallback(() => {
        dispatch({type: "changeParameter", payload: {
            parameter: createStrengthParameter({}),
        }});
        setSnackBarVisible(true);
        onInitializeConfirmClose();
    }, [dispatch, onInitializeConfirmClose]);

    const onSnackbarClose = React.useCallback(() => {
        setSnackBarVisible(false);
    }, []);
    
    const onSlotClick = React.useCallback((slotIndex: number) => {
        const member = selectedTeam?.members[slotIndex];
        if (member && member.filled) {
            // Remove Pokemon from filled slot
            dispatch({
                type: 'updateTeamMember',
                payload: {
                    slotIndex,
                    member: {
                        iv: member.iv,
                        nickname: member.nickname,
                        filled: false,
                    },
                },
            });
        } else {
            // Open dialog for empty slot
            setSelectedSlotIndex(slotIndex);
            setSlotDialogOpen(true);
        }
    }, [selectedTeam, dispatch]);

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

    const selectedRecipe = RECIPES.find(r => r.id === state.team.selectedRecipeId) || RECIPES[0];

    const ingredientRequirements = React.useMemo(() => {
        if (!selectedRecipe) return [];
        return calculateIngredientRequirements(selectedRecipe, teamEnergy.ingredients);
    }, [selectedRecipe, teamEnergy.ingredients]);

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
                    <Box display="flex" gap={1} mb={1}>
                        <Select
                            value={RECIPES.find(r => r.id === state.team.selectedRecipeId)?.category || 'curry'}
                            onChange={(e) => {
                                const category = e.target.value as 'curry' | 'salad' | 'dessert';
                                const firstRecipeInCategory = RECIPES.find(r => r.category === category);
                                if (firstRecipeInCategory) {
                                    dispatch({
                                        type: 'selectRecipe',
                                        payload: { recipeId: firstRecipeInCategory.id }
                                    });
                                }
                            }}
                            style={{ minWidth: '120px' }}
                        >
                            <MenuItem value="curry">カレー</MenuItem>
                            <MenuItem value="salad">サラダ</MenuItem>
                            <MenuItem value="dessert">デザート</MenuItem>
                        </Select>
                        <Select
                            value={state.team.selectedRecipeId}
                            onChange={(e) => dispatch({
                                type: 'selectRecipe',
                                payload: { recipeId: e.target.value as string }
                            })}
                            fullWidth
                        >
                            {RECIPES.filter(r => r.category === RECIPES.find(r => r.id === state.team.selectedRecipeId)?.category).map((recipe) => (
                                <MenuItem key={recipe.id} value={recipe.id}>
                                    <Box width="100%">
                                        <Typography variant="body2">{recipe.name}</Typography>
                                        {recipe.ingredients && (
                                            <Box display="flex" gap={0.3} flexWrap="wrap" mt={0.5}>
                                                {recipe.ingredients.map((ing, idx) => (
                                                    <Box key={idx} display="flex" alignItems="center" gap={0.2}>
                                                        <Box style={{ transform: 'scale(0.6)', transformOrigin: 'center' }}>
                                                            <IngredientIcon name={mapIngredientName(ing.name)} />
                                                        </Box>
                                                        <Typography variant="caption" style={{ fontSize: '0.65rem' }}>
                                                            {ing.amount}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        )}
                                        <Typography variant="caption" color="textSecondary" style={{ fontSize: '0.7rem' }}>
                                            {recipe.energyPerMeal.toLocaleString()} energy/meal
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                </Box>

                <Box display="flex" flexWrap="nowrap" gap={1}>
                    {selectedTeam.members.map((member, index) => (
                        <Box key={index} flex="1" minWidth="0">
                            <StyledSlot onClick={() => onSlotClick(index)}>
                                {member.filled ? (
                                    <>
                                        <PokemonIcon idForm={member.iv.idForm} size={60} />
                                        <Typography variant="caption" style={{ marginTop: '0.5rem' }}>
                                            Lv{member.iv.level}
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography variant="caption" color="textSecondary" style={{ fontSize: '0.75rem' }}>
                                        空き
                                    </Typography>
                                )}
                            </StyledSlot>
                        </Box>
                    ))}
                </Box>

                {teamEnergy.totalEnergy > 0 && (
                    <StyledEnergyCard>
                        <CardContent>
                            {teamEnergy.memberResults.length > 0 && (
                                <Box>
                                    <Typography variant="subtitle2" gutterBottom style={{ fontWeight: 'bold' }}>
                                        {t('individual contributions')}
                                    </Typography>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{t('pokemon')}</TableCell>
                                                <TableCell align="right" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>きのみ</TableCell>
                                                <TableCell align="right" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>スキル</TableCell>
                                                <TableCell align="right" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>料理</TableCell>
                                                <TableCell align="right" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{t('total')}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedTeam.members.map((member, index) => {
                                                if (!member.filled) return null;
                                                const result = teamEnergy.memberResults[index];
                                                const weeklyBerry = result.berryTotalStrength * 7;
                                                const weeklySkill = result.skillStrength * 7;
                                                const individualTotal = weeklyBerry + weeklySkill;
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell style={{ padding: '4px 8px', whiteSpace: 'nowrap' }}>
                                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                                <PokemonIcon idForm={member.iv.idForm} size={24} />
                                                                <Typography variant="caption">
                                                                    {t(`pokemons.${member.iv.pokemon.name}`)}
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell align="right" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
                                                            {Math.round(weeklyBerry).toLocaleString()}
                                                        </TableCell>
                                                        <TableCell align="right" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
                                                            {Math.round(weeklySkill).toLocaleString()}
                                                        </TableCell>
                                                        <TableCell align="right" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
                                                            -
                                                        </TableCell>
                                                        <TableCell align="right" style={{ padding: '4px 8px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                            {Math.round(individualTotal).toLocaleString()}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                            <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                                                <TableCell style={{ padding: '4px 8px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                    {t('total')}
                                                </TableCell>
                                                <TableCell align="right" style={{ padding: '4px 8px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                    {Math.round(teamEnergy.berryEnergy).toLocaleString()}
                                                </TableCell>
                                                <TableCell align="right" style={{ padding: '4px 8px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                    {Math.round(teamEnergy.skillEnergy).toLocaleString()}
                                                </TableCell>
                                                <TableCell align="right" style={{ padding: '4px 8px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                    {Math.round(teamEnergy.cookingEnergy).toLocaleString()}
                                                </TableCell>
                                                <TableCell align="right" style={{ padding: '4px 8px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                    {Math.round(teamEnergy.totalEnergy).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Box>
                            )}

                            {/* Weekly ingredient production and shortage */}
                            <Box mt={3} display="flex" gap={2} flexWrap="wrap">
                                {/* Weekly ingredient production */}
                                {teamEnergy.ingredients.size > 0 && (
                                    <Box flex="1" minWidth="250px">
                                        <Typography variant="subtitle2" gutterBottom style={{ fontWeight: 'bold' }}>
                                            {t('weekly ingredient production')}
                                        </Typography>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell style={{ fontSize: '0.8rem' }}>{t('ingredient')}</TableCell>
                                                    <TableCell align="right" style={{ fontSize: '0.8rem' }}>{t('amount')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {Array.from(teamEnergy.ingredients.entries())
                                                    .sort((a, b) => b[1] - a[1])
                                                    .map(([name, count]) => (
                                                    <TableRow key={name}>
                                                        <TableCell style={{ padding: '4px 8px' }}>
                                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                                <Box style={{ transform: 'scale(0.6)', transformOrigin: 'center' }}>
                                                                    <IngredientIcon name={name} />
                                                                </Box>
                                                                <Typography variant="caption">
                                                                    {name}
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell align="right" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
                                                            {Math.round(count).toLocaleString()}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Box>
                                )}

                                {/* Ingredient shortage for 21 meals */}
                                {ingredientRequirements.length > 0 && (
                                    <Box flex="1" minWidth="300px">
                                        <Typography variant="subtitle2" gutterBottom style={{ fontWeight: 'bold' }}>
                                            {t('ingredient shortage for 21 meals')}
                                        </Typography>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell style={{ fontSize: '0.8rem' }}>{t('ingredient')}</TableCell>
                                                    <TableCell align="right" style={{ fontSize: '0.8rem' }}>{t('required')}</TableCell>
                                                    <TableCell align="right" style={{ fontSize: '0.8rem' }}>{t('produced')}</TableCell>
                                                    <TableCell align="right" style={{ fontSize: '0.8rem' }}>{t('shortage')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {ingredientRequirements.map((req) => (
                                                    <TableRow key={req.name}>
                                                        <TableCell style={{ padding: '4px 8px' }}>
                                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                                <Box style={{ transform: 'scale(0.6)', transformOrigin: 'center' }}>
                                                                    <IngredientIcon name={req.name} />
                                                                </Box>
                                                                <Typography variant="caption">
                                                                    {req.name}
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell align="right" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
                                                            {req.required.toLocaleString()}
                                                        </TableCell>
                                                        <TableCell align="right" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
                                                            {req.produced.toLocaleString()}
                                                        </TableCell>
                                                        <TableCell align="right" style={{ 
                                                            padding: '4px 8px', 
                                                            fontSize: '0.8rem',
                                                            fontWeight: 'bold',
                                                            color: req.shortage > 0 ? '#f44336' : '#4caf50'
                                                        }}>
                                                            {req.shortage > 0 ? `-${req.shortage.toLocaleString()}` : `+${Math.abs(req.shortage).toLocaleString()}`}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Box>
                                )}
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
                                        {t('period')}:
                                    </Typography>
                                    <PeriodSelect dispatch={dispatch} value={state.parameter}/>
                                </Box>
                                <AreaControlGroup value={state.parameter} onChange={(value) => dispatch({type: "changeParameter", payload: {parameter: value}})}/>
                                <Box>
                                    <Typography variant="body2" gutterBottom>
                                        {t('event')}:
                                    </Typography>
                                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                                        <ToggleButtonGroup size="small" exclusive
                                            value={eventName} onChange={onEventChange}>
                                            {eventToggles}
                                        </ToggleButtonGroup>
                                    </div>
                                </Box>
                                <Box>
                                    <Typography variant="body2" gutterBottom>
                                        {t('level')}:
                                    </Typography>
                                    <FixedLevelSelect dispatch={dispatch} value={state.parameter}/>
                                </Box>
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
                                <Box sx={{display: isNotWhistle ? 'block' : 'none'}}>
                                    <Typography variant="body2" gutterBottom>
                                        {t('tap frequency')} ({t('awake')}):
                                    </Typography>
                                    <Select
                                        variant="standard"
                                        value={state.parameter.tapFrequency}
                                        onChange={(e) => dispatch({
                                            type: 'changeParameter',
                                            payload: { parameter: { ...state.parameter, tapFrequency: e.target.value as "always"|"none" } }
                                        })}
                                        fullWidth
                                    >
                                        <MenuItem value="always">{t('every minute')}</MenuItem>
                                        <MenuItem value="none">{t('none')}</MenuItem>
                                    </Select>
                                </Box>
                                <Box sx={{display: (isNotWhistle && state.parameter.tapFrequency !== "none") ? 'block' : 'none'}}>
                                    <Typography variant="body2" gutterBottom>
                                        {t('tap frequency')} ({t('asleep')}):
                                    </Typography>
                                    <Select
                                        variant="standard"
                                        value={state.parameter.tapFrequencyAsleep}
                                        onChange={(e) => dispatch({
                                            type: 'changeParameter',
                                            payload: { parameter: { ...state.parameter, tapFrequencyAsleep: e.target.value as "always"|"none" } }
                                        })}
                                        fullWidth
                                    >
                                        <MenuItem value="always">{t('every minute')}</MenuItem>
                                        <MenuItem value="none">{t('none')}</MenuItem>
                                    </Select>
                                </Box>
                                <Box sx={{display: isNotWhistle ? 'block' : 'none'}}>
                                    <Typography variant="body2" gutterBottom>
                                        {t('energy')}:
                                    </Typography>
                                    <Button onClick={onEditEnergyClick}>{t('edit')}</Button>
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
                                        <MenuItem value="0">0% <small style={{paddingLeft: '0.3rem'}}>({t('mixed recipe')})</small></MenuItem>
                                        <MenuItem value="19">19% <small style={{paddingLeft: '0.3rem'}}>(7{t('range separator')}16 {t('ingredients unit')})</small></MenuItem>
                                        <MenuItem value="20">20% <small style={{paddingLeft: '0.3rem'}}>(20{t('range separator')}22 {t('ingredients unit')})</small></MenuItem>
                                        <MenuItem value="21">21% <small style={{paddingLeft: '0.3rem'}}>(23{t('range separator')}26 {t('ingredients unit')})</small></MenuItem>
                                        <MenuItem value="25">25% <small style={{paddingLeft: '0.3rem'}}>(17{t('range separator')}35 {t('ingredients unit')})</small></MenuItem>
                                        <MenuItem value="35">35% <small style={{paddingLeft: '0.3rem'}}>(35{t('range separator')}56 {t('ingredients unit')})</small></MenuItem>
                                        <MenuItem value="48">48% <small style={{paddingLeft: '0.3rem'}}>(49{t('range separator')}77 {t('ingredients unit')})</small></MenuItem>
                                        <MenuItem value="61">61% <small style={{paddingLeft: '0.3rem'}}>(78{t('range separator')}102 {t('ingredients unit')})</small></MenuItem>
                                        <MenuItem value="78">78% <small style={{paddingLeft: '0.3rem'}}>(103{t('range separator')}115 {t('ingredients unit')})</small></MenuItem>
                                    </Select>
                                </Box>
                                <Box>
                                    <Typography variant="body2" gutterBottom>
                                        {t('average recipe level')}:
                                    </Typography>
                                    <LevelInput value={state.parameter.recipeLevel}
                                        onChange={(recipeLevel) => dispatch({type: "changeParameter", payload: {parameter: {...state.parameter, recipeLevel}}})}
                                        showSlider sx={{width: '2rem'}}/>
                                </Box>
                                <Box>
                                    <Button onClick={onInitializeClick} variant="outlined">{t('initialize all parameters')}</Button>
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
            <EventConfigDialog open={eventDetailOpen} onClose={onEventDetailClose}
                value={state.parameter} onChange={(value) => dispatch({type: "changeParameter", payload: {parameter: value}})}/>
            <Dialog open={initializeConfirmOpen} onClose={onInitializeConfirmClose}>
                <DialogTitle>{t('initialize all parameters')}</DialogTitle>
                <DialogContent>
                    <p style={{ fontSize: "0.9rem", margin: 0 }}>{t("initialize all parameters message")}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onInitialize} color="error">{t("reset")}</Button>
                    <Button onClick={onInitializeConfirmClose}>{t("cancel")}</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackBarVisible}
                autoHideDuration={2000} onClose={onSnackbarClose}
                message={t("initialized all parameters")}/>
        </>
    );
});

export default TeamView;
