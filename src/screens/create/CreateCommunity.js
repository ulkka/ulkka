import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, Text, KeyboardAvoidingView, ViewPagerAndroid} from 'react-native';
import mainClient from '../../client/mainClient';
import {Button, Input} from 'react-native-elements';
import Header from '../../components/Header';
import LoadingOverlay from '../../components/LoadingOverlay';
import ShowSubmitStatus from '../../components/PostCreator/ShowSubmitStatus';

export default function CreateCommunity({navigation}) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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

  const submit = async () => {
    setLoading(true);
    const client = await mainClient;
    client
      .post('community', {
        name: title,
        description: description,
      })
      .then((response) => {
        setLoading(false);
        var statusData = {
          type: 'success',
          message: 'Successfully Created Community',
          entity: title,
        };
        setStatus(statusData);
        setTimeout(() => navigation.navigate('Home'), 3000);
      })
      .catch((error) => {
        setLoading(false);
        var statusData = {
          type: 'fail',
          message: 'Failed to create community',
          entity: title,
        };
        setStatus(statusData);
        console.log(error);
      });
  };
  const Title = (
    <View
      style={{
        flex: 2,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          width: 180,
          color: '#555',
        }}>
        Create Community
      </Text>
    </View>
  );
  const InputFields = (
    <View>
      <Input
        style={{
          height: 40,
        }}
        inputContainerStyle={{
          borderBottomColor: '#ddd',
        }}
        onChangeText={(text) => setTitle(text)}
        value={title}
        placeholder={'Title'}
      />
      <Input
        style={{
          maxHeight: 300,
          minHeight: 150,
        }}
        inputContainerStyle={{
          borderBottomColor: '#fff',
        }}
        onChangeText={(text) => setDescription(text)}
        value={description}
        placeholder={'Description'}
        numberOfLines={10}
        multiline={true}
        maxLength={1000}
      />
    </View>
  );
  const Submit = (
    <View style={{width: '35%', alignSelf: 'center', marginTop: 50}}>
      <Button
        buttonStyle={{
          backgroundColor: '#20bb29c4',
          borderRadius: 20,
        }}
        title="Submit"
        onPress={() => submit()}
      />
    </View>
  );
  const Form = (
    <View style={{flex: 5}}>
      {InputFields}
      {Submit}
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <Header navigation={navigation} />
      <KeyboardAvoidingView
        keyboardVerticalOffset={140}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1, width: '100%', padding: 25}}>
        {Title}
        {Form}
      </KeyboardAvoidingView>
      <LoadingOverlay visible={loading} />
      <ShowSubmitStatus data={status} />
    </View>
  );
}
