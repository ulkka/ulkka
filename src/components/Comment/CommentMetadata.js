import React, {memo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon, Divider} from 'react-native-elements';
import TimeAgo from '../TimeAgo';
import {useSelector} from 'react-redux';
import {selectUserById} from '../../redux/reducers/UserSlice';
import {navigate} from '../../navigation/Ref';

const CommentMetadata = (props) => {
  const {author, createdAt} = props;
  const isCollapsed = props.isCollapsed;

  const user = useSelector((state) => selectUserById(state, author));

  const CommentAuthor = (
    <Text
      style={{
        fontSize: 12,
        fontWeight: '300',
        color: 'darkgreen',
      }}>
      {user.displayname}
    </Text>
  );

  const Seperator = (
    <Divider
      style={{
        backgroundColor: 'white',
        width: 15,
      }}
    />
  );

  const CreatedAt = <TimeAgo time={createdAt} />;

  const HeaderLeft = (
    <TouchableOpacity
      onPress={() => navigate('Account')}
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {CommentAuthor}
      {Seperator}
      {CreatedAt}
    </TouchableOpacity>
  );

  const HeaderRight = (
    <TouchableOpacity
      style={{flex: 1, alignItems: 'flex-end'}}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      onPress={props.onPressToggleCollapse}>
      {
        <Icon
          name={isCollapsed ? 'expand-more' : 'expand-less'}
          size={20}
          color="#888"
        />
      }
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      {HeaderLeft}
      {HeaderRight}
    </View>
  );
};

export default memo(CommentMetadata);
