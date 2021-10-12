import React from 'react';
import {View} from 'react-native';
import {Input, useTheme} from 'react-native-elements';

export const DescriptionField = props => {
  const {theme} = useTheme();

  const {onChangeText, description} = props;
  return (
    <View
      style={{
        // flex: 3,
        marginTop: 20,
        marginBottom: 10,
        justifyContent: 'center',
      }}>
      <Input
        placeholderTextColor={theme.colors.black7}
        keyboardAppearance={theme.dark ? 'dark' : 'light'}
        inputContainerStyle={{
          borderBottomColor: theme.colors.primary,
          minHeight: 100,
        }}
        inputStyle={{textAlign: 'center', lineHeight: 24}}
        onChangeText={text => onChangeText(text)}
        value={description}
        placeholder={'Description'}
        multiline={true}
        maxLength={10000}
      />
    </View>
  );
};
