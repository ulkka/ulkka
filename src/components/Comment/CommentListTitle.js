import React, {memo} from 'react';
import {TouchableOpacity, Platform, Text, View} from 'react-native';
import {useTheme} from 'react-native-elements';

const CommentListTitle = props => {
  const {theme} = useTheme();
  const {commentId, setCommentId} = props;
  const isSingle = commentId ? true : false;
  return (
    <View
      style={{
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: theme.colors.grey1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          color: theme.colors.black6,
          fontSize: isSingle ? 12 : 13,
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        {isSingle ? 'Single Comment Thread' : 'All Comments'}
      </Text>
      {isSingle && (
        <TouchableOpacity onPress={() => setCommentId(undefined)}>
          <Text
            style={{
              color: theme.colors.blue,
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
