import React, {memo} from 'react';
import {View} from 'react-native';
import {useTheme} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {getPostDescription} from '../../redux/selectors/PostSelectors';

import AutolinkText from '../AutolinkText';

const TextPostContent = props => {
  const {theme} = useTheme();

  const {postId} = props;
  const description = useSelector(state => getPostDescription(state, postId));

  return description ? (
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
          fontSize: 13,
          lineHeight: 22,
          paddingRight: 5,
          color: theme.colors.black5,
        }}
      />
    </View>
  ) : (
    <View></View>
  );
};

export default memo(TextPostContent);
