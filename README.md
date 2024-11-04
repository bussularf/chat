# WeChat

**WeChat** é uma aplicação responsiva de chat em tempo real, onde os usuários podem se cadastrar e se conectar com amigos instantaneamente. A aplicação utiliza as seguintes tecnologias e funcionalidades:

## Funcionalidades

- **Cadastro de Usuário**: Permite que novos usuários se cadastrem facilmente.
- **Autenticação**: Utiliza OAuth2 para autenticação de usuários e 2FA (autenticação de dois fatores) para maior segurança.
- **WebSockets**: Implementação de WebSockets para entrega de mensagens em tempo real.
- **Busca Avançada**: Utiliza ElasticSearch para realizar buscas rápidas e eficientes.
- **Frontend**: Desenvolvido com React e estilizado com Tailwind CSS para uma interface moderna e responsiva.

## Tecnologias

- **Ruby**: 3.2.2
- **Rails**: 7.2.1.2

## Configuração do Ambiente

### Pré-requisitos

Antes de executar o projeto, você precisa ter o Docker instalado em sua máquina. Além disso, certifique-se de que o ElasticSearch está instalado e em execução, pois a aplicação depende dele para a funcionalidade de busca.

### Comandos Docker

Para gerenciar a aplicação usando Docker, utilize os seguintes comandos:

- **Acessar o Container Docker**:
  ```bash
  docker-compose exec web bash


- Iniciar o Console Rails:

  ```bash
  docker-compose exec web rails console

- Parar os Containers Docker:

  ```bash
  docker-compose down

- Iniciar os Containers Docker:

  ```bash
  docker-compose up

- Reconstruir os Containers:

  ```bash
  docker-compose build

- Rodar testes:
  ```bash
  docker-compose exec web bundle exec rspec

