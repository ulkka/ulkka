import React, {useEffect, useState, useRef} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon, Input} from 'react-native-elements';
import mainClient from '../client/mainClient';
// import Snackbar from 'react-native-snackbar';

export default function FloatingAddComment(props) {
  const inputRef = useRef(null);
  const [active, setActive] = useState(false);
  const [comment, setComment] = useState('');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    prepare();
  }, []);

  useEffect(() => {
    if (props.reply_to == 'comment') {
      setActive(true);
      inputRef.current.focus();
    }
  }, [props.reply_to, props.comment_id]);

  const prepare = () => {
    inputRef.current.blur();
    setActive(false);
    props.prepareComment(props.item._id, props.item.title);
    setComment('');
    setExpanded(false);
  };

  const expandForm = () => {
    setExpanded(!expanded);
  };

  const submitComment = async () => {
    const client = await mainClient;
    var payload = {};
    if (props.reply_to == 'post') {
      payload = {
        text: comment,
        post: props.item._id,
      };
    } else {
      payload = {
        text: comment,
        post: props.item._id,
        parent: props.comment_id,
      };
    }
    client
      .post('comment', payload)
      .then((response) => {
        if (props.reply_to == 'post') {
          props.newComment(response.data, 'post');
        } else {
          props.newComment(response.data, props.comment_id);
        }
        prepare();
        // Snackbar.show({
        //   text: 'Successfully commented',
        //   duration: Snackbar.LENGTH_LONG,
        // });
      })
      .catch((error) => {
        console.log(error);
        // Snackbar.show({
        //   text: 'Please check your network connection',
        //   duration: Snackbar.LENGTH_LONG,
        // });
      });
  };

  const CommentPrompt = (
    <View style={{flexDirection: 'row'}}>
      <Text
        style={{
          color: '#666',
          fontSize: 12,
          fontWeight: '400',
        }}>
        Commenting on{' '}
      </Text>
      <Text
        style={{
          color: '#333',
          fontSize: 12,
          fontWeight: '400',
        }}>
        {props.post_title}
      </Text>
    </View>
  );

  const ReplyPrompt = (
    <View style={{flexDirection: 'row'}}>
      <Text
        style={{
          color: '#333',
          fontSize: 12,
          fontWeight: '400',
        }}>
        Replying to{' '}
      </Text>
      <Text
        style={{
          color: 'green',
          fontSize: 12,
          fontWeight: '400',
        }}>
        {props.comment_author}
      </Text>
    </View>
  );

  const expand = (
    <View style={{paddingHorizontal: 10}}>
      <TouchableOpacity onPress={() => expandForm()}>
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
        style={{paddingHorizontal: 5}}
        onPress={() => prepare()}>
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
        {props.reply_to == 'post' ? CommentPrompt : ReplyPrompt}
      </View>
      {expand}
    </View>
  );
  const whenInactive = <View></View>;
  const AddCommentHeader = active ? whenActive : whenInactive;
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        flex: 1,
        backgroundColor: '#ddd',
        width: '100%',
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
      }}>
      {AddCommentHeader}
      <View
        style={{
          padding: 5,
          backgroundColor: '#fff',
        }}>
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
          // textAlignVertical={true}
          multiline={true}
          onBlur={() => prepare()}
          onFocus={() => setActive(true)}
          value={comment}
          onChangeText={(text) => setComment(text)}
          renderErrorMessage={false}
          rightIcon={
            <Icon
              name="send"
              color="green"
              size={15}
              style={{marginBottom: 10}}
              onPress={() => submitComment()}
            />
          }
        />
      </View>
    </View>
  );
}
