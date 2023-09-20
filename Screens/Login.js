import React, { useEffect, useState } from 'react';
import {SafeAreaView, Text, TextInput, View, StyleSheet, Dimensions, Pressable, TouchableOpacity} from 'react-native';
import * as Font from 'expo-font';
import colors from "../colors";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faLock, faAt} from '@fortawesome/free-solid-svg-icons';
import { } from "../firebase";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";


const { width, height } = Dimensions.get('window');

const LoginScreen = ({navigation}) => {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = getAuth();

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

    const handleEmailChange = (text) => {
        setEmail(text);
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
    };

    const onSignInPressed = () => {

            signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                // can use the variable user to get uid  and use it for accessing docs/info in firestore
                navigation.navigate(('Home')); // the unsubscribe was not working for login so added navigation
            }).catch(error => alert(error.message))

    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.heading, styles.bold_text]}>Login</Text>
                <View style={{marginTop: 40}}>
                    <Text style={[styles.bold_text, {marginTop: 0.03*height,fontSize: 16, marginBottom: 0.006*height}]}>Email</Text>
                    <View style={styles.input}>
                        <FontAwesomeIcon icon={faUser} style={styles.icon} />
                        <TextInput
                            onChangeText={handleEmailChange}
                            value={email}
                            style={[styles.reg_text]}
                            placeholder="Email"
                        />
                    </View>
                    <Text style={[styles.bold_text, {marginTop: 0.03*height, fontSize: 16, marginBottom: 0.006*height}]}>Password</Text>
                    <View style={styles.input}>
                        <FontAwesomeIcon icon={faLock} style={styles.icon} />
                        <TextInput
                            onChangeText={handlePasswordChange}
                            value={password}
                            placeholder="Password"
                            style={[styles.reg_text]}
                            secureTextEntry={true}
                        />
                    </View>
                    <TouchableOpacity activeOpacity={0.7} style={styles.btncontainer} onPress={() => onSignInPressed()}>
                        <Text style={[styles.text, styles.bold_text]}> SIGN IN </Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                    <Text style={styles.reg_text}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')} activeOpacity={0.7}>
                        <Text style={[styles.bold_text, {color: 'red', textDecorationLine: 'underline'}]}> Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        marginTop: height * 0.18,
        flexDirection: 'column', // Changed flexDirection to 'column'
        marginHorizontal: width * 0.05,
        position: 'absolute'
    },
    container:{
        flex: 1,
        backgroundColor: "#F2F5F9",
    },
    heading: {
        fontSize: 36,
    },
    bold_text: {
        fontFamily: 'Urbanist-Bold',
    },
    reg_text: {
        fontFamily: 'Urbanist-Regular',
    },
    input: {
        display: "flex",
        flexDirection: "row",
        alignItems:"flex-start",
        backgroundColor:"white",
        padding:16,
        width:0.9*width,
        borderRadius: 12,
        // elevation: 5,
    },
    btncontainer : {
        backgroundColor: colors.primary,
        width: '100%',
        padding: 20,
        marginVertical: 40,
        alignItems:'center',
        borderRadius: 12,
    },
    text:{
        color:'white',
    },
    icon: {
        marginRight: 10,
        marginVertical: height*0.006,
        position: "relative"
    },
});

export default LoginScreen;
