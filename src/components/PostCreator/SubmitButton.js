import React, {useContext} from 'react';
import {View} from 'react-native';
import {Icon, Button, ThemeContext} from 'react-native-elements';

export const SubmitButton = props => {
  const {onPress} = props;
  const {theme} = useContext(ThemeContext);

  return (
    <View
      style={{
        width: '40%',
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      <Button
        icon={
          <Icon
            name="send"
            size={15}
            color={theme.colors.green}
            type="font-awesome"
          />
        }
        title="Post"
        buttonStyle={{
          backgroundColor: theme.colors.primary,
          borderRadius: 20,
          borderColor: theme.colors.grey3,
          borderWidth: 1,
          //padding:20
        }}
        titleStyle={{
          color: theme.colors.green,
          fontWeight: 'bold',
          paddingLeft: 20,
        }}
        type="solid"
        //  disabled={true}
        onPress={onPress}
      />
    </View>
  );
};
