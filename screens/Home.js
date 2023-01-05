import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  useColorScheme,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import SQlite from 'react-native-sqlite-storage';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

let db = SQlite.openDatabase({
  name: 'bible-sqlite.db',
  createFromLocation: 1,
});

const Home = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const bookText = {
    color: isDarkMode ? '#ffffff' : '#ff0000',
    fontSize: 20,
    marginLeft: 20,
    fontWeight: 'bold',
  };

  const floatingBookText = {
    fontStyle: 'italic',
    marginLeft: 10,
    fontSize: 12,
    color: isDarkMode ? '#ffffff' : '#030303',
  };

  const parentView = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: isDarkMode ? '#030303' : '#ffffff',
  };

  const iconTheme = {
    color: isDarkMode ? '#ffffff' : '#030303',
  };

  const navigation = useNavigation();

  const isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
  };

  const bookmarkView = {
    display: 'flex',
    flexDirection: isPortrait() ? 'row' : 'column',
    alignItems: 'center',
  };

  let [flatListItems, setFlatListItems] = useState([]);
  let [book, setBook] = useState(1);
  let [translation, setTranslation] = useState('t_kjv');
  let [abbv, setAbbv] = useState('KJV');
  let [bookTitle, setBookTitle] = useState('Genesis');
  let [chapter, setChapter] = useState(1);

  useEffect(() => {
    loadBible();
  });

  const fetchBook = async () => {
    const value = await AsyncStorage.getItem('book');
    if (value !== null) {
      setBook(value);
    }

    const title = await AsyncStorage.getItem('bookTitle');
    if (title !== null) {
      setBookTitle(title);
    }

    const valuec = await AsyncStorage.getItem('chapter');
    if (valuec !== null) {
      setChapter(valuec);
    }

    const trnl = await AsyncStorage.getItem('bible_version');
    if (trnl !== null) {
      setTranslation(trnl);
    }

    const abb = await AsyncStorage.getItem('abbreviation');
    if (abb !== null) {
      setAbbv(abb);
    }
  };

  const loadBible = async () => {
    await fetchBook();

    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM ${translation} WHERE b = ${book} AND c = ${chapter}`,
        [],
        (_tx, results) => {
          let dataLength = results.rows.length;
          if (dataLength > 0) {
            let helperArray = [];

            let verseView = {
              flexDirection: isPortrait() ? 'row' : 'column',
              display: 'flex',
              marginRight: 12,
            };

            let verseNumber = {
              fontSize: 16,
              paddingLeft: 12,
              color: isDarkMode ? 'red' : '#ff0000',
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
                  onPress={() => {}}
                  onLongPress={() =>
                    addBookmark(
                      results.rows.item(i).b,
                      results.rows.item(i).c,
                      results.rows.item(i).v,
                    )
                  }>
                  <View style={verseView}>
                    <Text style={verseNumber}>{i + 1}.</Text>
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

    // create table
    createBookmarkTable();
  };

  const createBookmarkTable = () => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='bookmark'",
        [],
        function (tx, res) {
          if (res.rows.length === 0) {
            txn.executeSql('DROP TABLE IF EXISTS bookmark', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS bookmark(id INTEGER PRIMARY KEY AUTOINCREMENT, b INT(15), c INT(15), v INT(15))',
              [],
            );
          }
        },
      );
    });
  };

  const addBookmark = (b, c, v) => {
    db.transaction(function (txn) {
      txn.executeSql(
        `SELECT * FROM bookmark WHERE b=${b} AND c=${c} AND v=${v}`,
        [],
        function (tx, res) {
          if (res.rows.length < 1) {
            txn.executeSql(
              'INSERT INTO bookmark (b, c, v) VALUES (?,?,?)',
              [b, c, v],
              function (_, __) {
                // console.log('Results', res.rowsAffected);
                // if (res.rowsAffected > 0) {
                Alert.alert('Bible verse added to bookmark');
                // else {
                //   Alert.alert('Failed....');
                // }
              },
            );
          }
        },
      );
    });
  };

  return (
    <View style={parentView}>
      <View style={styles.ySpacer} />
      <View style={styles.ySpacer} />
      <View style={styles.ySpacer} />
      <View style={styles.ySpacer} />
      <View style={styles.headerTwo}>
        <Text style={bookText}>
          {bookTitle} {chapter}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Translation')}>
          <Text style={floatingBookText}>{abbv}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.ySpacer} />
      <View style={styles.headerThree}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Books');
          }}>
          <Text style={bookText}>
            {bookTitle} {chapter}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Bookmark')}>
          <View style={bookmarkView}>
            <Image source={require('../assets/bookmark.png')} />
            <Text style={styles.bookmarkText}>Bookmark</Text>
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>{flatListItems}</ScrollView>
      <View style={styles.footer}>
        <View style={styles.divider} />
      </View>
      <View style={styles.footerIcons}>
        <Icon
          onPress={() => navigation.navigate('Bookmark')}
          name="bookmark"
          size={24}
          style={iconTheme}
        />
        <Icon
          onPress={() => navigation.navigate('Search')}
          name="search"
          size={24}
          style={iconTheme}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  headerOne: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 60,
  },
  iconButton: {width: 24, height: 24, marginRight: 20},
  touch: {height: 40},
  headerTwo: {display: 'flex', flexDirection: 'row', alignItems: 'center'},

  headerThree: {
    height: 60,
    width: '100%',
    backgroundColor: '#2E2252',
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  ySpacer: {height: 15},
  bookmarkText: {
    color: '#ffffff',
    fontSize: 16,
    paddingRight: 20,
  },
  scrollView: {
    flex: 1,
    paddingTop: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#922724',
    width: '100%',
    marginVertical: 5,
  },
  footerIcons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingBottom: 30,
    paddingTop: 5,
  },
});
