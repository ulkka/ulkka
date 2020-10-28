import React, {useState} from 'react';
import {View, Text, TextInput} from 'react-native';
import mainClient from '../../client/mainClient';
import {Button, Icon, Input} from 'react-native-elements';
import Header from '../../components/Header';
import LoadingOverlay from '../../components/LoadingOverlay';
import SubmitStatus from '../../components/SubmitStatus';

export default function CreateCommunity({navigation}) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(new Map());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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
        var statusData = new Map();
        statusData.set('status', 'success');
        statusData.set('message', 'Successfully Created Community');
        statusData.set('entity', title);
        setStatus(statusData);
        setTimeout(() => navigation.navigate('Home'), 3000);
        console.log('response is', response.data);
      })
      .catch((error) => {
        setLoading(false);
        var statusData = new Map();
        statusData.set('status', 'fail');
        statusData.set('message', 'Failed to created community');
        statusData.set('entity', title);
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
      <View style={{flex: 1, width: '100%', padding: 25}}>
        {Title}
        {Form}
      </View>
      <LoadingOverlay loading={loading} />
      <SubmitStatus data={status} />
    </View>
  );
}
