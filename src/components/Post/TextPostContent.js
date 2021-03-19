import React, {memo, useState, useCallback} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

const TextPostContent = (props) => {
  const {description} = props;
  const [showMore, setShowMore] = useState(false);
  const [textHidden, setTextHidden] = useState(true);

  const onTextLayout = useCallback((e) => {
    setShowMore(e.nativeEvent.lines.length > 9);
  }, []);

  return (
    <View
      style={{
        alignItems: 'flex-start',
        paddingLeft: 5,
      }}>
      <Text
        onTextLayout={onTextLayout}
        ellipsizeMode={'tail'}
        numberOfLines={textHidden ? 10 : undefined}
        style={{
          fontSize: 14,
          lineHeight: 22,
        }}>
        {description}
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

export default memo(TextPostContent);
