# Caso 1: Manter Usuário
| Elemento      | Descrição                                                                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ator**      | Usuário                                                                                                                                            |
| **Descrição** | O usuário pode criar um perfil com nome, e-mail, senha e metas. Após isso, poderá acessar com e-mail e senha e editar informações enquanto logado. |

# Caso 2: Login de Usuário
| Elemento              | Descrição                                                                        |
| --------------------- | -------------------------------------------------------------------------------- |
| **Ator**              | Usuário                                                                          |
| **Pré-condição**      | Ter conta registrada                                                             |
| **Fluxo Principal**   | 1. Informar e-mail e senha  <br> 2. Validar credenciais <br> 3. Acesso concedido |
| **Fluxo Alternativo** | Erro de autenticação → mensagem de erro                                          |

# Caso 3: Manter Meta de Hábito
| Elemento            | Descrição                                                                               |
| ------------------- | --------------------------------------------------------------------------------------- |
| **Ator**            | Usuário                                                                                 |
| **Pré-condição**    | Estar logado                                                                            |
| **Fluxo Principal** | 1. Acessar tela de metas <br> 2. Criar nova meta <br> 3. Preencher dados <br> 4. Salvar |
| **Pós-condição**    | Meta registrada com lembrete ativado                                                    |

# Caso 4: Receber Notificações de Progresso
| Elemento            | Descrição                                                        |
| ------------------- | ---------------------------------------------------------------- |
| **Ator**            | Sistema                                                          |
| **Pré-condição**    | Meta com lembrete ativado                                        |
| **Fluxo Principal** | 1. Verifica horário da meta <br> 2. Envia notificação ao usuário |

# Caso 5: Visualizar Progresso / Estatísticas
| Elemento            | Descrição                                                                |
| ------------------- | ------------------------------------------------------------------------ |
| **Ator**            | Usuário                                                                  |
| **Pré-condição**    | Ter concluído ao menos uma meta                                          |
| **Fluxo Principal** | 1. Acessar aba de progresso <br> 2. Visualizar gráfico ou lista de metas |

# Caso 6: Receber Dicas e Motivação
| Elemento            | Descrição                                          |
| ------------------- | -------------------------------------------------- |
| **Ator**            | Sistema                                            |
| **Fluxo Principal** | Exibir mensagens positivas ou dicas periodicamente |
| **Objetivo**        | Engajar e motivar o usuário                        |

# Caso 7: Compartilhar Progresso
| Elemento            | Descrição                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| **Ator**            | Usuário                                                                                           |
| **Fluxo Principal** | 1. Usuário escolhe compartilhar <br> 2. App gera card com progresso <br> 3. Compartilha nas redes |
| **Objetivo**        | Incentivar o uso contínuo                                                                         |

# Caso 8: Cronograma de Sono
| Elemento            | Descrição                                                                     |
| ------------------- | ----------------------------------------------------------------------------- |
| **Atores**          | Sistema / Usuário                                                             |
| **Fluxo Principal** | 1. Usuário informa horário de sono <br> 2. App envia notificações de lembrete |
| **Objetivo**        | Ajudar o usuário a manter um padrão saudável de sono                          |

# Caso 9: Manter Definição de Vícios
| Elemento            | Descrição                                                                                           |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| **Ator**            | Usuário                                                                                             |
| **Fluxo Principal** | 1. Cadastrar vício <br> 2. Informar frequência/gasto <br> 3. App mostra progresso e economia gerada |
| **Objetivo**        | Incentivar abandono do vício e mostrar resultados                                                   |

# Caso 10: Registrar Reflexão Diária
| Elemento            | Descrição                                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Ator**            | Usuário                                                                                                        |
| **Fluxo Principal** | 1. Campo para reflexão <br> 2. Usuário escreve texto <br> 3. Escolhe sentimento <br> 4. Salva entrada com data |
| **Objetivo**        | Promover autoconhecimento e registro emocional diário                                                          |

