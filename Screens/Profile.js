import React, { useEffect, useState } from "react";
import Toggle from "react-native-toggle-element";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Text, View, Image, TouchableOpacity, SafeAreaView, StyleSheet } from "react-native";
import { Font } from "expo";
import { FontAwesome5 } from '@expo/vector-icons';
import { PFPpopup } from "../PopUps/PFPpopup";
import Colors from "../colors";
import { signOut } from "firebase/auth";
import { userslist } from "../consts/foodData";

const ProfileScreen = ({ navigation }) => {
    const [fontLoaded, setFontLoaded] = useState(false);
    
    const [toggleValue, setToggleValue] = useState(false);
    let popupRef = React.createRef();

    const handleAdd = () => {
        popupRef.show();
        console.log('Add button pressed');
    };

    const onClosePopup = () => {
        popupRef.close();
    };

    const { users, isLoading } = userslist();

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
        <SafeAreaView style={styles.safecontainer}>
            <View style={styles.container}>
                <View>
                    <View style={styles.header}>
                        <Text style={styles.heading}>{users.name}</Text>
                        {/* Assuming you want to display the name of the first user in the list */}
                    </View>
                </View>
                <View>
                    <View style={styles.addpfp}>
                        <TouchableOpacity onPress={handleAdd}>
                            <FontAwesome5 name="plus" size={24} color="white" />
                        </TouchableOpacity>
                        <PFPpopup
                            title="Profile Picture"
                            ref={(target) => (popupRef = target)}
                            onTouchOutside={onClosePopup}
                        />
                    </View>
                    <View style={styles.profileImage}>
                        <Image
                            source={{ uri: users.profile }} // Assuming you want to display the profile image of the first user
                            style={styles.image}
                            resizeMode="center"
                        />
                    </View>
                </View>
            </View>

            <View style={styles.updateSection}>
                <View style={styles.smallContainer}>
                    <FontAwesomeIcon icon={faUser} style={styles.icon} />
                    <Text style={styles.textInfo}>
                        Student Number: {users.number}
                    </Text>
                </View>

                <View style={styles.smallContainer}>
                    <FontAwesomeIcon icon={faEnvelope} style={styles.icon} />
                    <Text style={styles.textInfo}>
                        {users.email}
                    </Text>
                </View>

                <View style={styles.smallContainer}>
                    <FontAwesomeIcon icon={faWallet} style={styles.icon} />
                    <Text style={styles.textInfo}>
                        Credit Wallet: {users.credits} Kudu
                    </Text>
                </View>

                <TouchableOpacity style={styles.smallContainer}>
                    <FontAwesomeIcon icon={faUserEdit} style={styles.icon} />
                    <Text style={styles.textInfo}>
                        Edit profile
                    </Text>
                </TouchableOpacity>

                {toggleValue && (
                    <View style={styles.smallContainer}>
                        <FontAwesomeIcon icon={faStar} style={styles.icon} />
                        <Text style={styles.textInfo}>
                            Ratings: {users.rating}
                        </Text>
                    </View>
                )}
            </View>
            <View style={{ height: 20 }} />

            <View style={{ flexDirection: 'row', width: '90%', padding: 20, alignItems: "center" }}>
                <Toggle
                    thumbButton={{
                        activeBackgroundColor: "green",
                        inActiveBackgroundColor: "grey"
                    }}
                    trackBarStyle={{
                        borderColor: 'green',
                        backgroundColor: "#4DBA0F",
                    }}

                    trackBar={{
                        radius: 10,
                        borderWidth: 2
                    }}
                    value={toggleValue}
                    onPress={(newState) => setToggleValue(newState)}
                    leftTitle="Off"
                    rightTitle="On"
                />
                <Text style={styles.text}> Delivery Status</Text>
            </View>

            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <TouchableOpacity activeOpacity={0.7} style={styles.btncontainer} onPress={() => signOut()}>
                    <Text>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ProfileScreen;
