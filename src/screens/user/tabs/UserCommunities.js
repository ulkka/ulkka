import React, {memo} from 'react';
import {View, Text, Platform, TouchableOpacity, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {getUserMemberCommunities} from '../../../redux/reducers/CommunitySlice';
import {Icon, useTheme} from 'react-native-elements';
import CommunityAvatar from '../../../components/CommunityAvatar';
import {push} from '../../../navigation/Ref';
import {FlatList} from 'react-native-gesture-handler';
import FavoriteCommunity from '../../community/FavoriteCommunity';

const CommunityRow = memo(({community, onlyIcons}) => {
  const {theme} = useTheme();
  const {_id: communityId, name: communityName, role} = community;

  return communityName ? (
    <View
      style={{
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        //   height: 50,
      }}>
      <TouchableOpacity
        style={{flexDirection: 'row'}}
        onPress={() => push('CommunityNavigation', {communityId: communityId})}>
        <CommunityAvatar communityId={communityId} size="small" />
        {!onlyIcons && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              numberOfLines={1}
              style={{
                padding: 10,
                color: theme.colors.black4,
                maxWidth: 160,
                fontWeight: 'bold',
                ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
              }}>
              {communityName}
            </Text>
            {role == 'admin' && (
              <Icon
                name="shield"
                type="font-awesome"
                size={20}
                style={{
                  ...(Platform.OS == 'ios' && {
                    paddingTop: 5,
                    paddingLeft: 10,
                  }),
                }}
                color={theme.colors.green}
              />
            )}
          </View>
        )}
      </TouchableOpacity>
      <FavoriteCommunity communityId={communityId} />
    </View>
  ) : (
    <View></View>
  );
});

export default memo(function UserCommunities(props) {
  const {theme} = useTheme();

  const {type, contentContainerStyle, onlyIcons} = props;
  const memberCommunities = useSelector(getUserMemberCommunities);

  const handlerRenderItem = ({item, index}) => {
    return <CommunityRow community={item} onlyIcons={onlyIcons} />;
  };

  const sortComparer = (a, b) =>
    b.role == 'admin'
      ? a.role == 'admin'
        ? a.name.toLowerCase() > b.name.toLowerCase()
          ? 1
          : -1
        : 1
      : a.role == 'admin'
      ? -1
      : a.name.toLowerCase() > b.name.toLowerCase()
      ? 1
      : -1;

  const listEmptyComponent = () => (
    <View
      style={{
        alignItems: 'center',
        paddingTop: 5,
        paddingHorizontal: 15,
      }}>
      <Image
        source={require('../../../../assets/newMember.jpg')}
        resizeMode="contain"
        style={{borderRadius: 15, width: '100%'}}
      />
      <View style={{height: 5}}></View>
      <Text style={{color: theme.colors.black5, fontSize: 13}}>
        You haven't joined any communities yet
      </Text>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 5,
        ...contentContainerStyle,
      }}>
      <FlatList
        listKey="mycommunities"
        horizontal={type == 'row' ? true : false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={handlerRenderItem}
        data={memberCommunities.sort(sortComparer)}
        keyExtractor={(item, index) => item._id}
        windowSize={15}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        // ItemSeparatorComponent={separator}
        // ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmptyComponent}
        // ListFooterComponent={separator}
      />
    </View>
  );
});
