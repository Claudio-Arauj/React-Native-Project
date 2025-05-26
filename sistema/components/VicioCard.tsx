import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from '../styles/globalStyles';

interface Props {
  vicio: {
    id: string;
    nome: string;
    icon: any;
    cor: string;
  };
}

export default function VicioCard({ vicio }: Props) {
  return (
    <View style={[styles.cardSelecionadoVicio, { backgroundColor: vicio.cor }]}>
      <FontAwesome5 name={vicio.icon} size={24} color="white" />
      <Text style={styles.nomeSelecionado}>{vicio.nome}</Text>
    </View>
  );
}
