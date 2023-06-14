import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '../icon';
import styles from './style';

const NavigationBar = (props) => {
  const { currentMenu } = props;
  const navigation = useNavigation();

  return (
    <View style={styles.bar}>
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.navigate('Book')}>
          <View style={styles.iconWrap}>
            <Icon name="document-folder" theme={currentMenu === 'Book' ? 'fill' : 'outline'} size={40} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('App')}>
          <View style={styles.iconWrap}>
            <Icon name="application-one" theme={currentMenu === 'App' ? 'fill' : 'outline'} size={40} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
          <Icon name="config" theme={currentMenu === 'Setting' ? 'fill' : 'outline'} size={40} />
        </TouchableOpacity>
      </View>
    </View> 
  )
};

export default NavigationBar;
