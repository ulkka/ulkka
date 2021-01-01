import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Icon, Text} from 'react-native-elements';

export default function Vote(props) {
  const [selfVote, setSelfVote] = useState(props.item.userVote);
  const [voteCount, setVoteCount] = useState(props.item.voteCount);

  useEffect(() => {
    setSelfVote(props.item.userVote);
    setVoteCount(props.item.voteCount);
  }, [props.item.userVote]);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 120,
        ...props.style,
      }}>
      <TouchableOpacity
        onPress={() => props.vote(props.type, props.item._id, 1, selfVote)}>
        <Icon
          name="arrow-up-bold"
          type="material-community"
          size={20}
          color={selfVote == 1 ? 'red' : '#888'}
        />
      </TouchableOpacity>
      <Text
        style={{
          fontWeight: 'bold',
          color: '#888',
          paddingHorizontal: 10,
        }}>
        {voteCount}
      </Text>
      <TouchableOpacity
        onPress={() => props.vote(props.type, props.item._id, -1, selfVote)}>
        <Icon
          name="arrow-down-bold"
          type="material-community"
          size={20}
          color={selfVote == -1 ? 'pink' : '#888'}
        />
      </TouchableOpacity>
    </View>
  );
}
