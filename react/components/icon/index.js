import React from 'react';
import { Image } from 'react-native';
import styles from './style';

/*
  图标图片来自于 https://iconpark.oceanengine.com/official
  取默认配置，大小：48，线段粗细：2，端点拐点选中间
*/
const ICON_MAP = {
  outline: {
    'application-one': require('./outline/application-one.png'),
    'document-folder': require('./outline/document-folder.png'),
    config: require('./outline/config.png'),
    right: require('./outline/right.png'),
    close: require('./outline/close.png'),
  },
  fill: {
    'application-one': require('./fill/application-one.png'),
    'document-folder': require('./fill/document-folder.png'),
    config: require('./fill/config.png'),
    right: require('./outline/right.png'),
  },
};

const Icon = (props) => {
  const { theme = 'outline', name, size = 24 } = props;
  return (
    <Image
      style={{...styles.image, width: size, height: size}}
      source={ICON_MAP[theme][name]}
    />
  )
};

export default Icon;
