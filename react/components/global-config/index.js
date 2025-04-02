import { Dimensions } from 'react-native';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

// 左侧导航栏的宽度
const NAVIGATION_BAR_WIDTH = 50;
// 顶部状态栏的高度
const STATUS_BAR_HEIGHT = 30;

const LIST_CONTAINER_WIDTH = DEVICE_WIDTH - NAVIGATION_BAR_WIDTH;
const LIST_CONTAINER_HEIGHT = DEVICE_HEIGHT - STATUS_BAR_HEIGHT;

// 应用卡片的宽度和高度
const APP_CARD_WIDTH = 110;
const APP_CARD_HEIGHT = 110;

export default {
  DEVICE_WIDTH,
  DEVICE_HEIGHT,
  NAVIGATION_BAR_WIDTH,
  STATUS_BAR_HEIGHT,
  LIST_CONTAINER_WIDTH,
  LIST_CONTAINER_HEIGHT,
  APP_CARD_WIDTH,
  APP_CARD_HEIGHT,
};
