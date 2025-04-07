import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, TouchableWithoutFeedback, TouchableOpacity, InteractionManager } from 'react-native';
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
      {
        currentMenu === 'Book' && rootStore.bookPages > 1 && (
          <View style={styles.pager}>
            <TouchableOpacity onPress={() => rootStore.setBookCurrentPage(Math.max(1, rootStore.bookCurrentPage - 1))}>
              <Icon name="arrow-up" size={20} />
            </TouchableOpacity>
            <Text>{rootStore.bookCurrentPage}</Text>
            <Text>/</Text>
            <Text>{rootStore.bookPages}</Text>
            <TouchableOpacity onPress={() => rootStore.setBookCurrentPage(Math.min(rootStore.bookPages, rootStore.bookCurrentPage + 1))}>
              <Icon name="arrow-down" size={20} />
            </TouchableOpacity>
          </View>
        )
      }
      {
        currentMenu === 'App' && rootStore.appPages > 1 && (
          <View style={styles.pager}>
            <TouchableOpacity onPress={() => rootStore.setAppCurrentPage(Math.max(1, rootStore.appCurrentPage - 1))}>
              <Icon name="arrow-up" size={20} />
            </TouchableOpacity>
            <Text>{rootStore.appCurrentPage}</Text>
            <Text>/</Text>
            <Text>{rootStore.appPages}</Text>
            <TouchableOpacity onPress={() => rootStore.setAppCurrentPage(Math.min(rootStore.appPages, rootStore.appCurrentPage + 1))}>
              <Icon name="arrow-down" size={20} />
            </TouchableOpacity>
          </View>
        )
      }
    </View> 
  )
};

export default observer(NavigationBar);
