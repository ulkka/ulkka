import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {Button, CheckBox} from 'react-native-elements';
import {registerUser} from '../../redux/actions/AuthActions';
import {useDispatch} from 'react-redux';
import {Icon, Input} from 'react-native-elements';
import ChangeAccount from './ChangeAcount';
import userApi from '../../services/UserApi';
import {transformText} from '../../components/PostCreator/helpers';
import {navigateToURL} from '../../components/helpers';
import Snackbar from 'react-native-snackbar';
import {TouchableOpacity} from 'react-native';

const RegisterAccount = () => {
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

  const validateDisplayName = async (text) => {
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
        console.log('displayname response', response);
        setIsDisplaynameValid(true);
        return true;
      } else {
        console.log('displayname already exists response', response);
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
      labelStyle={{color: '#444', marginBottom: 5}}
      ref={displaynameField}
      placeholder="Nickname / വട്ടപ്പേര്"
      placeholderTextColor="#666"
      autoCapitalize="none"
      autoCorrect={false}
      containerStyle={{width: 320}}
      inputContainerStyle={{
        borderBottomColor: '#ddd',
        backgroundColor: 'rgba(52, 52, 52, 0.1)',
        borderRadius: 5,
        paddingHorizontal: 10,
      }}
      inputStyle={{fontSize: 14, padding: 10}}
      leftIcon={
        <Icon
          name="user-alt"
          size={20}
          color={isDisplaynameValid ? 'green' : '#555'}
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
      onChangeText={(text) => {
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
          color: '#444',
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
          checkedColor="#02862ad6"
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
                color: '#666',
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
                  color: '#2980b9',
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
                color: '#666',
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
                  color: '#2980b9',
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
          raised
          type="solid"
          activeOpacity={0.5}
          disabledTitleStyle={{color: '#777', fontWeight: '400'}}
          titleStyle={{
            color: '#0099ff',
            fontWeight: '500',
          }}
          containerStyle={{
            alignItems: 'center',
            width: 180,
            alignSelf: 'center',
            borderRadius: 25,
          }}
          style={{
            width: '80%',
          }}
          buttonStyle={{
            alignItems: 'center',
            borderColor: '#222',
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
            isDisplayNameValid && checked
              ? register()
              : console.log('its not valid');
          }}
        />
      </View>
    </View>
  );
  return (
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
      source={require('../../../assets/doodlebg.jpg')}>
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
  );
};

export default RegisterAccount;
