export const getFeedPostIds = (state, screen) =>
  state.feed.screens[screen] === undefined
    ? []
    : state.feed.screens[screen].ids;

export const isComplete = (state, screen) =>
  state.feed.screens[screen] === undefined
    ? false
    : state.feed.screens[screen].complete;

export const isLoading = (state, screen) =>
  state.feed.screens[screen] === undefined
    ? false
    : state.feed.screens[screen].loading;
