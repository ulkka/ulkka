import React from 'react';
import {View, Alert} from 'react-native';
import {ListItem, Divider, Button, Overlay} from 'react-native-elements';
import {
  hideOptionSheet,
  isVisible,
  showReportOptions,
} from '../redux/reducers/OptionSheetSlice';
import {useDispatch, useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native';
import {getId, getType, getReport} from '../redux/reducers/OptionSheetSlice';
import Report from './Report';
import {getPostAuthorId} from '../redux/selectors/PostSelectors';
import {getCommentAuthorId} from '../redux/selectors/CommentSelectors';
import {getRegisteredUser} from '../redux/reducers/AuthSlice';
import {deletePost} from '../redux/actions/PostActions';
import {deleteComment} from '../redux/actions/CommentActions';

export default function OptionSheet() {
  const dispatch = useDispatch();

  const visible = useSelector(isVisible);
  const id = useSelector(getId);
  const type = useSelector(getType);
  const isReport = useSelector(getReport);

  const authorId =
    type == 'post'
      ? useSelector((state) => getPostAuthorId(state, id))
      : useSelector((state) => getCommentAuthorId(state, id));

  const currentUser = useSelector(getRegisteredUser);

  const currentUserisAuthor = authorId == currentUser?._id;

  console.log('option sheet', id, type);
  const listItemStyle = {
    borderRadius: 5,
  };
  const list = [
    !currentUserisAuthor && {
      // dont show report option if current user same as author
      title: 'Report',
      titleStyle: {fontSize: 14},
      containerStyle: listItemStyle,
      onPress: () => dispatch(showReportOptions({type: type, id: id})),
    },
    currentUserisAuthor && {
      // show delete option only of current user is same as author
      title: 'Delete',
      titleStyle: {fontSize: 14},
      containerStyle: listItemStyle,
      onPress: () => {
        Alert.alert('Delete ' + type + ' ?', null, [
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
        ]);
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
                <TouchableOpacity onPress={l.onPress} style={{flex: 1}}>
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
        titleStyle={{fontSize: 14, color: '#EC5152'}}
        onPress={() => dispatch(hideOptionSheet())}
      />
    </View>
  );
  return (
    <Overlay
      isVisible={visible}
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
