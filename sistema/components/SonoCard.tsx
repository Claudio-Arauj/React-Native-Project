import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Sono } from '../models/sono';
import styles from '../styles/sonoStyles'

interface Props {
  sono: Sono;
  onPress: () => void;
}

export default function SonoCard({ sono, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, styles.sonoCard, { elevation: 3 }]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Feather name="moon" size={20} color="#7e57c2" style={{ marginRight: 10 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.nome}>Dormir às {sono.horarioDormir}</Text>
          <Text style={styles.info}>
            Notificações: {sono.notificacoesAtivas ? 'Ativas' : 'Desativadas'}
          </Text>
        </View>
        <Feather name="chevron-right" size={24} color="#999" />
      </View>
    </TouchableOpacity>
  );
}

