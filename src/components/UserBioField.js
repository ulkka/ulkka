import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon, Input} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {getUserBio, updateBio} from '../redux/reducers/UserSlice';
import {getRegisteredUser} from '../redux/reducers/AuthSlice';

const UserBioField = (props) => {
  const dispatch = useDispatch();
  const {userId} = props;

  const [bioEdit, setBioEdit] = useState(false);
  const [bioValue, setBioValue] = useState('');

  const registeredUser = useSelector(getRegisteredUser);
  const registeredUserId = registeredUser?._id;
  const isProfile = userId == registeredUserId;

  const bio = useSelector((state) => getUserBio(state, userId));

  useEffect(() => {
    setBioValue(bio);
  }, [bio]);

  const FieldOptions = (
    <View style={{flexDirection: 'row'}}>
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
          color="#25D366"
        />
      </TouchableOpacity>
      <TouchableOpacity
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        onPress={() => {
          setBioEdit(false);
        }}>
        <Icon raised type="font-awesome" name="remove" size={11} color="red" />
      </TouchableOpacity>
    </View>
  );

  const bioField = (
    <Text
      style={{
        fontSize: 12,
        color: '#555',
        fontStyle: 'italic',
      }}>
      {bio}
    </Text>
  );
  const AddDescriptionIfProfile = isProfile && (
    <Text
      style={{
        fontSize: 12,
        color: '#555',
        fontStyle: 'italic',
      }}>
      Add description
    </Text>
  );
  const EditButton = (
    <TouchableOpacity
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      style={{paddingLeft: 10}}
      onPress={() => {
        setBioEdit(true);
      }}>
      <Icon type="font-awesome" name="pencil" size={11} color="#555" />
    </TouchableOpacity>
  );
  const TextInputField = (
    <Input
      inputContainerStyle={{
        borderBottomColor: '#eee',
        height: 20,
      }}
      inputStyle={{
        fontSize: 12,
        fontStyle: 'italic',
        height: 10,
      }}
      renderErrorMessage={false}
      autoFocus={true}
      containerStyle={{
        width: 200,
      }}
      placeholder="A little description of yourself"
      onChangeText={(text) => setBioValue(text)}
      maxLength={50}
      value={bioValue}
    />
  );

  return (
    <View
      style={{
        paddingVertical: bio || isProfile ? 15 : 10,
        paddingHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {bioEdit ? TextInputField : bio ? bioField : AddDescriptionIfProfile}
      {isProfile ? (bioEdit ? FieldOptions : EditButton) : null}
    </View>
  );
};

export default UserBioField;
