import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/globalStyles';
import { Sono } from '../models/sono';
import { adicionarSono, observarSonos, excluirSono } from '../services/sonoService';
import { getAuth } from 'firebase/auth';
import app from '../firebase-config';
import SonoCard from '../components/SonoCard';

import estilos from '../styles/sonoStyles'


function ModalSugestoes({
  visible,
  onClose,
  baseTime,
  onDelete,
}: {
  visible: boolean;
  onClose: () => void;
  baseTime: string;
  onDelete: () => void;
}) {
  const calcularHorarios = (horaBase: string) => {
    const [h, m] = horaBase.split(':').map(Number);
    const baseDate = new Date();
    baseDate.setHours(h, m, 0);
    const ciclos = [1.5, 3, 4.5, 6, 7.5, 9];
    return ciclos.map((c) => {
      const acordar = new Date(baseDate.getTime() + c * 60 * 60 * 1000);
      return acordar.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
  };

  const sugestoes = calcularHorarios(baseTime);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={estilos.modalOverlay}>
        <View style={estilos.modalBonito}>
          <MaterialCommunityIcons name="weather-night" size={42} color="#7e57c2" style={{ alignSelf: 'center', marginBottom: 8 }} />
          <Text style={estilos.modalTituloBonito}>Sugestões para acordar bem</Text>
          <View style={estilos.sugestoesContainer}>
            {sugestoes.map((hora, i) => (
              <View key={i} style={estilos.horarioItemBonito}>
                <Text style={estilos.horarioTextoBonito}>{hora}</Text>
              </View>
            ))}
          </View>

          <View style={estilos.botoesModal}>
            <TouchableOpacity style={[estilos.botaoBonito, { backgroundColor: '#ccc' }]} onPress={onClose}>
              <Text style={estilos.botaoTextoBonito}>Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[estilos.botaoBonito, { backgroundColor: '#ff6b6b' }]} onPress={onDelete}>
              <Text style={estilos.botaoTextoBonito}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}


export default function SonoScreen() {
  const auth = getAuth(app);
  const user = auth.currentUser;

  const [horaSonoCadastro, setHoraSonoCadastro] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [sonos, setSonos] = useState<Sono[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [sonoSelecionado, setSonoSelecionado] = useState<Sono | null>(null);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const [confirmarExclusao, setConfirmarExclusao] = useState<Sono | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = observarSonos(user.uid, setSonos);
    return () => unsubscribe();
  }, [user]);

  const salvarHorarioSono = async () => {
    if (!user) return;
    const horarioFormatado = horaSonoCadastro.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    try {
      await adicionarSono(user.uid, {
        userId: user.uid,
        horarioDormir: horarioFormatado,
        notificacoesAtivas,
        criadoEm: new Date(),
      });
      setModalVisible(false);
      setNotificacoesAtivas(true);
    } catch (error) {
      console.error('Erro ao salvar sono:', error);
    }
  };

  const handleExcluirSono = async () => {
    if (!user || !confirmarExclusao) return;
    try {
      await excluirSono(user.uid, confirmarExclusao.id);
      setConfirmarExclusao(null);
      setSonoSelecionado(null);
    } catch (error) {
      console.error('Erro ao excluir sono:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#e6e6e6' }]}>
      <Text style={estilos.title}>Horários de Sono</Text>
      <Text style={estilos.subtitle}> Toque em um horário para ver sugestões de acordar ou excluir </Text>

      <FlatList
        data={sonos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SonoCard
            sono={item}
            onPress={() => {
              setSonoSelecionado(item);
            }}
          />
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum horário salvo ainda.</Text>}
      />

      <TouchableOpacity style={estilos.botao} onPress={() => setModalVisible(true)}>
        <Text style={estilos.botaoTexto}>+ Novo horário</Text>
      </TouchableOpacity>

      {/* Modal para cadastro */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={estilos.modalOverlay}>
          <View style={estilos.modalContainer}>
            <Text style={estilos.modalTitulo}>Cadastrar horário de sono</Text>

            <TouchableOpacity style={estilos.inputBox} onPress={() => setShowPicker(true)}>
              <Text style={estilos.labelInput}>Hora para dormir</Text>
              <Text style={estilos.valorInput}>
                {horaSonoCadastro.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>

            <View style={[estilos.inputBox, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
              <Text style={estilos.labelInput}>Notificações</Text>
              <Switch
                value={notificacoesAtivas}
                onValueChange={setNotificacoesAtivas}
                thumbColor={notificacoesAtivas ? '#2b8a3e' : '#ccc'}
              />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: 'gray', fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={salvarHorarioSono}>
                <Text style={{ color: '#2b8a3e', fontWeight: '600' }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ModalSugestoes
        visible={!!sonoSelecionado}
        onClose={() => setSonoSelecionado(null)}
        baseTime={sonoSelecionado?.horarioDormir || '00:00:00'}
        onDelete={() => setConfirmarExclusao(sonoSelecionado)}
      />

      {/* Modal de confirmação de exclusão */}
      <Modal visible={!!confirmarExclusao} transparent animationType="fade">
        <View style={estilos.modalOverlay}>
          <View style={estilos.modalContainer}>
            <Text style={estilos.modalTitulo}>Deseja realmente excluir este horário?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity onPress={() => setConfirmarExclusao(null)}>
                <Text style={{ color: 'gray', fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleExcluirSono}>
                <Text style={{ color: '#ff6b6b', fontWeight: '600' }}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {showPicker && (
        <DateTimePicker
          value={horaSonoCadastro}
          mode="time"
          is24Hour
          display="default"
          onChange={(_, selected) => {
            setShowPicker(false);
            if (selected) setHoraSonoCadastro(selected);
          }}
        />
      )}
    </SafeAreaView>
  );
}

