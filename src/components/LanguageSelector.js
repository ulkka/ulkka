import React from 'react';
import {View, Text, Platform} from 'react-native';
import {useTheme, ButtonGroup, Icon} from 'react-native-elements';
import {useTranslation} from 'react-i18next';

export default function LanguageSelector(props) {
  const {theme} = useTheme();
  const {t, i18n} = useTranslation();
  const buttons = ['en', 'id'];

  const changeLanguage = index => {
    i18n.changeLanguage(buttons[index]).catch(err => console.log(err));
  };

  return (
    <View
      style={{
        paddingLeft: 17,
        paddingBottom: 8,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon
          name="language"
          type="font-awesome"
          color={theme.colors.black4}
          size={21}
        />
        <View style={{width: 8}}></View>
        <Text
          style={{
            color: theme.colors.black4,
            fontWeight: 'bold',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          {t('Language')}
        </Text>
      </View>
      <ButtonGroup
        onPress={changeLanguage}
        selectedIndex={buttons.indexOf(i18n.language)}
        buttons={buttons}
        containerStyle={{
          width: 75,
          height: 30,
          borderColor: theme.colors.grey4,
          borderRadius: 10,
        }}
        selectedButtonStyle={{
          backgroundColor: theme.colors.blue,
        }}
        buttonContainerStyle={{
          backgroundColor: theme.colors.grey2,
          borderColor: theme.colors.grey4,
          borderLeftWidth: 0,
          borderRightWidth: 0,
        }}
        innerBorderStyle={{
          color: theme.colors.grey4,
          width: 1,
          backgroundColor: theme.colors.grey4,
        }}
        textStyle={{
          fontSize: 11,
          color: theme.colors.black5,
          textTransform: 'uppercase',
        }}
      />
    </View>
  );
}
