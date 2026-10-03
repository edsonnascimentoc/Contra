|**Requisitos Funcionais**|
|---|
|**ID_RF:**001<br>**Oculto[]**<br>**Desejável[]**<br>**Permanente[ X]**|
|**Nome:**Cadastro de Eixos Tecnológicos|
|**Descrição:**O administradorpoderá cadastrar,editar e excluir eixos tecnológicos, que servirão como basepara a estrutura curricular dos cursos.|
|**Prioridade:**Alta.|



**Restrição:** Apenas administradores podem realizar o cadastro, edição e exclusão de eixos tecnológicos. **Justificativa:** Essencial para estrutura curricular. 

|**Requisit**|**os Não Funcionais**||
|---|---|---|
|**ID_RNF**|**Categoria**|**Descrição**<br>i|
|RNF01|Portabilidade|O sistema deve ser multiplataforma,adaptável aqualquer sistema operacional.<br>i|
|RNF02|Usabilidade<br>i|O sistema deve ter uma interface intuitiva,semelhante ao ambiente Windows.<br>i|
|RNF04|Confiabilidade|O sistema deve ser estável,com recuperação automática apósquedas de energia.|
|RNF05|Suporte|O sistema deve contar com um menu de ajudapara orientar o usuário.|
|RNF06|Suporte|O suporte será realizado remotamente,com manutenção local se necessário.|
|RNF07|Escalabilidade|O sistema deve suportar aumento de carga sem degradaçãoperceptível de desempenho,com escalabilidade horizontal e vertical.|
|RNF08|Monitoramento|O sistema devepossuir monitoramento ativo de falhas,uso de recursos egeração de alertas automáticospara equipe técnica.<br>ii|
|RNF09|Segurança|O sistema deveproteger contra-ataques como SQL Injection,XSS,CSRF e brute force,além de exigirpolítica de senhas seguras.<br>ii|
|RNF10|Acessibilidade|O sistema deve ser acessível conformepadrões WCAG 2.1, permitindo usoporpessoas com deficiência.<br>i|
|RNF11|Alta Disponibilidade|O sistema devegarantir disponibilidade mínima de 99,5%(SLA),com redundância e balanceamento de carga.<br>i|
|RNF12|Testabilidade|O sistema devepossuir cobertura mínima de testes automatizados(unitários,integração e aceitação).|
|RNF13|Documentação|O sistema devepossuir documentação técnica atualizada de APIs,arquitetura e fluxos críticos.|
|RNF14|Backupe Recuperação|O sistema deve realizar backup’s automáticos diários,testes de restauração mensais e retenção de versõespor 6 meses.|
|RNF15|Atualização|O sistema devepermitir atualizações sem downtime significativo,com rollback seguro em caso de falha.|
|**Critérios**|**de Aceitação**||



- O sistema deve permitir apenas ao administrador acessar a tela de cadastro de eixos tecnológicos. 

- O sistema deve exibir mensagens de sucesso ao cadastrar, editar ou excluir um eixo. 

- O sistema deve impedir que usuários não administradores acessem ou modifiquem eixos tecnológicos. 

|**Requisitos Funcionais**||
|---|---|
|**ID_RF:**|**Oculto[]**<br>**Desejável[]**<br>**Permanente[]**|
|**Nome:**||
|**Descrição:**||
|**Prioridade:**||
|**Restrição:**<br>**iii**||
|**Justificativa:**||
|**Requisitos Não Funcionais**<br><br>||
|**ID_RNF**<br>**Categoria**|**Descrição**|
|**Critérios de Aceitação**<br><br><br>||



# **Observar:** 

**Requisito Funcional Oculto** O que é: 

Uma funcionalidade **implícita** , que o cliente **espera que exista** , mas **não expressou diretamente** . 

## **Requisito Funcional Desejável** 

O que é: 

Funcionalidade **não essencial** , mas que **agrega valor** . Ajuda na **usabilidade, eficiência ou diferencial competitivo** . 

## **Requisito Funcional Permanente** 

O que é: Funcionalidade que **não muda ao longo do tempo** , ou seja, **é sempre obrigatória** para o funcionamento correto do sistema. 

