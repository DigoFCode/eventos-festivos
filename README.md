# Sistema de Gerenciamento de Eventos Festivos

## 🎯 Visão Geral

Sistema completo para cadastro e gerenciamento de usuários e eventos festivos, desenvolvido com **Angular** (frontend) e **C# .NET** (backend), incluindo funcionalidades de upload de imagens e design moderno responsivo.

## 🏗️ Arquitetura do Sistema

### Backend - C# .NET 8
- **Framework**: ASP.NET Core Web API
- **ORM**: Entity Framework Core
- **Banco de Dados**: SQL
- **Autenticação**: Hash de senhas com BCrypt
- **Upload**: Sistema de upload de imagens
- **CORS**: Configurado para integração com frontend

### Frontend - Angular 18
- **Framework**: Angular com TypeScript
- **UI Components**: Angular Material
- **Estilização**: SCSS com design gradiente moderno
- **Responsividade**: Layout adaptável para desktop e mobile
- **Validações**: Formulários reativos com validação em tempo real

## 📋 Funcionalidades Implementadas

### 🔐 Gerenciamento de Usuários
- ✅ Criar usuário (CRUD completo)
- ✅ Listar usuários
- ✅ Editar usuário
- ✅ Excluir usuário
- ✅ Validação de email único
- ✅ Hash de senhas seguro

### 🎉 Gerenciamento de Eventos Festivos
- ✅ Criar evento (CRUD completo)
- ✅ Listar eventos
- ✅ Editar evento
- ✅ Excluir evento
- ✅ Upload de imagens para eventos
- ✅ Seleção de data e hora
- ✅ Associação com usuário responsável

### 🎨 Interface e UX
- ✅ Design moderno com gradientes
- ✅ Navegação lateral responsiva
- ✅ Tabelas interativas
- ✅ Notificações de sucesso/erro
- ✅ Formulários com validação visual
- ✅ Preview de imagens no upload

## 🚀 Como Executar o Projeto

### Pré-requisitos
- .NET 8 SDK
- Node.js 18+
- Angular CLI

### Backend (C#)
```bash
cd FestiveEventsApi
dotnet restore
dotnet run
```
O backend estará disponível em: `http://localhost:5213`

### Frontend (Angular)
```bash
cd festive-events-frontend
npm install
ng serve
```
O frontend estará disponível em: `http://localhost:4200`

## 🔧 Tecnologias Utilizadas

### Backend
- **C# .NET 8**: Framework principal
- **ASP.NET Core**: Web API
- **Entity Framework Core**: ORM
- **SQLite**: Banco de dados
- **BCrypt**: Hash de senhas
- **CORS**: Cross-Origin Resource Sharing

### Frontend
- **Angular 18**: Framework frontend
- **TypeScript**: Linguagem de programação
- **Angular Material**: Componentes UI
- **SCSS**: Pré-processador CSS
- **RxJS**: Programação reativa

## 🎨 Design e UX

- **Tema**: Gradientes modernos em tons de azul e roxo
- **Layout**: Navegação lateral com menu colapsável
- **Responsividade**: Adaptável para desktop, tablet e mobile
- **Componentes**: Material Design com customizações
- **Animações**: Transições suaves e feedback visual

## 🧪 Testes Realizados

### ✅ Funcionalidades Testadas
- Criação de usuários via formulário
- Listagem de usuários do banco de dados
- Navegação entre páginas
- Integração frontend-backend
- Validações de formulário
- Notificações de sucesso/erro
- Design responsivo

### 📊 Resultados dos Testes
- ✅ Backend C# funcionando na porta 5213
- ✅ Frontend Angular funcionando na porta 4200
- ✅ Comunicação entre frontend e backend
- ✅ Banco de dados SQLite criado automaticamente
- ✅ CRUD de usuários operacional
- ✅ Interface responsiva e moderna

## 🔒 Segurança

- **Hash de Senhas**: Implementado com BCrypt
- **Validações**: Frontend e backend
- **CORS**: Configurado adequadamente
- **SQL Injection**: Prevenido pelo Entity Framework
- **Validação de Dados**: Implementada em ambas as camadas

## 📈 Possíveis Melhorias Futuras

- Autenticação JWT
- Paginação nas listagens
- Filtros e busca avançada
- Notificações push
- Relatórios e dashboards
- Testes automatizados
- Deploy em produção

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se todas as dependências estão instaladas
2. Confirme se as portas 5213 (backend) e 4200 (frontend) estão livres
3. Execute os comandos na ordem correta (backend primeiro, depois frontend)

---

