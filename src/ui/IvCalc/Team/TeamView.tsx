import React from 'react';
import { styled } from '@mui/system';
import { Button, Card, CardContent, Typography, Box } from '@mui/material';
import IvState, { IvAction } from '../IvState';
import { calculateTeamEnergy, TeamEnergyResult } from '../../../util/TeamEnergy';
import PokemonIcon from '../PokemonIcon';
import TeamSlotDialog from './TeamSlotDialog';
import FieldOptimizationDialog from './FieldOptimizationDialog';
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
        return calculateTeamEnergy(members, state.parameter);
    }, [selectedTeam, state.parameter]);

    if (!selectedTeam) {
        return <Typography>No team selected</Typography>;
    }

    return (
        <>
            <div style={{ padding: '0.5rem' }}>
                <Typography variant="h6" gutterBottom>
                    {selectedTeam.name}
                </Typography>

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

                <Box mt={2} display="flex" justifyContent="center">
                    <Button 
                        variant="outlined" 
                        onClick={() => dispatch({ type: 'openOptimizationDialog' })}
                    >
                        {t('optimize for field')}
                    </Button>
                </Box>
            </div>
            <TeamSlotDialog
                open={slotDialogOpen}
                onClose={onSlotDialogClose}
                onSelect={onPokemonSelect}
                state={state}
            />
            <FieldOptimizationDialog
                open={state.team.optimizationDialogOpen}
                onClose={() => dispatch({ type: 'optimizationDialogClose' })}
                state={state}
                dispatch={dispatch}
            />
        </>
    );
});

export default TeamView;
