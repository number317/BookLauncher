import React from 'react';
import { Image } from 'react-native';
import styles from './style';

const ICON_MAP = {
  outline: {
    'application-one': require('./outline/application-one.png'),
    'document-folder': require('./outline/document-folder.png'),
    config: require('./outline/config.png'),
  },
  fill: {
    'application-one': require('./fill/application-one.png'),
    'document-folder': require('./fill/document-folder.png'),
    config: require('./fill/config.png'),
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
