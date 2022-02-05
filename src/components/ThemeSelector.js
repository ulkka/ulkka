import React from 'react';
import {View, Text, Platform} from 'react-native';
import {useTheme, ButtonGroup, Icon} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {getTheme, setTheme} from '../redux/reducers/ThemeSlice';
import {useTranslation} from 'react-i18next';

export default function ThemeSelector(props) {
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const {t} = useTranslation();

  const buttons = ['auto', t('Light'), t('Dark')];
  const themes = ['auto', 'light', 'dark'];

  const currentTheme = useSelector(getTheme);

  const changeTheme = index => {
    dispatch(setTheme(themes[index]));
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
          name="theme-light-dark"
          type="material-community"
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
          Theme
        </Text>
      </View>
      <ButtonGroup
        onPress={changeTheme}
        selectedIndex={themes.indexOf(currentTheme)}
        buttons={buttons}
        containerStyle={{
          width: 143,
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
          borderRightWidth: 0,
          borderLeftWidth: 0,
        }}
        innerBorderStyle={{
          color: theme.colors.grey4,
          width: 0,
          backgroundColor: theme.colors.grey4,
        }}
        textStyle={{
          fontSize: 11,
          color: theme.colors.black5,
          textTransform: 'capitalize',
        }}
      />
    </View>
  );
}
