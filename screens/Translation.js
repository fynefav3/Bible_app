import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SQlite from 'react-native-sqlite-storage';

let db = SQlite.openDatabase({
  name: 'bible-sqlite.db',
  createFromLocation: 1,
});
const Translation = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
  };
  let [flatListItems, setFlatListItems] = useState([]);

  useEffect(() => {
    loadTranslation();
  });

  const loadTranslation = async () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM bible_version_key', [], (_tx, results) => {
        let dataLength = results.rows.length;
        if (dataLength > 0) {
          let helperArray = [];

          let verseView = {
            flexDirection: isPortrait() ? 'column' : 'row',
            display: 'flex',
            marginRight: isPortrait() ? 0 : 50,
            color: isDarkMode ? '#ffffff' : '#000000',
          };

          let verseText = {
            flex: 1,
            fontSize: 16,
            padding: 20,
            textAlign: 'center',
            color: isDarkMode ? '#ffffff' : '#000000',
          };

          for (let i = 0; i < dataLength; i++) {
            helperArray.push(
              <TouchableOpacity
                key={results.rows.item(i).id}
                onPress={() => selectTranslation(results.rows.item(i))}>
                <View style={verseView}>
                  <Text key={results.rows.item(i).id} style={verseText}>
                    {results.rows.item(i).version}
                  </Text>
                </View>
              </TouchableOpacity>,
            );
          }

          setFlatListItems(helperArray);
        }
      });
    });
  };
  const selectTranslation = async data => {
    await AsyncStorage.setItem('abbreviation', data.abbreviation);
    await AsyncStorage.setItem('bible_version', data.table);

    navigation.goBack();
  };

  const parentView = {display: 'flex', flexDirection: 'column', height: '100%'};

  return (
    <View style={parentView}>
      <ScrollView style={styles.scrollView}>{flatListItems}</ScrollView>
    </View>
  );
};

export default Translation;

const styles = StyleSheet.create({
  scrollView: {flex: 1},
});
