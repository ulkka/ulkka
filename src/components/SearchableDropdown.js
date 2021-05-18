import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {SearchBar, Button, Icon, Divider, Overlay} from 'react-native-elements';
import {useSelector} from 'react-redux';
import mainClient from '../client/mainClient';
import {
  getUserMemberCommunities,
  getUserModeratorCommunities,
} from '../redux/reducers/CommunitySlice';

export default function SearchableDropdown(props) {
  const {allowOnlyMemberCommunities, allowOnlyModeratorCommunities} = props;
  const [visible, setVisible] = useState(props.selectCommunityModalVisible);
  const userMemberCommunities = useSelector(getUserMemberCommunities);
  const userModeratorCommunites = useSelector(getUserModeratorCommunities);
  const [value, setValue] = useState('');
  const [items, setItems] = useState(userMemberCommunities);

  const searchBarRef = useRef(null);

  const toggleModal = () => {
    props.setSelectCommunityModalVisible(!props.selectCommunityModalVisible);
  };

  useEffect(() => {
    setVisible(props.selectCommunityModalVisible);
  }, [props.selectCommunityModalVisible]);

  useEffect(() => {
    if (
      value.length > 2 &&
      !allowOnlyMemberCommunities &&
      !allowOnlyModeratorCommunities
    ) {
      searchForCommunity(value);
    } else if (allowOnlyMemberCommunities) {
      const filteredMemberCommunities = userMemberCommunities.filter(
        (community) =>
          community.name.toLowerCase().startsWith(value.toLowerCase()),
      );
      setItems(filteredMemberCommunities);
    } else if (allowOnlyModeratorCommunities) {
      const filteredMemberCommunities = userModeratorCommunites.filter(
        (community) =>
          community.name.toLowerCase().startsWith(value.toLowerCase()),
      );
      setItems(filteredMemberCommunities);
    }
  }, [value]);

  const searchHandle = (text) => {
    setValue(text);
  };

  const searchForCommunity = (term) => {
    mainClient
      .get('/community?query={"name":{"$regex":"' + term + '","$options":"i"}}')
      .then((res) => {
        console.log('res.data', res.data);
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
        ref={searchBarRef}
        showCancel={true}
        value={value}
        onChangeText={(text) => searchHandle(text)}
        placeholder="Search Community"
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
        width: '100%',
        padding: 10,
      }}>
      <FlatList
        keyboardShouldPersistTaps="always"
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
    <View>
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
    <Overlay
      //  onShow={() => searchBarRef.current.focus()}
      statusBarTranslucent={true}
      transparent={true}
      animationType="slide"
      isVisible={visible}
      onBackdropPress={() => toggleModal()}
      overlayStyle={{
        height: '90%',
        width: '75%',
        backgroundColor: 'white',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={30}
        style={{
          flex: 1,
          height: 'auto',
          width: '100%',
        }}>
        <View
          style={{
            padding: 20,
            flex: 1,
            height: 'auto',
            width: '100%',
          }}>
          {SearchBarView}
          {ResultsView}
        </View>
        {CloseButtonView}
      </KeyboardAvoidingView>
    </Overlay>
  );
}
