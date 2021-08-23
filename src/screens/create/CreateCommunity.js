import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import {Button, Input, useTheme} from 'react-native-elements';
import LoadingOverlay from '../../components/LoadingOverlay';
import ShowSubmitStatus from '../../components/PostCreator/ShowSubmitStatus';
import CommunityTopicSelector from '../../components/CommunityTopicSelector';
import Snackbar from 'react-native-snackbar';
import {useDispatch} from 'react-redux';
import {createCommunity} from '../../redux/reducers/CommunitySlice';
import communityApi from '../../services/CommunityApi';
import {pop, push} from '../../navigation/Ref';

export default function CreateCommunity({navigation, route}) {
  const {theme} = useTheme();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState({});
  const [title, setTitle] = useState(
    route?.params?.name ? route.params?.name.replace(/#/g, '') : '',
  );
  const [description, setDescription] = useState('');

  const [isCommunityTitleValid, setIsCommunityTitleValid] = useState(null);
  const [communityTitleErrorMessage, setCommunityTitleErrorMessage] = useState(
    '',
  );

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        setLoading(false);
        setStatus({});
        setTitle('');
        setDescription('');
      };
    }, []),
  );

  const payloadCreator = () => {
    const payload = {
      name: '#' + title,
      type: topic,
      description: description,
    };
    return payload;
  };

  const validateCommunityTitle = async text => {
    if (
      text.length < 5 ||
      !/^(#[a-zA-Z0-9\u0D00-\u0D7F_]+)$/.test(text) || // reg exp to check characters are english or malayalam alphabets, numbers or _
      text.length > 25
    ) {
      setIsCommunityTitleValid(false);
      setCommunityTitleErrorMessage(
        'Invalid Community Title \nMin 4 characters, Max 25 characters\nNo spaces\nEnglish / Malayalam alphabets, numbers or underscore',
      );
      return false;
    } else {
      const response = await communityApi.community.searchByName(text);
      if (!response.data?._id) {
        setIsCommunityTitleValid(true);
        return true;
      } else {
        setIsCommunityTitleValid(false);
        setCommunityTitleErrorMessage(
          'Community already exists. Please enter another title',
        );
        return false;
      }
    }
  };

  const payloadValidator = async payload => {
    if (!payload.type) {
      Snackbar.show({
        text: 'Please select a valid topic for the community',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
    if (!payload.name) {
      Snackbar.show({
        text: 'Please select a valid title for the community',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
    if (payload.name) {
      const isTitleValid = await validateCommunityTitle(payload.name);
      if (!isTitleValid) {
        Snackbar.show({
          text: 'Please select a valid title for the community',
          duration: Snackbar.LENGTH_SHORT,
        });
        return false;
      }
    }
    if (!payload.description) {
      Snackbar.show({
        text: 'Please select a valid description for the community',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
    return true;
  };

  const communityCreationSuccess = newCommunityId => {
    var statusData = {
      type: 'success',
      message: 'Successfully Created Community',
      entity: title,
    };
    setStatus(statusData);
    setTimeout(() => {
      pop();
      push('CommunityNavigation', {
        communityId: newCommunityId,
      });
    }, 1500);
  };

  const submit = async () => {
    Keyboard.dismiss();
    const payload = payloadCreator();
    const isPayloadValid = await payloadValidator(payload);
    if (isPayloadValid) {
      setLoading(true);
      await dispatch(createCommunity(payload)).then(response => {
        if (!response.error) {
          const newCommunityId = response.payload._id;
          communityCreationSuccess(newCommunityId);
        }
      });
      setLoading(false);
    }
  };

  const InputFields = (
    <View style={{justifyContent: 'space-evenly', paddingTop: 0}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomColor: theme.colors.grey3,
          borderBottomWidth: 1,
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            color: theme.colors.black4,
          }}>
          #
        </Text>
        <Input
          keyboardAppearance={theme.dark ? 'dark' : 'light'}
          placeholderTextColor={theme.colors.black7}
          inputContainerStyle={{
            borderBottomColor: 'transparent',
          }}
          onChangeText={text => setTitle(text)}
          value={title}
          placeholder={'Title'}
          renderErrorMessage={!!isCommunityTitleValid}
          errorStyle={{color: 'red'}}
          onFocus={() => {
            setIsCommunityTitleValid(null);
            setCommunityTitleErrorMessage('');
          }}
          // multiline={true}
          inputStyle={{
            // textAlign: 'center',
            justifyContent: 'center',
            lineHeight: 24,
          }}
          errorMessage={
            isCommunityTitleValid == null
              ? null
              : isCommunityTitleValid
              ? null
              : communityTitleErrorMessage
          }
          returnKeyType="done"
          onSubmitEditing={e => {
            Keyboard.dismiss();
          }}
        />
      </View>
      <View
        style={{
          marginTop: 30,
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}>
        <Input
          keyboardAppearance={theme.dark ? 'dark' : 'light'}
          placeholderTextColor={theme.colors.black7}
          style={{
            height: 'auto',
            minHeight: 75,
            marginBottom: 20,
          }}
          inputContainerStyle={{
            borderBottomColor: theme.colors.primary,
            marginBottom: 20,
          }}
          onChangeText={text => setDescription(text)}
          inputStyle={{
            lineHeight: 24,
          }}
          value={description}
          placeholder={'Description'}
          numberOfLines={10}
          multiline={true}
          maxLength={400}
        />
      </View>
    </View>
  );
  const Submit = (
    <View style={{width: '50%', alignSelf: 'center'}}>
      <Button
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
        }}
        title="Create"
        onPress={() => submit()}
      />
    </View>
  );
  const Form = (
    <View style={{justifyContent: 'space-evenly', marginTop: 50}}>
      {InputFields}
      {Submit}
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
      }}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS == 'ios' ? 125 : 75}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          backgroundColor: theme.colors.primary,
          width: '100%',
          padding: 25,
          justifyContent: 'space-evenly',
        }}>
        <View>
          <CommunityTopicSelector topic={topic} setTopic={setTopic} />
        </View>
        {Form}
      </KeyboardAvoidingView>
      <LoadingOverlay visible={loading} />
      <ShowSubmitStatus data={status} />
    </View>
  );
}
