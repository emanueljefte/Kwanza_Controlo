# Meu Kwanza Controlado - Gestor Financeiro Inteligente 🇦🇴

**Meu Kwanza Controlado** é um aplicativo de finanças pessoais focado na realidade angolana, projetado com uma filosofia **Local-First**. O objetivo é oferecer controle total sobre despesas e receitas, funcionando perfeitamente offline e sincronizando dados de forma inteligente quando há conexão.

---

## 🚀 Funcionalidades Principais

### 🏦 Gestão de Carteiras e Transações

* **Múltiplas Carteiras:** Gestão de diferentes contas (Banco, Carteira, Poupança).
* **Local-First:** Registro instantâneo de transações mesmo sem internet.
* **Categorização:** Organização de gastos por categorias personalizadas com ícones dinâmicos.
* **Visibilidade seletiva:** Opção de ocultar o saldo principal no `HomeCard` para maior privacidade em locais públicos.

### 📊 Estatísticas e Relatórios

* **Gráficos Dinâmicos:** Visualização de dados através de gráficos de barras e pizza (Gifted Charts).
* **Filtros Temporais:** Análises semanais, mensais e anuais.
* **Exportação PDF:** Geração de relatórios formatados com tabelas e resumo visual (totalmente offline).

### 🧠 Inteligência e Proatividade

* **Assistente IA:** Chat para consultas sobre economia e análise de gastos (integração com LLM).
* **Notificações Inteligentes (Notifee):** * Lembretes diários para registro de gastos.
* Dicas de economia personalizadas via *BigText notifications*.



### 💾 Sincronização e Segurança

* **Drizzle ORM + SQLite:** Persistência de dados robusta e tipada.
* **Auth System:** Autenticação segura com JWT e sistema de *Refresh Token* resiliente a múltiplas chamadas simultâneas.
* **Sync Manager:** Flag `is_dirty` para controle de sincronização pendente com o servidor remoto.

---

## 🛠 Stack Tecnológico

* **Frontend:** React Native (Expo)
* **Linguagem:** TypeScript
* **Banco de Dados Local:** SQLite via Expo SQLite
* **ORM:** Drizzle ORM
* **Estilização:** StyleSheet (Design System com escala vertical/horizontal para diferentes dispositivos)
* **Notificações:** Notifee
* **Ícones:** Phosphor React Native e FontAwesome6
* **Gráficos:** React Native Gifted Charts

---

## 🏗 Arquitetura de Dados

O aplicativo utiliza um fluxo de dados unidirecional para atualizações, garantindo que a UI nunca trave esperando a rede.

---

## 📦 Como Instalar e Rodar

1. **Clonar o repositório:**
```bash
git clone https://github.com/seu-usuario/Kwanza_Controlo.git

```


2. **Instalar dependências:**
```bash
npm install

```


3. **Configurar o Banco de Dados:**
```bash
npx drizzle-kit generate:sqlite
npx drizzle-kit push:sqlite

```


4. **Executar o App:**
```bash
npx expo run:android # Para testar notificações nativas com Notifee

```



---

## 🛠 Próximos Passos (Roadmap)

* [ ] Implementar Biometria (Fingerprint/FaceID) para abrir o app.
* [ ] Criar Widget para a tela inicial do Android/iOS.
* [ ] Adicionar suporte a múltiplas moedas (Conversão Automática).
* [ ] Backup automático para Google Drive ou iCloud.

---

## 📝 Notas de Versão

**Versão Atual:** `1.0.4`

* Adicionado suporte a notificações via Notifee.
* Implementada lógica de ocultação de saldo.
* Refatoração do interceptor de autenticação para fila de requisições.

---

**Desenvolvido com foco na literacia financeira em Angola.** 🇦🇴

---
