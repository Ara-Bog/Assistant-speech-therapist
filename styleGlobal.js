import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        display: 'flex',
        paddingTop: 30,
        paddingHorizontal: 20,
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#F7F7F7'
    },

    containerCard: {
        display: 'flex',
        flexDirection: 'column'
    },

    cardDays: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: 25,
        borderRadius: 15,
        borderColor: '#EBEBEB',
        borderWidth: 1,
        marginBottom: 15,
        backgroundColor: '#fff',
    },

    cardDaysRow: {
        display:'flex', 
        flexDirection:'row', 
        justifyContent:'space-between', 
        width: '100%',
    },

    cardDaysRowTime:{
        marginBottom: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems:'center'
    },

    cardDaysRowTimeText:{
        fontSize: 16,
        fontFamily: 'sf_medium',
        color: '#04021D',
    },

    cardDaysRowTitle: {
        fontSize: 14,
        fontFamily: 'sf_medium',
        color: '#04021D',
        marginBottom: 15,
    },

    cardDaysRowText: {
        fontSize: 14,
        fontFamily: 'sf_regular',
        fontWeight:'400',
        marginTop: 15,
        fontStyle:'normal'
    },

    cardDaysRowLine: {
        height: 1,
        backgroundColor: '#EBEBEB',
        borderRadius: 42
    },

    rowSwitch: {
        display:'flex', 
        flexDirection:'row', 
        marginBottom: 5, 
        alignItems:'center', 
    },

    rowSwitchText: {
        fontSize: 14, 
        fontFamily:'sf_medium', 
        marginTop: -4, 
        marginLeft: 15
    },

    float_btAdd_wrap: {
        position: 'absolute',
        bottom: 98,
        right: 20,
    },

    float_btAdd: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        backgroundColor: '#fff',
        padding: 13,
        shadowColor: 'rgba(4, 2, 29, 0.7)',
        elevation: 20,
    },

    float_btnRow: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        bottom: 40,
        right: 20,
        alignItems: 'flex-end'
    },

    float_btEdit: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        backgroundColor: '#fff',
        padding: 16,
        shadowColor: 'rgba(4, 2, 29, 0.7)',
        elevation: 20,
    },

    float_btEdit_Check: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        backgroundColor: '#A1DDAB',
        padding: 16,
        shadowColor: 'rgba(4, 2, 29, 0.7)',
        elevation: 20,
    },

    float_btEdit_Close: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        backgroundColor: '#FBEFEF',
        padding: 16,
        marginBottom: 20,
        shadowColor: 'rgba(4, 2, 29, 0.7)',
        elevation: 20,
    },

    formDataTime: {
        display: 'flex',
        borderColor: '#EBEBEB',
        borderWidth: 1,
        backgroundColor: 'white',
        height: 50,
        paddingHorizontal: 25,
        borderRadius: 10,
        justifyContent: 'center'
    },

    formDataTimeText: {
        fontSize: 14,
        fontFamily: 'sf_regular',
        fontWeight: '400',
        lineHeight: 24
    },

    rowForm: {
        marginBottom: 15
    },

    dropDown: {
        marginTop: 6,
        paddingHorizontal: 25,
        height: 50,
        borderColor: '#EBEBEB',
    },

    dropDownBox: {
        borderColor: '#EBEBEB',
        paddingHorizontal: 15,
        paddingVertical: 0,
    },

    cardDaysGoTo: {
        backgroundColor: '#554AF01A',
        borderRadius: 10,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems:'center',
        flex: 1,
        justifyContent:'center',
        width: '100%'
    },

    cardDaysGoToText:{
        fontSize: 13,
        fontFamily: 'sf_semibold',
        fontWeight: '600',
        color:'#554AF0'
    },

    cardStudentBtn_delete: {
        backgroundColor: '#fcefef',
        borderRadius: 10,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
        marginBottom: 15
    },

    cardDaysRemove: {
        backgroundColor: '#fcefef',
        borderRadius: 10,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems:'center',
        flex: 1,
        marginLeft: 8,
        justifyContent:'center'
    },

    cardDaysRemoveText: {
        fontSize: 13,
        fontFamily: 'sf_semibold',
        fontWeight: '600',
        color:'#DC5F5A'
    },

    cardDaysBtns: {
        marginTop: 20,
        flexDirection: 'row',
        width: "100%",
    },

    cardDaysEdit: {
        backgroundColor: '#554AF01A',
        borderRadius: 10,
        paddingVertical: 11,
        flexDirection: 'row',
        alignItems:'center',
        flex: 1,
        marginRight: 8,
        justifyContent:'center'
    },

    cardDaysEditText: {
        fontSize: 13,
        fontFamily: 'sf_semibold',
        fontWeight: '600',
        color:'#554AF0'
    },

    emptyContainer: {
        flex: 1,
        alignItems:'center',
        width: '100%'
    },

    pickerDefault: {
        borderColor: '#EBEBEB',
        borderWidth: 1,
        borderRadius: 10,
        height: 50
    },

    crutch: {
        padding: 75
    },

    submitBtn: {
        height: 50,
        justifyContent: 'center',
        backgroundColor: '#554AF0',
        borderRadius: 10,
        alignItems: 'center',
    },

    submitBtnText: {
        fontFamily: 'sf_semibold',
        fontWeight: '600',
        fontSize: 15,
        color: '#fff'
    },

    cardStudentRow:{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        width: '100%'
    },

    cardStudentRow_edit: {
        flexDirection: 'column',
        marginBottom: 15
    },

    cardStudentLabel: {
        width: '48%',
        marginRight: '2%',
        fontFamily: 'sf_regular',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 16,
        color: '#848484'
    },

    inputDefault: {
        paddingHorizontal: 25,
        borderColor: '#EBEBEB',
        borderWidth: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        flex:1,
        width: '100%',
        marginTop: 6,
        color: '#04021D',
        fontFamily: 'sf_regular',
        fontWeight: '400',
        fontSize: 14,
        height: 50
    },

    inputDefault_disabled: {
        width: '48%',
        marginLeft: '2%',
        opacity: 1,
        fontSize: 14,
        fontFamily: 'sf_regular',
        fontWeight: '400',
        color: '#04021D',
    },

    cardStudentValue: {
        fontSize: 14, 
        fontFamily: 'sf_regular', 
        fontWeight: '400', 
        color: '#04021D', 
        width: '48%',
        marginLeft: '2%'
    },

    cardStudentBox: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10
    },

    cardStudentElement: {
        marginTop: 6,
        paddingHorizontal: 10,
        borderRadius: 15,
        backgroundColor: '#F2F1F1',
        textAlign: 'center',
        fontFamily: 'sf_regular',
        fontWeight: '400',
        fontSize: 14,
        color: '#04021D',
        paddingVertical: 3,
        marginRight: 5,
        lineHeight: 24
    },

    cardStudentElement_active: {
        marginTop: 6,
        paddingHorizontal: 10,
        borderRadius: 15,
        backgroundColor: '#554AF0',
        textAlign: 'center',
        fontFamily: 'sf_regular',
        fontWeight: '400',
        fontSize: 14,
        color: '#fff',
        paddingVertical: 3,
        marginRight: 5,
        lineHeight: 24
    },

    cardStudentElement_radio: {
        paddingHorizontal: 10,
        borderRadius: 15,
        backgroundColor: '#F2F1F1',
        fontFamily: 'sf_medium',
        fontWeight: '500',
        fontSize: 12,
        color: '#04021D',
        paddingVertical: 3,
        lineHeight: 14,
        marginRight: 'auto'
    },

    cardStudentElement_table: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        backgroundColor: '#F2F1F1',
        fontFamily: 'sf_regular',
        fontWeight: '400',
        fontSize: 12,
        color: '#04021D',
        lineHeight: 24,
        marginRight: 5
    },

    cardStudentLine: {
        height: 3,
        backgroundColor: '#EBEBEB',
        borderRadius: 42,
        marginTop: 5,
        marginBottom: 30
    },

    cardStudentTitle: {
        fontFamily: 'sf_medium',
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 19,
        color: '#04021D',
        marginBottom: 15
    },

    cardStudentValue_empty: {
        fontSize: 14, 
        fontFamily: 'sf_regular', 
        fontWeight: '400', 
        color: '#848484', 
        width: '48%',
        marginLeft: '2%'
    },

    cardStudentSubTitle: {
        fontFamily: 'sf_medium',
        fontWeight: '500',
        fontSize: 14,
        lineHeight: 19,
        color: '#04021D',
        marginBottom: 5,
        width: '48%',
        marginRight: '2%'
    },

    cardStudentRowRadio: {
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },

    RadioView: {
        marginBottom: 25
    },

    RadioView_label: {
        fontSize:14, 
        fontWeight: '300', 
        fontFamily: 'sf_regular', 
        margin: 0, 
        padding: 0, 
        alignContent: 'center'
    },

    RadioView_wrap: {
        flexDirection:'row-reverse', 
        left: -24, 
        height: 36, 
        alignItems: 'center'
    },

    RadioViewTitle: {
        fontSize: 14,
        lineHeight: 17,
        fontFamily: 'sf_semibold',
        fontWeight: '600',
        marginBottom: 12,
        color: '#04021D',
    },

    RadioViewTitleSub: {
        fontSize: 14,
        lineHeight: 17,
        fontFamily: 'sf_light',
        fontWeight: '300',
        marginBottom: 12,
        color: '#04021D'
    },

    TableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },

    TableHeadText: {
        width: '10%',
        fontFamily: 'sf_medium',
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 19,
        color: '#04021D',
        textTransform: 'uppercase'
    },

    cardStudentNoteText: {
        fontSize: 14,
        fontFamily: 'sf_regular',
        lineHeight: 20,
        fontWeight: '400',
        color: '#04021D'
    },

    cardStudentNote_edit: {
        borderColor: '#EBEBEB',
        borderWidth: 1,
        borderRadius: 10,
        textAlignVertical: 'top',
        paddingHorizontal: 25,
        paddingVertical: 16,
        fontSize: 14,
        fontFamily: 'sf_regular',
        lineHeight: 20,
        fontWeight: '400',
        color: '#04021D',
    },

    cardGroupBox: {
        marginBottom: 15
    },

    cardGroupBoxRow: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    cardGroupBoxRowText: {
        fontFamily: 'sf_light',
        fontStyle: 'normal',
        fontWeight: '300',
        fontSize: 14,
        lineHeight: 17,
        color: '#04021D'
    },

    cardGroupBoxRowBtn: {
        borderRadius: 10,
        backgroundColor: 'green',
        width: 38,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center'
    }
});