import React, {memo} from 'react';
import {View, Text, Platform, TouchableOpacity, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {getUserFavoriteCommunities} from '../../../redux/reducers/CommunitySlice';
import {Button, Icon, useTheme} from 'react-native-elements';
import CommunityAvatar from '../../../components/CommunityAvatar';
import {push, navigate} from '../../../navigation/Ref';
import TopCommunities from '../../../components/TopCommunities';
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
        //  height: 50,
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

export default memo(function FavoriteCommunities(props) {
  const {theme} = useTheme();

  const {type, contentContainerStyle, onlyIcons} = props;
  const memberCommunities = useSelector(getUserFavoriteCommunities);

  const handlerRenderItem = ({item, index}) => {
    return <CommunityRow community={item} onlyIcons={onlyIcons} />;
  };

  const CreateCommunityButton = (
    <View style={{paddingHorizontal: 20, paddingBottom: 15}}>
      <Button
        raised
        title="Create Community"
        buttonStyle={{
          borderRadius: 15,
          backgroundColor: theme.colors.blue,
          paddingVertical: 7,
          alignItems: 'center',
        }}
        titleStyle={{
          paddingLeft: 10,
          color: theme.colors.primary,
          fontSize: 14,
          ...(Platform.OS == 'ios' && {fontWeight: 'bold'}),
        }}
        icon={
          <Icon
            name="plus"
            size={17}
            color={theme.colors.primary}
            type="font-awesome"
          />
        }
        onPress={() => navigate('Create Community')}
      />
    </View>
  );
  const listHeader = (
    <View>
      {CreateCommunityButton}
      {<TopCommunities />}
      {memberCommunities.length > 0 && (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey2,
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 14,
              color: theme.colors.black5,
              textTransform: 'uppercase',
              ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
            }}>
            My communities
          </Text>
        </View>
      )}
    </View>
  );

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
        padding: 10,
        paddingHorizontal: 15,
      }}>
      <Text style={{color: theme.colors.black5, fontSize: 12}}>
        No communities favorited
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
        listKey="favorites"
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
