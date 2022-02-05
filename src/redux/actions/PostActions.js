import {post} from '../schema/FeedSchema';
import postApi from '../../services/PostApi';
import {normalize} from 'normalizr';
import {createAsyncThunk} from '@reduxjs/toolkit';
import RNFS from 'react-native-fs';
import {
  hasAndroidPermission,
  savePicture,
  getAlbumFromType,
  requestPermissionAlert,
} from './common';
import {Platform} from 'react-native';
import Snackbar from 'react-native-snackbar';
import RNFetchBlob from 'rn-fetch-blob';

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
      // const isRegistered = getState().authorization.isRegistered;
      // const access = isRegistered ? true : false;
      // return access;
      return true;
    },
    dispatchConditionRejection: true,
  },
);

export const downloadMedia = createAsyncThunk(
  'posts/downloadMedia',
  async (postId, {rejectWithValue, getState}) => {
    try {
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
        return {
          postId: postId,
          localUri: toFile,
        };
      }

      const mediaLibraryDirectoryPathExists = await RNFS.exists(
        mediaCacheDirectoryPath,
      );
      if (!mediaLibraryDirectoryPathExists) {
        await RNFS.mkdir(mediaCacheDirectoryPath);
      }

      await RNFS.downloadFile({
        fromUrl: url,
        toFile: toFile,
      }).promise;

      fileExists = await RNFS.exists(toFile);
      fileStat = fileExists && (await RNFS.stat(toFile));
      if (fileExists && fileStat?.size == bytes) {
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
      const mediaLibraryDirectoryPath =
        Platform.OS == 'android'
          ? RNFetchBlob.fs.dirs.DownloadDir + '/Omong/'
          : RNFetchBlob.fs.dirs.LibraryDir + '/Omong/';
      const filename = url.split('/').pop().replace('.', '').replace(/:/g, '');
      const toFile = mediaLibraryDirectoryPath + filename;
      if (Platform.OS === 'android') {
        let hasPermission = await hasAndroidPermission();
        if (!hasPermission) {
          requestPermissionAlert();
          Snackbar.show({
            text: 'Error saving file. Permission denied',
            duration: Snackbar.LENGTH_SHORT,
          });
          return rejectWithValue('Permission denied');
        }
      }
      const mediaLibraryDirectoryPathExists = await RNFS.exists(
        mediaLibraryDirectoryPath,
      ).catch(error =>
        console.warn('error creating media library path', error),
      );

      if (!mediaLibraryDirectoryPathExists) {
        if (Platform.OS === 'android') {
          let hasPermission = await hasAndroidPermission();
          if (!hasPermission) {
            requestPermissionAlert();
            Snackbar.show({
              text: 'Error saving file. Permission denied',
              duration: Snackbar.LENGTH_SHORT,
            });
            return rejectWithValue('Permission denied');
          }
        }
        await RNFS.mkdir(mediaLibraryDirectoryPath).catch(error =>
          console.warn('error creating Omong folder', error),
        );
      }

      const res = await RNFetchBlob.config({
        path: toFile,
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true, // <-- this is the only thing required
          // Optional, override notification setting (default to true)
          notification: true,
          // Optional, but recommended since android DownloadManager will fail when
          // the url does not contains a file extension, by default the mime type will be text/plain
          //mime: 'image/jpg',
          description: 'Media downloaded by Omong',
          path: toFile,
        },
      })
        .fetch('GET', url, {
          //some headers ..
        })
        .catch(error => {
          console.warn('error downloading through rnfetchblob', error);
          return rejectWithValue(error);
        });

      if (res?.path) {
        const result = await savePicture(
          {
            tag: toFile,
            album: getAlbumFromType(type),
          },
          rejectWithValue,
        );
        if (result?.message == 'Rejected') {
          return rejectWithValue(result?.message);
        }
      }
    } catch (error) {
      console.warn('error try catch', error);
      return rejectWithValue(error);
    }
  },
);
