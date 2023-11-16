import {
    Modal,
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TouchableWithoutFeedback, Linking
} from "react-native";
import React, {useEffect, useState, useRef} from 'react'
import {Ionicons} from "@expo/vector-icons";
import colors from "../colors";
import {completeOrder} from "../consts/orders";
const deviceHeight = Dimensions.get("window").height
//import {Camera, useCameraDevices} from "react-native-vision-camera";

export class PFPpopup extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    show = () => {
        this.setState({show: true})
    }

    close = () => {
        this.setState({show: false})
    }

    renderOutsideTouchable(onTouch){
        const view = <View style={{flex: 1, width: '100%'}}/>
        if (!onTouch) return view

        return(
            <TouchableWithoutFeedback onPress={onTouch} style={{flex: 1, width: '100%'}}>
                {view}
            </TouchableWithoutFeedback>
        )
    }

    navToGrav = () => {
        const gravitarLink = 'https://gravatar.com/';

        Linking.openURL(gravitarLink).catch((err) => console.error('An error occurred', err));

    }

    renderTitle =  () => {
        const {title} =this.props
        return(
            <View>
                <Text style={{
                    color: '#182E44',
                    fontSize: 20,
                    fontWeight: '500',
                    margin: 15,
                }}>
                    {title}
                </Text>
            </View>
        )
    }



    renderContent = () => {
        return (
            <View style={styles.buttonContainer}>
                <View style={styles.buttonWithText}>
                    <TouchableOpacity style={styles.circularButton} onPress={this.navToGrav}>
                        <Ionicons name="image" size={24} color="white" style={styles.icon}/>
                    </TouchableOpacity>
                    <Text style={styles.buttonText}>
                        Join Gravitar
                    </Text>
                </View>
            </View>
        )
    }

    handleCameraPress = () => {

    }


    render() {
        let {show} = this.state
        const {onTouchOutside} = this.props

        return(
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={show}
                onRequestClose={this.close}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: "#000000AA",
                    justifyContent: 'flex-end'
                }}>
                    {this.renderOutsideTouchable(onTouchOutside)}
                    <View style={{
                        backgroundColor: '#FFF',
                        width: '100%',
                        borderTopLeftRadius:10,
                        borderTopRightRadius:10,
                        paddingHorizontal: 10,
                        height: deviceHeight*0.18
                    }}>
                        {this.renderTitle()}
                        {this.renderContent()}
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20, // Adjust as needed for spacing
    },
    buttonWithText: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    circularButton: {
        width: 60, // Adjust as needed for button size
        height: 60, // Adjust as needed for button size
        borderRadius: 30, // Make it half of width/height for a circle
        backgroundColor: colors.primary, // Set the desired button color
        justifyContent: 'flex-start',
        alignItems: 'center',
        elevation: 1
    },
    buttonText: {
        marginTop: 5, // Adjust as needed for spacing between button and text
        fontSize: 18, // Set the desired font size for the text
        marginLeft: 20,
        fontWeight: 'bold'
    },
    icon: {
        marginTop: 17
    }
    // Add more styles for your buttons as needed
});
