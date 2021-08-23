import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Button, CheckBox, useTheme, Icon, Input} from 'react-native-elements';
import {registerUser} from '../../redux/actions/AuthActions';
import {useDispatch} from 'react-redux';
import ChangeAccount from './ChangeAcount';
import userApi from '../../services/UserApi';
import {transformText} from '../../components/PostCreator/helpers';
import {navigateToURL} from '../../components/helpers';
import Snackbar from 'react-native-snackbar';

const RegisterAccount = () => {
  const {theme} = useTheme();

  const dispatch = useDispatch();
  const displaynameField = useRef(null);
  const renderErrorMessage = true;
  const [displayname, setDisplayname] = useState('');
  const [displaynameErrorMessage, setDisplaynameErrorMessage] = useState('');
  const [isDisplaynameValid, setIsDisplaynameValid] = useState(null);
  const [checked, setChecked] = useState(false);
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    if (Platform.OS == 'android') {
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        keyboardDidShow,
      );
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        keyboardDidHide,
      );
      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }
  }, []);

  const keyboardDidShow = () => setShowTitle(false);
  const keyboardDidHide = () => setShowTitle(true);

  const validateDisplayName = async text => {
    if (
      text.length < 4 ||
      !/^([a-zA-Z0-9\u0D00-\u0D7F_.-]+)$/.test(text) || // reg exp to check characters are english or malayalam alphabets, numbers or _.-
      text.length > 25
    ) {
      setIsDisplaynameValid(false);
      setDisplaynameErrorMessage(
        'Invalid Display Name \nMin 4 characters, Max 25 characters \nEnglish / Malayalam alphabets, numbers or _.- ',
      );
      return false;
    } else {
      const response = await userApi.user.displaynameExists(text);
      if (response.data.length == 0) {
        setIsDisplaynameValid(true);
        return true;
      } else {
        setIsDisplaynameValid(false);
        setDisplaynameErrorMessage(
          'Display name already in use. Please enter another one',
        );
        return false;
      }
    }
  };

  const register = () => {
    dispatch(registerUser(displayname));
  };

  const DisplayNameField = (
    <Input
      label="Display Name"
      labelStyle={{color: theme.colors.black4, marginBottom: 5}}
      ref={displaynameField}
      placeholder="Nickname / വട്ടപ്പേര്"
      keyboardAppearance={theme.dark ? 'dark' : 'light'}
      placeholderTextColor={theme.colors.black7}
      autoCapitalize="none"
      autoCorrect={false}
      containerStyle={{width: 320}}
      inputContainerStyle={{
        borderBottomColor: theme.colors.grey3,
        backgroundColor: 'rgba(52, 52, 52, 0.1)',
        borderRadius: 5,
        paddingHorizontal: 10,
      }}
      inputStyle={{fontSize: 14, padding: 10}}
      leftIcon={
        <Icon
          name="user-alt"
          size={20}
          color={isDisplaynameValid ? 'green' : theme.colors.black5}
          type="font-awesome-5"
        />
      }
      rightIcon={
        isDisplaynameValid == null ? null : isDisplaynameValid ? (
          <Icon name="check-circle" size={20} color="green" />
        ) : (
          <Icon name="warning" size={20} color="red" />
        )
      }
      errorStyle={{color: 'red'}}
      errorMessage={
        isDisplaynameValid == null
          ? null
          : isDisplaynameValid
          ? null
          : displaynameErrorMessage
      }
      onFocus={() => {
        setIsDisplaynameValid(null);
        setDisplaynameErrorMessage('');
      }}
      renderErrorMessage={renderErrorMessage}
      onChangeText={text => {
        setDisplayname(transformText(text, 1));
      }}
      value={displayname}
    />
  );
  const Title = (
    <View
      style={{
        marginBottom: 20,
      }}>
      <Text
        style={{
          fontSize: 18,
          color: theme.colors.black4,
          lineHeight: 27,
          fontWeight: 'bold',
          textAlign: 'center',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        {'  '}
        Enter a Cool Display Name
      </Text>
    </View>
  );
  const Register = (
    <View
      style={{
        justifyContent: 'space-evenly',
      }}>
      <View>{DisplayNameField}</View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingBottom: 10,
        }}>
        <CheckBox
          checked={checked}
          onPress={() => setChecked(!checked)}
          checkedColor={theme.colors.green}
          uncheckedColor="#888"
          size={18}
          containerStyle={{
            paddingHorizontal: 0,
          }}
        />
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: theme.colors.black6,
                fontSize: 10,
                fontWeight: '700',
                ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
              }}>
              I have read and agree to the{' '}
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigateToURL('https://ulkka.in/terms.html', 'registerAccount')
              }>
              <Text
                style={{
                  color: theme.colors.blue,
                  fontSize: 10,
                  fontWeight: '700',
                  ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
                }}>
                Terms and Conditions
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: theme.colors.black6,
                fontSize: 10,
                fontWeight: '700',
                ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
              }}>
              and{' '}
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigateToURL(
                  'https://ulkka.in/privacy-policy.html',
                  'registerAccount',
                )
              }>
              <Text
                style={{
                  color: theme.colors.blue,
                  fontSize: 10,
                  fontWeight: '700',
                  ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
                }}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
        <Button
          type="solid"
          activeOpacity={0.5}
          disabledTitleStyle={{color: theme.colors.black6, fontWeight: '400'}}
          titleStyle={{
            color: theme.colors.blue,
            fontWeight: '500',
          }}
          // style={{
          //   width: '80%',
          // }}
          buttonStyle={{
            borderWidth: 1,
            borderRadius: 25,
            borderColor: theme.colors.grey3,
          }}
          title="Create Account"
          onPress={async () => {
            displaynameField.current.blur();
            const isDisplayNameValid = await validateDisplayName(displayname);
            isDisplayNameValid &&
              !checked &&
              Snackbar.show({
                text:
                  'Please agree to the Terms & Conditions and Privacy Policy',
                duration: Snackbar.LENGTH_SHORT,
              });
            if (isDisplayNameValid && checked) register();
          }}
        />
      </View>
    </View>
  );
  return (
    <View style={{flex: 1, backgroundColor: theme.colors.primary}}>
      <ImageBackground
        blurRadius={1}
        resizeMode="repeat"
        imageStyle={{flex: 1}}
        style={{
          // flex: 1,
          position: 'absolute',
          left: 0,
          top: 0,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height - 50,
          alignItems: 'center',
          // justifyContent: 'center',
        }}
        source={
          theme.dark
            ? require('../../../assets/doodlebg_dark.jpg')
            : require('../../../assets/doodlebg.jpg')
        }>
        <KeyboardAvoidingView
          keyboardVerticalOffset={60}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <View
            style={{
              justifyContent: 'center',
            }}>
            {Title}
          </View>
          <View>{showTitle && <ChangeAccount />}</View>
          <View>{Register}</View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

export default RegisterAccount;
