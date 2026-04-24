import React from 'react';
import { styled } from '@mui/system';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography } from '@mui/material';
import IvState, { IvAction } from '../IvState';
import PokemonIcon from '../PokemonIcon';
import { useTranslation } from 'react-i18next';

const StyledDialog = styled(Dialog)({
    '& .MuiDialog-paper': {
        maxWidth: '600px',
        width: '100%',
    },
});

const TeamSlotDialog = React.memo(({ 
    open, 
    onClose, 
    onSelect, 
    state 
}: {
    open: boolean;
    onClose: () => void;
    onSelect: (boxItemId: number) => void;
    state: IvState;
}) => {
    const { t } = useTranslation();

    const handleSelect = React.useCallback((boxItemId: number) => {
        onSelect(boxItemId);
        onClose();
    }, [onSelect, onClose]);

    return (
        <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{t('select pokemon from box')}</DialogTitle>
            <DialogContent>
                {state.box.items.length === 0 ? (
                    <Typography variant="body2" color="textSecondary" style={{ padding: '1rem' }}>
                        {t('box is empty')}
                    </Typography>
                ) : (
                    <List>
                        {state.box.items.map((item) => (
                            <ListItem 
                                key={item.id} 
                                onClick={() => handleSelect(item.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <PokemonIcon idForm={item.iv.idForm} size={40} />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.nickname || t(`pokemons.${item.iv.pokemon.name}`)}
                                    secondary={`Lv${item.iv.level}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>
        </StyledDialog>
    );
});

export default TeamSlotDialog;
