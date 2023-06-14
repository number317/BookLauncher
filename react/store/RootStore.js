import { NativeModules } from 'react-native';
import { useLocalObservable } from "mobx-react-lite"
import { getLocalData } from '../components/global-store';

const { _LocalInfo } = NativeModules;

const RootStore = () => useLocalObservable(() => ({
  appList: [],
  setAppList(data) {
    this.appList = data;
  },

  hideList: [],
  setHideList(data) {
    this.hideList = data;
  },
  loadHideList() {
    getLocalData('hideList', (data = []) => {
      this.hideList = data;
    });
  },

  appLoading: true,
  setAppLoading(data) {
    this.appLoading = data;
  },

  appPadding: [],
  setAppPadding(data) {
    this.appPadding = data;
  },

  appPageSize: 0,
  setAppPageSize(data) {
    this.appPageSize = data;
  },

  currentAppPage: 1,
  setCurrentAppPage(data) {
    this.currentAppPage = data;
  },

  lang: '',
  setLang(data) {
    this.lang = data;
  },
  queryLocalLang() {
    _LocalInfo.getLocalLanguage((currentLang) => {
      console.info('info: lang', currentLang);
      this.lang = currentLang;
    });
  },

}));

export default RootStore;
