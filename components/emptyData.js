import React from 'react';
import { Text, View } from 'react-native';
import Styles from "../styleGlobal.js";

export default function App({typeField}) {
    const fieldValues = {s:'карточку ученика', g:'группу', t:'запись в расписании'}


    return (
        <View style={Styles.emptyContainer}>
            <Text style={{fontSize:18, fontWeight:'500', fontFamily: 'sf_medium', marginBottom: 15, color: '#04021D'}}>Ничего не найдено</Text>
            <Text style={{fontSize:14, fontWeight:'400', fontFamily: 'sf_regular', color: '#B1B1B1', textAlign:'center'}}>Нажмите на кнопку “+” в правном нижнем углу экрана, что бы создать новую {fieldValues[typeField]}</Text>
        </View>
    );
}
