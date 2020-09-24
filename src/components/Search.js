import React, { useContext, useState } from 'react';
import { SearchBar } from 'react-native-elements';
import { ThemeContext } from 'react-native-elements';

export default function Search() {
    const { theme } = useContext(ThemeContext);

    const [search, setSearch] = useState('');

    const updateSearch = (search) => {
        setSearch(search);
    };

    const CancelSearch = () => {
        return (
            <Icon name="menu" color="#111" />
        )
    };

    return (
        <SearchBar
            placeholder="Type Here..."
            onChangeText={(text) => updateSearch(text)}
            value={search}
            lightTheme={true}
            containerStyle={{
                justifyContent:"center",
                backgroundColor: theme.colors.primary,
               // height:"50%"
            }}
            round={true}
            leftIcon={CancelSearch}
        />
    );
}