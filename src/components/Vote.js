import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {selectPostById, votePost} from '../redux/reducers/PostSlice';
import {selectCommentById, voteComment} from '../redux/reducers/CommentSlice';

export default function Vote(props) {
  const dispatch = useDispatch();
  const entityType = props.type;
  const entity =
    entityType == 'post'
      ? useSelector((state) => selectPostById(state, props.item))
      : useSelector((state) => selectCommentById(state, props.item));
  const [selfVote, setSelfVote] = useState(entity.userVote);
  const [voteCount, setVoteCount] = useState(entity.voteCount);

  useEffect(() => {
    setSelfVote(entity.userVote);
    setVoteCount(entity.voteCount);
  }, [entity.userVote]);

  const vote = (type) => {
    let voteType = selfVote == type ? 0 : type;
    const payload = {id: entity._id, voteType: voteType};
    //setSelfVote(voteType);
    if (entityType == 'post') {
      dispatch(votePost(payload));
    }
    if (entityType == 'comment') {
      dispatch(voteComment(payload));
    }
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 120,
        ...props.style,
      }}>
      <TouchableOpacity onPress={() => vote(1)}>
        <Icon
          name={selfVote == 1 ? 'arrow-up-bold' : 'arrow-up-bold-outline'}
          type="material-community"
          size={20}
          color={selfVote == 1 ? '#00acee' : '#888'}
        />
      </TouchableOpacity>
      <Text
        style={{
          fontWeight: 'bold',
          color:
            selfVote == 1 ? '#00acee' : selfVote == -1 ? '#ff4301' : '#888',
          paddingHorizontal: 10,
        }}>
        {voteCount}
      </Text>
      <TouchableOpacity onPress={() => vote(-1)}>
        <Icon
          name={selfVote == -1 ? 'arrow-down-bold' : 'arrow-down-bold-outline'}
          type="material-community"
          size={20}
          color={selfVote == -1 ? '#ff4301' : '#888'}
        />
      </TouchableOpacity>
    </View>
  );
}
