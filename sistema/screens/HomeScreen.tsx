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
import viciosDisponiveis from '../data/vicios';
import VicioCard from '../components/VicioCard';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface VicioSelecionado {
  id: string;
  nome: string;
  icon: any;
  cor: string;
  dataInicio: Date;
  descricao?: string;
}

export default function HomeScreen() {
  const [viciosSelecionados, setViciosSelecionados] = useState<VicioSelecionado[]>([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalPersonalizadoVisivel, setModalPersonalizadoVisivel] = useState(false);
  const [modalInfoVisivel, setModalInfoVisivel] = useState(false);

  const [vicioSelecionadoInfo, setVicioSelecionadoInfo] = useState<VicioSelecionado | null>(null);
  const [descricao, setDescricao] = useState('');

  const [nomePersonalizado, setNomePersonalizado] = useState('');
  const [corPersonalizada, setCorPersonalizada] = useState('#FF6B6B');
  const [usarDataAtual, setUsarDataAtual] = useState(true);
  const [dataPersonalizada, setDataPersonalizada] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [iconeSelecionado, setIcone] = useState('smoking-ban');

  const iconesDisponiveis = [
    'smoking-ban', 'wine-bottle', 'gamepad', 'mobile-alt', 'coffee',
    'hamburger', 'cannabis', 'beer', 'tv', 'shopping-cart', 'heartbeat', 'plus',
  ];

  useEffect(() => {
    if (vicioSelecionadoInfo) {
      setDescricao(vicioSelecionadoInfo.descricao || '');
    }
  }, [vicioSelecionadoInfo]);

  const viciosRestantes = viciosDisponiveis.filter(
    v => !viciosSelecionados.find(sel => sel.id === v.id)
  );

  const formatarTempo = (inicio: Date) => {
    const agora = new Date();
    const diff = agora.getTime() - new Date(inicio).getTime();
    const segundos = Math.floor(diff / 1000) % 60;
    const minutos = Math.floor(diff / (1000 * 60)) % 60;
    const horas = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${dias}d ${horas}h ${minutos}m ${segundos}s`;
  };

  const adicionarVicio = (id: string) => {
    const vicioBase = viciosDisponiveis.find(v => v.id === id);
    if (!vicioBase) return;

    const novoVicio: VicioSelecionado = {
      ...vicioBase,
      dataInicio: new Date(),
    };

    setViciosSelecionados([...viciosSelecionados, novoVicio]);
    setModalVisivel(false);
  };

  const adicionarVicioPersonalizado = () => {
    const novo: VicioSelecionado = {
      id: Date.now().toString(),
      nome: nomePersonalizado || 'Novo Vício',
      icon: iconeSelecionado,
      cor: corPersonalizada,
      dataInicio: usarDataAtual ? new Date() : dataPersonalizada,
      descricao: descricao,
    };
    setViciosSelecionados([...viciosSelecionados, novo]);
    setModalPersonalizadoVisivel(false);
    setNomePersonalizado('');
    setUsarDataAtual(true);
    setDataPersonalizada(new Date());
    setDescricao('');
  };

  const atualizarDescricao = () => {
    if (!vicioSelecionadoInfo) return;
    setViciosSelecionados(prev =>
      prev.map(v =>
        v.id === vicioSelecionadoInfo.id ? { ...v, descricao } : v
      )
    );
  };

  const resetarTempo = () => {
    if (!vicioSelecionadoInfo) return;
    Alert.alert(
      'Confirmar Recaída',
      `Você deseja resetar o tempo do vício "${vicioSelecionadoInfo.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            setViciosSelecionados(prev =>
              prev.map(v =>
                v.id === vicioSelecionadoInfo.id ? { ...v, dataInicio: new Date() } : v
              )
            );
            setModalInfoVisivel(false);
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
          {viciosSelecionados.map(vicio => (
            <TouchableOpacity
              key={vicio.id}
              onPress={() => {
                setVicioSelecionadoInfo(vicio);
                setModalInfoVisivel(true);
              }}
            >
              <VicioCard vicio={vicio} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity style={estilos.botao} onPress={() => setModalVisivel(true)}>
        <Text style={estilos.botaoTexto}>+ Novo Vício</Text>
      </TouchableOpacity>

      {/* Modais: seleção, personalizado e info */}
      {/* Modal de seleção */}
      <Modal visible={modalVisivel} animationType="slide" transparent={true}>
        <View style={estilos.modalContainer}>
          <View style={estilos.modalContent}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Escolha um vício</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {viciosRestantes.map(vicio => (
                <TouchableOpacity
                  key={vicio.id}
                  onPress={() => adicionarVicio(vicio.id)}
                >
                  <VicioCard vicio={vicio} mostrarTempo={false} />
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={estilos.cardAdicionar}
                onPress={() => {
                  setModalVisivel(false);
                  setTimeout(() => setModalPersonalizadoVisivel(true), 300); // animação suave
                }}
              >
                <FontAwesome5 name="plus" size={30} color="#777" />
                <Text style={{ textAlign: 'center', marginTop: 6 }}>Adicionar Vício</Text>
              </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity onPress={() => setModalVisivel(false)}>
              <Text style={{ color: 'gray', textAlign: 'center', fontSize: 16 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal personalizado */}
      <Modal visible={modalPersonalizadoVisivel} animationType="slide" transparent={true}>
        <View style={estilos.modalContainer}>
          <View style={estilos.modalContent}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Novo Vício</Text>

            <TextInput
              placeholder="Nome do vício"
              value={nomePersonalizado}
              onChangeText={setNomePersonalizado}
              style={estilos.input}
            />

            <Text style={{ marginTop: 10, marginBottom: 5 }}>Escolha uma cor:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 }}>
              {[ '#FF6B6B', '#FF8C42', '#FFD93D', '#6BCB77', '#4ECDC4', '#36A2EB', '#A29BFE', '#C77DFF' ].map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCorPersonalizada(c)}
                  style={{
                    backgroundColor: c,
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    marginRight: 8,
                    marginBottom: 8,
                    borderWidth: corPersonalizada === c ? 2 : 0,
                    borderColor: 'black',
                  }}
                />
              ))}
            </View>

            <Text style={{ marginTop: 10, marginBottom: 5 }}>Escolha um ícone:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {iconesDisponiveis.map((icone) => (
                <TouchableOpacity
                  key={icone}
                  onPress={() => setIcone(icone)}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 10,
                    backgroundColor: icone === iconeSelecionado ? '#2b8a3e' : '#eee',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 6,
                  }}
                >
                  <FontAwesome5 name={icone} size={24} color={icone === iconeSelecionado ? '#fff' : '#333'} />
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
              <Text>Usar data atual:</Text>
              <Switch value={usarDataAtual} onValueChange={setUsarDataAtual} style={{ marginLeft: 10 }} />
            </View>

            {!usarDataAtual && (
              <>
                <TouchableOpacity
                  onPress={() => setMostrarDatePicker(true)}
                  style={[estilos.input, { justifyContent: 'center' }]}
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

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <Button title="Cancelar" color="gray" onPress={() => setModalPersonalizadoVisivel(false)} />
              <Button title="Salvar" onPress={adicionarVicioPersonalizado} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de informações */}
      <Modal visible={modalInfoVisivel} animationType="slide" transparent={true}>
        <View style={estilos.modalContainer}>
          <View style={[estilos.modalContent, { maxHeight: '90%' }]}>
            {vicioSelecionadoInfo && (
              <>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Vício: {vicioSelecionadoInfo.nome}</Text>
                <Text style={{ marginTop: 20 }}>Tempo passado: {formatarTempo(vicioSelecionadoInfo.dataInicio)}</Text>
                <Text style={{ marginTop: 10 }}>Início: {new Date(vicioSelecionadoInfo.dataInicio).toLocaleDateString()}</Text>

                <Text style={{ marginTop: 10, marginBottom: 5 }}>Descrição (opcional):</Text>
                <TextInput
                  multiline
                  placeholder="Escreva algo sobre esse vício..."
                  value={descricao}
                  onChangeText={setDescricao}
                  onBlur={atualizarDescricao}
                  style={[estilos.input, { height: 80 }]} // () => setModalInfoVisivel(false)
                  // resetarTempo
                />

                {/* Botão fixo na parte de baixo do modal */}
                <TouchableOpacity style={estilos.botaoRecaida} onPress={resetarTempo}>
                  <Text style={estilos.botaoRecaidaTexto}>Recaída</Text>
                </TouchableOpacity>

                {/* Botão "Fechar", se você quiser que continue onde está, abaixo também */}
                <TouchableOpacity onPress={() => setModalInfoVisivel(false)}>
                  <Text style={{ color: 'gray', textAlign: 'center', marginTop: 15 }}>Fechar</Text>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  cardAdicionar: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 2,
    borderColor: '#aaa',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
  
});
