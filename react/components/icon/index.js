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
    'arrow-down': require('./outline/arrow-down.png'),
    'arrow-up': require('./outline/arrow-up.png'),
    'battery-empty': require('./outline/battery-empty.png'),
    'battery-charge': require('./outline/battery-charge.png'),
    'battery-full': require('./outline/battery-full.png'),
    'battery-working': require('./outline/battery-working.png'),
    'battery-working-one': require('./outline/battery-working-one.png'),
    'check-one': require('./outline/check-one.png'),
    close: require('./outline/close.png'),
    config: require('./outline/config.png'),
    'document-folder': require('./outline/document-folder.png'),
    left: require('./outline/left.png'),
    right: require('./outline/right.png'),
    round: require('./outline/round.png'),
  },
  fill: {
    'application-one': require('./fill/application-one.png'),
    'arrow-down': require('./outline/arrow-down.png'),
    'arrow-up': require('./outline/arrow-up.png'),
    'battery-empty': require('./outline/battery-empty.png'),
    'battery-charge': require('./outline/battery-charge.png'),
    'battery-full': require('./outline/battery-full.png'),
    'battery-working': require('./outline/battery-working.png'),
    'battery-working-one': require('./outline/battery-working-one.png'),
    'check-one': require('./fill/check-one.png'),
    close: require('./outline/close.png'),
    config: require('./fill/config.png'),
    'document-folder': require('./fill/document-folder.png'),
    left: require('./outline/left.png'),
    right: require('./outline/right.png'),
    round: require('./fill/round.png'),
  },
};

const Icon = (props) => {
  const { theme = 'outline', name, size = 24, style } = props;
  return (
    <Image
      style={{...styles.image, width: size, height: size, ...style }}
      source={ICON_MAP[theme][name]}
    />
  )
};

export default Icon;
