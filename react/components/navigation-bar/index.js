import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { View, TouchableWithoutFeedback, InteractionManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Store from '../../store';
import Icon from '../icon';
import styles from './style';

const NavigationBar = (props) => {
  const { currentMenu } = props;
  const { rootStore } = useContext(Store);
  const navigation = useNavigation();

  const handleNavigation = (page) => {
    InteractionManager.runAfterInteractions(() => {
      navigation.navigate(page);
    });
  };

  return rootStore.appMode === 'book' && (
    <View style={styles.bar}>
      <View style={styles.top}>
        <TouchableWithoutFeedback onPress={() => handleNavigation('Book')}>
          <View style={styles.iconWrap}>
            <Icon name="document-folder" theme={currentMenu === 'Book' ? 'fill' : 'outline'} size={40} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => handleNavigation('App')}>
          <View style={styles.iconWrap}>
            <Icon name="application-one" theme={currentMenu === 'App' ? 'fill' : 'outline'} size={40} />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.bottom}>
        <TouchableWithoutFeedback onPress={() => handleNavigation('Setting')}>
          <View>
            <Icon name="config" theme={currentMenu === 'Setting' ? 'fill' : 'outline'} size={40} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View> 
  )
};

export default observer(NavigationBar);
