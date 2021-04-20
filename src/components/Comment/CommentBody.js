import React, {memo, useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {useSelector} from 'react-redux';
import {getCommentText} from '../../redux/selectors/CommentSelectors';
import Hyperlink from 'react-native-hyperlink';
import {navigateToURL} from '../helpers';
import analytics from '@react-native-firebase/analytics';

const CommentBody = (props) => {
  const {commentId} = props;

  const text = useSelector((state) => getCommentText(state, commentId));

  const [showMore, setShowMore] = useState(false);
  const [textHidden, setTextHidden] = useState(true);

  const onTextLayout = useCallback((e) => {
    analytics().logEvent('comment_longtext');
    setShowMore(e.nativeEvent.lines.length > 5);
  }, []);

  const commentView = (
    <View>
      <Hyperlink
        linkDefault={false}
        linkStyle={{color: '#2980b9'}}
        onPress={(url, text) => navigateToURL(url, 'comment')}>
        <Text
          onTextLayout={onTextLayout}
          ellipsizeMode={'tail'}
          numberOfLines={textHidden ? 10 : undefined}
          style={{
            color: '#333',
            fontSize: 13,
            fontWeight: '400',
            lineHeight: Platform.OS == 'ios' ? 19 : 21,
            textAlign: 'justify',
            paddingRight: 10,
          }}>
          {text}
        </Text>
      </Hyperlink>
      {showMore && (
        <TouchableOpacity
          style={{paddingVertical: 5}}
          onPress={() => {
            analytics().logEvent('comment_toggletexthidden', {
              value: !textHidden,
            });
            setTextHidden(!textHidden);
          }}>
          <Text style={{color: '#68cbf8'}}>
            {textHidden ? 'See More' : 'See Less'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return <View style={{paddingTop: 8}}>{commentView}</View>;
};

export default memo(CommentBody);
