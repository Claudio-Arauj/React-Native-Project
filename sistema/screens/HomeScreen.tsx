import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import app from '../firebase-config';

import { observarHabitos } from '../services/habitoService';
import { buscarDiarios } from '../services/diarioService';
import { observarSonos } from '../services/sonoService';
import { observarVicios } from '../services/vicioService';

import { MetaHabito } from '../models/habito';
import { VicioSelecionado } from '../models/vicio';
import { Diario } from '../models/diario';
import { Sono } from '../models/sono';

export default function HomeScreen() {
  const auth = getAuth(app);
  const user = auth.currentUser;

  const [habitos, setHabitos] = useState<MetaHabito[]>([]);
  const [reflexoes, setReflexoes] = useState<Diario[]>([]);
  const [vicios, setVicios] = useState<VicioSelecionado[]>([]);
  const [sono, setSono] = useState<Sono | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubHabitos = observarHabitos(user.uid, setHabitos);
    const unsubVicios = observarVicios(user.uid, setVicios);

    const unsubSonos = observarSonos(user.uid, (dados) => {
      if (dados.length > 0) {
        const agora = new Date();
        const agoraMinutos = agora.getHours() * 60 + agora.getMinutes();

        // Converte o horário de dormir para minutos e acha o mais próximo
        const maisProximo = dados.reduce((prev, atual) => {
          const [h, m] = atual.horarioDormir.split(':').map(Number);
          const minutos = h * 60 + m;
          const diffAtual = Math.abs(minutos - agoraMinutos);
          const [hPrev, mPrev] = prev.horarioDormir.split(':').map(Number);
          const diffPrev = Math.abs(hPrev * 60 + mPrev - agoraMinutos);
          return diffAtual < diffPrev ? atual : prev;
        });

        setSono(maisProximo);
      }
    });

    buscarDiarios().then((diarios) => {
      const lista = Object.values(diarios || {});
      setReflexoes(lista);
    });

    return () => {
      unsubHabitos?.();
      unsubVicios?.();
      unsubSonos?.();
    };
  }, [user]);


  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando usuário...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f2f2f2' }} contentContainerStyle={{ paddingBottom: 140 }}>
      {/* Cabeçalho com avatar */}
      <View style={modern.avatarContainer}>
        <Animatable.Image
          animation="flipInY"
          source={require('../assets/logo.png')}
          resizeMode="contain"
          style={modern.logo}
        />
        <View style={modern.emailContainer}>
          <Ionicons name="mail-outline" size={16} color="#2b8a3e" style={{ marginRight: 6 }} />
          <Text style={modern.email}>{user.email}</Text>
        </View>
      </View>

      {/* Resumo */}
      <View style={modern.card}>
        <Text style={modern.cardTitle}>Resumo</Text>
        <View style={modern.statsRow}>
          <View style={modern.stat}>
            <Ionicons name="leaf" size={26} color="#2b8a3e" />
            <Text style={modern.statValue}>{habitos.length}</Text>
            <Text style={modern.statLabel}>Hábitos</Text>
          </View>
          <View style={modern.stat}>
            <MaterialCommunityIcons name="emoticon-happy-outline" size={26} color="#2b8a3e" />
            <Text style={modern.statValue}>{reflexoes.length}</Text>
            <Text style={modern.statLabel}>Reflexões</Text>
          </View>
          <View style={modern.stat}>
            <Ionicons name="cafe" size={26} color="#2b8a3e" />
            <Text style={modern.statValue}>{vicios.length}</Text>
            <Text style={modern.statLabel}>Vícios</Text>
          </View>
        </View>
      </View>

      {/* Saúde e bem-estar */}
      <View style={modern.card}>
        <Text style={modern.cardTitle}>Saúde e Bem-estar</Text>
        <View style={modern.row}>
          <Text style={modern.label}>Dormir às:</Text>
          <Text style={modern.value}>{sono?.horarioDormir || '--'}h</Text>
        </View>
        <View style={modern.row}>
          <Text style={modern.label}>Notificações:</Text>
          <Text style={modern.value}>{sono?.notificacoesAtivas ? 'Ativas' : 'Desativadas'}</Text>
        </View>
      </View>

      {/* Lista de hábitos */}
      <View style={modern.card}>
        <Text style={modern.cardTitle}>Seus hábitos</Text>
        {habitos.map((habito) => (
          <View key={habito.id} style={modern.habitItem}>
            <Ionicons name="checkmark-circle-outline" size={18} color="#2b8a3e" />
            <Text style={modern.habitText}>{habito.nome}</Text>
          </View>
        ))}
      </View>

      {/* Lista de vícios */}
      <View style={modern.card}>
        <Text style={modern.cardTitle}>Seus vícios</Text>
        {vicios.map((vicio) => (
          <View key={vicio.id} style={modern.habitItem}>
            <Ionicons name="alert-circle-outline" size={18} color="#c0392b" />
            <Text style={modern.habitText}>{vicio.nome}</Text>
          </View>
        ))}
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
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#2b2b2b',
  },
  logo: {
  width: 100,
  height: 100,
  marginBottom: 12,
},

emailContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#eafbea',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 20,
},

email: {
  fontSize: 14,
  color: '#2b8a3e',
  fontWeight: '600',
},
});
