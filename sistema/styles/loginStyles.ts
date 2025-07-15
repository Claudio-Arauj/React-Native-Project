import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  motivacional: {
  fontSize: 16,
  fontStyle: 'italic',
  color: '#6a0dad',
  textAlign: 'center',
  marginHorizontal: 20,
  marginBottom: 20,
},

  container: {
    flex: 1,
    backgroundColor: '#3EB489',
  },
  containerHeader: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: '8%',
    paddingTop: 60,
  },
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subMessage: {
    fontSize: 16,
    color: '#E0F5EF',
    marginTop: 6,
  },
  containerForm: {
    flex: 2,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: '8%',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    height: 44,
    backgroundColor: '#F1F1F1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#3EB489',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#888',
  },
  registerLink: {
    color: '#3EB489',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: '#CC0000',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  caixaMensagem: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f3e8ff', // lilás clarinho
  padding: 12,
  marginHorizontal: 20,
  marginBottom: 16,
  borderRadius: 16,
  shadowColor: '#6a0dad',
  shadowOpacity: 0.15,
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 6,
  elevation: 4,
},

mensagemTexto: {
  flex: 1,
  fontSize: 16,
  fontStyle: 'italic',
  color: '#6a0dad',
  fontWeight: '600',
},
});
