import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import {SearchBar, Button, Icon, Divider} from 'react-native-elements';
import mainClient from '../client/mainClient';

export default function SearchableDropdown(props) {
  const [visible, setVisible] = useState(props.selectCommunityModalVisible);
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);

  const toggleModal = () => {
    //setVisible(!visible);
    props.setSelectCommunityModalVisible(!props.selectCommunityModalVisible);
  };

  useEffect(() => {
    setVisible(props.selectCommunityModalVisible);
  }, [props.selectCommunityModalVisible]);

  useEffect(() => {
    if (value.length > 2) {
      searchForCommunity(value);
    } else {
      setItems([]);
    }
  }, [value]);

  const searchHandle = (text) => {
    setValue(text);
  };

  const searchForCommunity = (term) => {
    mainClient
      .get('/community?query={"name":{"$regex":"' + term + '","$options":"i"}}')
      .then((res) => {
        setItems(res.data);
      });
  };

  const setCommunityToPost = (community) => {
    setValue('');
    props.setSelectCommunityModalVisible(false);
    props.setCommunity(community);
  };

  function _renderItem() {
    return ({item}) => {
      return (
        <TouchableOpacity
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          style={{}}
          onPress={() => setCommunityToPost(item)}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: '#222',
              }}>
              {item.name}
            </Text>

            <Icon
              name="arrow-right"
              type="font-awesome-5"
              color="#333"
              size={12}
              style={{padding: 5}}
            />
          </View>
        </TouchableOpacity>
      );
    };
  }

  const SearchBarView = (
    <View
      style={{
        width: '100%',
        marginBottom: 15,
      }}>
      <SearchBar
        showCancel={true}
        value={value}
        onChangeText={(text) => searchHandle(text)}
        placeholder="Select Community"
        round={true}
        lightTheme={true}
        containerStyle={{
          backgroundColor: 'white',
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          height: 22,
        }}
        inputContainerStyle={{
          height: 30,
          backgroundColor: '#eee',
        }}
        inputStyle={{
          fontSize: 15,
        }}
        round={true}
        searchIcon={{size: 15}}
      />
    </View>
  );

  const _itemSeperatorComponent = () => {
    return (
      <View
        style={{
          height: 30,
          justifyContent: 'center',
        }}>
        <Divider
          style={{
            backgroundColor: '#ddd',
          }}
        />
      </View>
    );
  };
  const ResultsView = (
    <View
      style={{
        height: '80%',
        width: '100%',
      }}>
      <FlatList
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
        data={items}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={_itemSeperatorComponent}
        contentContainerStyle={{
          opacity: 0.8,
          padding: 10,
        }}
        renderItem={_renderItem()}
      />
    </View>
  );

  const CloseButtonView = (
    <View style={{marginBottom: 20}}>
      <Button
        title="Close"
        color="red"
        titleStyle={{
          color: 'green',
        }}
        onPress={() => {
          toggleModal();
        }}
      />
    </View>
  );

  return (
    <View style={{}}>
      <Modal
        statusBarTranslucent={true}
        transparent={true}
        animationType="slide"
        visible={visible}
        onRequestClose={() => disableFilterMode()}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            margin: 45,
            height: '80%',
            backgroundColor: 'white',
            borderRadius: 25,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOffset: {
              width: 2,
              height: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          {SearchBarView}
          {ResultsView}
          {CloseButtonView}
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
