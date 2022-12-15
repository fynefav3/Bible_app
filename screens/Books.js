import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SQlite from 'react-native-sqlite-storage';

let db = SQlite.openDatabase({
  name: 'bible-sqlite.db',
  createFromLocation: 1,
});

const Books = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';

  let [flatListItems, setFlatListItems] = useState([]);

  useEffect(() => {
    loadBooks();
  });

  const selectBook = async book => {
    navigation.goBack();
    await AsyncStorage.setItem('book', `${book.b}`);
    await AsyncStorage.setItem('bookTitle', `${book.n}`);
    navigation.navigate('Chapters');
  };

  const loadBooks = async () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM key_english LIMIT 66',
        [],
        (_tx, results) => {
          let dataLength = results.rows.length;
          if (dataLength > 0) {
            let helperArray = [];

            let bookView = {
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              padding: 10,
            };

            let bookDivider = {
              height: 2,
              width: '100%',
              color: 'red',
            };

            let bookText = {
              flex: 1,
              fontSize: 16,
              paddingBottom: 12,
              paddingLeft: 10,
              paddingRight: 10,
              textAlign: 'center',
            };

            for (let i = 0; i < dataLength; i++) {
              helperArray.push(
                <View key={results.rows.item(i).b} style={bookView}>
                  <TouchableOpacity
                    onPress={() => selectBook(results.rows.item(i))}>
                    <Text style={bookText}>{results.rows.item(i).n}</Text>
                  </TouchableOpacity>
                  <View style={bookDivider} />
                </View>,
              );
            }

            setFlatListItems(helperArray);
          }
        },
      );
    });
  };

  const parentView = {display: 'flex', flexDirection: 'column', height: '100%'};

  return (
    <View style={parentView}>
      <ScrollView style={styles.scrollView}>{flatListItems}</ScrollView>
    </View>
  );
};

export default Books;

const styles = StyleSheet.create({
  scrollView: {flex: 1},
});
