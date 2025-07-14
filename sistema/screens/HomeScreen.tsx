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
import { buscarMensagensMotivacionais } from '../services/mensagensService';
import { buscarUsuario } from '../services/usuarioService';

import { MetaHabito } from '../models/habito';
import { VicioSelecionado } from '../models/vicio';
import { Diario } from '../models/diario';
import { Sono } from '../models/sono';
import { Usuario } from '../models/usuario';
import { ImageBackground } from 'react-native'; 
import modern from '../styles/homeStyle'

export default function HomeScreen() {
  const auth = getAuth(app);
  const user = auth.currentUser;

  const [nome, setNome] = useState<string>('');
  const [habitos, setHabitos] = useState<MetaHabito[]>([]);
  const [reflexoes, setReflexoes] = useState<Diario[]>([]);
  const [vicios, setVicios] = useState<VicioSelecionado[]>([]);
  const [sono, setSono] = useState<Sono | null>(null);
  const [mensagemAtual, setMensagemAtual] = useState<string>('');

  useEffect(() => {
    async function carregarMensagens() {
      const mensagens = await buscarMensagensMotivacionais();
      if (mensagens.length > 0) {
        const idx = Math.floor(Math.random() * mensagens.length);
        setMensagemAtual(mensagens[idx]);
      }
    }

    carregarMensagens();
  }, []);

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

    buscarUsuario(user.uid).then((usuario) => {
      if (usuario) {
        setNome(usuario.nome);
      }
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
      <ImageBackground
        source={{ uri: `https://picsum.photos/800/300?random=${Date.now()}` }}
        style={modern.avatarContainer}
        resizeMode="cover"
      >
        <View style={modern.overlay}> {/* Para escurecer e dar contraste ao texto */}
          <Animatable.Image
            animation="flipInY"
            source={require('../assets/logo.png')} // se quiser manter a logo no topo
            resizeMode="contain"
            style={modern.logo}
          />
          <View style={modern.emailContainer}>
            <Ionicons name="person-circle-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={[modern.email, { color: '#fff' }]}>
              Bem-vindo, {nome || 'usuário'}!
            </Text>
          </View>
        </View>
      </ImageBackground>

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

