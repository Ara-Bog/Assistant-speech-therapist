import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Styles from "../styleGlobal.js";

class TableSoundRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDataRow: this.props.currentDataRow || []
        }
    }

    checkedSounds(key, val){
        let currentVal = this.state.currentDataRow
        const indexVal = currentVal.indexOf(val)
        if(indexVal == -1){
            if (val == 'Изолир.'){
                currentVal.length = 0
            }
            currentVal.push(val)
        } else {
            currentVal.splice(indexVal, 1)
        }
        this.setState({currentDataRow:currentVal})
        this.props.onCallBack(key, currentVal)
    }

    render() {
        const rowIndex = this.props.rowIndex
        const keySound = this.props.keySound
        const header = this.props.header
        return(
            <View style={{...Styles.TableRow, justifyContent: 'space-between'}}>
                <Text style={Styles.TableHeadText} key={rowIndex+'.0'}>{keySound}</Text>
                {header.map((valCell, colIndex) =>
                    <TouchableOpacity 
                    key={rowIndex + '.' + (colIndex + 1)}
                    onPress={() => this.checkedSounds(keySound, valCell)}
                    style={this.state.currentDataRow.includes(valCell)?{...Styles.cardStudentElement_table, backgroundColor: '#554AF0'}: Styles.cardStudentElement_table}
                    disabled={this.state.currentDataRow.includes('Изолир.') && valCell != 'Изолир.'}
                    >
                        <Text style={this.state.currentDataRow.includes(valCell)?{color: '#fff'}:{color: '#000'}}>{valCell}</Text>
                    </TouchableOpacity>
                )}
            </View>
        )
    }

}

export default class TableSounds extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            tableSoundHead: ['', 'Изолир.', 'В нач.', 'В сер.', 'В кон.'],
            currentData: this.props.currentSounds,
            soundSymbols:['б', 'бь', 'п', 'пь', 'г', 'гь', 'к', 
            'кь', 'д', 'дь', 'т', 'ть', 'в', 'вь', 
            'ф', 'фь', 'х', 'хь', 'м', 'мь', 'н', 'нь', 
            'с', 'сь', 'з', 'зь', 'ц', 'ш', 'ж', 'щ', 'ч', 
            'л', 'ль', 'р', 'рь', 'й']
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        const prevState = this.state
        const prevProps = this.props
        this.state.currentData != nextProps.currentSounds?this.setState({currentData:nextProps.currentSounds}):null
        if (prevProps.mode != nextProps.mode || 
            prevState.currentData != nextProps.currentSounds) {
            return true
        }
        return false
    }

    setCurrentData(key, val){
        let postData = this.state.currentData
        if (val.length == 0) {
            delete postData[key]
        } else {
            postData[key] = val
        }
        this.setState({currentData:postData})
        this.props.onCallBack(postData)
    }

    render() {
        return(
            <View style={Styles.cardStudentRow_edit}>
                <Text style={Styles.cardStudentTitle}>Таблица нарушений звукопроизношения</Text>
                {this.props.mode?
                    this.state.soundSymbols.map((keyRow, rowIndex) => 
                        <TableSoundRow 
                        key={rowIndex}
                        keySound={keyRow}
                        rowIndex={rowIndex}
                        currentDataRow={this.state.currentData[keyRow]}
                        header={this.state.tableSoundHead.slice(1)}
                        onCallBack={(key, val) => this.setCurrentData(key, val)}
                        />
                    )
                :
                Object.keys(this.state.currentData).length == 0
                    ?
                    <Text style={{...Styles.cardStudentValue_empty, marginBottom: 10, marginLeft: 0}}>Не выбранно</Text>
                    :
                    Object.keys(this.state.currentData).map((label, index) => 
                        <View style={Styles.TableRow} key={index}>
                            <Text style={Styles.TableHeadText}>{label}</Text>
                            {this.state.currentData[label].map((value, indexVal) =>
                                <Text key={index + '.' + indexVal} style={Styles.cardStudentElement_table}>{value}</Text>
                            )}
                        </View>
                    )
                }
            </View>
        )
    }
}