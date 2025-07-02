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
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/globalStyles';
import { Sono } from '../models/sono';
import { adicionarSono, observarSonos } from '../services/sonoService';
import { getAuth } from 'firebase/auth';
import app from '../firebase-config';

function SonoCard({ sono, onPress }: { sono: Sono; onPress: () => void }) {
  return (
    <TouchableOpacity style={estilos.card} onPress={onPress}>
      <Text style={estilos.nome}>Dormir às {sono.horarioDormir}</Text>
      <Text style={estilos.info}>
        Notificações: {sono.notificacoesAtivas ? 'Ativas' : 'Desativadas'}
      </Text>
    </TouchableOpacity>
  );
}

function ModalSugestoes({
  visible,
  onClose,
  baseTime,
}: {
  visible: boolean;
  onClose: () => void;
  baseTime: string;
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
      setShowPicker(false);
      setNotificacoesAtivas(true);
    } catch (error) {
      console.error('Erro ao salvar sono:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#e6e6e6' }]}>
      <Text style={[styles.titulo, { color: '#2b8a3e' }]}>Cadastrar Horário de Sono</Text>

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

      <View style={estilos.cardContainer}>
        <View style={estilos.linhaRelogio}>
          <TouchableOpacity style={estilos.botaoRelogio} onPress={() => setShowPicker(true)}>
            <Text style={estilos.iconeRelogio}>🕒</Text>
          </TouchableOpacity>
          <View style={{ marginLeft: 16 }}>
            <Text style={estilos.labelPequeno}>Hora escolhida</Text>
            <Text style={estilos.horaSelecionada}>
              {horaSonoCadastro.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>

        <View style={estilos.switchContainer}>
          <Text style={estilos.label}>Ativar notificações?</Text>
          <Switch
            value={notificacoesAtivas}
            onValueChange={setNotificacoesAtivas}
            thumbColor={notificacoesAtivas ? '#2b8a3e' : '#ccc'}
          />
        </View>

        <TouchableOpacity style={estilos.botaoSalvar} onPress={salvarHorarioSono}>
          <Text style={estilos.textoBotaoSalvar}>Salvar Horário</Text>
        </TouchableOpacity>
      </View>

      {sonos.length > 0 && (
        <>
          <Text style={[styles.subtitulo, { marginTop: 20 }]}>Horários Salvos:</Text>
          <FlatList
            data={sonos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SonoCard
                sono={item}
                onPress={() => {
                  setSonoSelecionado(item);
                  setModalVisible(true);
                }}
              />
            )}
          />
        </>
      )}

      <ModalSugestoes
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        baseTime={sonoSelecionado?.horarioDormir || '00:00:00'}
      />
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
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    gap: 20,
  },
  linhaRelogio: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botaoRelogio: {
    backgroundColor: '#2b8a3e',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  iconeRelogio: {
    fontSize: 22,
    color: '#fff',
  },
  labelPequeno: {
    fontSize: 14,
    color: '#888',
  },
  horaSelecionada: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2b2b2b',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  botaoSalvar: {
    backgroundColor: '#2b8a3e',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  textoBotaoSalvar: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
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
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 400,
    elevation: 10,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2b8a3e',
    marginBottom: 16,
    textAlign: 'center',
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
