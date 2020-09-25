import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Header, Icon, Text } from 'react-native-elements';
import Search from './Search';

const HeaderBar = (props) => {
    const [searchMode, setSearchMode] = useState(false);

    const _goBack = () => console.log('Went back');

    const _toggleSearch = () => setSearchMode(!searchMode);

    const _handleMore = () => console.log('Shown more');

    const MenuComponent = () => {
        return (
            <Icon name="menu" color="#333" onPress={() => props.navigation.toggleDrawer()} />
        )
    }

    const TitleComponent = () => {
        return (
            searchMode == false ?
                <View style={
                    {
                        flex: 1,
                        justifyContent: "center"
                    }
                }>
                    <Text style={{
                        fontSize: 17,
                        fontWeight: "bold",
                        color: "#333"
                    }}>Vellarikka Pattanam</Text>
                </View>
                :

                <Search />
        )
    }

    const SearchComponent = () => {
        return (
            searchMode == false ?
                <Icon name="search" color="#333" onPress={() => _toggleSearch()} />
                :
                <TouchableOpacity onPress={() => _toggleSearch()}  >
                    <Text style={{ fontSize: 13, color: "#444", fontWeight:"bold" , paddingTop:4}}> Cancel</Text>
                </TouchableOpacity>
        )
    }

    return (

        <Header
            containerStyle={{
                height: 72,
                borderBottomColor:'transparent'
            }}
            statusBarProps={{ barStyle: "dark-content" }}
            barStyle="dark-content"
            placement="left"
            leftComponent={MenuComponent}
            centerComponent={TitleComponent}
            rightComponent={SearchComponent}
        />

    );
};

export default HeaderBar;