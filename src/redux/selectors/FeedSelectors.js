export const makeFeed = (screen) => (state) =>
  state.feed.screens[screen] === undefined
    ? []
    : state.feed.screens[screen].ids;

export const isComplete = (screen) => (state) =>
  state.feed.screens[screen] === undefined
    ? false
    : state.feed.screens[screen].complete;

export const isLoading = (screen) => (state) =>
  state.feed.screens[screen] === undefined
    ? false
    : state.feed.screens[screen].loading;
