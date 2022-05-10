import React, { Component } from 'react';
import { View, Animated, StyleSheet, Image } from 'react-native';
import Styles from "../styleGlobal.js";



export default class LoadingAnimation extends Component  {
    constructor(props) {
        super(props);
        this.state = {
          startValue: new Animated.Value(-30),
          endValue: 30,
        };
    }

    componentDidMount() {
      Animated.loop(
        Animated.spring(this.state.startValue, {
          toValue: this.state.endValue,
          useNativeDriver: true,
          friction: 7
        }),
        {iterations: -1},
      ).start();
    }

    render() {
        var persons = []

        for (let i = 0; i < 4; i++) {
            persons.push(
                <Image key={i} style={Styles.iconLoadImagePerson} source={require('../assets/person.png')}/>
            )
        }

        return (
            <View style={Styles.iconLoadContainer}>
                <View style={Styles.iconLoadWrap}>
                    <Image style={{width:115, height:120}} source={require('../assets/borderIcon.png')}/>
                    <Animated.View
                    style={[
                        {
                            flexDirection:'row',
                            position:'absolute',
                            overflow: 'hidden',
                            transform: [
                                {
                                translateX: this.state.startValue,
                                },
                            ],
                        },
                    ]}
                    >
                        {persons}
                    </Animated.View>
                </View>
            </View>
        );
    };
}
