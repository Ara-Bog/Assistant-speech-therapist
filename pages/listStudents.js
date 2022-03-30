import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Styles from "../styleGlobal.js";
import ButtonAdd from '../components/buttonAdd'
import EmptyData from '../components/emptyData'

export default class ListStudentsWrap extends Component  {
    constructor(props) {
        super(props);
        this.state = {dataStudents:[]}
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', () => this.getData());
    }

    getData() {
        db.transaction((tx) => {
            tx.executeSql("SELECT st.ID as ID, st.Group_name as 'Group', dg.Name as Diagnos, st.Name || ' ' || st.Surname || ' ' || COALESCE(st.Midname, '') as Name FROM Students as st INNER JOIN Diagnosis as dg ON st.diagnos_id = dg.id", [], 
                (_, {rows:{_array}}) => this.setState({dataStudents : _array}), 
                (_, err) => console.log('error getData - ', err)
            )
        });
    }

    render() {
        return (
            <View style={Styles.container}>
                {this.state.dataStudents.length != 0 ?
                <ScrollView style={Styles.containerCard}>
                    {this.state.dataStudents.map((item) => 
                        <TouchableOpacity style={Styles.cardDays} key={item.ID} onPress={() => this.props.navigation.navigate('Student', {type: 'view', id:item.ID})}>
                            <View style={Styles.cardDaysRow}>
                                <Text style={Styles.cardDaysRowTitle}>{item.Name}</Text>
                            </View>
                            <View style={Styles.cardDaysRowLine}></View>
                            <View style={Styles.cardDaysRow}>
                                <Text style={Styles.cardDaysRowText}>{item.Group}</Text>
                                <Text style={Styles.cardDaysRowText}>{item.Diagnos}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    <View style={Styles.crutch}></View>
                </ScrollView>
                :
                <EmptyData typeField={'s'}/>
                }
                <ButtonAdd execute={()=> this.props.navigation.navigate('Student', {type: 'add', id:undefined})}/>           
            </View>
        );
    };
}
