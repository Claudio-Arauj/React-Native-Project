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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: '#555',
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
    padding: 8,
    marginTop: 10,
    marginBottom: 10,
  },
});