// components/habitos/HabitoCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MetaHabito } from '../models/habito';
import estilos from '../styles/habitosStyles';
import { Feather } from '@expo/vector-icons';

type Props = {
  habito: MetaHabito;
  onDelete: (id: string) => void;
};

const HabitoCard: React.FC<Props> = ({ habito, onDelete }) => {
  const calcularDias = (data: Date): string => {
    const hoje = new Date();
    const diff = Math.floor((hoje.getTime() - data.getTime()) / (1000 * 60 * 60 * 24));
    return `${diff} dias atrás`;
  };

  return (
    <View style={[estilos.card, { borderLeftColor: habito.cor || '#ccc', borderLeftWidth: 6 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={estilos.nome}>{habito.nome}</Text>
        <TouchableOpacity onPress={() => onDelete(habito.id)}>
          <Feather name="trash-2" size={18} color="#e74c3c" />
        </TouchableOpacity>
      </View>
      <Text style={estilos.info}>Frequência: {habito.frequencia}</Text>
      <Text style={estilos.info}>Criado há: {calcularDias(new Date(habito.criadoEm))}</Text>
      {habito.lembreteHorario && (
        <Text style={estilos.info}>Lembrete: {habito.lembreteHorario}</Text>
      )}
    </View>
  );
};

export default HabitoCard;
