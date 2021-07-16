import {post} from '../schema/FeedSchema';
import postApi from '../../services/PostApi';
import {normalize} from 'normalizr';
import {createAsyncThunk} from '@reduxjs/toolkit';
import RNFS from 'react-native-fs';
import {hasAndroidPermission, savePicture, getAlbumFromType} from './common';
import {Platform} from 'react-native';
import Snackbar from 'react-native-snackbar';

export function resetState(state, type) {
  postAdapter.removeAll(state);
}

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (id, {rejectWithValue}) => {
    try {
      let response = await postApi.post.fetchById(id);
      const normalized = normalize(response.data, post);
      return {
        posts: normalized.entities.posts,
        postId: normalized.result,
        users: normalized.entities.users,
        communities: normalized.entities.communities,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (id, {getState}) => {
      const authStatus = getState().authorization.status;
      const authAccess = authStatus == 'UNAUTHENTICATED' ? false : true;

      return authAccess;
    },
    dispatchConditionRejection: true,
  },
);

export const createPost = createAsyncThunk(
  'posts/create',
  async (payload, {rejectWithValue}) => {
    try {
      let response = await postApi.post.create(payload);
      const normalized = normalize(response.data, post);
      return {
        normalizedPost: normalized.entities,
        newPostId: normalized.result,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (payload, {getState}) => {
      const isRegistered = getState().authorization.isRegistered;
      const access = isRegistered ? true : false;
      return access;
    },
    dispatchConditionRejection: true,
  },
);

export const votePost = createAsyncThunk(
  'posts/vote',
  async ({id, voteType}, {rejectWithValue}) => {
    try {
      let response = await postApi.post.vote(id, voteType);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: ({id, voteType}, {getState}) => {
      const isRegistered = getState().authorization.isRegistered;
      const access = isRegistered ? true : false;

      return access;
    },
    dispatchConditionRejection: true,
  },
);

export const deletePost = createAsyncThunk(
  'posts/delete',
  async (id, {rejectWithValue}) => {
    try {
      let response = await postApi.post.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (id, {getState}) => {
      const isRegistered = getState().authorization.isRegistered;
      const access = isRegistered ? true : false;
      return access;
    },
    dispatchConditionRejection: true,
  },
);

export const removePost = createAsyncThunk(
  'posts/remove',
  async (id, {rejectWithValue}) => {
    try {
      let response = await postApi.post.remove(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (id, {getState}) => {
      const isRegistered = getState().authorization.isRegistered;
      const access = isRegistered ? true : false;

      const communityId = getState().posts.entities[id]?.community;
      const role = getState().communities.entities[communityId]?.role;
      return access && role == 'admin';
    },
    dispatchConditionRejection: true,
  },
);

export const pinPost = createAsyncThunk(
  'posts/pin',
  async (id, {rejectWithValue}) => {
    try {
      let response = await postApi.post.pin(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (id, {getState}) => {
      const isRegistered = getState().authorization.isRegistered;
      const access = isRegistered ? true : false;

      const communityId = getState().posts.entities[id]?.community;
      const role = getState().communities.entities[communityId]?.role;
      return access && role == 'admin';
    },
    dispatchConditionRejection: true,
  },
);

export const unpinPost = createAsyncThunk(
  'posts/unpin',
  async (id, {rejectWithValue}) => {
    try {
      let response = await postApi.post.unpin(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (id, {getState}) => {
      const isRegistered = getState().authorization.isRegistered;
      const access = isRegistered ? true : false;

      const communityId = getState().posts.entities[id]?.community;
      const role = getState().communities.entities[communityId]?.role;
      return access && role == 'admin';
    },
    dispatchConditionRejection: true,
  },
);

export const reportPost = createAsyncThunk(
  'posts/report',
  async ({id, option}, {rejectWithValue}) => {
    try {
      await postApi.post.report(id, option);
      return {id, option};
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (id, {getState}) => {
      const isRegistered = getState().authorization.isRegistered;
      const access = isRegistered ? true : false;
      return access;
    },
    dispatchConditionRejection: true,
  },
);

export const downloadMedia = createAsyncThunk(
  'posts/downloadMedia',
  async (postId, {rejectWithValue, getState}) => {
    try {
      console.log('cache directory', RNFS.CachesDirectoryPath);
      const {bytes, secure_url: url} = getState().posts.entities[
        postId
      ]?.mediaMetadata;

      const cachesDirectoryPath = RNFS.CachesDirectoryPath;
      const mediaCacheDirectoryPath = cachesDirectoryPath + '/media';
      const filename = url.split('/').pop();
      const toFile = mediaCacheDirectoryPath + '/' + filename;

      let fileExists = await RNFS.exists(toFile);
      let fileStat = fileExists && (await RNFS.stat(toFile));

      if (fileExists && fileStat?.size == bytes) {
        console.log('file exists in cache, so returning local uri already');
        return {
          postId: postId,
          localUri: toFile,
        };
      }

      console.log('file doesnt exist in cache so downloading');

      const mediaLibraryDirectoryPathExists = await RNFS.exists(
        mediaCacheDirectoryPath,
      );
      if (!mediaLibraryDirectoryPathExists) {
        console.log(
          'Media cache download folder does not exist. So creating one!',
        );
        await RNFS.mkdir(mediaCacheDirectoryPath);
      }

      await RNFS.downloadFile({
        fromUrl: url,
        toFile: toFile,
      }).promise;

      fileExists = await RNFS.exists(toFile);
      fileStat = fileExists && (await RNFS.stat(toFile));
      if (fileExists && fileStat?.size == bytes) {
        console.log('file downloaded successfully, so returning local uri');
        return {
          postId: postId,
          localUri: toFile,
        };
      } else {
        const error = {message: 'Download failed', name: 'DownloadError'};
        return rejectWithValue(error);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (postId, {getState}) => {
      const isDownloading = getState().posts.entities[postId].isDownloading;
      const isDownloaded = getState().posts.entities[postId].downloaded;
      const access = !isDownloading && !isDownloaded;
      return access;
    },
    dispatchConditionRejection: true,
  },
);

export const downloadMediaToLibrary = createAsyncThunk(
  'posts/downloadMediaToLibrary',
  async (postId, {rejectWithValue, getState}) => {
    try {
      const {bytes, secure_url: url} = getState().posts.entities[
        postId
      ]?.mediaMetadata;

      const {type} = getState().posts.entities[postId];

      const picturesDirectoryPath =
        Platform.OS == 'android'
          ? RNFS.ExternalDirectoryPath
          : RNFS.LibraryDirectoryPath;
      const mediaLibraryDirectoryPath = picturesDirectoryPath + '/Ulkka';
      const filename =
        Platform.OS == 'ios'
          ? url.split('/').pop().replace('.', '').replaceAll(':', '')
          : url.split('/').pop();
      const toFile = mediaLibraryDirectoryPath + '/' + filename;

      let error = false;
      if (Platform.OS === 'android') {
        error = !(await hasAndroidPermission());
        if (error) {
          Snackbar.show({
            text: 'Error saving file. Permission denied',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      }
      const mediaLibraryDirectoryPathExists = await RNFS.exists(
        mediaLibraryDirectoryPath,
      ).catch((error) =>
        console.log('error creating media library path', error),
      );

      if (!mediaLibraryDirectoryPathExists) {
        if (Platform.OS == 'android') {
          await hasAndroidPermission();
        }
        await RNFS.mkdir(mediaLibraryDirectoryPath).catch((error) =>
          console.log('error creating Ulkka folder', error),
        );
      }

      await RNFS.downloadFile({
        //  background: true,
        fromUrl: url,
        toFile: toFile,
      })
        .promise.then(async (result) => {
          console.log(
            'saving media to ',
            toFile,
            mediaLibraryDirectoryPath,
            mediaLibraryDirectoryPathExists,
            await RNFS.stat(mediaLibraryDirectoryPath),
            result,
          );
          const res = await savePicture(
            {
              tag: Platform.OS == 'android' ? 'file://' + toFile : toFile,
              album: getAlbumFromType(type),
            },
            rejectWithValue,
          );

          if (res.message == 'Rejected') {
            error = true;
          }
        })
        .catch((error) => {
          console.log('error downloading', error);
          return rejectWithValue(error);
        });

      let fileExists = await RNFS.exists(toFile);
      let fileStat = fileExists && (await RNFS.stat(toFile));
      if (fileExists && fileStat?.size == bytes && error === false) {
        console.log(
          'file downloaded successfully, so returning local uri',
          toFile,
        );
        return {
          postId: postId,
          localUri: toFile,
          type: type,
        };
      } else {
        const error = {message: 'Download failed', name: 'DownloadError'};
        return rejectWithValue(error);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
