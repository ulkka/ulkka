import React from 'react';
import {FlatList, View} from 'react-native';
import ChatItem from '../../components/ChatItem';

const ChatList = () => {
  return (
    <View>
      <FlatList
        data={[
          {username: 'Devin', unread: 0},
          {username: 'Dan', unread: 4},
          {username: 'Dominic', unread: 3},
          {username: 'Jackson', unread: 9},
          {username: 'James', unread: 4},
          {username: 'Joel', unread: 86},
          {username: 'John', unread: 4},
          {username: 'Jillian', unread: 0},
          {username: 'Jimmy', unread: 0},
          {username: 'Julie', unread: 0},
        ]}
        renderItem={({item}) => (
          <ChatItem username={item.username} unread={item.unread} />
        )}
      />
    </View>
  );
};

export default ChatList;
