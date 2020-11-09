import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import mainClient from '../client/mainClient';

export default function Vote(props) {
  const [selfVote, setSelfVote] = useState(props.item.userVote);
  const [voteCount, setVoteCount] = useState(props.item.voteCount);

  const vote = async (type) => {
    const client = await mainClient;
    if (selfVote == type) {
      type = 0;
    }
    var diff = type - props.item.userVote;
    client
      .post(props.type + '/' + props.item._id + '/vote/' + type)
      .then((response) => {
        console.log(response);
        setVoteCount(props.item.voteCount + diff);
        setSelfVote(type);
      })
      .catch((error) => {
        console.log(error);
      });
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
      <TouchableOpacity onPress={() => vote(-1)}>
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
