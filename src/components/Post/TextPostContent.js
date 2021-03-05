import React, {useState, useCallback} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {getPostField} from '../../redux/reducers/PostSlice';
import {useSelector} from 'react-redux';

const TextPostContent = (props) => {
  const postId = props.postId;
  const postDescription = useSelector(getPostField(postId, 'description'));
  const [hideText, setHideText] = useState(true); //To show ur remaining Text
  const [limitLength, setLimitLength] = useState(true); //to show the "Read more & Less Line"

  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setHideText(!hideText);
  };

  const onTextLayout = useCallback((e) => {
    setLimitLength(e.nativeEvent.lines.length >= 4); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  }, []);

  return (
    <View>
      <Text
        onTextLayout={onTextLayout}
        numberOfLines={hideText ? 5 : undefined}
        style={{
          color: '#444',
          fontSize: 14,
          fontWeight: '400',
          lineHeight: 21,
        }}>
        {postDescription}
      </Text>
      {limitLength ? (
        <TouchableOpacity
          onPress={toggleNumberOfLines}
          style={{
            marginTop: 20,
          }}>
          <Text
            style={{
              lineHeight: 21,
              color: '#035aa6',
            }}>
            {
              hideText ? 'Read more...' : 'Read less...'
              //'Read More'
            }
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default TextPostContent;
