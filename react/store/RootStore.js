import { NativeModules, Dimensions } from 'react-native';
import { useLocalObservable } from "mobx-react-lite"
import { getLocalData } from '../components/global-store';
import GlobalConfig from '../components/global-config';
import I18nMap from '../locale';

const { _LocalInfo, _AppManager, _BookManager } = NativeModules;

const { NAVIGATION_BAR_WIDTH, APP_CARD_WIDTH, APP_CARD_HEIGHT } = GlobalConfig;

const RootStore = () => useLocalObservable(() => ({
  hello: 'Hello world!',
  setHello(data) {
    this.hello = data;
  },
  appMode: '',
  setAppMode(data) {
    this.appMode = data;
  },
  batteryLevel: 0,
  setBatteryLevel(data) {
    this.batteryLevel = data;
  },
  isCharging: false,
  setIsCharging(data) {
    this.isCharging = data;
  },
  bookLoading: true,
  setBookLoading(data) {
    this.bookLoading = data;
  },
  bookList: [],
  setBookList(data) {
    this.bookList = data;
  },
  async queryBookList() {
    this,this.setBookLoading(true);
    try {
      const booksStr = await _BookManager.getBookList();
      this.bookList = JSON.parse(booksStr);
    } catch (error) {
      console.error('error: ', error);
      this.bookList = [];
    }
    this.setBookLoading(false);
  },
  appList: [],
  setAppList(data) {
    this.appList = data;
  },
  queryAppList() {
    _AppManager.getAppList(async (result) => {
      const cacheAppList = await getLocalData('appList') || [];
      const notCacheList = result.filter(x => !cacheAppList.some(y => y.packageName === x.packageName));
      cacheAppList.push(...notCacheList);
      this.setAppList(cacheAppList);

      const { width, height } = Dimensions.get('window');
      const appCountPerLine = Math.floor((width - NAVIGATION_BAR_WIDTH) / APP_CARD_WIDTH);
      const appPaddingHorizontal = (width - appCountPerLine * APP_CARD_WIDTH - NAVIGATION_BAR_WIDTH) / 2;

      const appCountPerColumn = Math.floor(height / APP_CARD_HEIGHT);
      const appPaddingVertical = (height - appCountPerColumn * APP_CARD_HEIGHT) / 2;

      const pageSizeApp = appCountPerLine * appCountPerColumn;

      this.setAppPageSize(pageSizeApp);
      this.setAppPadding([appPaddingHorizontal, appPaddingVertical]);
      this.setAppLoading(false);
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
  async queryLocalLang() {
    return new Promise(resolve => {
      _LocalInfo.getLocalLanguage((currentLang) => {
        this.setLang(currentLang);
        resolve();
      });
    });
  },
  formatMessage(key) {
    if (I18nMap[this.lang]) {
      return I18nMap[this.lang][key] || key;
    } else {
      return I18nMap.en[key] || key;
    }
  },
  queryCacheConfig() {
    return Promise.all([
      getLocalData('hello'),
      getLocalData('appMode'),
      getLocalData('lang'),
    ]);
  },
}));

export default RootStore;
