import React, {memo, useState, useCallback} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

const CommentBody = (props) => {
  const {text} = props;
  const [showMore, setShowMore] = useState(false);
  const [textHidden, setTextHidden] = useState(true);

  const onTextLayout = useCallback((e) => {
    setShowMore(e.nativeEvent.lines.length > 5);
  }, []);

  return (
    <View style={{paddingTop: 8}}>
      <Text
        onTextLayout={onTextLayout}
        ellipsizeMode={'tail'}
        numberOfLines={textHidden ? 5 : undefined}
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
};

export default memo(CommentBody);
