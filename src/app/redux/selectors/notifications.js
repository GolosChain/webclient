import { fromJS } from 'immutable';
import { createDeepEqualSelector, globalSelector, currentUserSelector } from './common';

// Notifications selectors

export const hydrateNotification = (notification, account, accounts, contents, prevNotify) => {
    return notification.withMutations(notify => {
        // Add content title and link from store data
        const eventType = notify.get('eventType');
        if (
            ['vote', 'flag', 'repost', 'reply', 'mention', 'reward', 'curatorReward'].includes(
                eventType
            )
        ) {
            let author = '';
            if (['vote', 'flag', 'reward'].includes(eventType)) {
                author = account.get('name');
            } else if (['curatorReward'].includes(eventType)) {
                author = notify.get('curatorTargetAuthor');
            } else if (['repost', 'reply', 'mention'].includes(eventType)) {
                author = notify.get('fromUsers').get(0);
            }

            const content = contents.getIn([`${author}/${notify.get('permlink')}`]);
            if (content) {
                // if it isn't post
                if (content.get('parent_author')) {
                    notify.setIn(
                        ['computed'],
                        fromJS({
                            title: content.get('root_title'),
                            link: content.get('url'),
                        })
                    );
                } else {
                    notify.setIn(
                        ['computed'],
                        fromJS({
                            title: content.get('title'),
                            link: `/@${content.get('author')}/${content.get('permlink')}`,
                        })
                    );
                }
            }
        }

        // Add users from store data
        const computedAccounts = notify
            .get('fromUsers')
            .map(userName => accounts.get(userName.toLowerCase()));
        notify.setIn(['computed', 'accounts'], computedAccounts);

        // Check that this notification have next day date
        if (prevNotify) {
            const isNextDay =
                new Date(prevNotify.get('createdAt')).toDateString() !==
                new Date(notify.get('createdAt')).toDateString();
            notify.set('isNextDay', isNextDay);
        }

        return notify;
    });
};

// Prepare all data for render notifications
export const hydratedNotificationsSelector = filteredNotificationsSelector =>
    createDeepEqualSelector(
        [
            filteredNotificationsSelector,
            currentUserSelector,
            globalSelector('accounts'),
            globalSelector('content'),
        ],
        (notifications, account, accounts, contents) =>
            notifications.map((notification, key) => {
                // skip first element, because we don't need date label before first element
                const prevNotify = key !== 0 ? notifications.get(key - 1) : null; // prev notify on null
                return hydrateNotification(notification, account, accounts, contents, prevNotify);
            })
    );

export const hydratedNotificationOnlineSelector = () =>
    createDeepEqualSelector(
        [
            (state, props) => props.notification,
            currentUserSelector,
            globalSelector('accounts'),
            globalSelector('content'),
        ],
        (notification, account, accounts, contents) => ({
            notification: hydrateNotification(notification, account, accounts, contents),
        })
    );
