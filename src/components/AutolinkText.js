import React, {memo, useState, useCallback, useContext} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {useDispatch} from 'react-redux';
import {navigateToURL} from './helpers';
import analytics from '@react-native-firebase/analytics';
import Autolink from 'react-native-autolink';
import {searchCommunitiesByName} from '../redux/reducers/CommunitySlice';
import {ThemeContext} from 'react-native-elements';

const AutolinkText = props => {
  const dispatch = useDispatch();
  const {theme} = useContext(ThemeContext);
  const {enableShowMore, text, source, textStyle} = props;

  const defaultTextStyle = {
    color: theme.colors.black3,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: Platform.OS == 'ios' ? 19 : 21,
    textAlign: 'justify',
    paddingRight: 10,
  };

  //const [showMore, setShowMore] = useState(false);
  const [textHidden, setTextHidden] = useState(true);
  const showMore = text?.length > 500 ? true : false;

  const onTextLayout = useCallback(e => {
    const shouldShowMore = e.nativeEvent.lines.length > 5;
    shouldShowMore && analytics().logEvent('comment_longtext');
    setShowMore(shouldShowMore);
  }, []);

  const handlePress = (url, match) => {
    if (match?.url) {
      navigateToURL(match.url, source);
    } else if (match?.matchedText) {
      dispatch(searchCommunitiesByName(match.matchedText));
    } else if (url?.matchedText) {
      dispatch(searchCommunitiesByName(url.matchedText));
    }
  };

  const MlTagMatcher = [
    {
      pattern: /(^|\s)(ml\/[_a-z\u0D00-\u0D7F\d]+)/gm,
      getLinkText: replacerArgs => {
        return `${replacerArgs[0]}`;
      },
      onPress: handlePress,
    },
  ];

  const textView = (
    <View>
      <Autolink
        textProps={{
          ...(textStyle ? {style: textStyle} : {style: defaultTextStyle}),
          ...{
            // onTextLayout: onTextLayout,
            ellipsizeMode: 'tail',
            numberOfLines: textHidden ? 10 : undefined,
          },
        }}
        linkStyle={{color: theme.colors.blue}}
        // Required: the text to parse for links
        text={
          enableShowMore ? (textHidden ? text?.substring(0, 499) : text) : text
        } //"This is the string to parse for urls #adada #അർജുൻ (https://github.com/joshswan/react-native-autolink), phone numbers (415-555-5555), emails (josh@example.com), mentions/handles (@twitter), and hashtags (#exciting)"
        // Optional: enable email linking
        email={false}
        // Optional: enable hashtag linking to instagram
        hashtag={'twitter'}
        // Optional: enable @username linking to twitter
        mention={false}
        // Optional: enable phone linking
        phone={false}
        // Optional: enable URL linking
        url
        // Optional: custom linking matchers
        matchers={MlTagMatcher}
        onPress={handlePress}
      />
      {showMore && (
        <TouchableOpacity
          style={{paddingVertical: 5}}
          onPress={() => {
            analytics().logEvent(source + '_toggletexthidden', {
              value: !textHidden,
            });
            setTextHidden(!textHidden);
          }}>
          <Text style={{color: theme.colors.blue}}>
            {textHidden ? 'See More' : 'See Less'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return <View>{textView}</View>;
};

export default memo(AutolinkText);
