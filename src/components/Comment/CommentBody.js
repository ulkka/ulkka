import React, {memo, useContext} from 'react';
import {View} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {getCommentText} from '../../redux/selectors/CommentSelectors';

import AutolinkText from '../AutolinkText';

const CommentBody = props => {
  const {commentId} = props;
  const {theme} = useContext(ThemeContext);
  const text = useSelector(state => getCommentText(state, commentId));

  return (
    <View style={{paddingTop: 8}}>
      <AutolinkText
        text={text}
        enableShowMore={true}
        source={'comment'}
        textStyle={{
          color: theme.colors.black3,
          fontSize: 13,
          fontWeight: '400',
          lineHeight: Platform.OS == 'ios' ? 19 : 21,
          paddingRight: 10,
        }}
      />
    </View>
  );
};

export default memo(CommentBody);
