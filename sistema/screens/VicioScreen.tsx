import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  Button,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../styles/globalStyles';
import VicioCard from '../components/VicioCard';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { getAuth } from 'firebase/auth';
import app from '../firebase-config';

import {
  observarVicios,
  adicionarVicio,
  atualizarDescricao,
  resetarDataInicio,
} from '../services/vicioService';
import { VicioSelecionado } from '../models/vicio';

const ICONES_DISPONIVEIS = [
  'smoking-ban',
  'wine-bottle',
  'gamepad',
  'mobile-alt',
  'coffee',
  'hamburger',
  'cannabis',
  'beer',
  'tv',
  'shopping-cart',
  'heartbeat',
  'plus',
];

const CORES_DISPONIVEIS = [
  '#FF6B6B',
  '#FF8C42',
  '#FFD93D',
  '#6BCB77',
  '#4ECDC4',
  '#36A2EB',
  '#A29BFE',
  '#C77DFF',
];

function formatarTempo(inicio: Date) {
  const agora = new Date();
  const diff = agora.getTime() - new Date(inicio).getTime();
  const segundos = Math.floor(diff / 1000) % 60;
  const minutos = Math.floor(diff / (1000 * 60)) % 60;
  const horas = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  return `${dias}d ${horas}h ${minutos}m ${segundos}s`;
}

