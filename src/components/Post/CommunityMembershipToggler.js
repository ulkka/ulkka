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
} from '../../redux/reducers/CommunitySlice';

const CommunityMembershipToggler = (props) => {
  const dispatch = useDispatch();
  const {postId, screen} = props;
  const communityId = useSelector((state) => getPostCommunityId(state, postId));
  const screenType = screen.split('-')[0];

  return (
    screen == 'popular' && (
      <TouchableOpacity
        hitSlop={{top: 20, bottom: 20, right: 5}}
        activeOpacity={0.7}
        style={{marginHorizontal: 7}}
        onPress={() => dispatch(leaveCommunity(communityId))}>
        <Icon
          reverse
          raised
          name="plus"
          type="font-awesome"
          size={9}
          color="#2a9df4"
        />
      </TouchableOpacity>
    )
  );
};

export default memo(CommunityMembershipToggler);
