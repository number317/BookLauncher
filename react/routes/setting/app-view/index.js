import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction, set } from 'mobx';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { AppIconView } from '../../../components/native-components';
import Icon from '../../../components/icon';
import Store from '../../../store';
import styles from './styles';

const AppView = () => {
  const { rootStore } = useContext(Store);

  const handleToggleHide = (appInfo) => {
    runInAction(() => {
      set(appInfo, 'hide', !appInfo.hide);
    });
  };

  const handleUp = (appInfo, index) => {
    const newList = rootStore.appList.slice();
    const prev = newList[index - 1];
    newList[index - 1] = appInfo;
    newList[index] = prev;
    rootStore.setAppList(newList);
  };

  const handleDown = (appInfo, index) => {
    const newList = rootStore.appList.slice();
    const next = newList[index + 1];
    newList[index + 1] = appInfo;
    newList[index] = next;
    rootStore.setAppList(newList);
  };

  return (
    <ScrollView style={styles.list}>
      {
        rootStore.appList.slice().map((appInfo, index) => (
          <View style={styles.item} key={appInfo.packageName}>
            <View style={styles.info}>
              <AppIconView style={styles.icon} packageName={appInfo.packageName} />
              <Text>{appInfo.appName}</Text>
            </View>
              <View style={styles.action}>
                <TouchableOpacity onPress={() => handleToggleHide(appInfo)}>
                  <Text>{rootStore.formatMessage(appInfo.hide ? 'show' : 'hide')}</Text>
                </TouchableOpacity>
                {
                  index !== 0 && (
                    <TouchableOpacity onPress={() => handleUp(appInfo, index)}>
                      <Icon name="arrow-up" />
                    </TouchableOpacity>
                  )
                }
                {
                  index !== rootStore.appList.length - 1 && (
                    <TouchableOpacity onPress={() => handleDown(appInfo, index)}>
                      <Icon name="arrow-down" />
                    </TouchableOpacity>
                  )
                }
              </View>
          </View>
        ))
      }
    </ScrollView>
  );
};

export default observer(AppView);
