import React, {memo} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {getUserMemberCommunities} from '../redux/reducers/CommunitySlice';
import {Divider, Icon} from 'react-native-elements';
import CommunityAvatar from './CommunityAvatar';
import {getRegistrationStatus} from '../redux/reducers/AuthSlice';
import {FlatList} from 'react-native-gesture-handler';

const CommunityRow = memo(({community, screen, setScreen, screenType}) => {
  const {_id: communityId, name: communityName, role} = community;

  return communityName ? (
    <TouchableOpacity
      onPress={() =>
        screen === screenType ||
        screen !== 'CommunityDetail-' + communityId + '-' + screenType
          ? setScreen('CommunityDetail-' + communityId + '-' + screenType)
          : setScreen(screenType)
      }
      style={{
        flex: 1,
        padding: 3,
        marginHorizontal: 3,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
        backgroundColor:
          screen == 'CommunityDetail-' + communityId + '-' + screenType
            ? '#444'
            : '#eee',
      }}>
      <View
        style={{
          alignItems: 'center',
        }}>
        <CommunityAvatar
          communityId={communityId}
          size="small"
          disableTouch={true}
        />
      </View>
    </TouchableOpacity>
  ) : (
    <View></View>
  );
});

export default memo(function StickyTopBarCommunities(props) {
  const {type, contentContainerStyle, screen, setScreen, screenType} = props;
  const memberCommunities = useSelector(getUserMemberCommunities);
  const isRegistered = useSelector(getRegistrationStatus);

  const separator = () => {
    return <Divider style={{backgroundColor: '#fff', height: 5}} />;
  };

  const handlerRenderItem = ({item, index}) => {
    return (
      <CommunityRow
        community={item}
        screen={screen}
        setScreen={setScreen}
        screenType={screenType}
      />
    );
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

  const homeButton = (
    <TouchableOpacity
      onPress={() => setScreen(screenType)}
      style={{
        padding: 3,
        alignSelf: 'center',
        marginHorizontal: 3,
      }}>
      <View>
        <Icon
          name={screen === screenType ? 'home' : 'home-outline'}
          color="#444"
          size={32}
          type="material-community"
        />
      </View>
    </TouchableOpacity>
  );
  return isRegistered ? (
    <View
      style={{
        padding: 3,
        flex: 1,
        ...contentContainerStyle,
        flexDirection: 'row',
      }}>
      <FlatList
        horizontal={type == 'row' ? true : false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        listKey="communities"
        renderItem={handlerRenderItem}
        data={memberCommunities.sort(sortComparer)}
        keyExtractor={(item, index) => item._id}
        windowSize={15}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        // ItemSeparatorComponent={separator}
        ListHeaderComponent={homeButton}
        ListFooterComponent={separator}
      />
    </View>
  ) : (
    <View />
  );
});
