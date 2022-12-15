import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SQlite from 'react-native-sqlite-storage';
import {FlatGrid} from 'react-native-super-grid';

let db = SQlite.openDatabase({
  name: 'bible-sqlite.db',
  createFromLocation: 1,
});

const Chapters = ({navigation}) => {
  let [flatListItems, setFlatListItems] = useState([]);
  let [book, setBook] = useState(1);

  useEffect(() => {
    loadChapters();
  });

  const selectBook = async c => {
    await AsyncStorage.setItem('chapter', `${c}`);
    navigation.goBack();
  };

  const loadBook = async () => {
    const value = await AsyncStorage.getItem('book');
    if (value !== null) {
      setBook(value);
    }
  };

  const loadChapters = async () => {
    await loadBook();

    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM t_kjv WHERE b = ${book} GROUP BY c`,
        [],
        (_tx, results) => {
          let dataLength = results.rows.length;
          if (dataLength > 0) {
            let helperArray = [];

            // let bookText = {
            //   flex: 1,
            //   fontSize: 16,
            //   paddingBottom: 12,
            //   paddingLeft: 10,
            //   paddingRight: 10,
            //   textAlign: 'center',
            // };

            for (let i = 0; i < dataLength; i++) {
              // <TouchableOpacity
              //   key={results.rows.item(i).id}
              //   onPress={() => selectBook(results.rows.item(i).c)}>
              //   <Text style={bookText}>{}</Text>
              // </TouchableOpacity>,
              helperArray.push(results.rows.item(i));
            }

            setFlatListItems(helperArray);
          }
        },
      );
    });
  };

  const parentView = {
    height: '100%',
  };

  return (
    <View style={parentView}>
      <FlatGrid
        itemDimension={60}
        data={flatListItems}
        style={styles.gridView}
        staticDimension={450}
        fixed
        spacing={10}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => selectBook(item.c)}>
            <View style={[styles.itemContainer, {backgroundColor: item.code}]}>
              <Text style={styles.itemName}>{item.c}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Chapters;

const styles = StyleSheet.create({
  gridView: {
    marginTop: 10,
    flex: 1,
    width: '100%',
  },
  itemContainer: {
    justifyContent: 'center',
    borderRadius: 5,
    padding: 10,
    height: 100,
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#000000',
  },
});
