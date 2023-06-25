import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '../icon';
import styles from './style';

const NavigationBar = (props) => {
  const { currentMenu } = props;
  const navigation = useNavigation();

  return (
    <View style={styles.bar}>
      <View style={styles.top}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Book')}>
          <View style={styles.iconWrap}>
            <Icon name="document-folder" theme={currentMenu === 'Book' ? 'fill' : 'outline'} size={40} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('App')}>
          <View style={styles.iconWrap}>
            <Icon name="application-one" theme={currentMenu === 'App' ? 'fill' : 'outline'} size={40} />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.bottom}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Setting')}>
          <View>
            <Icon name="config" theme={currentMenu === 'Setting' ? 'fill' : 'outline'} size={40} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View> 
  )
};

export default NavigationBar;
