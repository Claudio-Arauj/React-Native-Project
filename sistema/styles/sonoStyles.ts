import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3a3a3a',
        fontFamily: 'monospace',
        marginTop: 4,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14, // menor que o título
        fontWeight: '500', // menos ênfase
        color: '#6e6e6e', // cinza mais claro
        fontFamily: 'monospace',
        marginTop: 2,
        textAlign: 'center',
    },
  card: {
    minHeight: 120,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
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
  sonoCard: {
  borderLeftWidth: 5,
  borderLeftColor: '#7e57c2', // roxo suave
},
modalBonito: {
  backgroundColor: '#e6e6e6',
  borderRadius: 24,
  padding: 24,
  width: '100%',
  maxWidth: 400,
  alignItems: 'center',
},

modalTituloBonito: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#2b2b2b',
  marginBottom: 16,
  textAlign: 'center',
},

sugestoesContainer: {
  width: '100%',
  marginBottom: 24,
},

horarioItemBonito: {
  backgroundColor: '#fff',
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 12,
  marginBottom: 8,
  alignItems: 'center',
},

horarioTextoBonito: {
  fontSize: 16,
  fontWeight: '500',
  color: '#5e35b1',
},

botoesModal: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  gap: 10,
},

botaoBonito: {
  flex: 1,
  paddingVertical: 12,
  borderRadius: 30,
  alignItems: 'center',
},

botaoTextoBonito: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},


});
