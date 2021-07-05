import React, {memo} from 'react';
import {TouchableOpacity, Platform, Text, View} from 'react-native';

const CommentListTitle = (props) => {
  const {listType, setListType} = props;
  const isSingle = listType == 'single';
  return (
    <View
      style={{
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#f5f5f5',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          color: '#777',
          fontSize: isSingle ? 12 : 13,
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        {isSingle ? 'Single Comment Thread' : 'All Comments'}
      </Text>
      {isSingle && (
        <TouchableOpacity onPress={() => setListType('all')}>
          <Text
            style={{
              color: '#289df4',
              fontWeight: 'bold',
              fontSize: 12,
              ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
            }}>
            View All Comments
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(CommentListTitle);
