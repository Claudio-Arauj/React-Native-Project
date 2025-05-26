import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import styles from '../styles/globalStyles';
import viciosDisponiveis from '../data/vicios';
import VicioCard from '../components/VicioCard';

export default function HomeScreen() {
  const [viciosSelecionados] = useState<string[]>(['cigarro', 'acucar']);
  const selecionados = viciosDisponiveis.filter(v => viciosSelecionados.includes(v.id));

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Seus Vícios Monitorados</Text>
      <ScrollView>
        {selecionados.map(vicio => (
          <VicioCard key={vicio.id} vicio={vicio} />
        ))}
      </ScrollView>
    </View>
  );
}
