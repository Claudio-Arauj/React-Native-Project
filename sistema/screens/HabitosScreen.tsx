import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/globalStyles';

export default function HabitosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Hábitos</Text>
      <Text style={styles.subtitulo}>
        Crie e acompanhe seus hábitos saudáveis aqui.
      </Text>
    </View>
  );
}
