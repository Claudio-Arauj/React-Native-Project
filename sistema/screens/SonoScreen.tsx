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
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/globalStyles';
import { Sono } from '../models/sono';
import { adicionarSono, observarSonos, excluirSono } from '../services/sonoService';
import { getAuth } from 'firebase/auth';
import app from '../firebase-config';


function SonoCard({ sono, onPress }: { sono: Sono; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[estilos.card, { elevation: 3 }]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={estilos.nome}>Dormir às {sono.horarioDormir}</Text>
          <Text style={estilos.info}>
            Notificações: {sono.notificacoesAtivas ? 'Ativas' : 'Desativadas'}
          </Text>
        </View>
        <Feather name="chevron-right" size={24} color="#999" />
      </View>
    </TouchableOpacity>
  );
}

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
    const [h, m, s] = horaBase.split(':').map(Number);
    const baseDate = new Date();
    baseDate.setHours(h, m, s || 0);
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
        <View style={estilos.modalContainer}>
          <Text style={estilos.modalTitulo}>Melhores horários para acordar</Text>
          {sugestoes.map((hora, i) => (
            <View key={i} style={estilos.horarioItem}>
              <Text style={estilos.horarioTexto}>{hora}</Text>
            </View>
          ))}
          <TouchableOpacity style={estilos.botaoFechar} onPress={onClose}>
            <Text style={estilos.botaoFecharTexto}>Fechar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[estilos.botaoFechar, { backgroundColor: '#ff6b6b', marginTop: 8 }]}
            onPress={onDelete}
          >
            <Text style={estilos.botaoFecharTexto}>Excluir</Text>
          </TouchableOpacity>
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
    const horarioFormatado = horaSonoCadastro.toTimeString().split(' ')[0];
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
      <Text style={[styles.titulo, { color: '#2b8a3e' }]}>Horários de Sono</Text>
      <Text style={{ marginHorizontal: 16, marginBottom: 8, color: '#666' }}>
        Toque em um horário para ver sugestões de acordar ou excluir
      </Text>

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

const estilos = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 14,
    color: '#555',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2b8a3e',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  labelInput: {
    fontSize: 13,
    color: '#777',
    marginBottom: 4,
  },
  valorInput: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2b2b2b',
  },
  botao: {
    position: 'absolute',
    bottom: 140,
    right: 20,
    backgroundColor: '#2b8a3e',
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
  horarioItem: {
    backgroundColor: '#f1f3f5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  horarioTexto: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  botaoFechar: {
    backgroundColor: '#2b8a3e',
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  botaoFecharTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
