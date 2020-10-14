import React, { useContext } from 'react';
import { View, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { ThemeContext, Icon, Text, } from 'react-native-elements';


export default function Post(props) {

    const { theme } = useContext(ThemeContext);

    return (
        <View style={
            {
                alignSelf: "center",
                borderBottomWidth: 1,
                borderColor: "#ddd",
                borderRadius: 10,
                backgroundColor: theme.colors.background,
                width: "100%"
            }
        }>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row" }}>
                    <Icon name="account-circle" color="#333" size={32} style={{ padding: 5 }} />
                    <View style={{ padding: 5 }}>
                        <TouchableOpacity onPress={() => props.navigation.navigate('Community')}>
                            <Text style={{ fontSize: 13, fontWeight: "bold", color: "#432" }}>
                                Community Name Title
                        </Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: "row", }}>
                            <TouchableOpacity onPress={() => props.navigation.navigate('Account')}>
                                <Text style={{ fontSize: 11, paddingRight: 10, color: "#555" }}>
                                    By - {props.item.author.name}
                                </Text>
                            </TouchableOpacity>
                            <Text style={{ fontSize: 11, color: "#555" }}>
                                3h
                        </Text>
                        </View>
                    </View>
                </View>
                <View style={{ padding: 5, }}>
                    <Icon name="more-vert" size={18} color="#888" />
                </View>
            </View>
            <View>
                <Text style={{ fontSize: 16, padding: 10 }}>
                    Text - {props.item.text}
                </Text>
            </View>
            <TouchableHighlight
                activeOpacity={0.9}
                underlayColor="#fff"
                onPress={()=>console.log('hi')}
            >
                <Image style={{
                    width: "100%",
                    height:270 ,
                    resizeMode: "contain",
                }}
                    source={{ uri: "https://d1by7ovwgplzkj.cloudfront.net/assets/trollmalayalamofficial/121191949_1222980311404786_8919896763969967922_n.jpg" }}
               //     source={{uri:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Rotating_earth_%28large%29.gif/200px-Rotating_earth_%28large%29.gif"}}
                />
            </TouchableHighlight>
            <View style={{ flexDirection: "row", padding: 10, borderTopWidth: 1, borderTopColor: "#eee", flex: 1, justifyContent: "space-evenly" }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 3, paddingLeft: 10 }}>
                    <Icon name="arrow-up-bold" type="material-community" size={20} color="#888" />
                    <Icon name="arrow-down-bold" type="material-community" size={20} color="#888" />
                </View>
                <View style={{ flex: 5 }}>
                    <Icon name="comment" type="material-community" color="#000" size={18} color="#888" />
                </View>
                <TouchableOpacity style={{ flex: 3, flexDirection: "row" }} >
                    <Icon name="share" type="font-awesome" size={18} color="#888" />
                    <Text style={{ fontSize: 13, fontWeight: "bold", paddingLeft: 12, color: "#777" }} >Share</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}