import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon, Input} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {
  getUserDisplayname,
  updateDisplayname,
} from '../redux/reducers/UserSlice';
import {getRegisteredUser} from '../redux/reducers/AuthSlice';
import userApi from '../services/UserApi';

const UserDisplaynameField = (props) => {
  const dispatch = useDispatch();
  const {userId} = props;
  const renderErrorMessage = true;
  const [displaynameErrorMessage, setDisplaynameErrorMessage] = useState('');
  const [isDisplaynameValid, setIsDisplaynameValid] = useState(true);
  const [displaynameEdit, setDisplaynameEdit] = useState(false);
  const [displaynameValue, setDisplaynameValue] = useState('');

  const registeredUser = useSelector(getRegisteredUser);
  const registeredUserId = registeredUser?._id;
  const isProfile = userId == registeredUserId;

  const userDisplayname = useSelector((state) =>
    getUserDisplayname(state, userId),
  );

  useEffect(() => {
    setDisplaynameValue(userDisplayname);
  }, [userDisplayname]);

  const validateDisplayName = async (text) => {
    if (
      text.length < 4 ||
      !/^([a-zA-Z0-9\u0D00-\u0D7F_.-]+)$/.test(text) || // reg exp to check characters are english or malayalam alphabets, numbers or _.-
      text.length > 25
    ) {
      setIsDisplaynameValid(false);
      setDisplaynameErrorMessage(
        'Min 4 characters\nMax 25 characters \nEnglish / Malayalam alphabets, numbers or _.- ',
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
    dispatch(updateDisplayname({id: userId, displayname: displaynameValue}));
  };
  const FieldOptions = (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        onPress={async () => {
          const isDisplayNameValid = await validateDisplayName(
            displaynameValue,
          );
          if (isDisplayNameValid) {
            register();
            setDisplaynameEdit(!displaynameEdit);
          }
        }}>
        <Icon
          raised
          type="font-awesome"
          name="check"
          size={11}
          color="#25D366"
        />
      </TouchableOpacity>
      <TouchableOpacity
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        onPress={() => {
          setDisplaynameEdit(false);
        }}>
        <Icon raised type="font-awesome" name="remove" size={11} color="red" />
      </TouchableOpacity>
    </View>
  );

  const displaynameField = (
    <Text
      style={{
        fontSize: 17,
        fontWeight: 'bold',
        color: '#444',
        paddingLeft: 10,
      }}>
      {userDisplayname}
      {'    '}
    </Text>
  );

  const EditButton = (
    <TouchableOpacity
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      onPress={() => {
        setDisplaynameEdit(true);
      }}>
      <Icon type="font-awesome" name="pencil" size={11} color="#555" />
    </TouchableOpacity>
  );

  const TextInputField = (
    <Input
      containerStyle={{
        width: isDisplaynameValid ? 150 : 200,
      }}
      inputContainerStyle={{
        borderBottomColor: '#eee',
        height: 25,
      }}
      inputStyle={{
        fontSize: 14,
      }}
      placeholder="Display Name"
      autoCapitalize="none"
      autoCorrect={false}
      autoFocus={true}
      onChangeText={(text) => setDisplaynameValue(text)}
      maxLength={25}
      value={displaynameValue}
      errorStyle={{color: 'red'}}
      errorMessage={
        isDisplaynameValid == null
          ? null
          : isDisplaynameValid
          ? null
          : displaynameErrorMessage
      }
      renderErrorMessage={!isDisplaynameValid}
    />
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {displaynameEdit ? TextInputField : displaynameField}
      {isProfile ? (displaynameEdit ? FieldOptions : EditButton) : null}
    </View>
  );
};

export default UserDisplaynameField;
