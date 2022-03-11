import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {navigate} from '../navigation/Ref';

const styles = StyleSheet.create({
  chatItem: {
    display: 'flex',
    padding: 24,
    backgroundColor: 'white',
    flexDirection: 'row',
    marginBottom: 1,
  },

  avatar: {
    height: 60,
    width: 60,
    borderRadius: 50,
    alignSelf: 'center',
    overflow: 'hidden',
    marginRight: 16,
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 2,
    alignContent: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: '700',
  },
  date: {
    color: '#b5b5b5',
    fontSize: 12,
  },
  container: {
    flex: 1,
  },
  preview: {
    color: '#b5b5b5',
    maxWidth: '80%',
  },
  unread: {
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: '#FF7BAC',
    color: '#000',
    borderRadius: 50,
    width: 20,
    height: 20,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

const ChatItem = ({username, unread}) => {
  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        navigate('ChatDetailNavigation', {username});
      }}>
      <FastImage
        rounded
        style={styles.avatar}
        source={{
          uri: 'https://placekitten.com/g/100/100',
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.username} numberOfLines={1}>
            {username}
          </Text>
          <Text style={styles.date}>Mar 11, 22</Text>
        </View>
        <View style={styles.content}>
          <Text numberOfLines={1} style={styles.preview}>
            :react-native-firebase_remote-config:firebase.bom using custom
            value: 28.3.1
          </Text>
          {unread > 0 ? (
            <Text style={styles.unread}>{unread > 9 ? '9+' : unread}</Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatItem;
