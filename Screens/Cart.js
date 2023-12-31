import React, {useCallback, useEffect, useState} from "react";
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
import {addNewOrder, CheckCartValidity} from "../consts/orders";
import {collection, doc, getDocs, getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import colors from "../colors";
import {useFocusEffect} from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const CartScreen = ({ navigation, route }) => {
    let popupRef = React.createRef();
    const [cartList, setCartList] = useState([]);
    const [fontLoaded, setFontLoaded] = useState(false);
    //let [cartFoods, cartLoading] = getCart();
    const [cartFoods, setFoodIDs] = useState([]);
    const [cartLoading, setLoading] = useState(true)
    const [allFoods, foodLoading] = foodList();
    const creditProcessor = new CreditProcessor();
  
    const [isAtEndOfList, setIsAtEndOfList] = useState(false);
    const [price, setPrice] = useState(0);
    const deliveryFee = 5
    const [location, setLocation] = useState("not selected");

    const db = getFirestore();
    const auth = getAuth();
    const currentUser = auth.currentUser;
    let userUID;

    if(currentUser){
        userUID = currentUser.uid;
    }
    else{
        console.log("User not logged in!");
    }

    const fetchCart = async () => {
        try {
            const usersCollection = collection(db, 'users');
            const userDoc = doc(usersCollection,userUID);
            const cartCollection = collection(userDoc,'Cart');
            const querySnapshot = await getDocs(cartCollection);

            querySnapshot.forEach((doc) =>{
                const docData = doc.data();
                setFoodIDs(docData.foodIDs);
                setLoading(false);
            })
        } catch (error) {
            console.log('Error getting documents', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCart();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchCart();
        }, [])
    );

    useEffect(() =>{
        if(!foodLoading && !cartLoading ){
            const filteredFoods = allFoods.filter(food => cartFoods.includes(food.id));
            const totalPrice = creditProcessor.calculateTotal(filteredFoods);
            setPrice(totalPrice);
            setCartList(filteredFoods);
        }
    },[cartLoading,foodLoading]);

    useEffect(() => {
        if (route.params && route.params.selectedLocation) {
            setLocation(route.params.selectedLocation);
        }
    }, [route.params]);

    
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
    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const containerHeight = event.nativeEvent.layoutMeasurement.height;

        // Check if the user has reached the end of the list
        if (offsetY + containerHeight >= contentHeight) {
            setIsAtEndOfList(true);
        } else {
            setIsAtEndOfList(false);
        }
    };

    const handleCheckout = async () => {
        // console.log("WIthin");
         if(CheckCartValidity(cartList)){
           //  console.log("it works");
              if(location !== "not selected"){

                  const fee = price + deliveryFee;
                 // console.log(fee);
                  const orderID =  await addNewOrder(cartList,location, fee);
                  if(orderID){
                      await clearCart();
                      setCartList([]);
                      const totalPrice = creditProcessor.calculateTotal([]);
                      setPrice(totalPrice);
                      alert("Order Placed");
                      navigation.navigate("Status" , { orderID});   //navigate to a myOrders page
                  }


              }else{
                  alert("Select a pick up point");
              }
         }else{
             alert("You cannot order from stores in different locations");
         }



    };

    const changeLoc = () => {
        console.log("change loc pressed");
        navigation.navigate("Map");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <Image
                            source={require("../assets/back_thick.png")}
                            style={{width: 24, height: 24}}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.heading, styles.boldText]}>My Cart</Text>
                </View>

                {cartLoading || foodLoading ? (
                    // Display a loading indicator here
                    <ActivityIndicator size="large" color="orange" style={{marginTop: (height / 2) - height * 0.15}}/>
                ) : cartList.length > 0 ? (
                    <ScrollView
                        style={{flex: 1, marginTop: height * 0.1, flexDirection: "column"}}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        <FlatList
                            data={cartList}
                            keyExtractor={(item) => item.key}
                            scrollEnabled={false} // Disable scrolling of the FlatList
                            style={styles.flatListContainer}
                            renderItem={({item, index}) => (
                                <View style={styles.itemContainer}>
                                    <Image
                                        source={{uri: item.imageURL} || require("../assets/jimmys.jpg")}
                                        style={styles.itemImage}
                                    />
                                    <View style={{flexDirection: "column"}}>
                                        <Text style={[styles.boldText, styles.category]}>
                                            {item.name}
                                        </Text>
                                        <Text style={[styles.boldText, styles.subcategory]}>
                                            {item.restaurantName}
                                        </Text>
                                        <Text></Text>
                                        <Text></Text>
                                        <Text style={[styles.boldText, styles.category]}>{item.price}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.rightButton}
                                        onPress={() => {
                                            removeFromCart(item.id);
                                            setCartList(cartList.filter(food => food.id !== item.id));
                                            const totalPrice = creditProcessor.calculateTotal(cartList.filter(food => food.id !== item.id));
                                            setPrice(totalPrice);
                                        }}
                                    >
                                        <Image
                                            source={require("../assets/delete.png")}
                                            style={{width: 24, height: 24}}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                            onEndReached={() => {
                                // You can add additional logic here if needed
                            }}
                            onEndReachedThreshold={0.1}
                        />
                        <View style={{marginTop: 8, backgroundColor: "white", padding: 10, flexDirection: "column"}}>
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.boldTextGrey, styles.alignLeft]}>Subtotal: </Text>
                                {/*add the price variable here*/}
                                <Text style={[styles.boldTextGrey, styles.alignRight]}>R {price}</Text>
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.boldTextGrey, styles.alignLeft]}>Delivery fee: </Text>
                                <Text style={[styles.boldTextGrey, styles.alignRight]}>R {deliveryFee}</Text>
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.boldText17, styles.alignLeft]}>Order total: </Text>
                                <Text style={[styles.boldText17, styles.alignRight]}>R {price + deliveryFee}</Text>
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.boldText17, styles.alignLeft]}>Delivery Location: </Text>
                                <Text style={[styles.boldText17, styles.alignRight]}> {location}</Text>
                            </View>
                        </View>
                        <View style={{alignContent: "center", backgroundColor: "white"}}>
                            <TouchableOpacity
                                style={styles.bottomButton}
                                onPress={() => { changeLoc()}
                                }>
                                <Text style={styles.bottomButtonText}>Select Location</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.bottomButton}
                                onPress={() => { handleCheckout()}
                            }>
                                <Text style={styles.bottomButtonText}>Place Order</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                ) : (
                    // Wrap the "empty cart" image and text in a parent View
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <Image
                            source={require("../assets/sad.png")}
                            style={{ width: 200, height: 200 }}
                        />
                        <Text style={[styles.emptyText]}>Your cart is empty</Text>
                        <TouchableOpacity style={styles.pressable} activeOpacity={0.7} onPress={() => {
                            navigation.navigate("TrackOrders");
                        }}>
                            <Text style={[styles.boldText, styles.pressableText]}> Track orders</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
    pressable:{
        backgroundColor: colors.primary,
        width: '80%',
        padding: 20,
        marginVertical: 40,
        alignItems:'center',
        borderRadius: 12,
    },
    pressableText:{
        color: "#FFF",
        fontSize:16
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

export default CartScreen;
