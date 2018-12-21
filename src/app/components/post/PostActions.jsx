import React, { Fragment } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';

const Action = styled.div`
    display: flex;
    align-items: center;
    color: ${props => (props.active ? '#2879ff' : '#333333')} !important;
    cursor: pointer;

    ${({ colored }) =>
        colored
            ? `
        &:hover {
            color: #2879ff !important;
        }
    `
            : `
        transition: transform 0.15s;
        &:hover {
            transform: scale(1.15);
        }
    `};
`;

const ActionEditLink = styled(Action.withComponent(Link))``;

const ActionIcon = styled(Icon)`
    width: 20px;
`;

const ActionText = styled.div`
    margin-left: 25px;
    font-family: Roboto, sans-serif;
    font-size: 14px;
    line-height: 44px;
    white-space: nowrap;
    cursor: pointer;
`;

const PostActions = ({
    className,
    isFavorite,
    isPinned,
    togglePin,
    isOwner,
    showText = false,
    toggleFavorite,
    fullUrl,
    coloredOnHover,
}) => {
    const favoriteTooltip = !showText
        ? isFavorite
            ? tt('g.remove_from_favorites')
            : tt('g.add_to_favorites')
        : undefined;

    const FavoriteButton = (
        <Action
            className={className}
            colored={coloredOnHover ? 1 : 0}
            role="button"
            data-tooltip={favoriteTooltip}
            aria-label={favoriteTooltip}
            onClick={toggleFavorite}
        >
            <ActionIcon name={isFavorite ? 'star_filled' : 'star'} />
            {showText ? <ActionText>{tt('g.add_to_favorites')}</ActionText> : null}
        </Action>
    );

    if (isOwner) {
        const editTooltip = showText ? undefined : tt('active_panel_tooltip.edit');
        const pinTooltip = !showText
            ? isPinned
                ? tt('active_panel_tooltip.unpin_post')
                : tt('active_panel_tooltip.pin_post')
            : undefined;

        return (
            <Fragment>
                <ActionEditLink
                    className={className}
                    colored={coloredOnHover ? 1 : 0}
                    to={`${fullUrl}/edit`}
                    role="button"
                    data-tooltip={editTooltip}
                    aria-label={editTooltip}
                >
                    <ActionIcon name="pen" />
                    {showText ? <ActionText>{tt('active_panel_tooltip.edit')}</ActionText> : null}
                </ActionEditLink>
                <Action
                    className={className}
                    active={isPinned ? 1 : 0}
                    colored={coloredOnHover ? 1 : 0}
                    role="button"
                    data-tooltip={pinTooltip}
                    aria-label={pinTooltip}
                    onClick={togglePin}
                >
                    <ActionIcon name="pin" />
                    {showText ? (
                        <ActionText>{tt('active_panel_tooltip.pin_post')}</ActionText>
                    ) : null}
                </Action>
                {FavoriteButton}
            </Fragment>
        );
    } else {
        return FavoriteButton;
    }
};

PostActions.propTypes = {
    fullUrl: PropTypes.string.isRequired,
    isFavorite: PropTypes.bool.isRequired,
    isPinned: PropTypes.bool.isRequired,
    isOwner: PropTypes.bool.isRequired,
    togglePin: PropTypes.func.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    showText: PropTypes.bool,
    coloredOnHover: PropTypes.bool,
};

export default PostActions;
