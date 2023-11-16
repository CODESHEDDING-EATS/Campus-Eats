import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    TouchableWithoutFeedback, FlatList, Button, ScrollView
} from "react-native";
import * as Font from "expo-font";
import { FontAwesome5 } from '@expo/vector-icons';
import { PFPpopup } from "../PopUps/PFPpopup";
import Colors from "../colors";
import foodCategories from "../consts/foodCategories";
import { foodList } from "../consts/foodData";
import {clearCart, getCart, removeFromCart} from "../consts/cartData";
import { CreditProcessor } from "../consts/creditProcessor";
import {addNewOrder, getAllOrders, getCurrentUsersOrders} from "../consts/orders";
import LottieView from "lottie-react-native";
import StarRating from 'react-native-star-rating-widget';
import {collection, doc, getFirestore, onSnapshot} from "firebase/firestore";
import md5 from "md5";

const { width, height } = Dimensions.get("window");

const StatusScreen = ({ navigation, route }) => {
    const [fontLoaded, setFontLoaded] = useState(false);

    // Delivery process states
    const [findingDeliveryPerson, setFindingDeliveryPerson] = useState(true);
    const [deliveryAccepted, setDeliveryAccepted] = useState(false);
    const [deliveryArrived, setDeliveryArrived] = useState(false);
    const [rating, setRating] = useState(2.5);
    const orderID = route.params.orderID;
    console.log("asdf")
    console.log(orderID)
    const [currOrder, setOrder] = useState([]);
    const [allOrders, isOrdersLoading ] = getAllOrders();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "orders", orderID), (docSnapshot) => {
            console.log("XXXXXXXX  Received doc snapshot:", docSnapshot.data());
            setOrder(docSnapshot.data());
        }, (err) => {
            console.log("Encountered error:", err);
        });

        return () => {
            // Unsubscribe when component unmounts
            unsubscribe();
        };
    }, [orderID, db]);


    useEffect(() => {
            if (!isOrdersLoading) {
                console.log("ALL")
                console.log(allOrders)
                const orderWithId = allOrders.find(order => order.id === orderID);
                setOrder(orderWithId)
            }
        // Cleanup the interval when the component unmounts or when dependencies change
    }, [allOrders]);


    useEffect(() => {
            if (currOrder.status === "Accepted") {

                setDeliveryAccepted(true);
                setFindingDeliveryPerson(false);
            }
            if (currOrder.status === "Completed") {
                setDeliveryArrived(true);
                setDeliveryAccepted(false);
            }
    }, [currOrder]);

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



    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            navigation.navigate("Home");
                        }}
                    >
                        <Image
                            source={require("../assets/back_thick.png")}
                            style={{ width: 24, height: 24 }}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.heading, styles.boldText]}>Status</Text>
                </View>

                {/* Display delivery process status */}
                <View style={{flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 100}}>
                    {findingDeliveryPerson && (

                        <View>
                            <LottieView
                                source={require('../animations/searching.json')}
                                autoPlay
                                loop
                                style={styles.animation}
                            />
                            <Text style={[styles.boldText17]}>  Finding Delivery Person...</Text>
                        </View>
                    )}
                    {deliveryAccepted && (
                        <View>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={[styles.boldText17, { fontSize: 20 }]}>{currOrder.delivererName} is on the way</Text>
                                <View style={styles.animationContainer}>
                                    <LottieView
                                        source={require('../animations/dots.json')}
                                        autoPlay
                                        loop
                                        style={styles.animation2}
                                    />
                                </View>
                            </View>
                            <View style={styles.card}>
                                <View style={styles.profileImage}>
                                    {/*<Image*/}
                                    {/*    source={{uri: `https://www.gravatar.com/avatar/${md5(currOrder.orderersEmail)}?s=200`}}*/}
                                    {/*    style={styles.cardImage}*/}
                                    {/*    resizeMode= "cover"*/}

                                    />
                                </View>
                                <View>
                                    <Text style={[styles.boldText17, { fontSize: 20 }]}>{currOrder.delivererName}</Text>
                                </View>
                                <View style={{ pointerEvents: 'none', marginTop: 30}}>
                                    <StarRating
                                        rating={rating}
                                        onChange={setRating}
                                    />
                                </View>
                                <View style={{paddingTop: 20}}>
                                    <Text style={[styles.boldText17, { fontSize: 20 }]}>Confirmation Code: {currOrder.pin}</Text>
                                    {/*add randomised code*/}
                                </View>
                            </View>

                        </View>
                    )}
                    {deliveryArrived && (
                        <View style={styles.card}>
                            <View>
                                <LottieView
                                    source={require('../animations/tick.json')}
                                    autoPlay
                                    loop={false}
                                    style={styles.animation}
                                />
                            </View>
                            <Text style={[styles.boldText17, { fontSize: 20 , padding: 10 }]}>Order Complete!</Text>
                            <Text style={styles.boldText17}>Please rate {currOrder.delivererName}</Text>
                            <View style={{ marginTop: 10}}>
                                <StarRating
                                    rating={rating}
                                    onChange={setRating}
                                />
                            </View>
                        </View>
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
    card: {
        height: 370,
        marginTop: 5,
        paddingTop: 30,
        width: width-30,
        elevation: 8,
        borderRadius: 10,
        backgroundColor: "#FFF",
        alignItems: 'center',
        flexDirection: "column"
    },
    cardImage: {
        flex: 1,
        height: undefined,
        width: undefined
    },
    profileImage:{
        marginBottom: 40,
        width: 130,
        height: 130,
        borderRadius: 200,
        overflow: "hidden"
    },
    animationContainer:{
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
        height: 20,
        width: 48,
        overflow: "hidden",
    },
    contentContainer: {
        flex: 1,
        marginTop: height * 0.055,
    },
    containeranim: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    animation: {
        width: 200,
        height: 200,
    },
    animation2: {
        width: 100,
        height: 100,
        marginRight: 20,
    },
    header: {
        flexDirection: "row",
        alignItems:'center',
        paddingTop: height * 0.02,
        marginHorizontal: width * 0.05,
        position: "absolute",
    },
    boldText: {
        fontFamily: "Urbanist-Bold",
    },
    boldText17: {
        fontFamily: "Urbanist-Bold",
        fontSize: 17,
    },
    emptyText: {
        fontFamily: "Urbanist-Bold",
        fontSize: 19,
        marginTop: 20
    },
    boldTextGrey: {
        fontFamily: "Urbanist-Bold",
        fontSize: 17,
        color: "grey"
    },
    alignLeft: {
        flex: 1,
        textAlign: "left",
        paddingLeft: 5
    },
    alignRight: {
        flex: 1,
        textAlign: "right",
        paddingRight: 5

    },
    itemContainer: {
        backgroundColor: "white",
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        flexDirection: "row",

    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 60,
    },
    flatListContainer:{
        flex:1,
        paddingLeft: 10,
        paddingRight: 10,
    },
    flatContainer:{
        flex: 1,
        marginTop: height * 0.7,
    },
    itemImage: {
        position:"relative",
        width: "25%",
        height: 85,
        marginBottom: 10,
        borderRadius: 10,

    },
    backButton: {
        marginRight: 10,
    },
    backButtonText: {
        fontFamily: 'Urbanist-Regular',
        fontSize: 16,
        color: '#333',
    },
    category: {
        paddingLeft: 10,
        fontSize:18
    },
    subcategory: {
        paddingLeft: 10,
        fontSize:12,
        color: "gray"
    },
    rightButton: {
        marginLeft: "auto",
        marginRight: 10
    },
    bottomButton: {
        backgroundColor: "orange",
        width: "95%",
        alignItems: "center",
        justifyContent: "center",
        height: 60,
        borderRadius: 10,
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 20, // Add margin from the bottom
    },
    bottomButtonText: {
        color: "white",
        fontSize: 18,
        fontFamily: "Urbanist-Bold",
    },
});

export default StatusScreen;
