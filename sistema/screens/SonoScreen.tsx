import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/globalStyles';

export default function SonoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Sono</Text>
      <Text style={styles.subtitulo}>
        Registre sua rotina de sono e melhore sua qualidade de vida.
      </Text>
    </View>
  );
}
