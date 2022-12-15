import { Theme } from '@mui/material';
import React from 'react';
import { makeStyles } from 'tss-react/mui';

import { isMobileBrowser } from '../../../environment/utils';
import Icon from '../../../icons/components/Icon';
import { IconCheckMark } from '../../../icons/svg';
import { withPixelLineHeight } from '../../../styles/functions.web';

interface ICheckboxProps {

    /**
     * Whether the input is checked or not.
     */
    checked: boolean;

    /**
     * Class name for additional styles.
     */
    className?: string;

    /**
     * Whether the input is disabled or not.
     */
    disabled?: boolean;

    /**
     * The label of the input.
     */
    label: string;

    /**
     * The name of the input.
     */
    name?: string;

     /**
     * check box or radio type of the input.
     */
    type?:string;
    /**
     * Change callback.
     */
 /**
     * Ans id.
     */
  id?:string;
  /**
   * Change callback.
   */
     
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const useStyles = makeStyles()((theme: Theme) => {
    return {
        formControl: {
            ...withPixelLineHeight(theme.typography.bodyLongRegular),
            color: theme.palette.text01,
            display: 'inline-flex',
            alignItems: 'center',

            '&.is-mobile': {
                ...withPixelLineHeight(theme.typography.bodyLongRegularLarge)

            }
        },

        activeArea: {
            display: 'grid',
            placeContent: 'center',
            width: '24px',
            height: '24px',
            backgroundColor: 'transparent',
            marginRight: '15px',
            position: 'relative',
            cursor: 'pointer',

            '& input[type="checkbox"]': {
                appearance: 'none',
                backgroundColor: 'transparent',
                margin: 0,
                font: 'inherit',
                color: theme.palette.icon03,
                width: '18px',
                height: '18px',
                border: `2px solid ${theme.palette.icon03}`,
                borderRadius: '3px',
                cursor: 'pointer',

                display: 'grid',
                placeContent: 'center',

                '&::before': {
                    content: 'url("")',
                    width: '18px',
                    height: '18px',
                    opacity: 0,
                    backgroundColor: theme.palette.action01,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 0,
                    borderRadius: '3px',
                    transition: '.2s'
                },

                '&:checked::before': {
                    opacity: 1
                },

                '&:disabled': {
                    backgroundColor: theme.palette.ui03,
                    borderColor: theme.palette.ui04,

                    '&::before': {
                        backgroundColor: theme.palette.ui04
                    }
                },

                '&:checked+.checkmark': {
                    opacity: 1
                }
            },

            '& .checkmark': {
                position: 'absolute',
                left: '3px',
                top: '3px',
                opacity: 0,
                transition: '.2s'
            },

            '&.is-mobile': {
                width: '40px',
                height: '40px',

                '& input[type="checkbox"]': {
                    width: '24px',
                    height: '24px',

                    '&::before': {
                        width: '24px',
                        height: '24px'
                    }
                },

                '& .checkmark': {
                    left: '11px',
                    top: '10px'
                }
            }
        }
    };
});

const Checkbox = ({
    checked,
    className,
    disabled,
    label,
    name,
    type,
    id,
    onChange
}: ICheckboxProps) => {
    const { classes: styles, cx, theme } = useStyles();
    const isMobile = isMobileBrowser();

    return (
        <div className = { cx(styles.formControl, isMobile && 'is-mobile', className) }>
            <label className = { cx(styles.activeArea, isMobile && 'is-mobile') }>
                <input
                    checked = { checked }
                    disabled = { disabled }
                    name = { name }
                    id={id}
                    onChange = { onChange }
                    type = {type} />
                <Icon
                    className = 'checkmark'
                    color = { disabled ? theme.palette.icon03 : theme.palette.icon01 }
                    size = { 18 }
                    src = { IconCheckMark } />
            </label>
            <label>{label}</label>
        </div>
    );
};

export default Checkbox;
