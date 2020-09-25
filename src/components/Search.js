import React, { useContext, useState } from 'react';
import { SearchBar } from 'react-native-elements';
import { ThemeContext } from 'react-native-elements';

export default function Search() {
    const { theme } = useContext(ThemeContext);

    const [search, setSearch] = useState('');

    const updateSearch = (search) => {
        setSearch(search);
    };

    return (
        <SearchBar
            placeholder="Search..."
            onChangeText={(text) => updateSearch(text)}
            value={search}
            lightTheme={true}
            cancelButtonTitle='cancel'
            containerStyle={{
                backgroundColor: 'white',
                borderTopColor: 'transparent',
                borderBottomColor: 'transparent',
                width: "100%",
            }}
            inputContainerStyle={{
                height: 30,
                backgroundColor:"#eee"
            }}
            inputStyle={{
                fontSize: 12
            }}

            round={true}
            showLoading={true}
            searchIcon={{ size: 15 }}
        />
    );
}