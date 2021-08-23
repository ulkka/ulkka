import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  SearchBar,
  Button,
  Icon,
  Divider,
  Overlay,
  useTheme,
} from 'react-native-elements';
import {useSelector} from 'react-redux';
import communityApi from '../services/CommunityApi';
import {
  getUserMemberCommunities,
  getUserModeratorCommunities,
} from '../redux/reducers/CommunitySlice';
import CommunityAvatar from '../components/CommunityAvatar';

export default function SearchableDropdown(props) {
  const {theme} = useTheme();

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
      value.length > 0 &&
      !allowOnlyMemberCommunities &&
      !allowOnlyModeratorCommunities
    ) {
      searchForCommunity(value);
    } else if (allowOnlyMemberCommunities) {
      const filteredMemberCommunities = userMemberCommunities.filter(
        community =>
          community.name.toLowerCase().startsWith(value.toLowerCase()),
      );
      setItems(filteredMemberCommunities);
    } else if (allowOnlyModeratorCommunities) {
      const filteredMemberCommunities = userModeratorCommunites.filter(
        community =>
          community.name.toLowerCase().startsWith(value.toLowerCase()),
      );
      setItems(filteredMemberCommunities);
    }
  }, [value]);

  const searchHandle = text => {
    setValue(text);
  };

  const searchForCommunity = async term => {
    const response = await communityApi.community
      .search(term, 1, 10)
      .catch(error => console.error('error searching communities'));
    if (response?.data?.data) {
      setItems(response.data.data);
    }
  };

  const setCommunityToPost = community => {
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
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <CommunityAvatar
                communityId={item._id}
                size="small"
                disableTouch={true}
                name={item.name}
                icon={item.icon}
              />
              <View style={{width: 10}}></View>
              <Text
                style={{
                  color: theme.colors.black2,
                  fontWeight: '600',
                  ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
                }}>
                {item.name}
              </Text>
            </View>
            <Icon
              name="arrow-right"
              type="font-awesome-5"
              color={theme.colors.black3}
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
        autoFocus={true}
        showCancel={true}
        value={value}
        onChangeText={text => searchHandle(text)}
        placeholder="Search Community"
        round={true}
        lightTheme={!theme.dark}
        keyboardAppearance={theme.dark ? 'dark' : 'light'}
        placeholderTextColor={theme.colors.black7}
        containerStyle={{
          backgroundColor: theme.colors.primary,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          height: 22,
        }}
        inputContainerStyle={{
          height: 30,
          backgroundColor: theme.colors.grey2,
        }}
        inputStyle={{
          fontSize: 15,
          color: theme.colors.black5,
        }}
        searchIcon={{size: 18, color: theme.colors.black7}}
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
        <Divider color={theme.colors.grey2} />
      </View>
    );
  };
  const ResultsView = (
    <View
      style={{
        width: '100%',
        padding: 5,
      }}>
      <FlatList
        keyboardShouldPersistTaps="always"
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
        data={items}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={_itemSeperatorComponent}
        contentContainerStyle={{
          opacity: 0.8,
          padding: 5,
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
          color: theme.colors.green,
        }}
        onPress={() => {
          toggleModal();
        }}
      />
    </View>
  );

  return (
    <Overlay
      statusBarTranslucent={true}
      transparent={true}
      animationType="slide"
      isVisible={visible}
      onBackdropPress={() => toggleModal()}
      overlayStyle={{
        height: '90%',
        width: '75%',
        backgroundColor: theme.colors.primary,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      backdropStyle={{backgroundColor: theme.colors.grey4, opacity: 0.3}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={40}
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
