import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../styles/globalStyles';

export default function HomeScreen() {
  const user = {
    nome: 'Bruno Costa',
    email: 'bruno@email.com',
    criado_em: new Date('2025-04-01'),
    avatar: 'https://i.pravatar.cc/150?img=12',
  };

  const goals = [
    { id: '1', nome: 'Meditar' },
    { id: '2', nome: 'Ler livro' },
  ];

  const goalProgress = [
    { goal_id: '1', concluido: true },
    { goal_id: '1', concluido: false },
    { goal_id: '2', concluido: true },
  ];

  const reflexoes = [
    { sentimento: 4 }, { sentimento: 2 },
  ];

  const adictions = [
    { nome: 'Café', gasto: 60.5 },
  ];

  const sleepSchedule = { horario_dormir: '22:30', notificacoes_ativas: true };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f2f2f2' }} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Header */}
      <View style={modern.avatarContainer}>
        <Image source={{ uri: user.avatar }} style={modern.avatar} />
        <Text style={modern.nome}>{user.nome}</Text>
        <Text style={modern.email}>{user.email}</Text>
      </View>

      {/* Cards */}
      <View style={modern.card}>
        <Text style={modern.cardTitle}>Resumo</Text>
        <View style={modern.statsRow}>
          <View style={modern.stat}>
            <Ionicons name="checkmark-circle" size={26} color="#2b8a3e" />
            <Text style={modern.statValue}>{goals.length}</Text>
            <Text style={modern.statLabel}>Metas</Text>
          </View>
          <View style={modern.stat}>
            <MaterialCommunityIcons name="progress-check" size={26} color="#2b8a3e" />
            <Text style={modern.statValue}>
              {goalProgress.filter(p => p.concluido).length}
            </Text>
            <Text style={modern.statLabel}>Concluídas</Text>
          </View>
          <View style={modern.stat}>
            <Ionicons name="calendar" size={26} color="#2b8a3e" />
            <Text style={modern.statValue}>{reflexoes.length}</Text>
            <Text style={modern.statLabel}>Reflexões</Text>
          </View>
        </View>
      </View>

      <View style={modern.card}>
        <Text style={modern.cardTitle}>Saúde e Bem-estar</Text>
        <View style={modern.row}>
          <Text style={modern.label}>Dormir às:</Text>
          <Text style={modern.value}>{sleepSchedule.horario_dormir}h</Text>
        </View>
        <View style={modern.row}>
          <Text style={modern.label}>Notificações:</Text>
          <Text style={modern.value}>{sleepSchedule.notificacoes_ativas ? 'Ativas' : 'Desativadas'}</Text>
        </View>
        <View style={modern.row}>
          <Text style={modern.label}>Vícios:</Text>
          <Text style={modern.value}>{adictions.length}</Text>
        </View>
        <View style={modern.row}>
          <Text style={modern.label}>Gasto estimado:</Text>
          <Text style={modern.value}>R$ {adictions.reduce((s, a) => s + a.gasto, 0).toFixed(2)}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const modern = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 30,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#2b8a3e',
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2b8a3e',
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2b8a3e',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    color: '#444',
    fontSize: 14,
  },
  value: {
    fontWeight: '600',
    color: '#000',
  },
});
