import React from 'react';
import {View} from 'react-native';
import {Input, useTheme} from 'react-native-elements';
import {transformText} from './helpers';

export const PostTitleField = props => {
  const {title, onChangeText} = props;
  const {theme} = useTheme();

  return (
    <View
      style={{
        marginTop: 30,
        justifyContent: 'flex-end',
      }}>
      <Input
        placeholderTextColor={theme.colors.black7}
        keyboardAppearance={theme.dark ? 'dark' : 'light'}
        inputContainerStyle={{
          borderBottomColor: theme.colors.grey3,
        }}
        inputStyle={{
          textAlign: 'center',
          lineHeight: 24,
          marginBottom: 10,
        }}
        onChangeText={text => onChangeText(text)}
        value={title}
        numberOfLines={3}
        multiline={true}
        placeholder={'Title'}
        maxLength={300}
      />
    </View>
  );
};
