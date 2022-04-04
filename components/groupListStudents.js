import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Styles from "../styleGlobal.js";
import { Feather } from '@expo/vector-icons';

export default class GroupListWrap extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            currentStudents: this.props.currentStudents.slice(),
            possibleStudents: []
        }
    }

    getPossibleStudents(){
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT ID, Surname || ' ' || Name || ' ' || COALESCE(Midname, '') as Name FROM Students WHERE Subgroup_id IS NULL",
                [],
                (_, {rows:{_array}}) => this.setState({possibleStudents: _array}),
                (_, err) => console.log('error - ', err)
            );
        })
    }

    changedList(ID_onList, adding){
        let addingList = []
        let removingList = []
        if (adding){
            addingList = this.state.currentStudents
            removingList = this.state.possibleStudents
        } else {
            removingList = this.state.currentStudents
            addingList = this.state.possibleStudents
        }
        let changedItem = removingList[ID_onList]
        addingList.push(changedItem)
        removingList.splice(ID_onList, 1)
        this.props.onCallBack(this.state.currentStudents)
    }

    shouldComponentUpdate(nextProps, nextState){
        const prevState = this.state
        prevState.currentStudents != nextProps.currentStudents?(this.setState({currentStudents:nextProps.currentStudents}), this.getPossibleStudents()):null
        return true
    }

    render() {
        return(
            <>
            <View>
                <Text style={Styles.cardStudentTitle}>{this.props.editing ? 'Выбранные ученики': 'Список учеников'}</Text>
                <View style={Styles.cardGroupBox}>
                    {this.state.currentStudents.length != 0
                    ?
                    this.state.currentStudents.map((item, indexItem) => 
                        <View style={Styles.cardGroupBoxRow} key={item.ID}>
                            <Text style={Styles.cardGroupBoxRowText}>{item.Name}</Text>
                            {this.props.editing
                            ?
                                <TouchableOpacity
                                style={{...Styles.cardGroupBoxRowBtn, backgroundColor: 'rgba(220,95,90,0.1)'}}
                                onPress={() => this.changedList(indexItem, false)}
                                >
                                    <Feather name="minus" size={16} color="#DC5F5A" />
                                </TouchableOpacity>
                            :null}
                        </View>
                    )
                    :
                    <Text style={{...Styles.cardStudentValue_empty, marginBottom: 25, marginLeft: 0, width: '100%'}}>Список пуст</Text>
                    }
                </View>
            </View>
            {this.props.editing
            ?
                <View>
                    <Text style={Styles.cardStudentTitle}>Ученики без группы</Text>
                    <View style={Styles.cardGroupBox}>
                        {this.state.possibleStudents.length != 0
                        ?
                        this.state.possibleStudents.map((item, indexItem) => 
                            <View style={Styles.cardGroupBoxRow} key={item.ID}>
                                <Text style={Styles.cardGroupBoxRowText}>{item.Name}</Text>
                                {this.props.editing
                                ?
                                    <TouchableOpacity
                                    style={{...Styles.cardGroupBoxRowBtn, backgroundColor: '#EEEDFE'}}
                                    onPress={() => this.changedList(indexItem, true)}
                                    >
                                        <Feather name="plus" size={16} color="#554AF0" />
                                    </TouchableOpacity>
                                :null}
                            </View>
                        )
                        :
                        <Text style={{...Styles.cardStudentValue_empty, marginBottom: 25, marginLeft: 0}}>Нет свободных учеников</Text>
                        }
                    </View>
                </View>
            :null}
            </>
        )
    }
}