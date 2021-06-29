import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {Icon, Input} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {
  prepareReply,
  getCommentId,
  createReply,
  isActive,
  activate,
  deactivate,
  isLoading,
  getResetCommentToggle,
} from '../../redux/reducers/CommentWriterSlice';
import {
  getPostTitle,
  getPostAuthorId,
} from '../../redux/selectors/PostSelectors';
import {
  getRegistrationStatus,
  getRegisteredUser,
} from '../../redux/reducers/AuthSlice';
import {selectCommentById} from '../../redux/selectors/CommentSelectors';
import {getUserDisplayname} from '../../redux/reducers/UserSlice';
import {ActivityIndicator} from 'react-native';
import {removeEmptyLines} from '../PostCreator/helpers';
import UserAvatar from '../UserAvatar';
import analytics from '@react-native-firebase/analytics';

export default function CommentWriter(props) {
  const dispatch = useDispatch();

  console.log('running comment writer');

  const {postId} = props;
  const commentId = useSelector(getCommentId);
  const parentComment = useSelector((state) =>
    selectCommentById(state, commentId),
  );

  const title = useSelector((state) => getPostTitle(state, postId));
  const postAuthorId = useSelector((state) => getPostAuthorId(state, postId));
  const parentAuthorId = parentComment ? parentComment.author : postAuthorId;

  const registrationStatus = useSelector(getRegistrationStatus);
  const registeredUser = useSelector(getRegisteredUser);

  const parentCommentAuthorDisplayname = parentAuthorId
    ? useSelector((state) => getUserDisplayname(state, parentAuthorId))
    : '';

  const reply_to = parentComment != undefined ? 'comment' : 'post';
  const reply_to_text = parentComment ? parentCommentAuthorDisplayname : title;

  const inputRef = useRef(null);
  const active = useSelector(isActive);
  const loading = useSelector(isLoading);
  const resetCommentToggle = useSelector(getResetCommentToggle);

  const [comment, setComment] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const disableForm = !active || comment.length == 0 || loading;

  useEffect(() => {
    resetForm();
    return () => {
      resetForm();
    };
  }, []);

  useEffect(() => {
    if (reply_to == 'comment') {
      activateForm();
    }
  }, [reply_to, commentId]);

  useEffect(() => {
    if (!active) {
      inputRef.current.blur();
      setExpanded(false);
    }
  }, [active]);

  useEffect(() => {
    setComment('');
    inputRef.current.shake();
  }, [resetCommentToggle]);

  const initializeForm = () => {
    if (!initialized) {
      inputRef.current.blur();
      activateForm();
    }
  };

  const resetForm = () => {
    dispatch(prepareReply({postId: postId}));
    dispatch(deactivate());
  };

  const formBlurred = () => {
    dispatch(deactivate());
  };

  const confirmAndResetForm = () => {
    Alert.alert('Discard Comment ?', null, [
      {
        text: 'Keep Writing',
        onPress: () => console.log('Cancel Pressed'),
        style: 'default',
      },
      {text: 'Discard', onPress: () => resetForm()},
    ]);
  };

  const activateForm = () => {
    dispatch(activate()).then((result) => {
      if (result.error) {
        inputRef.current.blur();
      } else {
        setInitialized(true);
        inputRef.current.focus();
      }
    });
  };

  const expandForm = () => {
    analytics().logEvent('commentwriter_toggleexpand', {value: !expanded});
    setExpanded(!expanded);
  };

  const submitComment = async () => {
    var data = {};
    data.comment = removeEmptyLines(comment.trim());
    data.postId = postId;

    if (reply_to != 'post') {
      data.parentCommentId = commentId;
    }

    dispatch(createReply(data));
  };

  const ReplyPrompt = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: reply_to == 'post' ? '#333' : '#666',
          fontSize: 12,
          fontWeight: '400',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        {reply_to == 'post' ? 'Commenting on ' : 'Replying to '}
      </Text>
      <Text
        ellipsizeMode={'tail'}
        numberOfLines={1}
        style={{
          color: reply_to == 'post' ? '#245a89d6' : '#02862ad6',
          fontSize: 12,
          fontWeight: '600',
          width: 200,
        }}>
        {reply_to_text}
      </Text>
    </View>
  );

  const expand = (
    <View style={{paddingHorizontal: 10}}>
      <TouchableOpacity
        hitSlop={{top: 20, left: 20, right: 20}}
        onPress={() => expandForm()}>
        <Icon
          name={expanded ? 'compress' : 'expand'}
          size={18}
          type="font-awesome"
          color="#555"
        />
      </TouchableOpacity>
    </View>
  );
  const close = (
    <View>
      <TouchableOpacity
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        style={{paddingHorizontal: 5}}
        onPress={() => {
          analytics().logEvent('commentwriter_close', {value: comment.length});
          resetForm();
        }}>
        <Icon name="close" size={20} color="#444" />
      </TouchableOpacity>
    </View>
  );
  const whenActive = (
    <View
      style={{
        padding: 5,
        borderWidth: 1,
        borderColor: '#eee',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {close}
        {ReplyPrompt}
      </View>
      {expand}
    </View>
  );

  const SubmitButton = () => {
    const LoadingView = (
      <View
        style={{
          flex: 1,
          paddingVertical: 10,
          paddingHorizontal: 16,
        }}>
        <ActivityIndicator size="small" color="#4285f4" />
      </View>
    );

    const Button = (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: 'white',
          borderColor: '#666',
          marginRight: 8,
          marginTop: 3,
          marginBottom: 8,
          borderRadius: 25,
          shadowColor: '#000',
          shadowOffset: {
            width: 2,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
        <TouchableOpacity
          onPress={() => submitComment()}
          disabled={disableForm}
          hitSlop={{left: 20, right: 20, bottom: 20}}
          style={{
            paddingHorizontal: 15,
            paddingVertical: 5,
          }}>
          <Text
            style={{
              color: disableForm ? '#666' : '#02862ad6',
              fontWeight: 'bold',
              fontSize: 15,
              letterSpacing: 0.25,
            }}>
            {' '}
            Reply{' '}
          </Text>
        </TouchableOpacity>
      </View>
    );

    return (
      active && (
        <View
          style={{
            alignItems: 'flex-end',
          }}>
          {!loading ? Button : LoadingView}
        </View>
      )
    );
  };

  const whenInactive = <View></View>;
  const AddCommentHeader = active ? whenActive : whenInactive;

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={95}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        position: 'absolute',
        borderBottomWidth: Platform.OS === 'ios' ? 0 : 1,
        borderBottomColor: '#eee',
        bottom: 0,
        alignSelf: 'center',
        flex: 1,
        backgroundColor: '#fff',
        width: '100%',
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
      }}>
      {AddCommentHeader}
      <TouchableOpacity
        onPress={() => initializeForm()}
        activeOpacity={0.8}
        style={{
          padding: 5,
          paddingBottom: Platform.OS === 'ios' && !active ? 15 : 7,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
        }}>
        <View
          pointerEvents={initialized ? 'auto' : 'none'}
          style={
            !active && {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 20,
              paddingRight: 25,
            }
          }>
          {!active && (
            <View style={{paddingRight: 5}}>
              {registrationStatus == 1 ? (
                <UserAvatar size="large" seed={registeredUser?.displayname} />
              ) : (
                <Icon name="account-circle" size={38} color="#555" />
              )}
            </View>
          )}
          <Input
            ref={inputRef}
            placeholder="Add a comment ..."
            containerStyle={{
              backgroundColor: '#eee',
              borderRadius: 10,
            }}
            inputContainerStyle={{
              borderBottomWidth: 0,
              height: expanded
                ? 200
                : comment == '' && !active
                ? Platform.OS == 'ios'
                  ? 35
                  : 40
                : 'auto',
              maxHeight: 200,
              marginTop: Platform.OS == 'ios' ? 10 : 0,
              marginBottom: Platform.OS == 'ios' && comment != '' ? 10 : 0,
            }}
            inputStyle={{
              fontSize: 13,
              color: '#333',
              textAlign: 'justify',
            }}
            disabled={false}
            maxLength={10000}
            multiline={true}
            onBlur={() => formBlurred()}
            onFocus={() => activateForm()}
            value={comment}
            onChangeText={(text) => setComment(text)}
            renderErrorMessage={false}
          />
        </View>
      </TouchableOpacity>
      <SubmitButton />
    </KeyboardAvoidingView>
  );
}
