import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/globalStyles';

export default function PerfilScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Perfil</Text>
      <Text style={styles.subtitulo}>
        Visualize e edite suas informações pessoais.
      </Text>
    </View>
  );
}
