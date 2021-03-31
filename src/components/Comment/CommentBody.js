import React, {memo, useState, useCallback} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {getCommentText} from '../../redux/selectors/CommentSelectors';

const CommentBody = (props) => {
  const {commentId} = props;

  const text = useSelector((state) => getCommentText(state, commentId));

  const [showMore, setShowMore] = useState(false);
  const [textHidden, setTextHidden] = useState(true);

  const onTextLayout = useCallback((e) => {
    setShowMore(e.nativeEvent.lines.length > 5);
  }, []);

  const commentView = (
    <View>
      <Text
        onTextLayout={onTextLayout}
        ellipsizeMode={'tail'}
        numberOfLines={textHidden ? 10 : undefined}
        style={{
          color: '#333',
          fontSize: 13,
          fontWeight: '400',
          lineHeight: 18,
        }}>
        {text}
      </Text>
      {showMore && (
        <TouchableOpacity
          style={{paddingVertical: 5}}
          onPress={() => setTextHidden(!textHidden)}>
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
