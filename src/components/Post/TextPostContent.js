import React, {memo} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {getPostDescription} from '../../redux/selectors/PostSelectors';

import AutolinkText from '../AutolinkText';

const TextPostContent = (props) => {
  const {postId} = props;
  const description = useSelector((state) => getPostDescription(state, postId));

  return (
    <View
      style={{
        alignItems: 'flex-start',
        paddingLeft: 5,
      }}>
      <AutolinkText
        text={description}
        enableShowMore={true}
        source={'post_description'}
        textStyle={{
          fontSize: 14,
          lineHeight: 22,
          paddingRight: 5,
          color: '#444',
        }}
      />
    </View>
  );
};

export default memo(TextPostContent);