export default function VicioScreen() {
  const auth = getAuth(app);
  const user = auth.currentUser;

  const [viciosSelecionados, setViciosSelecionados] = useState<VicioSelecionado[]>([]);

  // Modais
  const [modalPersonalizadoVisivel, setModalPersonalizadoVisivel] = useState(false);
  const [modalInfoVisivel, setModalInfoVisivel] = useState(false);

  // Vício selecionado para edição/visualização
  const [vicioSelecionadoInfo, setVicioSelecionadoInfo] = useState<VicioSelecionado | null>(null);

  // Form de descrição no modal info
  const [descricao, setDescricao] = useState('');

  // Form para adicionar novo vício personalizado
  const [nomePersonalizado, setNomePersonalizado] = useState('');
  const [corPersonalizada, setCorPersonalizada] = useState(CORES_DISPONIVEIS[0]);
  const [usarDataAtual, setUsarDataAtual] = useState(true);
  const [dataPersonalizada, setDataPersonalizada] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [iconeSelecionado, setIcone] = useState(ICONES_DISPONIVEIS[0]);

  // Observar vícios do usuário
  useEffect(() => {
    if (!user) return;

    const unsubscribe = observarVicios(user.uid, setViciosSelecionados);

    return () => unsubscribe();
  }, [user]);

  // Resetar campos do form novo vício
  const resetarFormNovoVicio = () => {
    setNomePersonalizado('');
    setCorPersonalizada(CORES_DISPONIVEIS[0]);
    setUsarDataAtual(true);
    setDataPersonalizada(new Date());
    setDescricao('');
    setIcone(ICONES_DISPONIVEIS[0]);
  };

  // Ações
  const handleAdicionarVicio = async () => {
    if (!user) return;

    try {
      await adicionarVicio(user.uid, {
        nome: nomePersonalizado || 'Novo Vício',
        icon: iconeSelecionado,
        cor: corPersonalizada,
        dataInicio: usarDataAtual ? new Date() : dataPersonalizada,
        descricao,
      });

      setModalPersonalizadoVisivel(false);
      resetarFormNovoVicio();
    } catch (error) {
      console.error('Erro ao adicionar vício:', error);
    }
  };

  const handleAtualizarDescricao = async () => {
    if (!user || !vicioSelecionadoInfo) return;

    try {
      await atualizarDescricao(user.uid, vicioSelecionadoInfo.id, descricao);
    } catch (error) {
      console.error('Erro ao atualizar descrição:', error);
    }
  };

  const handleResetarTempo = async () => {
    if (!user || !vicioSelecionadoInfo) return;

    Alert.alert(
      'Confirmar Recaída',
      `Você deseja resetar o tempo do vício "${vicioSelecionadoInfo.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await resetarDataInicio(user.uid, vicioSelecionadoInfo.id);
              setModalInfoVisivel(false);
            } catch (error) {
              console.error('Erro ao resetar tempo:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#e6e6e6', flex: 1 }]}>
      <Text style={[styles.titulo, { color: '#2b8a3e' }]}>Vícios</Text>
      <Text style={styles.subtitulo}>Monitore os vícios que deseja superar.</Text>

      {viciosSelecionados.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={styles.subtitulo}>Você ainda não está monitorando nenhum vício.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
          {viciosSelecionados.map((vicio) => (
            <TouchableOpacity
              key={vicio.id}
              onPress={() => {
                setVicioSelecionadoInfo(vicio);
                setDescricao(vicio.descricao || '');
                setModalInfoVisivel(true);
              }}
            >
              <VicioCard vicio={vicio} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity style={estilos.botao} onPress={() => setModalPersonalizadoVisivel(true)}>
        <Text style={estilos.botaoTexto}>+ Novo Vício</Text>
      </TouchableOpacity>

      {/* Modal para adicionar novo vício */}
      <Modal visible={modalPersonalizadoVisivel} animationType="slide" transparent>
        <View style={estilos.modalContainer}>
          <View style={estilos.modalContent}>
            <Text style={estilos.modalTitulo}>Novo Vício</Text>

            <TextInput
              placeholder="Nome do vício"
              value={nomePersonalizado}
              onChangeText={setNomePersonalizado}
              style={estilos.input}
            />

            <Text style={estilos.label}>Escolha uma cor:</Text>
            <View style={estilos.paletaCores}>
              {CORES_DISPONIVEIS.map((cor) => (
                <TouchableOpacity
                  key={cor}
                  onPress={() => setCorPersonalizada(cor)}
                  style={[
                    estilos.corSelecionada,
                    { backgroundColor: cor },
                    corPersonalizada === cor && estilos.corSelecionadaAtiva,
                  ]}
                />
              ))}
            </View>

            <Text style={estilos.label}>Escolha um ícone:</Text>
            <View style={estilos.paletaIcones}>
              {ICONES_DISPONIVEIS.map((icone) => (
                <TouchableOpacity
                  key={icone}
                  onPress={() => setIcone(icone)}
                  style={[
                    estilos.iconeSelecionado,
                    { backgroundColor: icone === iconeSelecionado ? '#2b8a3e' : '#eee' },
                  ]}
                >
                  <FontAwesome5
                    name={icone}
                    size={24}
                    color={icone === iconeSelecionado ? '#fff' : '#333'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={estilos.switchContainer}>
              <Text>Usar data atual:</Text>
              <Switch
                value={usarDataAtual}
                onValueChange={setUsarDataAtual}
                style={{ marginLeft: 10 }}
              />
            </View>

            {!usarDataAtual && (
              <>
                <TouchableOpacity
                  onPress={() => setMostrarDatePicker(true)}
                  style={[estilos.input, estilos.datePickerButton]}
                >
                  <Text>{dataPersonalizada.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {mostrarDatePicker && (
                  <DateTimePicker
                    value={dataPersonalizada}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(e, date) => {
                      setMostrarDatePicker(false);
                      if (date) setDataPersonalizada(date);
                    }}
                  />
                )}
              </>
            )}

            <View style={estilos.modalBotoes}>
              <Button
                title="Cancelar"
                color="gray"
                onPress={() => {
                  setModalPersonalizadoVisivel(false);
                  resetarFormNovoVicio();
                }}
              />
              <Button title="Salvar" onPress={handleAdicionarVicio} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para exibir e editar informações do vício */}
      <Modal visible={modalInfoVisivel} animationType="slide" transparent>
        <View style={estilos.modalContainer}>
          <View style={[estilos.modalContent, { maxHeight: '90%' }]}>
            {vicioSelecionadoInfo && (
              <>
                <Text style={estilos.modalTitulo}>Vício: {vicioSelecionadoInfo.nome}</Text>
                <Text style={{ marginTop: 20 }}>
                  Tempo passado: {formatarTempo(vicioSelecionadoInfo.dataInicio)}
                </Text>
                <Text style={{ marginTop: 10 }}>
                  Início: {new Date(vicioSelecionadoInfo.dataInicio).toLocaleDateString()}
                </Text>

                <Text style={[estilos.label, { marginTop: 10 }]}>Descrição (opcional):</Text>
                <TextInput
                  multiline
                  placeholder="Escreva algo sobre esse vício..."
                  value={descricao}
                  onChangeText={setDescricao}
                  onBlur={handleAtualizarDescricao}
                  style={[estilos.input, { height: 80 }]}
                />

                <TouchableOpacity style={estilos.botaoRecaida} onPress={handleResetarTempo}>
                  <Text style={estilos.botaoRecaidaTexto}>Recaída</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setModalInfoVisivel(false)}>
                  <Text style={estilos.fecharTexto}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    width: '80%',
  },
  modalTitulo: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
  },
  paletaCores: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  corSelecionada: {
    width: 28,
    height: 28,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  corSelecionadaAtiva: {
    borderWidth: 2,
    borderColor: 'black',
  },
  paletaIcones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 10,
  },
  iconeSelecionado: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  datePickerButton: {
    justifyContent: 'center',
  },
  modalBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  botaoRecaida: {
    backgroundColor: '#2b8a3e',
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  botaoRecaidaTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fecharTexto: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 15,
  },
});
