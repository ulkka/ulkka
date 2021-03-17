import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';
import {signout} from '../actions/AuthActions';
import {fetchFeed} from '../actions/FeedActions';
import {createPost} from '../actions/PostActions';

const feedAdapter = createEntityAdapter({
  selectId: (post) => post._id,
});

const initialState = {
  ids: [],
  entities: {},
  metadata: {
    page: 0,
    total: -1,
    limit: 5,
  },
  complete: false,
  loading: false,
  initialised: false,
};

const intialEntityState = (postId) => {
  return {
    _id: postId,
    loaded: false,
    isViewable: false,
  };
};

export const slice = createSlice({
  name: 'feed',
  initialState: {
    screens: {},
  },

  reducers: {
    initialiseFeed(state, action) {
      const type = action.payload;
      const screen = state.screens[type];
      if (screen === undefined) {
        state.screens[type] = initialState;
      }
    },
    setViewableItems(state, action) {
      const {items, type} = action.payload;
      const screen = state.screens[type];

      const {viewableItems, changed} = items;
      changed.map((item) => {
        const postId = item.item._id;
        feedAdapter.updateOne(screen, {
          id: postId,
          changes: {isViewable: item.isViewable},
        });
      });
      viewableItems.map((item) => {
        const postId = item.item._id;

        feedAdapter.updateOne(screen, {
          id: postId,
          changes: {isViewable: item.isViewable},
        });
      });
    },
  },

  extraReducers: {
    [fetchFeed.pending]: (state, action) => {
      const type = action.meta.arg;
      const screen = state.screens[type];
      screen.loading = true;
    },
    [fetchFeed.fulfilled]: (state, action) => {
      const type = action.payload.type;
      const screen = state.screens[type];
      const normalizedPosts = action.payload.normalizedPosts;

      const isFeedEmpty =
        normalizedPosts &&
        Object.keys(normalizedPosts).length === 0 &&
        normalizedPosts.constructor === Object;

      let posts = {};
      if (!isFeedEmpty) {
        const postIds = action.payload.postIds;
        postIds.map((postId, index) => {
          if (screen.ids.includes(postId)) {
            console.log(
              'found duplicate id in feed array, so skipping',
              postId,
            );
          } else {
            posts[postId] = intialEntityState(postId);
          }
        });
        screen.metadata = action.payload.metadata;
      } else {
        screen.complete = true;
      }
      feedAdapter.upsertMany(screen, posts);
      screen.loading = false;
      screen.initialised = true;
    },
    [fetchFeed.rejected]: (state, action) => {
      const type = action.meta.arg;
      const screen = state.screens[type];
      screen.loading = false;
    },
    [createPost.fulfilled]: (state, action) => {
      const newPostId = action.payload.newPostId;
      const homeScreen = state.screens['home'];
      const newPost = intialEntityState(newPostId);
      homeScreen.entities[newPostId] = newPost;
      homeScreen.ids.unshift(newPostId); // to bring the newly added post to the top of current users home feed
    },
    [signout.fulfilled]: (state) => {
      //resetAllFeeds(state);
    },
    // [registerUser.fulfilled]: () => postAdapter.getInitialState(),
  },
});

export const feed = slice.reducer;
export const {setViewableItems, initialiseFeed} = slice.actions;

export const {
  selectById: selectFeedPostById,
  selectIds: selectFeedPostIds,
  selectEntities: selectFeedPostEntities,
  selectAll: selectAllPosts,
  selectTotal: selectTotalPosts,
} = feedAdapter.getSelectors((state) => state);
