import React, { useEffect, useState } from "react";
import {Dimensions, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, Button} from "react-native";
import * as Font from "expo-font";
import Colors from "../colors";
import restaurants from '../consts/dummyRestaurants'
import colors from "../colors";

const { width, height } = Dimensions.get("window");

const FoodScreen = () => {
    const [fontLoaded, setFontLoaded] = useState(false);



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

    let description = "This is a yummy and healthy sauce made by Panda himself. Contains a lot of calories, more than you need."

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.heading, styles.heading]}>Panda's Sauce</Text>
            </View>
            <View style={{ marginTop: height * 0.15 ,marginHorizontal: 10, height: "24%"}}>
                <Image  source={require('../assets/jimmys.jpg')} style={styles.foodImage} />
                <Text style={styles.boldText}>Price: $$$</Text>
                <Text style={styles.subDescr}>Description: {description}"</Text>
                <TouchableOpacity style={styles.addToCart}
                    title="Add to cart"
                    onPress={()=> console.log("Added item to cart")}>
                    <Text style={styles.boldText}>Add to cart</Text>
                 </TouchableOpacity>
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

    subDescr: {
        //fontFamily: "Urbanist-Bold",
        fontSize: 15,
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

    foodImage: {
        position:"relative",
        width: "100%",
        height: "600%",
        marginBottom: 10,
        borderRadius: 10,

    },

    addToCart: {
        position:"relative",
        backgroundColor: colors.primary,
        width: "100%",
        padding: 20,
        marginVertical: 6,
        alignItems:'center',
        borderRadius: 12,
    },

    flatListContainer:{
        padding: 10
    }
});

export default FoodScreen;
