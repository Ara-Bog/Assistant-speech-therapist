import React, { Component } from 'react';
import { Text, View, ScrollView, Alert, TouchableOpacity, TextInput } from 'react-native';
import Styles from "../styleGlobal.js";
import ButtonEdit from '../components/buttonEdit'
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import SymptomsForm from '../components/symptomsForm'
import TableSounds from '../components/tableSounds'
import { Feather } from '@expo/vector-icons';

DropDownPicker.setLanguage("RU");

export default class StudentPage extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            options: this.props.route.params,
            editing: false,
            requiredData:['Surname', 'Name', 'DateBD', 'Group_name', 'Diagnos_id', 'Categori_id'],
            dataClient:{},
            subGroups:[],
            categories:[],
            diagnosis:[],
            violations:[],
            currentDataClient:{},
            timePickerDate: new Date(),
            timePickerOpen: false,
            clientAge: 0,
            dropDownsOpen: {subgroup: false, categori: false, diagnos: false},
            checkedViolations: [],
            currentSymptoms: false,
            currentSounds: false,
            closePage: false
        }
        if (this.state.options.type == 'view') {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM Students WHERE ID = ?",
                    [this.state.options.id], 
                    (_, {rows:{_array}}) => this.setState({
                        currentSounds: _array[0].Sound!= null?JSON.parse(_array[0].Sound): {},
                        currentSymptoms: _array[0].Symptoms!= null?JSON.parse(_array[0].Symptoms): {},
                        currentDataClient: _array[0], 
                        clientAge : Math.round((new Date().getTime() - new Date(_array[0].DateBD)) / (24 * 3600 * 365.25 * 1000)),
                        checkedViolations: _array[0].Violations != null ? _array[0].Violations.split('/') : [],
                        dataClient : _array[0],
                    }),
                    (_, err) => console.log('error - ', err)
                );
            });
            this.props.navigation.setOptions({title : "Карточка ученика"})
        } else if (this.state.options.type == 'add') {
            this.state.currentSymptoms = {}
            this.state.currentSounds = {}
            this.props.navigation.setOptions({title: "Добавление ученика"})
            this.state.editing = true
        }
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT name as label, id as value FROM Groups",
                [],
                (_, {rows:{_array}}) => this.setState({subGroups : _array}), 
                (_, err) => console.log('error - ', err)
            );
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
            tx.executeSql(
                "SELECT name as label, id as value FROM Violations",
                [],
                (_, {rows:{_array}}) => this.setState({violations : _array}), 
                (_, err) => console.log('error - ', err)
            );
        });
    }

    checkData(){
        for (let nameCol of this.state.requiredData){
            if (this.state.currentDataClient[nameCol] == '' || this.state.currentDataClient[nameCol] == undefined) {
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
            (this.addBase(), 
            db.transaction((tx) => {
            tx.executeSql(
                "SELECT max(id) as lastID FROM Students", 
                [], 
                (_, {rows:{_array}}) => this.setState({currentDataClient:{...this.state.currentDataClient, ID:_array[0]['lastID']}}), 
                (_, err) => (Alert.alert('Произошла какая-то ошибка'), console.log('error getID - ', err)))
            }),
            this.setState({options:{...this.state.options, type:'view'}}),
            this.props.navigation.setOptions({headerTitle : "Карточка ученика"})
            )
            
        :
            this.updateBase()}
    }

    addBase(){
        const data = this.state.currentDataClient
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO students (Surname, Name, Midname, Group_name, Subgroup_id, DateBD, Categori_id, Diagnos_id, violations, symptoms, sound, note) "
                + "VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
                [data.Surname, data.Name, data.Midname || null, 
                    data.Group_name, data.Subgroup_id || null, data.DateBD, 
                    data.Categori_id, data.Diagnos_id, data.Violations || null, 
                    data.Symptoms || null, data.Sound || null, data.Note || null], 
                () => Alert.alert('Данные успешно добавленны'),
                (_, err) => (Alert.alert('Произошла какая-то ошибка'), console.log('error updateBase - ', err))
            );
        });
    }

    updateDateBD(val){
        if (val != undefined) {
            this.setState({
                currentDataClient:{...this.state.currentDataClient, DateBD:val.toISOString().slice(0, 10)}
            })
        }
        this.setState({
            timePickerOpen: false, 
        })
    }

    updateBase(){
        const data = this.state.currentDataClient
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE Students "
                +"SET surname=?, name=?, midname=?, group_name=?, subgroup_id=?, DateBD=?, categori_id=?, diagnos_id=?, violations=?, symptoms=?, sound=?, note=? "
                +"WHERE ID=?",
                [data.Surname, data.Name, data.Midname, data.Group_name, data.Subgroup_id, data.DateBD, data.Categori_id, data.Diagnos_id, data.Violations, data.Symptoms, data.Sound, data.Note, data.ID], 
                () => (Alert.alert('Данные успешно обновленны'), 
                this.setState({clientAge: Math.round((new Date().getTime() - new Date(this.state.currentDataClient.DateBD)) / (24 * 3600 * 365.25 * 1000))})), 
                (_, err) => (Alert.alert('Произошла какая-то ошибка'), console.log('error updateBase - ', err))
            );
        });
        this.setState({dataClient: this.state.currentDataClient})
    }

    formatDateBD(){
        if (this.state.currentDataClient.DateBD != undefined) {
            const currentDate = new Date(this.state.currentDataClient.DateBD)
            return currentDate.toISOString().slice(0, 10).split('-').reverse().join('.')
        } else {
            return 'Выберите дату'
        }
    }

    violationSelected(check_id){
        const arrBoxes = this.state.checkedViolations
        const indexChecker = arrBoxes.indexOf(check_id)
        if (indexChecker != -1) {
            arrBoxes.splice(indexChecker, 1)
        } else {
            arrBoxes.push(check_id)
        }
        arrBoxes.sort(function(a,b){return b - a})
        this.setState({currentDataClient: {...this.state.currentDataClient, Violations : arrBoxes.join('/')}})
    }

    symptomsSelected(newSympt){
        this.setState({
            currentSymptoms: newSympt,
            currentDataClient:{
                ...this.state.currentDataClient,
                Symptoms: JSON.stringify(newSympt)
            }
        })
    }

    soundsSelected(newSound){
        this.setState({
            currentSounds: newSound,
            currentDataClient:{
                ...this.state.currentDataClient,
                Sound: JSON.stringify(newSound)
            }
        })
    }

    undoActions(){
        this.state.options.type == 'view'?
        this.setState({
            currentDataClient: this.state.dataClient, 
            currentSymptoms: this.state.dataClient.Symptoms!= null?JSON.parse(this.state.dataClient.Symptoms): {},
            currentSounds: this.state.dataClient.Sound!= null?JSON.parse(this.state.dataClient.Sound): {},
            checkedViolations: this.state.dataClient.Violations != null ? this.state.dataClient.Violations.split('/') : []
        }):
        this.props.navigation.goBack()
    }

    removeStudentConfirm(){
        const student = this.state.currentDataClient
        Alert.alert(
            "Подтвердите удаление",
            `Вы действительно хотите удалить карточку для ${student.Surname} ${student.Name} ${student.Midname || ''} ?\nЭто также удалит связанные с ней записи в расписании.`,
            [{ text: "Да",
            onPress: () => this.removeStudent(student.ID),
            style: "destructive",}, 
            { text: "Отмена",
            style: "cancel",}],
            {cancelable: true}
        );

    }

    removeStudent(id_client) {
        db.transaction((tx) => {
            tx.executeSql(
            "DELETE FROM timetable WHERE Client_id = ? AND Type = 's'", 
            [id_client], 
            () => null, 
            (_, err) => console.log('error removeStudent (timetable) - ', err));
            tx.executeSql(
                "DELETE FROM students WHERE id = ?", 
                [id_client], 
                () => Alert.alert('Карточка успешно удаленна'), 
                (_, err) => (Alert.alert('Произошла какая-то ошибка'), console.log('error removeStudent (students) - ', err)));
        });
        this.props.navigation.goBack()
    }

    render() {
        return (
            <View style={{...Styles.container, backgroundColor: '#fff'}}>
                <ScrollView nestedScrollEnabled={true} contentContainerStyle={{flexGrow:1}}>
                    {this.state.editing && this.state.options.type == 'view'
                    ?
                        <TouchableOpacity style={Styles.cardStudentBtn_delete} onPress={() => this.removeStudentConfirm()}>
                            <Feather name="trash" size={16} color="#DC5F5A" style={{marginRight: 8}}/>
                            <Text style={Styles.cardDaysRemoveText}>Удалить</Text>
                        </TouchableOpacity>
                    :
                        null
                    }
                    <View style={this.state.editing? Styles.cardStudentRow_edit: Styles.cardStudentRow}>
                        <Text style={Styles.cardStudentLabel}>Фамилия{this.state.editing? ' *': null}</Text>
                        {this.state.editing
                        ?
                        <TextInput 
                        style={Styles.inputDefault}
                        value = {this.state.currentDataClient.Surname}
                        onChangeText = {(val) => this.setState({currentDataClient: {...this.state.currentDataClient, Surname: val}})}
                        />
                        :
                        <Text style={Styles.inputDefault_disabled}>{this.state.currentDataClient.Surname}</Text>
                        }
                    </View>
                    <View style={this.state.editing? Styles.cardStudentRow_edit: Styles.cardStudentRow}>
                        <Text style={Styles.cardStudentLabel}>Имя{this.state.editing?' *': null}</Text>
                        {this.state.editing
                        ?
                        <TextInput 
                        style={Styles.inputDefault}
                        value = {this.state.currentDataClient.Name}
                        onChangeText = {(val) => this.setState({currentDataClient: {...this.state.currentDataClient, Name: val}})}
                        />
                        :
                        <Text style={Styles.inputDefault_disabled}>{this.state.currentDataClient.Name}</Text>
                        }
                    </View>
                    <View style={this.state.editing? Styles.cardStudentRow_edit: Styles.cardStudentRow}>
                        <Text style={Styles.cardStudentLabel}>Отчество</Text>
                        {this.state.editing
                        ?
                        <TextInput 
                        style={Styles.inputDefault}
                        value = {this.state.currentDataClient.Midname}
                        onChangeText = {(val) => this.setState({currentDataClient: {...this.state.currentDataClient, Midname: val}})}
                        />
                        :
                        <Text style={Styles.inputDefault_disabled}>{this.state.currentDataClient.Midname || 'Не указано'}</Text>
                        }
                    </View>
                    <View style={this.state.editing? Styles.cardStudentRow_edit: Styles.cardStudentRow}>
                        <Text style={Styles.cardStudentLabel}>{this.state.editing ?'Дата рождения *':'Возраст'}</Text>
                        {this.state.editing ? 
                            <TouchableOpacity style={{...Styles.formDataTime, marginTop: 6}} onPress={() => this.setState({timePickerOpen: true})}>
                                <Text style={Styles.formDataTimeText}>{this.formatDateBD()}</Text>
                            </TouchableOpacity>
                        :
                            <Text style={Styles.cardStudentValue}>
                                {this.state.clientAge != 0?this.state.clientAge:'Не указано'}
                            </Text>
                        }
                    </View>
                    <View style={this.state.editing? Styles.cardStudentRow_edit: Styles.cardStudentRow}>
                        <Text style={Styles.cardStudentLabel}>Группа в организации{this.state.editing?' *': null}</Text>
                        {this.state.editing
                        ?
                        <TextInput 
                        style={Styles.inputDefault}
                        value = {this.state.currentDataClient.Group_name}
                        onChangeText = {(val) => this.setState({currentDataClient: {...this.state.currentDataClient, Group_name: val}})}
                        />
                        :
                        <Text style={Styles.inputDefault_disabled}>{this.state.currentDataClient.Group_name}</Text>
                        }
                    </View>
                    <View style={this.state.editing? Styles.cardStudentRow_edit: Styles.cardStudentRow}>
                        <Text style={Styles.cardStudentLabel}>Возрастная группа{this.state.editing?' *': null}</Text>
                        {this.state.editing ? 
                        <DropDownPicker
                        zIndex={12}
                        open={this.state.dropDownsOpen.categori}
                        value={this.state.currentDataClient.Categori_id}
                        items={this.state.categories}
                        setOpen={(val) => this.setState({dropDownsOpen: {...this.state.dropDownsOpen, categori: val}})}
                        setValue={(callback) => this.setState(state => ({currentDataClient: {...this.state.currentDataClient, Categori_id: callback(state.value)}}))}
                        setItems={(callback) => this.setState(state => ({categories: callback(state.items)}))}
                        listMode="SCROLLVIEW"
                        style={Styles.dropDown}
                        dropDownContainerStyle={Styles.dropDownBox}
                        disabled={!this.state.editing}
                        /> : 
                        <Text style={this.state.currentDataClient.Categori_id != null && this.state.categories.length > 0 ? Styles.cardStudentValue: Styles.cardStudentValue_empty}>
                            {this.state.currentDataClient.Categori_id != null && this.state.categories.length > 0 ? 
                            this.state.categories.filter((item) => item.value == this.state.currentDataClient.Categori_id)[0].label: 
                            'Не выбранно'}
                        </Text>
                        }
                    </View>
                    <View style={this.state.editing? Styles.cardStudentRow_edit: Styles.cardStudentRow}>
                        <Text style={Styles.cardStudentLabel}>Группа</Text>
                        {this.state.editing ? 
                            <DropDownPicker
                            zIndex={11}
                            open={this.state.dropDownsOpen.subgroup}
                            value={this.state.currentDataClient.Subgroup_id}
                            items={this.state.subGroups}
                            setOpen={(val) => this.setState({dropDownsOpen: {...this.state.dropDownsOpen, subgroup: val}})}
                            setValue={(callback) => this.setState(state => ({currentDataClient: {...this.state.currentDataClient, Subgroup_id: callback(state.value)}}))}
                            setItems={(callback) => this.setState(state => ({subGroups: callback(state.items)}))}
                            listMode="SCROLLVIEW"
                            style={Styles.dropDown}
                            dropDownContainerStyle={Styles.dropDownBox}
                            /> : 
                            <Text style={this.state.currentDataClient.Subgroup_id != null && this.state.subGroups.length > 0 ?Styles.cardStudentValue:Styles.cardStudentValue_empty}>
                                {this.state.currentDataClient.Subgroup_id != null && this.state.subGroups.length > 0 ? 
                                this.state.subGroups.filter((item) => item.value == this.state.currentDataClient.Subgroup_id)[0].label: 
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
                            value={this.state.currentDataClient.Diagnos_id}
                            items={this.state.diagnosis}
                            setOpen={(val) => this.setState({dropDownsOpen: {...this.state.dropDownsOpen, diagnos: val}})}
                            setValue={(callback) => this.setState(state => ({currentDataClient: {...this.state.currentDataClient, Diagnos_id: callback(state.value)}}))}
                            setItems={(callback) => this.setState(state => ({diagnosis: callback(state.items)}))}
                            listMode="SCROLLVIEW"
                            style={Styles.dropDown}
                            dropDownContainerStyle={Styles.dropDownBox}
                            /> : 
                            <Text style={this.state.currentDataClient.Diagnos_id != null && this.state.diagnosis.length > 0 ?Styles.cardStudentValue:Styles.cardStudentValue_empty}>
                                {this.state.currentDataClient.Diagnos_id != null && this.state.diagnosis.length > 0 ? 
                                this.state.diagnosis.filter((item) => item.value == this.state.currentDataClient.Diagnos_id)[0].label: 
                                'Не выбранно'}
                            </Text>
                        }
                    </View>
                    <View style={this.state.editing || this.state.checkedViolations.length != 0? Styles.cardStudentRow_edit: {...Styles.cardStudentRow, marginBottom: 25}}>
                        <Text style={Styles.cardStudentLabel}>Заключение логопеда</Text>
                        {this.state.checkedViolations.length == 0 && !this.state.editing
                        ?
                            <Text style={Styles.cardStudentValue_empty}>Не выбранно</Text>
                        :
                            <View style={Styles.cardStudentBox}>
                                {this.state.editing 
                                ? 
                                    this.state.violations.map((item) => 
                                        <Text key={item.value} 
                                        style={this.state.checkedViolations.includes(item.value.toString())?Styles.cardStudentElement_active:Styles.cardStudentElement}
                                        onPress={() => this.violationSelected(item.value.toString())}>
                                            {item.label}
                                        </Text>
                                    )
                                : 
                                    this.state.violations.filter((item) => 
                                        this.state.checkedViolations.includes(item.value.toString())).map((item) => 
                                            <Text key={item.value} style={Styles.cardStudentElement}>{item.label}</Text>
                                    )
                                }
                            </View>
                        }
                    </View>
                    <View style={Styles.cardStudentLine}></View>
                    {this.state.currentSymptoms
                    ? 
                    <SymptomsForm 
                    currentSymptoms={this.state.currentSymptoms}
                    mode={this.state.editing}
                    onCallBack={(newSympt) => this.symptomsSelected(newSympt)}
                    />
                    :null}
                    <View style={Styles.cardStudentLine}></View>
                    {this.state.currentSounds
                    ?<TableSounds 
                    currentSounds={this.state.currentSounds}
                    mode={this.state.editing}
                    onCallBack={(newSound) => this.soundsSelected(newSound)}
                    />
                    :null}
                    <View style={Styles.cardStudentLine}></View>
                    <View style={{...Styles.cardStudentRow_edit, marginBottom: 100}}>
                        <Text style={Styles.cardStudentTitle}>Заметки</Text>
                        {this.state.editing
                        ?
                            <TextInput 
                            multiline={true}
                            numberOfLines = {5}
                            value = {this.state.currentDataClient.Note}
                            onChangeText = {(val) => this.setState({currentDataClient: {...this.state.currentDataClient, Note: val}})}
                            style={Styles.cardStudentNote_edit}
                            editable={this.state.editing}/>
                        :
                            this.state.currentDataClient.Note 
                            ?
                                <Text style={Styles.cardStudentNoteText}>{this.state.currentDataClient.Note}</Text>
                            :
                                <Text style={{...Styles.cardStudentValue_empty, marginBottom: 25, marginLeft: 0}}>Пусто</Text>
                        }
                    </View>
                    <View style={Styles.crutch}></View>
                </ScrollView>
                {this.state.timePickerOpen 
                ?<DateTimePicker
                    maximumDate={new Date(Date.now() - 2*365*24*60*60*1000)}
                    minimumDate={new Date(Date.now() - 9*365*24*60*60*1000)}
                    value={this.state.timePickerDate}
                    mode={"date"}
                    is24Hour={true}
                    onChange={(_, val) => this.updateDateBD(val)}
                    />
                : null}
                <ButtonEdit 
                changeState={() => this.setState({editing: !this.state.editing, dropDownsOpen: {subgroup: false, categori: false, diagnos: false}})} 
                editing={this.state.editing} 
                confirm={(feedback) => {feedback ? this.checkData() : this.undoActions()}}
                />
            </View>            
        );
    };
}
