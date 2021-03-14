import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
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
} from '../../redux/reducers/ReplySlice';
import {selectPostById} from '../../redux/reducers/PostSlice';
import {selectCommentById} from '../../redux/reducers/CommentSlice';
import {selectUserById} from '../../redux/reducers/UserSlice';
import {ActivityIndicator} from 'react-native';

export default function CommentWriter(props) {
  const dispatch = useDispatch();

  const postId = props.postId;
  const commentId = useSelector(getCommentId);
  const post = useSelector((state) => selectPostById(state, postId));
  const parentComment = useSelector((state) =>
    selectCommentById(state, commentId),
  );

  const reply_to = parentComment != undefined ? 'comment' : 'post';
  const parentAuthorId =
    parentComment != undefined ? parentComment.author : post.author;

  const parentCommentAuthor = useSelector((state) =>
    selectUserById(state, parentAuthorId),
  );

  const reply_to_text =
    parentComment != undefined ? parentCommentAuthor.displayname : post.title;

  const reply_to_text_shrunk =
    reply_to_text.length > 38
      ? reply_to_text.substring(0, 40).concat('...')
      : reply_to_text;

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
      dispatch(prepareReply({postId: postId}));
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
    dispatch(deactivate());
  };

  const activateForm = () => {
    dispatch(activate()).then((result) => {
      if (result.error !== undefined) {
        inputRef.current.blur();
      } else {
        setInitialized(true);
        inputRef.current.focus();
      }
    });
  };

  const expandForm = () => {
    setExpanded(!expanded);
  };

  const submitComment = async () => {
    var data = {};
    if (reply_to == 'post') {
      data = {
        comment: comment,
        postId: postId,
      };
    } else {
      data = {
        comment: comment,
        postId: postId,
        parentCommentId: commentId,
      };
    }
    dispatch(createReply(data));
  };

  const ReplyPrompt = (
    <View style={{flexDirection: 'row'}}>
      <Text
        style={{
          color: reply_to == 'post' ? '#333' : '#666',
          fontSize: 12,
          fontWeight: '400',
        }}>
        {reply_to == 'post' ? 'Commenting on  ' : 'Replying to  '}
      </Text>
      <Text
        style={{
          color: reply_to == 'post' ? '#026aa7' : '#77c063',
          fontSize: 12,
          fontWeight: '400',
        }}>
        {reply_to_text_shrunk}
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
        onPress={() => resetForm()}>
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
          marginBottom: 5,
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
              color: disableForm ? '#666' : '#77c063',
              fontWeight: 'bold',
              fontSize: 15,
              letterSpacing: 0.25,
              width: 44,
            }}>
            Reply
          </Text>
        </TouchableOpacity>
      </View>
    );

    return active ? (
      <View
        style={{
          alignItems: 'flex-end',
        }}>
        {!loading ? Button : LoadingView}
      </View>
    ) : null;
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
        bottom: Platform.OS === 'ios' ? 20 : 0,
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
          backgroundColor: '#fff',
        }}>
        <View pointerEvents={initialized ? 'auto' : 'none'}>
          <Input
            ref={inputRef}
            placeholder="Add a comment ..."
            containerStyle={{
              backgroundColor: '#eee',
              borderRadius: 8,
            }}
            inputContainerStyle={{
              borderBottomWidth: 0,
              height: expanded ? 150 : 30,
              marginTop: 10,
            }}
            inputStyle={{
              fontSize: 13,
              color: '#333',
            }}
            disabled={false}
            maxLength={10000}
            multiline={true}
            onBlur={() => resetForm()}
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
