import React, { Component } from 'react';
import { Text, View, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import Styles from "../styleGlobal.js";
import ButtonEdit from '../components/buttonEdit'
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather } from '@expo/vector-icons';
import GroupListStudents from '../components/groupListStudents'

DropDownPicker.setLanguage("RU");

export default class GroupPage extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            options: this.props.route.params,
            editing: false,
            requiredData:['Name', 'Diagnos_id', 'Categori_id'],
            dataGroup:{},
            categories:[],
            diagnosis:[],
            currentDataGroup:{},
            dropDownsOpen: {categori: false, diagnos: false},
            includeStudentsCurrent: false,
            includeStudents: false
        }
        if (this.state.options.type == 'view') {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM 'Groups' WHERE ID = ?",
                    [this.state.options.id], 
                    (_, {rows:{_array}}) => this.setState({
                        currentDataGroup: _array[0], 
                        dataGroup : _array[0],
                    }),
                    (_, err) => console.log('error - ', err)
                );
                tx.executeSql(
                    "SELECT ID, Surname || ' ' || Name || ' ' || COALESCE(Midname, '') as Name FROM Students WHERE Subgroup_id = ?",
                    [this.state.options.id],
                    (_, {rows:{_array}}) => (this.setState({includeStudents: _array.slice()}), this.setState({includeStudentsCurrent: _array.slice()})),
                    (_, err) => console.log('error - ', err)
                );
            });
            this.props.navigation.setOptions({title : "Карточка группы"})
        } else if (this.state.options.type == 'add') {
            this.props.navigation.setOptions({title: "Создание группы"})
            this.state.editing = true
            this.state.includeStudents = []
            this.state.includeStudentsCurrent = []
        }
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT name as label, id as value FROM Categories",
                [],
                (_, {rows:{_array}}) => this.setState({categories : _array}), 
                (_, err) => console.log('error - ', err)
            );
            tx.executeSql(
                "SELECT name as label, id as value FROM Diagnosis",
                [],
                (_, {rows:{_array}}) => this.setState({diagnosis : _array}), 
                (_, err) => console.log('error - ', err)
            );
        });
    }

    checkData(){
        for (let nameCol of this.state.requiredData){
            if (this.state.currentDataGroup[nameCol] == '' || this.state.currentDataGroup[nameCol] == undefined) {
                this.setState({editing: !this.state.editing})
                Alert.alert(
                    "Ошибка ввода",
                    `Поля со звездочкой должны быть обязательно заполненны`,
                    [{ text: "Да",
                    style: "destructive"}]
                );
                return
            }
        }

        {this.state.options.type == 'add'
        ?
            ( 
                db.transaction((tx) => {
                    tx.executeSql(
                        "SELECT max(id) as lastID FROM 'Groups'", 
                        [], 
                        (_, {rows:{_array}}) => this.setState({currentDataGroup:{...this.state.currentDataGroup, ID:_array[0]['lastID']}}), 
                        (_, err) => (Alert.alert('Произошла какая-то ошибка'), console.log('error getID - ', err)))
                }),
                this.addBase(), 
                this.setState({options:{...this.state.options, type:'view'}}), 
                this.props.navigation.setOptions({headerTitle : "Карточка группы"})
            )
        :
            this.updateBase()
        }
    }

    addBase(){
        const data = this.state.currentDataGroup
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO 'Groups' (Name, Categori_id, Diagnos_id) "
                + "VALUES (?,?,?)",
                [data.Name, data.Categori_id, data.Diagnos_id], 
                () => Alert.alert('Данные успешно добавленны'),
                (_, err) => (Alert.alert('Произошла какая-то ошибка'), console.log('error updateBase - ', err))
            );
            this.state.includeStudentsCurrent.map((item) => 
                tx.executeSql(
                    "UPDATE Students "
                    +"SET Subgroup_id = ?"
                    +"WHERE ID = ?",
                    [data.ID, item.ID], 
                    () => null,
                    (_, err) => (Alert.alert('Произошла какая-то ошибка'), console.log('error updateBase - ', err))
                )
            )
        });
    }

    updateBase(){
        const data = this.state.currentDataGroup
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE Groups "
                +"SET name=?, categori_id=?, diagnos_id=?"
                +"WHERE ID=?",
                [data.Name, data.Categori_id, data.Diagnos_id, data.ID], 
                () => Alert.alert('Данные успешно обновленны'),
                (_, err) => (Alert.alert('Произошла какая-то ошибка'), console.log('error updateBase - ', err))
            );
            tx.executeSql(
                "UPDATE Students "
                +"SET Subgroup_id = ?"
                +"WHERE Subgroup_id = ?",
                [null, data.ID], 
                () => null,
                (_, err) => (Alert.alert('Произошла какая-то ошибка'), console.log('error updateBase - ', err))
            );
            this.state.includeStudentsCurrent.map((item) => 
                tx.executeSql(
                    "UPDATE Students "
                    +"SET Subgroup_id = ?"
                    +"WHERE ID = ?",
                    [data.ID, item.ID], 
                    () => null,
                    (_, err) => (Alert.alert('Произошла какая-то ошибка'), console.log('error updateBase - ', err))
                )
            )
        });
        this.setState({dataGroup: this.state.currentDataGroup})
    }

    undoActions(){
        this.state.options.type == 'view'
        ?
            this.setState({
                currentDataGroup: this.state.dataGroup,
                includeStudentsCurrent : this.state.includeStudents.slice()
            })
        :
            this.props.navigation.goBack()
    }

    removeGroupConfirm(){
        const group = this.state.currentDataGroup
        Alert.alert(
            "Подтвердите удаление",
            `Вы действительно хотите удалить карточку для ${group.Name}?\nЭто также удалит связанные с ней записи в расписании.`,
            [{ text: "Да",
            onPress: () => this.removeGroup(group.ID),
            style: "destructive",}, 
            { text: "Отмена",
            style: "cancel",}],
            {cancelable: true}
        );

    }

    removeGroup(id_client) {
        db.transaction((tx) => {
            tx.executeSql(
            "DELETE FROM timetable WHERE Client_id = ? AND Type = 'g'", 
            [id_client], 
            () => null, 
            (_, err) => (Alert.alert('Произошла какая-то ошибка'), console.log('error removeGroup (timetable) - ', err)));
            this.state.includeStudents.map(() => 
                tx.executeSql(
                    "UPDATE Students "
                    +"SET Subgroup_id = ?"
                    +"WHERE ID = ?",
                    [null, id_client], 
                    () => null,
                    (_, err) => (Alert.alert('Произошла какая-то ошибка'), console.log('error removeGroup (Students) - ', err))
                )
            );
            tx.executeSql(
            "DELETE FROM groups WHERE id = ?", 
            [id_client], 
            () => Alert.alert('Карточка успешно удаленна'), 
            (_, err) => (Alert.alert('Произошла какая-то ошибка'), console.log('error removeGroup (groups) - ', err)))
        });
        this.props.navigation.goBack()
    }

    render() {
        return (
            <View style={{...Styles.container, backgroundColor: '#fff'}}>
                <ScrollView nestedScrollEnabled={true} contentContainerStyle={{flexGrow:1}}>
                    {this.state.editing && this.state.options.type == 'view'
                    ?
                        <TouchableOpacity style={Styles.cardStudentBtn_delete} onPress={() => this.removeGroupConfirm()}>
                            <Feather name="trash" size={16} color="#DC5F5A" style={{marginRight: 8}}/>
                            <Text style={Styles.cardDaysRemoveText}>Удалить</Text>
                        </TouchableOpacity>
                    :
                        null
                    }
                    <View style={this.state.editing? Styles.cardStudentRow_edit: Styles.cardStudentRow}>
                        <Text style={Styles.cardStudentLabel}>Название{this.state.editing? ' *': null}</Text>
                        {this.state.editing
                        ?
                        <TextInput 
                        style={Styles.inputDefault}
                        value = {this.state.currentDataGroup.Name}
                        onChangeText = {(val) => this.setState({currentDataGroup: {...this.state.currentDataGroup, Name: val}})}
                        />
                        :
                        <Text style={Styles.inputDefault_disabled}>{this.state.currentDataGroup.Name}</Text>
                        }
                    </View>
                    <View style={this.state.editing? Styles.cardStudentRow_edit: Styles.cardStudentRow}>
                        <Text style={Styles.cardStudentLabel}>Возрастная группа{this.state.editing?' *': null}</Text>
                        {this.state.editing ? 
                        <DropDownPicker
                        zIndex={12}
                        open={this.state.dropDownsOpen.categori}
                        value={this.state.currentDataGroup.Categori_id}
                        items={this.state.categories}
                        setOpen={(val) => this.setState({dropDownsOpen: {...this.state.dropDownsOpen, categori: val}})}
                        setValue={(callback) => this.setState(state => ({currentDataGroup: {...this.state.currentDataGroup, Categori_id: callback(state.value)}}))}
                        setItems={(callback) => this.setState(state => ({categories: callback(state.items)}))}
                        listMode="SCROLLVIEW"
                        style={Styles.dropDown}
                        dropDownContainerStyle={Styles.dropDownBox}
                        disabled={!this.state.editing}
                        /> : 
                        <Text style={this.state.currentDataGroup.Categori_id != null && this.state.categories.length > 0 ? Styles.cardStudentValue: Styles.cardStudentValue_empty}>
                            {this.state.currentDataGroup.Categori_id != null && this.state.categories.length > 0 ? 
                            this.state.categories.filter((item) => item.value == this.state.currentDataGroup.Categori_id)[0].label: 
                            'Не выбранно'}
                        </Text>
                        }
                    </View>
                    <View style={this.state.editing? Styles.cardStudentRow_edit: Styles.cardStudentRow}>
                        <Text style={Styles.cardStudentLabel}>Заключение ЦПМПК{this.state.editing?' *': null}</Text>
                        {this.state.editing ? 
                            <DropDownPicker
                            zIndex={10}
                            open={this.state.dropDownsOpen.diagnos}
                            value={this.state.currentDataGroup.Diagnos_id}
                            items={this.state.diagnosis}
                            setOpen={(val) => this.setState({dropDownsOpen: {...this.state.dropDownsOpen, diagnos: val}})}
                            setValue={(callback) => this.setState(state => ({currentDataGroup: {...this.state.currentDataGroup, Diagnos_id: callback(state.value)}}))}
                            setItems={(callback) => this.setState(state => ({diagnosis: callback(state.items)}))}
                            listMode="SCROLLVIEW"
                            style={Styles.dropDown}
                            dropDownContainerStyle={Styles.dropDownBox}
                            /> : 
                            <Text style={this.state.currentDataGroup.Diagnos_id != null && this.state.diagnosis.length > 0 ?Styles.cardStudentValue:Styles.cardStudentValue_empty}>
                                {this.state.currentDataGroup.Diagnos_id != null && this.state.diagnosis.length > 0 ? 
                                this.state.diagnosis.filter((item) => item.value == this.state.currentDataGroup.Diagnos_id)[0].label: 
                                'Не выбранно'}
                            </Text>
                        }
                    </View>
                    <View style={{...Styles.cardStudentLine, marginTop: 15}}></View>
                    <View style={this.state.editing? Styles.cardStudentRow_edit: Styles.cardStudentRow}>
                        {this.state.includeStudentsCurrent
                        ? 
                        <GroupListStudents 
                        currentStudents = {this.state.includeStudentsCurrent}
                        editing = {this.state.editing}
                        onCallBack={(listStudents) => this.setState({includeStudentsCurrent: listStudents})}
                        />
                        :
                        null
                        }
                    </View>
                    <View style={Styles.crutch}></View>
                </ScrollView>
                <ButtonEdit 
                changeState={() => this.setState({editing: !this.state.editing, dropDownsOpen: {categori: false, diagnos: false}})} 
                editing={this.state.editing} 
                confirm={(feedback) => {feedback ? this.checkData() : this.undoActions()}}
                />
            </View>            
        );
    };
}
