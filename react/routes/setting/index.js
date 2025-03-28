import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NavigationBar from '../../components/navigation-bar';
import Modal from '../../components/modal';
import Gray16 from '../../components/gray16';
import Icon from '../../components/icon';
import Check from '../../components/check';
import { setLocalData } from '../../components/global-store';
import AppView from './app-view';
import Store from '../../store';
import styles from './style';

const Setting = () => {
  const { rootStore } = useContext(Store);
  const navigation = useNavigation();
  const { formatMessage } = rootStore;
  const [showModal, setShowModal] = useState(false); 

  const handleCloseModal = (modalName) => {
    setShowModal(false);
    if (modalName === 'appView') {
      const cacheAppList = rootStore.appList.slice();
      setLocalData('appList', cacheAppList);
    }
  }

  const handleResetApp = () => {
    rootStore.setHideList([]);
    rootStore.setAppMode('book');
    rootStore.queryAppList();

    setLocalData('appMode', 'book');
    setLocalData('appList', []);
  }

  return (
    <View style={styles.main}>
      <NavigationBar currentMenu="Setting" />
      <View style={styles.setting}>
        <View style={styles.header}>
          {
            rootStore.appMode === 'simple' && (
              <TouchableOpacity onPress={() => navigation.navigate('App')}>
                <Icon name="left" size={40} />
              </TouchableOpacity>
            )
          }
          <Text style={styles.title}>{formatMessage('setting')}</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.formItem}>
            <Text>{formatMessage('setting.appmode.setting')}</Text>
            <View style={styles.action}>
              <Check
                checked={rootStore.appMode === 'book'}
                text={formatMessage('setting.appmode.book')}
                onCheck={() => {
                  rootStore.setAppMode('book');
                  setLocalData('appMode', 'book');
                }}
              />
              <Check
                checked={rootStore.appMode === 'simple'}
                text={formatMessage('setting.appmode.simple')}
                onCheck={() => {
                  rootStore.setAppMode('simple');
                  setLocalData('appMode', 'simple');
                }}
              />
            </View>
          </View>
          <TouchableOpacity onPress={() => setShowModal('language')}>
            <View style={styles.formItem}>
              <Text>{formatMessage('setting.language.setting')}</Text>
              <Icon name="right" size={40} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowModal('appView')}>
            <View style={styles.formItem}>
              <Text>{formatMessage('setting.app.view')}</Text>
              <Icon name="right" size={40} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowModal('grayTest')}>
            <View style={styles.formItem}>
              <Text>{formatMessage('setting.gray.test')}</Text>
              <Icon name="right" size={40} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleResetApp}>
            <View style={styles.formItem}>
              <Text>{formatMessage('setting.app.reset')}</Text>
              <Icon name="right" size={40} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowModal('appInfo')}>
            <View style={styles.formItemLast}>
              <Text>{formatMessage('setting.app.info')}</Text>
              <Icon name="right" size={40} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {
        showModal === 'language' && (
          <Modal handleClose={handleCloseModal} displayType="bottom">
            <View>
              <View>
                <Text>English</Text>
                <Text>简体中文</Text>
              </View>
            </View>
          </Modal>
        )
      }
      {
        showModal === 'appView' && (
          <Modal
            handleClose={() => handleCloseModal('appView')}
            displayType="fullscreen"
          >
            <AppView />
          </Modal>
        )
      }
      {
        showModal === 'grayTest' && (
          <Modal handleClose={handleCloseModal} displayType="fullscreen">
            <View style={styles.grayTest}>
              <Gray16 />
            </View>
          </Modal>
        )
      }
      {
        showModal === 'appInfo' && (
          <Modal handleClose={handleCloseModal} displayType="center">
            <Text>appInfo</Text>
          </Modal>
        )
      }
    </View>
  );
};

export default observer(Setting);
