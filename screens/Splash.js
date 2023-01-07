import {StyleSheet, Image, View} from 'react-native';
import React, {useEffect} from 'react';

const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Home');
    }, 3000);
  });

  return (
    <View style={styles.parentView}>
      <View style={styles.subParent}>
        <Image
          source={require('../assets/splash.png')}
          style={styles.splashImg}
        />
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  parentView: {backgroundColor: '#060918', flex: 1},
  subParent: {flex: 1, paddingTop: 50},
  splashImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
