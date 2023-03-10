/* eslint-disable react/react-in-jsx-scope */
import {useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from './screens/Home';
import Splash from './screens/Splash';
import Search from './screens/Search';
import Books from './screens/Books';
import Chapters from './screens/Chapters';
import Bookmark from './screens/Bookmark';
import Translation from './screens/Translation';

const Stack = createNativeStackNavigator();

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Group>
          <Stack.Screen
            options={{headerShown: false}}
            name="Splash"
            component={Splash}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="Home"
            component={Home}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="Search"
            component={Search}
          />
        </Stack.Group>
        <Stack.Group screenOptions={{presentation: 'modal'}}>
          <Stack.Screen
            name="Books"
            component={Books}
            options={{
              headerStyle: {
                backgroundColor: isDarkMode ? '#030303' : '#ffffff',
              },
              headerTintColor: isDarkMode ? '#ffffff' : '#030303',
            }}
          />
          <Stack.Screen
            name="Chapters"
            component={Chapters}
            options={{
              headerStyle: {
                backgroundColor: isDarkMode ? '#030303' : '#ffffff',
              },
              headerTintColor: isDarkMode ? '#ffffff' : '#030303',
            }}
          />
          <Stack.Screen
            name="Bookmark"
            component={Bookmark}
            options={{
              headerStyle: {
                backgroundColor: isDarkMode ? '#030303' : '#ffffff',
              },
              headerTintColor: isDarkMode ? '#ffffff' : '#030303',
            }}
          />
          <Stack.Screen
            name="Translation"
            component={Translation}
            options={{
              headerStyle: {
                backgroundColor: isDarkMode ? '#030303' : '#ffffff',
              },
              headerTintColor: isDarkMode ? '#ffffff' : '#030303',
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
