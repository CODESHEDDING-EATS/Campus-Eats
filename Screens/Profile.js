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
    Button,
    ScrollView,
    TouchableWithoutFeedback
} from "react-native";
import * as Font from "expo-font";
import { FontAwesome5 } from '@expo/vector-icons'; // Import FontAwesome5 for the plus icon
import { Pressable } from 'react-native';
import Colors from "../colors";
import colors from "../colors";
import COLORS from "../colors";
import {PFPpopup} from "../PopUps/PFPpopup";

const { width, height } = Dimensions.get("window");

const ProfileScreen = ({navigation}) => {
    let popupRef = React.createRef()
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

    let student_name = "Panda";

    const handleAdd = () => {
        // Implement your logic here, e.g., navigate to a new screen
        popupRef.show();
        console.log('Add button pressed');
    };

    const onClosePopup = () => {
        popupRef.close()
    }

    return (
        <>
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <View>
                    <View style={styles.header}>
                        <Text style={styles.heading}>student_name</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.addpfp}>
                        <TouchableWithoutFeedback onPress={handleAdd}>
                            <FontAwesome5 name="plus" size={24} color="white" />
                        </TouchableWithoutFeedback>
                        <PFPpopup
                            title="Profile Picture"
                            ref={(target) => popupRef = target}
                            onTouchOutside={onClosePopup}
                        />
                    </View>

                    <View style={styles.profileImage}>
                        <Image source={require("../assets/avatar.png")} style={styles.image} resizeMode="center"></Image>
                    </View>

                </View>
            </View>


        </SafeAreaView>
        </>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F5F9",
        alignItems: "center"
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 200,
        overflow: "hidden"
    },
    image: {
        //marginTop: height * 0.002,
        flex: 1,
        height: undefined,
        width: undefined
    },
    addpfp: {
        backgroundColor: colors.primary,
        position: "absolute", // Position the plus button absolutely
        bottom: 30, // Adjust the bottom value as needed
        right: 30, // Adjust the right value as needed
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1, // Ensure the button appears on top of the image
    },

    heading: {
        fontFamily: "Urbanist-Bold",
        fontSize: 26,
    },

    header: {
        marginTop: height * 0.07,
        flexDirection: "column",
        marginHorizontal: width * 0.05,
        position: "relative",
    },
    add: {
        backgroundColor: "#41444B",
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center"
    },
});

export default ProfileScreen;
