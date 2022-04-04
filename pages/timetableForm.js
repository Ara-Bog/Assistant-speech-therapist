import React, { Component } from 'react';
import { View, Alert, Text, TouchableOpacity } from 'react-native';
import Styles from "../styleGlobal.js";
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';

export default class TimetableForm extends Component {

    constructor(props) {
        super(props);
        this.state = {dataForm: this.props.route.params.dataForm, 
            clientsData:[],
            timePickerOpen: false,
            timePickerData: new Date(),
            openedPickers: {day: false, type: false, client: false},
            itemsDays: [
                {label: 'Понедельник', value: 'mon'},
                {label: 'Вторник', value: 'tues'},
                {label: 'Среда', value: 'wen'},
                {label: 'Четверг', value: 'thur'},
                {label: 'Пятница', value: 'fri'}
            ],
            itemsType: [
                {label: 'Групповое', value: 'g'},
                {label: 'Индивидуальное', value: 's'}
            ]
        }
        if (this.state.dataForm.ID != undefined) {
            this.state.title = "Изменить записи"
            const timeVals = this.state.dataForm.Time.split(':')
            this.state.timePickerData.setHours(timeVals[0], timeVals[1])
        } else {
            this.state.title = "Новая запись"
        }

        this.props.navigation.setOptions({title: this.state.title})
    }
    
    loadDataClient() {
        let sqlRequst = ''
        db.transaction((tx) => {
            {this.state.dataForm.Type == 'g' ? sqlRequst = "SELECT name as label, id as value FROM Groups" : sqlRequst = "SELECT name || ' ' || surname as label, id as value FROM Students"}
            tx.executeSql(sqlRequst, [], 
                (_, {rows:{_array}}) => this.setState({clientsData:_array}), 
                (_, err) => console.log('error - ', err));
        });
    }

    checkValues(){
        if (Object.keys(this.state.dataForm).length < 4){
            Alert.alert(
                "Ошибка ввода данных",
                "Необходимо заполнить все поля",
                [{ text: "OK"}],
                {cancelable: true}
            );
            return
        }
        {this.state.dataForm.ID != undefined ? this.updateNote():this.updateBase()}
    };

    updateBase() {
        db.transaction((tx) => {
            tx.executeSql("INSERT INTO timetable (time, client_id, day, type) VALUES (?,?,?,?)", 
                [this.state.dataForm.Time, this.state.dataForm.Client_id, this.state.dataForm.Day, this.state.dataForm.Type],
            () => Alert.alert(
                'Успешно',
                'Запись добавленна',
                [
                    { 
                        text: "Продолжить",
                        style: "default"
                    },
                    {
                        text: "Выйти", 
                        onPress: () => this.props.navigation.goBack(),
                        style: "cancel",
                    }
                ]
            ),
            (_, err) => (Alert.alert('Произошла какая-то ошибка'), console.log('error updateBase - ', err)));
        })
    };

    updateNote() {
        db.transaction((tx) => {
            tx.executeSql("UPDATE timetable SET time = ?, client_id  = ?, day  = ?, type  = ? WHERE id = ?", 
                [this.state.dataForm.Time, this.state.dataForm.Client_id, this.state.dataForm.Day, this.state.dataForm.Type, this.state.dataForm.ID],
            () => Alert.alert(
                'Успешно',
                'Запись обновленна',
                [
                    { 
                        text: "Продолжить", 
                        style: "default",
                    },
                    {
                        text: "Выйти", 
                        onPress: () => this.props.navigation.goBack(),
                        style: "cancel",
                    }
                ]
            ),
            (_, err) => (Alert.alert('Произошла какая-то ошибка'), console.log('error removeClient - ', err)));
        })
    };

    updateTime(val) {
        if (val != undefined) {
            const newData = val.toTimeString().split(' ')[0].slice(0, 5)
            this.setState({
                timePickerData: val, 
                dataForm : {...this.state.dataForm, Time : newData}
            })
        }
        this.setState({
            timePickerOpen:false,
        })
    }

    render() {
        return (
            <View style={Styles.container}>
                <View style={Styles.rowForm}>
                    <DropDownPicker
                    zIndex={30}
                    placeholder="День недели"
                    textStyle={{fontSize:14, fontFamily:'sf_regular'}}
                    open={this.state.openedPickers.day}
                    value={this.state.dataForm.Day}
                    items={this.state.itemsDays}
                    setOpen={(open) => this.setState({openedPickers: {...this.state.openedPickers, day : open}})}
                    setValue={(callback) => this.setState(state => ({dataForm : {...this.state.dataForm, Day:callback(state.value)}}))}
                    setItems={(callback) => this.setState(state => ({itemsDays : callback(state.items)}))}
                    style={Styles.dropDown}
                    dropDownContainerStyle={Styles.dropDownBox}
                    />
                </View>
                <View style={Styles.rowForm}>
                    <DropDownPicker
                    zIndex={20}
                    placeholder="Тип занятия"
                    textStyle={{fontSize:14, fontFamily:'sf_regular'}}
                    open={this.state.openedPickers.type}
                    value={this.state.dataForm.Type}
                    items={this.state.itemsType}
                    setOpen={(open) => this.setState({openedPickers: {...this.state.openedPickers, type : open}})}
                    setValue={(callback) => this.setState(state => ({dataForm : {...this.state.dataForm, Type:callback(state.value)}}))}
                    setItems={(callback) => this.setState(state => ({itemsType : callback(state.items)}))}
                    style={Styles.dropDown}
                    dropDownContainerStyle={Styles.dropDownBox}
                    onSelectItem={() => this.loadDataClient()}
                    />
                </View>
                {this.state.dataForm.ID != undefined && this.state.clientsData.length == 0 ? this.loadDataClient() : null}
                {this.state.clientsData.length != 0 ? (
                    <View style={Styles.rowForm}>
                        <DropDownPicker
                        zIndex={10}
                        placeholder="Клиент"
                        textStyle={{fontSize:14, fontFamily:'sf_regular'}}
                        open={this.state.openedPickers.client}
                        value={this.state.dataForm.Client_id}
                        items={this.state.clientsData}
                        setOpen={(open) => this.setState({openedPickers: {...this.state.openedPickers, client : open}})}
                        setValue={(callback) => this.setState(state => ({dataForm : {...this.state.dataForm, Client_id:callback(state.value)}}))}
                        setItems={(callback) => this.setState(state => ({clientsData : callback(state.items)}))}
                        style={Styles.dropDown}
                        dropDownContainerStyle={Styles.dropDownBox}
                        />
                    </View>
                ): null}
                <View style={Styles.rowForm}>
                    <TouchableOpacity style={Styles.formDataTime} onPress={() => this.setState({timePickerOpen: true})}>
                        <Text style={Styles.formDataTimeText}>Время {this.state.dataForm.Time != undefined? '- ' + this.state.dataForm.Time: null}</Text>
                    </TouchableOpacity>
                </View>
                <View style={Styles.rowForm}>
                    <TouchableOpacity style={Styles.submitBtn} onPress={() => this.checkValues()}>
                        <Text style={Styles.submitBtnText}>{this.state.dataForm.ID != undefined ? 'Сохранить': 'Создать'}</Text>
                    </TouchableOpacity>
                </View>
                {this.state.timePickerOpen ?
                <DateTimePicker
                value={this.state.timePickerData}
                mode={"time"}
                is24Hour={true}
                onChange={(_, val) => this.updateTime(val)}
                /> : null}
            </View>
        );
    }
}