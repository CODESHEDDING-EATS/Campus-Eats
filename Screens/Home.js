import React, { useEffect, useState } from "react";
import {Dimensions, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import * as Font from "expo-font";
import Colors from "../colors";

const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0);
    const [selectedSubtypes, setSelectedSubtypes] = useState([]);


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

    if (!fontLoaded) {
        return null;
    }

    const categories = [
        {
            key: "1",
            category: "Hot",
            subtypes: [
                {
                    key: "1",
                    subtype: "wings",
                },
                {
                    key: "2",
                    subtype: "Jimmy strips",
                },
                {
                    key: "3",
                    subtype: "wings",
                },
                {
                    key: "4",
                    subtype: "Jimmy strips",
                },
                {
                    key: "5",
                    subtype: "wings",
                },
                {
                    key: "6",
                    subtype: "Jimmy strips",
                },
                {
                    key: "7",
                    subtype: "wings",
                },
                {
                    key: "8",
                    subtype: "Jimmy strips",
                },
            ],
        },
        {
            key: "2",
            category: "chicken",
            subtypes: [
                {
                    key: "1",
                    subtype: "wings",
                },
                {
                    key: "2",
                    subtype: "chicken curry",
                },
            ],
        },
        {
            key: "3",
            category: "beef",
            subtypes: [
                {
                    key: "1",
                    subtype: "steak",
                },
                {
                    key: "2",
                    subtype: "burger",
                },
            ],
        },
        {
            key: "4",
            category: "fish",
            subtypes: [
                {
                    key: "1",
                    subtype: "salmon",
                },
                {
                    key: "2",
                    subtype: "sushi",
                },
            ],
        },
        {
            key: "5",
            category: "vegan",
            subtypes: [
                {
                    key: "1",
                    subtype: "tofu stir-fry",
                },
                {
                    key: "2",
                    subtype: "vegetable curry",
                },
            ],
        },
        {
            key: "6",
            category: "desserts",
            subtypes: [
                {
                    key: "1",
                    subtype: "cake",
                },
                {
                    key: "2",
                    subtype: "ice cream",
                },
            ],
        },
    ];

    const ListCategories = () => {
        return (
            <View style={{ marginTop: height * 0.15 ,marginHorizontal: 10,}}>
                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.key}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedCategoryIndex(index);
                                setSelectedSubtypes(categories[index].subtypes); // Update selectedSubtypes here
                                console.log(item.key);
                            }}
                        >
                            <View
                                style={[
                                    styles.categoryItem,
                                    {
                                        backgroundColor:
                                            selectedCategoryIndex === index
                                                ? "#FF5733"
                                                : Colors.primary, // Change the colors as needed
                                    },
                                ]}
                            >
                                <Text style={styles.categoryText}>{item.category}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        );
    };

    const ListSubtypes = () => {
        return (
            <FlatList
                style={styles.flatListContainer} // Add this style
                data={selectedSubtypes}
                numColumns={2}
                keyExtractor={(item) => item.key}
                scrollEnabled={true}
                renderItem={({ item }) => (
                    <View style={styles.subtypeItem}>
                        <Text style={styles.subtypeText}>{item.subtype}</Text>
                    </View>
                )}
                columnWrapperStyle={{
                    justifyContent: 'space-between', // Adjust the alignment as needed
                    marginVertical: 10, // Add margin between rows
                    marginHorizontal: 10, // Add margin between columns
                }}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.heading, styles.boldText]}>Home</Text>
            </View>
            <View>
                <ListCategories />
            </View>
            <View>
                <ListSubtypes />
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
    },
    categoryItem: {
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 20,
        marginHorizontal: 10,
        height: height * 0.07,
        width: width * 0.2,
        justifyContent: "center",
        alignItems: "center",


    },
    categoryText: {
        fontFamily: "Urbanist-Regular",
        color: "#FFF",
        fontWeight: "bold"
    },
    subtypeItem: {
        backgroundColor: "white", // Change the colors as needed
        padding: 20,
        marginVertical: 5,
        borderRadius: 10,
        width: width*0.43,
        height: height* 0.25,
        elevation: 5
    },
    subtypeText: {
        fontFamily: "Urbanist-Regular",
        color: "black",
        fontWeight: "bold",
    },
    flatListContainer:{
        height: height*0.74,
        padding: 10
    }
});

export default HomeScreen;
