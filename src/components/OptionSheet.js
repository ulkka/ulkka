import React from 'react';
import {View, Alert, TouchableOpacity} from 'react-native';
import {ListItem, Divider, Button, Overlay} from 'react-native-elements';
import {
  hideOptionSheet,
  isVisible,
  showReportOptions,
  getId,
  getType,
  getReport,
} from '../redux/reducers/OptionSheetSlice';
import {useDispatch, useSelector} from 'react-redux';
import Report from './Report';
import {
  getPostAuthorId,
  getPostCommunityId,
  getPostType,
} from '../redux/selectors/PostSelectors';
import {getUserRoleInCommunity} from '../redux/reducers/CommunitySlice';
import {
  getCommentAuthorId,
  getCommentPostCommunity,
} from '../redux/selectors/CommentSelectors';
import {getRegisteredUser} from '../redux/reducers/AuthSlice';
import {
  deletePost,
  removePost,
  downloadMediaToLibrary,
} from '../redux/actions/PostActions';
import {deleteComment, removeComment} from '../redux/actions/CommentActions';
import {blockUser} from '../redux/reducers/UserSlice';
import {signout} from '../redux/actions/AuthActions';
import {navigate, push} from '../navigation/Ref';

function getCapitalizedPostType(postType) {
  switch (postType) {
    case 'image':
      return 'Image';
    case 'video':
      return 'Video';
    case 'gif':
      return 'GIF';

    default:
      break;
  }
}
export default function OptionSheet() {
  const dispatch = useDispatch();

  const visible = useSelector(isVisible);
  const id = useSelector(getId);
  const type = useSelector(getType);
  const isReport = useSelector(getReport);
  const authorId =
    type == 'post'
      ? useSelector((state) => getPostAuthorId(state, id))
      : type == 'comment'
      ? useSelector((state) => getCommentAuthorId(state, id))
      : null;

  const communityId =
    type == 'post'
      ? useSelector((state) => getPostCommunityId(state, id))
      : type == 'comment'
      ? useSelector((state) => getCommentPostCommunity(state, id))
      : null;

  const postType = useSelector((state) => getPostType(state, id));

  const userRole = useSelector((state) =>
    getUserRoleInCommunity(state, communityId),
  );

  const currentUser = useSelector(getRegisteredUser);

  const currentUserisAuthor = authorId == currentUser?._id;

  const listItemStyle = {
    borderRadius: 5,
  };

  const signoutConfirmationAlert = () => {
    dispatch(hideOptionSheet());
    Alert.alert(
      'Log out ?',
      null,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => signOut()},
      ],
      {cancelable: true},
    );
  };

  const signOut = async () => {
    try {
      dispatch(signout());
    } catch (error) {
      console.error(error);
    }
  };

  const list =
    type == 'user'
      ? [
          {
            // dont show report option if current user same as author
            title: 'Blocked Users',
            titleStyle: {fontSize: 14, fontWeight: '500', color: '#444'},
            containerStyle: listItemStyle,
            onPress: () => {
              dispatch(hideOptionSheet());
              navigate('BlockedUsers');
            },
          },
          {
            title: 'Logout',
            titleStyle: {fontSize: 14, fontWeight: '500', color: '#444'},
            containerStyle: listItemStyle,
            onPress: () => signoutConfirmationAlert(),
          },
        ]
      : [
          type == 'post' &&
            (postType == 'image' ||
              postType == 'video' ||
              postType == 'gif') && {
              title: 'Save ' + getCapitalizedPostType(postType),
              titleStyle: {fontSize: 14, fontWeight: '500', color: '#444'},
              containerStyle: listItemStyle,
              onPress: () => {
                console.log('download media to library');
                dispatch(downloadMediaToLibrary(id));
                dispatch(hideOptionSheet());
              },
            },
          !currentUserisAuthor && {
            title: 'Block User',
            titleStyle: {fontSize: 14, fontWeight: '500', color: '#444'},
            containerStyle: listItemStyle,
            onPress: () => {
              Alert.alert(
                'Are you sure?',
                "You won't be able to see posts and comments from this user and they won't be able to see your posts and comments on Ulkka. We won't let them know that you've blocked them",
                [
                  {
                    text: 'Cancel',
                    onPress: () => dispatch(hideOptionSheet()),
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => {
                      dispatch(blockUser(authorId));
                      dispatch(hideOptionSheet());
                    },
                  },
                ],
                {
                  cancelable: true,
                  onDismiss: () => dispatch(hideOptionSheet()),
                },
              );
            },
          },
          !currentUserisAuthor && {
            // dont show report option if current user same as author
            title: type == 'post' ? 'Report Post' : 'Report Comment',
            titleStyle: {fontSize: 14, fontWeight: '500', color: '#444'},
            containerStyle: listItemStyle,
            onPress: () => dispatch(showReportOptions({type: type, id: id})),
          },
          currentUserisAuthor && {
            // show delete option only of current user is same as author
            title: type == 'post' ? 'Delete Post' : 'Delete Comment',
            titleStyle: {fontSize: 14, fontWeight: '500', color: '#444'},
            containerStyle: listItemStyle,
            onPress: () => {
              Alert.alert(
                'Delete ' + type + ' ?',
                null,
                [
                  {
                    text: 'Cancel',
                    onPress: () => dispatch(hideOptionSheet()),
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => {
                      type == 'post'
                        ? dispatch(deletePost(id))
                        : dispatch(deleteComment(id));
                      dispatch(hideOptionSheet());
                    },
                  },
                ],
                {cancelable: true},
              );
            },
          },
          userRole == 'admin' && {
            // show delete option only of current user is same as author
            title: type == 'post' ? 'Remove Post' : 'Remove Comment',
            titleStyle: {fontSize: 14, fontWeight: '500', color: '#444'},
            containerStyle: listItemStyle,
            onPress: () => {
              Alert.alert(
                'Remove ' + type + ' ?',
                null,
                [
                  {
                    text: 'Cancel',
                    onPress: () => dispatch(hideOptionSheet()),
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => {
                      type == 'post'
                        ? dispatch(removePost(id))
                        : dispatch(removeComment(id));
                      dispatch(hideOptionSheet());
                    },
                  },
                ],
                {cancelable: true},
              );
            },
          },
        ];
  const optionsListView = (
    <View
      style={{
        width: '98%',
        alignSelf: 'center',
      }}>
      <View>
        {list.map(
          (l, i) =>
            l?.title && (
              <ListItem
                key={i}
                containerStyle={l.containerStyle}
                bottomDivider={true}>
                <TouchableOpacity
                  hitSlop={{top: 20, bottom: 10, left: 40, right: 40}}
                  onPress={l.onPress}
                  style={{flex: 1}}>
                  <ListItem.Content style={{alignItems: 'center'}}>
                    <ListItem.Title style={l.titleStyle}>
                      {l.title}
                    </ListItem.Title>
                  </ListItem.Content>
                </TouchableOpacity>
              </ListItem>
            ),
        )}
      </View>
      <Divider
        style={{
          height: 15,
          backgroundColor: 'transparent',
        }}
      />
      <Button
        title="Cancel"
        containerStyle={{backgroundColor: '#fff', marginBottom: 15}}
        titleStyle={{fontSize: 14, color: '#EC5152', fontWeight: '600'}}
        onPress={() => dispatch(hideOptionSheet())}
      />
    </View>
  );
  return (
    <Overlay
      isVisible={visible}
      statusBarTranslucent={true}
      onBackdropPress={() => dispatch(hideOptionSheet())}
      overlayStyle={{
        position: 'absolute',
        bottom: 0,
        width: '97%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}
      backdropStyle={{
        backgroundColor: '#000',
        opacity: 0.2,
      }}>
      <View>{isReport ? <Report id={id} type={type} /> : optionsListView}</View>
    </Overlay>
  );
}
