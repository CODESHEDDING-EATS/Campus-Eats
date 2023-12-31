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
    TextInput, Button, ScrollView, ActivityIndicator, Modal, TouchableWithoutFeedback
} from "react-native";
import * as Font from "expo-font";
import {useFetchRestaurants} from "../consts/foodData";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get("window");


const RestaurantsScreen = ({navigation}) => {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { restaurants} = useFetchRestaurants(isLoading);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const options = ["Entire Campus", "East", "West" ];

    useEffect(() => {
        // Use this useEffect to ensure setIsLoading(false) is called
        if (restaurants.length > 0) {
            setIsLoading(false);
        }
    }, [restaurants]);

    useEffect(() => {

        if (!isLoading) {
            // Update filteredRestaurants when data is fetched and isLoading becomes false
            setFilteredRestaurants(restaurants);
        }
    }, [isLoading, restaurants]);

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
        if (searchText === "") {
            console.log('emp')
            // If search text is empty, display all restaurants
            setFilteredRestaurants(restaurants);
        }
        else{
            // Filter the restaurants based on the search text
            const filtered = restaurants.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
            setFilteredRestaurants(filtered);
        }
    }, [searchText]);

    useEffect(() => {
        console.log(selectedOption)
        if (selectedOption === null || selectedOption === "Entire Campus" ) {
            console.log('null')
            // If search text is empty, display all restaurants
            setFilteredRestaurants(restaurants);
        }
        else{
            // Filter the restaurants based on the filters
            const filtered = restaurants.filter(item => item.location === selectedOption);
            setFilteredRestaurants(filtered);
        }
    }, [selectedOption]);


    const handleSearchTextChange = (text) => {
        setSearchText(text);
    };

    const handleFilterPress = () => {
        toggleDropdown()
    };
    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const selectOption = (option) => {
        setSelectedOption(option);
        toggleDropdown();
    };

    const handleRestaurantPress = (restaurantName) => {
        // Add your filter logic here
        navigation.navigate('Menu', {restaurantName} );
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.heading}>Restaurants</Text>
                </View>

                <View style={{ marginHorizontal: 10 }}>
                    <View style={styles.searchContainer}>
                        <Image
                            source={require('../assets/Search.png')}
                            style={{ width: 24, height: 24 }}
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

                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={isDropdownVisible}
                                onRequestClose={toggleDropdown}
                            >
                                <TouchableWithoutFeedback onPress={toggleDropdown}>
                                    <View style={styles.modalContainer}>
                                        <View style={styles.modalContent}>
                                            <FlatList
                                                data={options}
                                                keyExtractor={(item) => item}
                                                renderItem={({ item }) => (
                                                    <TouchableOpacity onPress={() => selectOption(item)}>
                                                        <Text style={styles.option}>{item}</Text>
                                                    </TouchableOpacity>
                                                )}
                                            />
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </Modal>
                        </View>
                    </View>

                    {isLoading ? (
                        // edit buffering icon location on screen here
                        <ActivityIndicator size="large" color="orange" style={{ marginTop: (height/2) - height*0.15 }} />
                    ) : (
                        <FlatList
                            data={filteredRestaurants}
                            keyExtractor={item => item.id}
                            scrollEnabled={true}
                            style={styles.flatListContainer}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => { handleRestaurantPress(item.name) }} style={styles.itemContainer}>
                                    {item.imageURL.startsWith('../assets/') ? (
                                        <Image source={require('../assets/jimmys.jpg')} style={styles.itemImage} />
                                    ) : (
                                        <Image source={{ uri: item.imageURL }} style={styles.itemImage} />
                                    )}
                                    <Text style={styles.boldText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F5F9",
    },
    heading: {
        fontFamily: "Urbanist-Bold",
        fontSize: 26,
    },
    contentContainer: {
        flex: 1,
        marginTop: height * 0.055,
    },
    header: {
        flexDirection: "column",
        paddingTop: height * 0.02,
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
        elevation: 5
    },
    itemImage: {
        position:"relative",
        width: "100%",
        height: 150,
        marginBottom: 10,
        borderRadius: 10,
    },

    flatListContainer:{
        height: height*0.80,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10
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
        marginTop: height*0.07,
        marginHorizontal: 10,
        backgroundColor: "white",
        borderRadius: 5,
        padding: 10
    },
    search: {
        position: "absolute"
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 200,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    option: {
        fontFamily: "Urbanist-Bold",
        fontSize: 16,
        paddingVertical: 10,
    },
});

export default RestaurantsScreen;
