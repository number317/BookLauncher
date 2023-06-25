import { NativeModules } from 'react-native';
import { useLocalObservable } from "mobx-react-lite"
import { getLocalData } from '../components/global-store';
import I18nMap from '../locale';

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
    this.lang= data;
  },
  queryLocalLang() {
    _LocalInfo.getLocalLanguage((currentLang) => {
      this.lang= currentLang;
    });
  },
  formatMessage(key) {
    if (I18nMap[this.lang]) {
      return I18nMap[this.lang][key] || key;
    } else {
      return I18nMap.en[key] || key;
    }
  },
}));

export default RootStore;
