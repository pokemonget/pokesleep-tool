import React from 'react';
import { styled } from '@mui/system';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Select, MenuItem } from '@mui/material';
import IvState, { IvAction } from '../IvState';
import { calculateTeamEnergy } from '../../../util/TeamEnergy';
import fields from '../../../data/fields';
import { useTranslation } from 'react-i18next';

const StyledDialog = styled(Dialog)({
    '& .MuiDialog-paper': {
        maxWidth: '600px',
        width: '100%',
    },
});

const FieldOptimizationDialog = React.memo(({ 
    open, 
    onClose, 
    state, 
    dispatch 
}: {
    open: boolean;
    onClose: () => void;
    state: IvState;
    dispatch: React.Dispatch<IvAction>;
}) => {
    const { t } = useTranslation();
    const [selectedFieldIndex, setSelectedFieldIndex] = React.useState(0);

    const handleOptimize = React.useCallback(() => {
        // Simple optimization: select top 5 Pokemon by strength from box
        if (state.box.items.length === 0) {
            return;
        }

        // Calculate strength for each Pokemon in box
        const pokemonWithStrength = state.box.items.map(item => {
            const result = calculateTeamEnergy([item.iv], state.parameter);
            return {
                item,
                totalEnergy: result.totalEnergy,
            };
        });

        // Sort by total energy and take top 5
        pokemonWithStrength.sort((a, b) => b.totalEnergy - a.totalEnergy);
        const top5 = pokemonWithStrength.slice(0, 5);

        // Update team with top 5
        top5.forEach((pokemon, index) => {
            dispatch({
                type: 'updateTeamMember',
                payload: {
                    slotIndex: index,
                    member: {
                        iv: pokemon.item.iv.clone(),
                        nickname: pokemon.item.nickname,
                        filled: true,
                    },
                },
            });
        });

        onClose();
    }, [state.box.items, state.parameter, dispatch, onClose]);

    return (
        <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{t('optimize for field')}</DialogTitle>
            <DialogContent>
                <Box mb={2}>
                    <Typography variant="body2" gutterBottom>
                        {t('select field')}:
                    </Typography>
                    <Select
                        value={selectedFieldIndex}
                        onChange={(e) => setSelectedFieldIndex(e.target.value as number)}
                        fullWidth
                    >
                        {fields.map((field) => (
                            <MenuItem key={field.index} value={field.index}>
                                {field.emoji} {field.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                <Typography variant="body2" color="textSecondary">
                    {t('optimize description')}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t('cancel')}</Button>
                <Button onClick={handleOptimize} variant="contained" color="primary">
                    {t('optimize')}
                </Button>
            </DialogActions>
        </StyledDialog>
    );
});

export default FieldOptimizationDialog;
