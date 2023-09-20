import React, { useEffect, useState } from "react";
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    TextInput, Button
} from "react-native";
import * as Font from "expo-font";
import restaurants from '../consts/dummyRestaurants'
import Icon from "react-native-vector-icons/MaterialIcons";


const { width, height } = Dimensions.get("window");

const RestaurantsScreen = () => {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);

    useEffect(() => {
        async function loadFont() {
            await Font.loadAsync({
                "Urbanist-Regular": require("../Fonts/Urbanist-Regular.ttf"),
                "Urbanist-Bold": require("../Fonts/Urbanist-Bold.ttf"),
            });
            setFontLoaded(true);
        }
        loadFont();
    }, []);

    useEffect(() => {
        // Filter the restaurants based on the search text
        const filtered = restaurants.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
        setFilteredRestaurants(filtered);
    }, [searchText]);

    const handleSearchTextChange = (text) => {
        setSearchText(text);
    };

    const handleFilterPress = () => {
        // Add your filter logic here
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.heading, styles.heading]}>Restaurants</Text>
            </View>

            <View style={{ marginHorizontal: 10}}>
                <View style={styles.searchContainer}>
                    <Image
                        source={require('../assets/Search.png')}
                        style={{ width: 24, height: 24 }}
                        onPress={() => {handleFilterPress()}}
                    />

                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search..."
                        value={searchText}
                        onChangeText={handleSearchTextChange}
                    />
                    <View style={styles.filter}>
                        <TouchableOpacity onPress={() => { handleFilterPress() }} style={styles.filter}>
                            <Image
                                source={require('../assets/Filter.png')}
                                style={{ width: 24, height: 24 }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <FlatList
                    data={filteredRestaurants}
                    keyExtractor={item => item.key}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.itemContainer}>
                            <Image source={require('../assets/jimmys.jpg')} style={styles.itemImage} />
                            <Text style={styles.boldText}>{item.name}</Text>
                            <Text style={styles.subText}>{item.price}</Text>
                            {/*<Text style={styles.boldText}>{item.name}</Text>*/}
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.flatListContainer}
                />
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 0,
        backgroundColor: "#F2F5F9",
    },
    heading: {
        fontFamily: "Urbanist-Bold",
        fontSize: 26,
    },
    header: {
        marginTop: height * 0.07,
        flexDirection: "column",
        marginHorizontal: width * 0.05,
        position: "absolute",
    },
    boldText: {
        fontFamily: "Urbanist-Bold",
        fontSize: 15,
        paddingBottom: 4
    },
    subText: {
        fontFamily: "Urbanist-Bold",
        fontSize: 10,
        color: "gray"
    },
    itemContainer: {
        backgroundColor: "white",
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        flexDirection: "column",
        alignItems: "left",
    },
    itemImage: {
        position:"relative",
        width: "100%",
        height: 150,
        marginBottom: 10,
        borderRadius: 10,

    },

    flatListContainer:{
        padding: 10
    },
    searchInput: {
        flex: 1,
        borderColor: "gray",
        marginRight: 10,
        padding: 5,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: height*0.08,
        marginHorizontal: 10,
        backgroundColor: "white",
        borderRadius: 5,
        padding: 10


    },
    search: {
        position: "absolute"
    }
});

export default RestaurantsScreen;
