import React, {memo} from 'react';
import {Text, TouchableOpacity, Platform} from 'react-native';
import {Icon} from 'react-native-elements';
import {push} from '../../navigation/Ref';
import {useSelector, useDispatch} from 'react-redux';
import {
  getPostTitle,
  getPostCommunityId,
} from '../../redux/selectors/PostSelectors';
import analytics from '@react-native-firebase/analytics';
import {
  joinCommunity,
  leaveCommunity,
  getUserRoleInCommunity,
} from '../../redux/reducers/CommunitySlice';

const CommunityMembershipToggler = (props) => {
  const dispatch = useDispatch();
  const {postId, screen} = props;
  const communityId = useSelector((state) => getPostCommunityId(state, postId));
  const userRole = useSelector((state) =>
    getUserRoleInCommunity(state, communityId),
  );
  const screenType = screen.split('-')[0];

  const leaveCommunityButton = (
    <TouchableOpacity
      hitSlop={{top: 20, bottom: 20, right: 5}}
      activeOpacity={0.7}
      style={{marginHorizontal: 7}}
      onPress={() => dispatch(leaveCommunity(communityId))}>
      <Icon
        // reverse
        raised
        name="check"
        type="font-awesome"
        size={9}
        color="#02862a99"
      />
    </TouchableOpacity>
  );

  const joinCommunityButton = (
    <TouchableOpacity
      hitSlop={{top: 20, bottom: 20, right: 5}}
      activeOpacity={0.7}
      style={{marginHorizontal: 7}}
      onPress={() => dispatch(joinCommunity(communityId))}>
      <Icon
        reverse
        raised
        name="plus"
        type="font-awesome"
        size={9}
        color="#2a9df4"
      />
    </TouchableOpacity>
  );

  return (
    screen == 'popular' &&
    userRole != 'member' &&
    userRole != 'admin' &&
    joinCommunityButton
  );
};

export default memo(CommunityMembershipToggler);
