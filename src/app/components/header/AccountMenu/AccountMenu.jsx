import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import styled from 'styled-components';
import tt from 'counterpart';
import Icon from 'app/components/elements/Icon';
import user from 'app/redux/User';
import { getAccountPrice } from 'src/app/redux/selectors/account/accountPrice';
import { formatCurrency } from 'src/app/helpers/currency';

const PriceBlock = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    border-bottom: 1px solid #e1e1e1;
    font-size: 14px;
    color: #333;
`;

const Price = styled.span`
    font-weight: 500;
`;

const Ul = styled.ul`
    padding: 5px 0 6px;
    margin: 0;
`;

const Li = styled.li`
    list-style: none;
`;

const IconWrapper = styled.div`
    display: flex;
    justify-content: center;
    width: 24px;
    margin-right: 20px;
    overflow: hidden;
`;

const IconStyled = styled(Icon)`
    transition: fill 0.15s, color 0.15s;
`;

const LinkStyled = styled(Link)`
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 10px 0 37px;
    font-size: 14px;
    color: #333 !important;
    background-color: #fff;
    transition: background-color 0.15s;

    &:hover {
        background-color: #f0f0f0;
    }

    &:hover ${IconStyled} {
        color: #3f46ad;
        fill: #3f46ad;
    }
`;

@connect(
    state => {
        const myAccountName = state.user.getIn(['current', 'username']);

        const { price, currency } = getAccountPrice(state, myAccountName);

        return {
            myAccountName,
            price,
            currency,
        };
    },
    {
        onShowMessagesClick: () => user.actions.showMessages(),
        onLogoutClick: () => user.actions.logout(),
    }
)
export default class AccountMenu extends PureComponent {
    render() {
        const { myAccountName, price, currency, onShowMessagesClick, onLogoutClick } = this.props;

        let items = [
            {
                link: `/@${myAccountName}/feed`,
                icon: 'new/home',
                iconSize: '1_5x',
                text: tt('g.feed'),
            },
            { link: `/@${myAccountName}`, icon: 'new/blogging', text: tt('g.blog') },
            { link: `/@${myAccountName}/comments`, icon: 'new/comment', text: tt('g.comments') },
            $STM_Config.is_sandbox
                ? {
                      icon: 'chatboxes',
                      text: tt('g.messages'),
                      onClick: onShowMessagesClick,
                  }
                : null,
            {
                link: `/@${myAccountName}/recent-replies`,
                icon: 'new/answer',
                text: tt('g.replies'),
            },
            { link: `/@${myAccountName}/favorites`, icon: 'new/star', text: tt('g.favorites') },
            { link: `/@${myAccountName}/transfers`, icon: 'new/wallet', text: tt('g.wallet') },
            { link: `/@${myAccountName}/settings`, icon: 'new/setting', text: tt('g.settings') },
            { icon: 'new/logout', text: tt('g.logout'), onClick: onLogoutClick },
        ];

        items = items.filter(item => item);

        const priceString = formatCurrency(price, currency, 'adaptive');

        return (
            <Fragment>
                <PriceBlock>
                    <div>
                        Баланс: <Price>{priceString}</Price>
                    </div>
                </PriceBlock>
                <Ul>
                    {items.map(({ link, icon, iconSize, text, onClick }, i) => (
                        <Li key={i}>
                            <LinkStyled href={link} onClick={onClick}>
                                <IconWrapper>
                                    <IconStyled name={icon} size={iconSize || '1_25x'} />
                                </IconWrapper>
                                {text}
                            </LinkStyled>
                        </Li>
                    ))}
                </Ul>
            </Fragment>
        );
    }
}