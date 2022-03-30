import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Styles from "../styleGlobal.js";
import ButtonAdd from '../components/buttonAdd'
import EmptyData from '../components/emptyData'

export default class ListStudentsWrap extends Component  {
    constructor(props) {
        super(props);
        this.state = {dataGroups:[]}
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', () => this.getData());
    }

    getData() {
        db.transaction((tx) => {
            tx.executeSql("SELECT gr.ID as ID, gr.Name as 'Name', dg.Name as Diagnos, ct.Name as Categori FROM Groups as gr INNER JOIN Diagnosis as dg ON gr.diagnos_id = dg.id INNER JOIN Categories as ct ON gr.Categori_id = ct.id", 
                [], 
                (_, {rows:{_array}}) => this.setState({dataGroups : _array}), 
                (_, err) => console.log('error getData - ', err)
            )
        });
    }

    render() {
        return (
            <View style={Styles.container}>
                {this.state.dataGroups.length != 0 ?
                <ScrollView style={Styles.containerCard}>
                    {this.state.dataGroups.map((item) => 
                        <TouchableOpacity style={Styles.cardDays} key={item.ID} onPress={() => this.props.navigation.navigate('Group', {type: 'view', id:item.ID})}>
                            <View style={Styles.cardDaysRow}>
                                <Text style={Styles.cardDaysRowTitle}>{item.Name}</Text>
                            </View>
                            <View style={Styles.cardDaysRowLine}></View>
                            <View style={Styles.cardDaysRow}>
                                <Text style={Styles.cardDaysRowText}>{item.Diagnos}</Text>
                                <Text style={Styles.cardDaysRowText}>{item.Categori}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    <View style={Styles.crutch}></View>
                </ScrollView>
                :
                <EmptyData typeField={'g'}/>
                }
                <ButtonAdd execute={()=> this.props.navigation.navigate('Group', {type: 'add', id:undefined})}/>           
            </View>
        );
    };
}
