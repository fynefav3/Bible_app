import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import SQlite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

let db = SQlite.openDatabase({
  name: 'bible-sqlite.db',
  createFromLocation: 1,
});

const Bookmark = () => {
  const isDarkMode = useColorScheme() === 'dark';

  let [flatListItems, setFlatListItems] = useState([]);
  let [translation, setTranslation] = useState('t_kjv');

  useEffect(() => {
    loadBookmark();
  });

  const loadBookmark = async () => {
    const trnl = await AsyncStorage.getItem('bible_version');
    if (trnl !== null) {
      setTranslation(trnl);
    }

    db.transaction(tx => {
      tx.executeSql(
        `SELECT bookmark.id, ${translation}.v, ${translation}.b, ${translation}.t, key_english.n FROM bookmark INNER JOIN ${translation} ON ${translation}.b=bookmark.b AND ${translation}.c=bookmark.c AND ${translation}.v=bookmark.v INNER JOIN key_english ON key_english.b=bookmark.b`,
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
              color: isDarkMode ? '#FF0000' : '#030303',
            };

            let verseText = {
              flex: 1,
              fontSize: 16,
              paddingBottom: 12,
              paddingLeft: 10,
              paddingRight: 10,
              color: isDarkMode ? '#ffffff' : '#030303',
            };

            for (let i = 0; i < dataLength; i++) {
              helperArray.push(
                <TouchableOpacity
                  key={results.rows.item(i).id}
                  onPress={() => removeBookmark(results.rows.item(i).id)}>
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
  
  const removeBookmark = id => {};

  const parentView = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
  };

  return (
    <View style={parentView}>
      <ScrollView style={styles.scrollView}>{flatListItems}</ScrollView>
    </View>
  );
};

export default Bookmark;

const styles = StyleSheet.create({
  scrollView: {flex: 1},
});
