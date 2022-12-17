import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  useColorScheme,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import SQlite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Search = () => {
  let db = SQlite.openDatabase({
    name: 'bible-sqlite.db',
    createFromLocation: 1,
  });
  let [flatListItems, setFlatListItems] = useState([]);
  let [searchText, setSearchText] = useState('');
  let [translation, setTranslation] = useState('t_kjv');

  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';

  const loadSearch = async () => {
    setFlatListItems([]);

    const trnl = await AsyncStorage.getItem('bible_version');
    if (trnl !== null) {
      setTranslation(trnl);
    }

    db.transaction(tx => {
      tx.executeSql(
        `SELECT key_english.n, ${translation}.id, ${translation}.t, ${translation}.c, ${translation}.v FROM ${translation} INNER JOIN key_english ON key_english.b = ${translation}.b WHERE ${translation}.t LIKE '%${searchText}%'`,
        [],
        (_tx, results) => {
          let dataLength = results.rows.length;
          if (dataLength > 0) {
            let helperArray = [];

            let verseView = {
              flexDirection: 'column',
              display: 'flex',
              marginRight: 12,
            };

            let verseNumber = {
              fontSize: 16,
              paddingLeft: 12,
              color: isDarkMode ? '#ffffff' : '#030303',
            };

            let verseText = {
              flex: 1,
              fontSize: 16,
              paddingBottom: 12,
              paddingLeft: 10,
              paddingRight: 10,
            };

            for (let i = 0; i < dataLength; i++) {
              helperArray.push(
                <TouchableOpacity
                  key={results.rows.item(i).id}
                  onPress={() => {}}>
                  <View style={verseView}>
                    <Text style={verseNumber}>
                      ({results.rows.item(i).n} {results.rows.item(i).c}
                      {':'}
                      {results.rows.item(i).v})
                    </Text>
                    <Text key={results.rows.item(i).id} style={verseText}>
                      {results.rows.item(i).t}
                    </Text>
                  </View>
                </TouchableOpacity>,
              );
            }

            setFlatListItems(helperArray);
          }
        },
      );
    });
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 80,
        height: '100%',
      }}>
      <View style={styles.viewOne}>
        <Icon
          onPress={() => navigation.navigate('Home')}
          name="arrow-left"
          size={20}
          color="#050505"
          style={{paddingLeft: 20}}
        />

        <TextInput
          style={styles.textOne}
          onChangeText={v => setSearchText(v)}
        />
        <TouchableOpacity onPress={() => loadSearch()}>
          <Image
            source={require('../assets/searchs.png')}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.textTwo}>Search results:</Text>
      <ScrollView
        style={{
          flex: 1,
        }}>
        {flatListItems}
      </ScrollView>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  viewOne: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textOne: {
    height: 40,
    width: '80%',
    borderColor: '#030303',
    borderWidth: 1,
    marginLeft: 10,
  },
  textTwo: {
    paddingLeft: 40,
    fontSize: 18,
    color: '#030303',
    paddingTop: 20,
  },
  textThree: {
    paddingLeft: 40,
    fontSize: 18,
    color: '#ff0000',
    paddingTop: 20,
    fontWeight: 'bold',
  },
  textFour: {paddingLeft: 40, fontSize: 18, color: '#030303'},
  image: {paddingLeft: 40, fontSize: 18, color: '#030303'},
});
