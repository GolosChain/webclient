import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Icon from 'golos-ui/Icon';
import { TagLink } from 'golos-ui/Tag';

import PostHeader from 'src/app/containers/post/postHeader';
import MarkdownViewer from 'app/components/cards/MarkdownViewer';

const Wrapper = styled.section`
    position: relative;
    padding: 40px 70px 30px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

    @media (max-width: 576px) {
        padding: 15px 16px;
    }
`;

const BackLink = styled(Link)`
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 8px 0 25px 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
`;

const BackIcon = styled(Icon)`
    display: block;
    width: 50px;
    height: 50px;
    padding: 13px;
`;

const Body = styled.div`
    margin-top: 27px;
`;

const PostTitle = styled.h1`
    margin-top: 20px;
    color: #333333;
    font: 34px 'Open Sans', sans-serif;
    font-weight: bold;
    letter-spacing: 0.37px;
    line-height: 41px;

    @media (max-width: 576px) {
        font-size: 30px;
    }
`;

const PostBody = styled.div`
    padding: 12px 0 14px;

    p {
        color: #373d3f;
        font-family: 'Open Sans', sans-serif;
        font-size: 18px;
        letter-spacing: -0.29px;
        line-height: 26px;
    }

    @media (max-width: 576px) {
        font-size: 16px;
        letter-spacing: -0.26px;
        line-height: 24px;
    }
`;

const Tags = styled.div`
    margin-top: -10px;
    display: flex;
    flex-wrap: wrap;

    & > div {
        margin: 10px 10px 0 0;
    }
`;

const CategoryWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

export class PostContent extends Component {
    static propTypes = {
        togglePin: PropTypes.func.isRequired,
        toggleFavorite: PropTypes.func.isRequired,
    };

    onBackClick = e => {
        e.preventDefault();
        browserHistory.goBack();
    };

    render() {
        const {
            tags,
            payout,
            permLink,
            category,
            title,
            body,
            jsonMetadata,
            pictures,
            created,
            className,
            isPromoted,
            backUrl,
            togglePin,
            toggleFavorite,
        } = this.props;

        const formId = `postFull-${permLink}`;

        return (
            <Wrapper className={className}>
                {backUrl ? (
                    <BackLink to={backUrl} onClick={this.onBackClick}>
                        <BackIcon name="arrow_left" />
                    </BackLink>
                ) : null}
                <PostHeader togglePin={togglePin} toggleFavorite={toggleFavorite} />
                <Body>
                    <CategoryWrapper>
                        <TagLink to={'/trending/' + category.origin} category={1}>
                            {category.tag}
                        </TagLink>
                        {isPromoted && <Icon name="best" width="34" height="37" />}
                    </CategoryWrapper>
                    <PostTitle>{title}</PostTitle>
                    <PostBody>
                        <MarkdownViewer
                            formId={formId + '-viewer'}
                            text={body}
                            jsonMetadata={jsonMetadata}
                            large
                            highQualityPost={payout > 10}
                            noImage={!pictures}
                            timeCteated={new Date(created)}
                        />
                    </PostBody>
                </Body>
                <Tags>
                    {tags.map((tag, index) => (
                        <TagLink
                            to={'/trending/' + tag.origin}
                            category={index === 0 ? 1 : 0}
                            key={index}
                        >
                            {tag.tag}
                        </TagLink>
                    ))}
                </Tags>
            </Wrapper>
        );
    }
}