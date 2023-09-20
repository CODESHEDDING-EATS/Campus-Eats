import React, {useEffect} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';

// App startup animation

export default function SplashScreen({navigation}) {
    useEffect(() => {
        const timeout = setTimeout(() => {
            navigation.navigate('Login');
        }, 3000);

        return () => clearTimeout(timeout);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <LottieView
                source={require('../animations/taco.json')}
                autoPlay
                loop
                style={styles.animation}
            />
            <Text>CODESHEDDING</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    animation: {
        width: 200,
        height: 200,
    },
});
