import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Styles from "../styleGlobal.js";
import { RadioButton } from 'react-native-paper';

class RadioRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentVall: this.props.currentVall,
        }
    }

    setSymptomsChecked(key, val) {
        this.setState({currentVall: val})
        this.props.onCallBack(key, val)
    }

    render() {
        const item = this.props.item
        return(
            item.values != null?
            <>
            <Text style={item.id.split('.').length == 2?Styles.RadioViewTitleSub:Styles.RadioViewTitle}>{item.label[0].toUpperCase()+item.label.slice(1)}</Text>
            <View style={Styles.RadioView}>
                <RadioButton.Group 
                onValueChange={(value) => this.setSymptomsChecked(item.id, value)} 
                value={this.state.currentVall}
                >
                    {item.values.split('/').map((radioVal, index) => 
                            <RadioButton.Item 
                            key={item.id + index.toString()} 
                            label={radioVal[0].toUpperCase()+radioVal.slice(1)} 
                            value={index}
                            style={Styles.RadioView_wrap}
                            labelStyle={Styles.RadioView_label}
                            color={'#554AF0'} />)
                    } 
                </RadioButton.Group>  
            </View>
            </>: 
            <Text style={{...Styles.RadioViewTitle, marginBottom: 12}}>{item.label[0].toUpperCase()+item.label.slice(1)}</Text>
        )
    }
}

export default class StudentPage extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            checkedSymptoms: props.currentSymptoms,
            symptoms: [],
            subSymptoms: [],
            listData: []
        }

        db.transaction((tx) => {
            tx.executeSql(
                "SELECT id, name as label, items FROM Symptoms",
                [],
                (_, {rows:{_array}}) => (
                _array.map((item) => this.state.listData.push({id: item.ID.toString(), label:item.label, values:item.Items})),
                this.setState({symptoms: _array})
                ),
                (_, err) => console.log('error - ', err)
            );
            tx.executeSql(
                "SELECT id, Symptom_id, text as label, items FROM SubSymptoms",
                [],
                (_, {rows:{_array}}) => (_array.map((item) => this.state.listData.push(
                    {id: item.Symptom_id+'.'+item.ID, label:item.label, values:item.Items})),
                this.state.listData.sort((a, b) => a.id > b.id ? 1 : -1), 
                this.setState({subSymptoms: _array})),
                (_, err) => console.log('error - ', err)
            );
        })
    }

    updateStash(key, val){
        let postSymptoms = this.state.checkedSymptoms
        postSymptoms[key] = val
        this.setState({checkedSymptoms:{...this.state.checkedSymptoms, [key]:val}})
        this.props.onCallBack(postSymptoms)
    }

    shouldComponentUpdate(nextProps, nextState){
        const currentState = this.state
        this.state.checkedSymptoms != nextProps.currentSymptoms?this.setState({checkedSymptoms:nextProps.currentSymptoms}):null
        if(currentState.symptoms.length == 0 || 
            currentState.subSymptoms.length == 0 || 
            currentState.listData != nextState.listData || 
            this.props.mode != nextProps.mode){
            return true
        }
        return false
    }

    render() {
        return(
            <>
                <Text style={Styles.cardStudentTitle}>Симптоматика</Text>
                {this.props.mode?
                this.state.listData.map((item) => 
                    <RadioRow 
                    key={item.id} 
                    item={item} 
                    currentVall={this.state.checkedSymptoms[item.id]}
                    onCallBack={(key, val) => (this.updateStash(key, val))}
                    />
                ):
                Object.keys(this.state.checkedSymptoms).length != 0
                ? 
                <View style={{marginBottom: 10}}>
                    {this.state.listData.map((item) => 
                    item.id in this.state.checkedSymptoms
                    ?
                        item.id.split('.').length == 2
                        ? 
                        <View style={Styles.cardStudentRowRadio} key={item.id}>
                            <Text style={Styles.cardStudentLabel}>{item.label}</Text>
                            <Text style={Styles.cardStudentElement_radio}>{item.values.split('/')[this.state.checkedSymptoms[item.id]]}</Text>
                        </View>
                        : 
                        <View style={{...Styles.cardStudentRowRadio, marginTop: 15}} key={item.id}>
                            <Text style={Styles.cardStudentSubTitle}>{item.label}</Text>
                            <View style={{flex: 1}}><Text style={Styles.cardStudentElement_radio}>{item.values.split('/')[this.state.checkedSymptoms[item.id]]}</Text></View>
                        </View>
                    :
                        item.values == null && Object.keys(this.state.checkedSymptoms).filter((checkedItem) => checkedItem[0] == item.id).length > 0
                        ?
                        <View style={{...Styles.cardStudentRowRadio, marginTop: 15}} key={item.id}>
                            <Text style={{...Styles.cardStudentSubTitle, width: '100%', marginRight: 0}}>{item.label}</Text>
                        </View>
                        :null
                    )}
                </View>
                :
                <Text style={{...Styles.cardStudentValue_empty, marginBottom: 25, marginLeft: 0}}>Не выбранно</Text>
                }
            </>
        )
    }
}