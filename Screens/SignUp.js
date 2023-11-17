import {
    Dimensions,
    SafeAreaView,
    Text,
    TextInput,
    View,
    StyleSheet,
    Button,
    Pressable,
    TouchableOpacity, TouchableWithoutFeedback, Image
} from "react-native";

const { width, height } = Dimensions.get('window');
import * as Font from "expo-font";
import React, {useEffect, useState, useContext } from "react";
import colors from "../colors";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faLock, faUserGraduate, faAt} from '@fortawesome/free-solid-svg-icons';
import { } from "../firebase";
import { getAuth,   createUserWithEmailAndPassword, onAuthStateChanged  } from "firebase/auth";
import { collection, addDoc, getFirestore, doc, setDoc } from 'firebase/firestore';
import {PFPpopup} from "../PopUps/PFPpopup";
import {FontAwesome5} from "@expo/vector-icons";


import {widthHeight} from "twrnc/dist/esm/resolve/width-height";


const SignUpScreen = ({navigation}) =>{
    const [fontLoaded, setFontLoaded] = useState(false);
    const [username, setUsername] = useState('');
    const [studentNumber, setStudentNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = getAuth();
    const db = getFirestore();

    const handleUsernameChange = (text) => {
        setUsername(text);
    };

    const handleStudentNumberChange = (text) => {
        setStudentNumber(text);
    };

    const handleEmailChange = (text) => {
        setEmail(text);
    };``

    const handlePasswordChange = (text) => {
        setPassword(text);
    };

    //firebase signup method
    const onSignUpPressed = async () => {
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;
            // get the userId so it can be used to match the the user document in firestore
            const userUID = user.uid;
            //array of data that will be added fo each user
            const userData = {
                username: username,
                studentNum: studentNumber,
                email: email,
                credits: 0,
                rating: 0,
                profileImageUrl: '',
                deliveryStatus: false,
            };

            const docRef = doc(db, 'users', userUID);
            //Set the document data with the userId so it matches the one in authentication
            await setDoc(docRef, userData);

            // Create the "Ratings" subcollection inside the user's document
            const ratingsCollectionRef = collection(docRef,'Ratings');
            // Add a sample rating document
            await addDoc(ratingsCollectionRef, {
                rating: 0, // Sample rating value
                comment: 'Great user!', // Sample comment
                numOfRatings: 0,
                //Any other category required in the ratings can be added here with a sample
            });

            // Create the "Ratings" subcollection inside the user's document
            const favFoodCollectionRef = collection(docRef, 'Favourites');
            // Add a sample fav document
            await addDoc(favFoodCollectionRef, {
                foodIDs:[]
            });

            // Create the "Cart" subcollection inside the user's document
            const cartCollectionRef = collection(docRef,'Cart');
            await addDoc(cartCollectionRef, {
                foodIDs: [] 
            });

        } catch (error) {
            alert(error.message);
        }
    }


    useEffect(() => {
        async function loadFont() {
            await Font.loadAsync({
                'Urbanist-Regular': require('../Fonts/Urbanist-Regular.ttf'),
                'Urbanist-Bold': require('../Fonts/Urbanist-Bold.ttf'),
            });
            setFontLoaded(true);
        }
        loadFont();

        //signup and auth navigate to home on signup, login and as long as user is not changed
        const unsubscribe =  onAuthStateChanged(auth, (user) => {
            if(user){
                navigation.navigate("Home")
            }
        })
        return unsubscribe;
    }, []);

    if (!fontLoaded) {
        return null;
    }


    let popupRef = React.createRef()

    const handleAdd = () => {
        // Implement your logic here, e.g., navigate to a new screen
        popupRef.show();
        console.log('Add button pressed');
    };

    const onClosePopup = () => {
        popupRef.close()
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.container2}>
                <View style={{marginLeft: width*0.4, marginTop: height*0.1}}>
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
            <View style={styles.header}>
                <Text style={[styles.heading, styles.boldText]}>Sign Up</Text>
                <Text style={[styles.boldText, styles.subHeadings]}>Username</Text>
                <View style={styles.combo}>
                    <FontAwesomeIcon icon={faUser} style={styles.icon} />
                    <TextInput
                        onChangeText={handleUsernameChange}
                        value={username}
                        style={[styles.regularText, styles.textBoxes]}
                        placeholder="Username"
                    />
                </View>

                <Text style={[styles.boldText, styles.subHeadings]}>Student Number</Text>
                <View style={styles.combo}>
                    <FontAwesomeIcon icon={faUserGraduate} style={styles.icon} />
                    <TextInput
                        onChangeText={handleStudentNumberChange}
                        value={studentNumber}
                        style={[styles.regularText, styles.textBoxes]}
                        placeholder="Student Number"
                    />
                </View>
                <Text style={[styles.boldText, styles.subHeadings]}>Email</Text>
                <View style={styles.combo}>
                    <FontAwesomeIcon icon={faAt} style={styles.icon} />
                    <TextInput
                        onChangeText={handleEmailChange}
                        value={email}
                        style={[styles.regularText, styles.textBoxes]}
                        placeholder="Email"
                    />
                </View>
                <Text style={[styles.boldText, styles.subHeadings]}>Password</Text>
                <View style={styles.combo}>
                    <FontAwesomeIcon icon={faLock} style={styles.icon} />
                    <TextInput
                        onChangeText={handlePasswordChange}
                        value={password}
                        style={[styles.regularText, styles.textBoxes]}
                        placeholder="Password"
                        secureTextEntry={true}

                    />
                </View>
                <TouchableOpacity style={styles.pressable} activeOpacity={0.7} onPress={() => onSignUpPressed()}>
                    <Text style={[styles.boldText, styles.pressableText]}> SIGN UP </Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                    <Text style={styles.regularText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}  activeOpacity={0.7}>
                        <Text style={[styles.boldText, {color: 'red', textDecorationLine: 'underline'}]}> Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>)
}

const styles = StyleSheet.create({
    container2: {
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
    container: {
        flex: 1,
        backgroundColor: "#F2F5F9",
    },
    header: {
        marginTop: height * 0.18,
        flexDirection: 'column',
        alignItems: 'left',
        marginHorizontal: width * 0.05,
        position:"absolute"
    },
    regularText: {
        fontFamily: 'Urbanist-Regular',
    },
    boldText: {
        fontFamily: 'Urbanist-Bold',
    },
    heading: {
        paddingBottom: height*0.03,
        fontSize: 36,
    },
    subHeadings:{
        fontSize:16,
        marginTop: 0.03*height,
        marginBottom: 0.006*height,
    },
    input:{
        display: "flex",
        flexDirection: "column",
        alignItems:"flex-start",
        backgroundColor:"white",
        padding:16,
        width:0.9*width,
        borderRadius: 12,
        // fontFamily:
    },
    pressable:{
        backgroundColor: colors.primary,
        width: '100%',
        padding: 20,
        marginVertical: 40,
        alignItems:'center',
        borderRadius: 12,
    },
    pressableText:{
        color: "#FFF",
        fontSize:16
    },
    bottomTextLeft:{
        fontSize:14,
        color: colors.gray,
        textAlign: "center",
    },
    bottomTextRigth:{
        fontSize:14,
        color: "#FA4D5E",
    },
    icon: {
        position: "relative",
        alignItems: "flex-start",
        marginLeft: 16,
        marginTop: 16
    },
    textBoxes:{
        display: "flex",
        alignItems:"flex-start",
        backgroundColor:"white",
        padding:16,
        width:0.8*width,
        borderRadius: 12,
    },
    combo:{
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 12,
    },

})

export default SignUpScreen;

