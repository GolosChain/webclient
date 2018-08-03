import { fromJS } from 'immutable';

export const CHANGE_LAYOUT = 'CHANGE_LAYOUT';
const LAYOUT_STORAGE_KEY = 'profile.layout';

export default function(state, { type, payload }) {
    if (!process.env.BROWSER) {
        return null;
    }

    if (!state) {
        state = {
            layout: getSavedLayout() || 'list',
        };
    }

    state = fromJS(state);

    switch (type) {
        case CHANGE_LAYOUT:
            localStorage.setItem(LAYOUT_STORAGE_KEY, payload.layout);
            return state.set('layout', payload.layout);
    }

    return state;
}

function getSavedLayout() {
    try {
        return localStorage.getItem(LAYOUT_STORAGE_KEY);
    } catch (err) {}
}