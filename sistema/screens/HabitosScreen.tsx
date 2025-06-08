import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import styles from '../styles/globalStyles';
import { MetaHabito } from '../models/metaHabito';

export default function HabitosScreen() {
  const [habitos, setHabitos] = useState<MetaHabito[]>([
    new MetaHabito(
      '1',
      'usuario_1',
      'Meditar',
      'diária',
      new Date('2025-06-01'),
      '08:00'
    ),
    new MetaHabito(
      '2',
      'usuario_1',
      'Ler livro',
      'semanal',
      new Date('2025-05-28')
    ),
  ]);

  const calcularDias = (data: Date): string => {
    const hoje = new Date();
    const diff = Math.floor((hoje.getTime() - data.getTime()) / (1000 * 60 * 60 * 24));
    return `${diff} dias atrás`;
  };

  const renderItem = ({ item }: { item: MetaHabito }) => (
    <View style={estilos.card}>
      <Text style={estilos.nome}>{item.nome}</Text>
      <Text style={estilos.info}>Frequência: {item.frequencia}</Text>
      <Text style={estilos.info}>Criado há: {calcularDias(item.criadoEm)}</Text>
      {item.lembreteHorario && (
        <Text style={estilos.info}>Lembrete: {item.lembreteHorario}</Text>
      )}
    </View>
  );

  return ( 
    <View style={[styles.container, { backgroundColor: '#e6e6e6' }]}>
      <Text style={[styles.titulo, {color: '#2b8a3e' }]}>Hábitos</Text>
      <Text style={styles.subtitulo}>Crie e acompanhe seus hábitos saudáveis aqui.</Text>

      <FlatList
        data={habitos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity style={estilos.botao} onPress={() => {}}>
        <Text style={estilos.botaoTexto}>+ Novo Hábito</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: '#555',
  },
  botao: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 3,
  },
  botaoTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
