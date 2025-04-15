import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TopStatus from '../../components/top-status';
import NavigationBar from '../../components/navigation-bar';
import Modal from '../../components/modal';
import Gray16 from '../../components/gray16';
import Icon from '../../components/icon';
import Check from '../../components/check';
import { AppIconView } from '../../components/native-components';
import { setLocalData } from '../../components/global-store';
import AppView from './app-view';
import Store from '../../store';
import styles from './style';

const Setting = () => {
  const { rootStore } = useContext(Store);
  const navigation = useNavigation();
  const { formatMessage } = rootStore;
  const [editHello, setEditHello] = useState(false);
  const [showModal, setShowModal] = useState(false); 

  const handleCloseModal = (modalName) => {
    setShowModal(false);
    if (modalName === 'appView') {
      const cacheAppList = rootStore.appList.slice();
      setLocalData('appList', cacheAppList);
    }
  }

  const handleResetApp = () => {
    rootStore.setAppMode('book');
    rootStore.queryAppList();

    setLocalData('appMode', 'book');
    setLocalData('appList', []);
  }

  return (
    <View style={styles.wrap}>
      <TopStatus />
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
            <TouchableOpacity onPress={() => setShowModal('hello')}>
              <View style={styles.formItem}>
                <Text>{formatMessage('setting.hello.text')}</Text>
                {
                  editHello ? (
                    <TextInput
                      autoFocus
                      value={rootStore.hello}
                      maxLength={20}
                      placeholder={rootStore.formatMessage('setting.hello.text')}
                      onChangeText={(text) => rootStore.setHello(text)}
                      onBlur={() => {
                        setEditHello(false);
                        setLocalData('hello', rootStore.hello);
                      }}
                    />
                  ) : (
                    <TouchableOpacity onPress={() => setEditHello(true)}>
                      <Text>{rootStore.hello}</Text>
                    </TouchableOpacity>
                  )
                }
              </View>
            </TouchableOpacity>
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
      </View>
      {
        showModal === 'hello' && (
          <Modal handleClose={handleCloseModal} displayType="center">
            <TextInput
              autoFocus
              value={rootStore.hello}
              placeholder={rootStore.formatMessage('setting.hello.text')}
              onChangeText={(text) => rootStore.setHello(text)}
            />
          </Modal>
        )
      }
      {
        showModal === 'language' && (
          <Modal handleClose={handleCloseModal} displayType="bottom">
            <View style={styles.langList}>
              <TouchableOpacity onPress={() => rootStore.changeLang('en')}>
                <View style={styles.langItem}>
                  <Text>English</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => rootStore.changeLang('zh')}>
                <View style={styles.langItem}>
                  <Text>简体中文</Text>
                </View>
              </TouchableOpacity>
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
            <View style={styles.appInfo}>
              <AppIconView style={styles.appIcon} packageName="com.booklauncher" />
              <Text>BookLauncher</Text>
              <Text>created by cheon</Text>
              <Text>https://github.com/cheon/BookLauncher</Text>
            </View>
          </Modal>
        )
      }
    </View>
  );
};

export default observer(Setting);
