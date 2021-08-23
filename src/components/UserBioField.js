import React, {useEffect, useState, useContext} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon, Input, ThemeContext} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {getUserBio, updateBio} from '../redux/reducers/UserSlice';
import {getRegisteredUser} from '../redux/reducers/AuthSlice';
import AutolinkText from './AutolinkText';

const UserBioField = props => {
  const {theme} = useContext(ThemeContext);
  const dispatch = useDispatch();
  const {userId} = props;

  const [bioEdit, setBioEdit] = useState(false);
  const [bioValue, setBioValue] = useState('');

  const registeredUser = useSelector(getRegisteredUser);
  const registeredUserId = registeredUser?._id;
  const isProfile = userId == registeredUserId;

  const bio = useSelector(state => getUserBio(state, userId));

  useEffect(() => {
    setBioValue(bio);
  }, [bio]);

  const FieldOptions = (
    <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
      <TouchableOpacity
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        onPress={() => {
          dispatch(updateBio({id: userId, bio: bioValue}));
          setBioEdit(false);
        }}>
        <Icon
          raised
          type="font-awesome"
          name="check"
          size={11}
          color={theme.colors.green}
          containerStyle={{borderWidth: 1, borderColor: theme.colors.grey5}}
        />
      </TouchableOpacity>
      <TouchableOpacity
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        onPress={() => {
          setBioEdit(false);
        }}>
        <Icon
          raised
          type="font-awesome"
          name="remove"
          size={11}
          color="red"
          containerStyle={{borderWidth: 1, borderColor: theme.colors.grey5}}
        />
      </TouchableOpacity>
    </View>
  );

  const bioField = (
    <AutolinkText
      text={bio}
      enableShowMore={true}
      source={'bio'}
      textStyle={{
        fontSize: 12,
        color: theme.colors.black1,
      }}
    />
  );
  const AddBioIfProfile = isProfile && (
    <Text
      style={{
        fontSize: 12,
        color: theme.colors.black5,
      }}>
      Add bio
    </Text>
  );
  const EditButton = (
    <TouchableOpacity
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      style={{marginLeft: 10}}
      onPress={() => {
        setBioEdit(true);
      }}>
      <Icon
        type="font-awesome"
        name="pencil"
        size={11}
        color={theme.colors.black5}
      />
    </TouchableOpacity>
  );

  const PlusButton = (
    <TouchableOpacity
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      style={{marginLeft: 8}}
      onPress={() => {
        setBioEdit(true);
      }}>
      <Icon
        type="font-awesome"
        name="plus-circle"
        size={15}
        color={theme.colors.blue}
      />
    </TouchableOpacity>
  );

  const TextInputField = (
    <View style={{flex: 1}}>
      <Input
        keyboardAppearance={theme.dark ? 'dark' : 'light'}
        placeholderTextColor={theme.colors.black7}
        autoCorrect={false}
        inputContainerStyle={{
          borderBottomColor: theme.colors.grey2,
          height: 'auto',
        }}
        inputStyle={{
          fontSize: 12,
        }}
        multiline={true}
        renderErrorMessage={false}
        autoFocus={true}
        containerStyle={{
          width: '95%',
        }}
        placeholder="A little description of yourself"
        onChangeText={text => setBioValue(text)}
        maxLength={150}
        value={bioValue}
      />
      {FieldOptions}
    </View>
  );

  return (
    <View
      style={{
        flexGrow: 2,
        paddingVertical: 10,
        paddingLeft: 5,
        marginRight: 20,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {bioEdit ? TextInputField : bio ? bioField : AddBioIfProfile}
      {isProfile ? (bioEdit ? null : bio ? EditButton : PlusButton) : null}
    </View>
  );
};

export default UserBioField;
