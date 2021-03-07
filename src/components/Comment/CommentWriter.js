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
    inputRef.current.blur();
    activateForm();
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
        {reply_to == 'post' ? 'Commenting on ' : 'Replying to '}
      </Text>
      <Text
        style={{
          color: reply_to == 'post' ? 'blue' : 'green',
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
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
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
        <Icon name="close" size={16} color="#444" />
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
  const whenInactive = <View></View>;
  const AddCommentHeader = active ? whenActive : whenInactive;
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={95}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        position: 'absolute',
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
              height: expanded ? 300 : 30,
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
            rightIcon={
              loading ? (
                <Icon
                  name="loading1"
                  type="antdesign"
                  color={'green'}
                  size={15}
                  style={{marginBottom: 10}}
                />
              ) : (
                <Icon
                  name="send"
                  color={disableForm ? 'grey' : 'green'}
                  disabled={disableForm}
                  disabledStyle={{
                    backgroundColor: 'transparent',
                  }}
                  size={15}
                  style={{marginBottom: 10}}
                  onPress={() => submitComment()}
                />
              )
            }
          />
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
