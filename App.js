import React from 'react';
import { PermissionsAndroid} from 'react-native';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import * as SQLite from 'expo-sqlite';
import * as FileSystem from "expo-file-system";
import {Asset} from "expo-asset";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';

import Timetable from './pages/timetable'
import TimetableForm from './pages/timetableForm'
import StudentPage from './pages/studentPage';
import ListStudents from './pages/listStudents';
import GroupPage from './pages/groupsPage';
import ListGroups from './pages/listGroups';

async function openDatabaseIShipWithApp() {
    const internalDbName = "db_app.db";
    const sqlDir = FileSystem.documentDirectory + "SQLite/";
    if (!( await FileSystem.getInfoAsync(sqlDir + internalDbName)).exists) {
        await FileSystem.makeDirectoryAsync(sqlDir, {intermediates: true});
        const asset = Asset.fromModule(require("./assets/database/db_app.db"));
        await FileSystem.downloadAsync(asset.uri, sqlDir + internalDbName);
    }
    return SQLite.openDatabase(internalDbName);
}

global.db = openDatabaseIShipWithApp()

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
	const [loaded] = useFonts({
		'sf_regular': require('./assets/fonts/sf_regular.ttf'),
		'sf_bold': require('./assets/fonts/sf_bold.ttf'),
		'sf_heavy': require('./assets/fonts/sf_heavy.ttf'),
		'sf_medium': require('./assets/fonts/sf_medium.ttf'),
		'sf_semibold': require('./assets/fonts/sf_semibold.ttf'),
		'sf_light': require('./assets/fonts/sf_light.ttf'),
	});

	const requestStoragePermission = async () => {
		try {
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
		);
		} catch (err) {
			console.warn(err);
		}
	};

	const hideTabPage = ['Student', 'TimetableForm', 'Group']

	const ListStudentsNav = () => (
		<Stack.Navigator initialRouteName="ListStudents" 
		screenOptions={{headerTitleAlign: 'center', headerTintColor: '#554AF0', headerTitleStyle: { color: "#000", fontFamily:'sf_semibold', fontSize: 18 }, headerShadowVisible: false}} >
			<Stack.Screen name="ListStudents" component={ListStudents} options={{ title: 'Список учеников' }}/>
			<Stack.Screen name="Student" component={StudentPage}/>
		</Stack.Navigator>
	)

	const TimetableNav = () => (
		<Stack.Navigator initialRouteName="Timetable"
		screenOptions={{headerTitleAlign: 'center', headerTintColor: '#554AF0', headerTitleStyle: { color: "#000", fontFamily:'sf_semibold', fontSize: 18 }, headerShadowVisible: false}} >
			<Stack.Screen name="Timetable" component={Timetable} options={{ title: 'Расписание' }}/>
			<Stack.Screen name="TimetableForm" component={TimetableForm}/>
			<Stack.Screen name="Student" component={StudentPage}/>
			<Stack.Screen name="Group" component={GroupPage}/>
		</Stack.Navigator>
	)

	const ListGroupNav = () => (
		<Stack.Navigator initialRouteName="ListGroups"
		screenOptions={{headerTitleAlign: 'center', headerTintColor: '#554AF0', headerTitleStyle: { color: "#000", fontFamily:'sf_semibold', fontSize: 18 }, headerShadowVisible: false}} >
			<Stack.Screen name="ListGroups" component={ListGroups} options={{ title: 'Список групп' }}/>
			<Stack.Screen name="Group" component={GroupPage}/>
		</Stack.Navigator>
	)

	if (PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)) {
		requestStoragePermission()
	}

	if((!loaded) || db['_W'] == null){
		return null
	} else {
		db = db['_W']
	}
	
	return (
		<NavigationContainer>
		<Tab.Navigator
			initialRouteName="timetable"
			screenOptions={({route}) => ({
				tabBarStyle: { 
					borderTopLeftRadius: 30,
					borderTopRightRadius: 30,
					position: 'absolute',
					bottom: hideTabPage.includes(getFocusedRouteNameFromRoute(route))?-100:0,
					borderTopWidth: 0,
					shadowColor: 'red',
					elevation: 10,
					height: 78,
					paddingBottom: 22,
					paddingTop: 13,
				},
				tabBarLabelStyle: {
					fontSize: 11,
					fontFamily: 'sf_medium'
				},
				tabBarActiveTintColor: '#554AF0',
				tabBarInactiveTintColor: '#B1B1B1',
			})
			}
		>
			<Tab.Screen
			name="timetable"
			component={TimetableNav}
			options={{
				title:"Расписание",
				headerShown: false,
				tabBarIcon: ({ color, size }) => (
				<Feather name="calendar" size={24} color={color} />
				),
			}}
			/>
			<Tab.Screen
			name="groups"
			component={ListGroupNav}
			options={{
				title:"Группы",
				headerShown: false,
				tabBarIcon: ({ color, size }) => (
				<Ionicons name="people-outline" size={27} color={color} />
				),
			}}
			/>
			<Tab.Screen
			name="students"
			component={ListStudentsNav}
			options={{
				title:"Ученики",
				headerShown: false,
				tabBarIcon: ({ color, size }) => (
				<MaterialCommunityIcons name="baby-face" size={size} color={color} />
				),
			}}
			/>
		</Tab.Navigator>
		</NavigationContainer>
	);
}
