import React, {memo} from 'react';
import {TouchableOpacity} from 'react-native';
import {Icon, useTheme} from 'react-native-elements';
import {showOptionSheet} from '../redux/reducers/OptionSheetSlice';
import {useDispatch, useSelector} from 'react-redux';
import {getPostCommunityId} from '../redux/selectors/PostSelectors';
import {getCommentPostCommunity} from '../redux/selectors/CommentSelectors';
import {getUserRoleInCommunity} from '../redux/reducers/CommunitySlice';

const ExtraOptions = props => {
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const {type, id} = props;
  const communityId =
    type == 'post'
      ? useSelector(state => getPostCommunityId(state, id))
      : type == 'comment'
      ? useSelector(state => getCommentPostCommunity(state, id))
      : null;

  const userRole = useSelector(state =>
    getUserRoleInCommunity(state, communityId),
  );

  return (
    <TouchableOpacity
      style={{padding: 5}}
      hitSlop={{top: 20, bottom: 20, right: 20}}
      onPress={() => dispatch(showOptionSheet({type: type, id: id}))}>
      {userRole == 'admin' ? (
        <Icon
          raised={false}
          name="shield"
          type="font-awesome"
          size={20}
          color={theme.colors.green}
        />
      ) : (
        <Icon name="more-horiz" size={18} color="#888" />
      )}
    </TouchableOpacity>
  );
};

export default memo(ExtraOptions);
