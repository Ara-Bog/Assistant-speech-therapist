import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Styles from "../styleGlobal.js";
import { MaterialIcons  } from '@expo/vector-icons';

export default class AddingButton extends Component  {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={Styles.float_btAdd_wrap}>
                <TouchableOpacity style={Styles.float_btAdd} onPress={() => this.props.execute()}>
                    <MaterialIcons  name="add" size={30} color="#554AF0" />
                </TouchableOpacity>
            </View>
        )
    }
}