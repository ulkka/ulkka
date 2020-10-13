import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  SafeAreaView,
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
    if (value.length > 3) {
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

  return (
    <SafeAreaView style={{}}>
      <Modal
        transparent={true}
        animationType="slide"
        visible={visible}
        onRequestClose={() => disableFilterMode()}>
        <View
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
              ItemSeparatorComponent={() => {
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
              }}
              contentContainerStyle={{
                opacity: 0.8,
                padding: 10,
              }}
              renderItem={({item}) => {
                let id = item._id;
                return (
                  <TouchableOpacity
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
                          // borderWidth: 1,
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
              }}
            />
          </View>
          <View style={{}}>
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
        </View>
      </Modal>
    </SafeAreaView>
  );
}
