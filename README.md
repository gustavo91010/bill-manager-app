# 💰 Bill Manager App

Um aplicativo moderno e intuitivo para gerenciamento de gastos pessoais, desenvolvido com Next.js 15, React 19 e uma interface elegante usando Tailwind CSS e componentes Radix UI.

![Bill Manager App](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-06B6D4?style=for-the-badge&logo=tailwindcss)

## ✨ Funcionalidades

- 📊 **Dashboard Interativo**: Visualize seus gastos de forma clara e organizada
- 💳 **Gerenciamento de Despesas**: Adicione, edite e exclua despesas facilmente
- 📅 **Widget de Calendário**: Acompanhe suas despesas por data
- 🔐 **Autenticação Segura**: Sistema de login integrado
- 📱 **Design Responsivo**: Interface adaptável para desktop e mobile
- 🎨 **Tema Escuro/Claro**: Alternância entre temas
- 📈 **Relatórios**: Visualize resumos dos seus gastos
- ⚡ **Performance Otimizada**: Construído com as melhores práticas do Next.js

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15.2.4** - Framework React para produção
- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript 5** - Tipagem estática para JavaScript
- **Tailwind CSS 3.4.17** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis e customizáveis

### Bibliotecas Principais
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas TypeScript
- **Date-fns** - Manipulação de datas
- **Lucide React** - Ícones modernos
- **Recharts** - Gráficos e visualizações
- **React Hot Toast** - Notificações elegantes

### Ferramentas de Desenvolvimento
- **Autoprefixer** - CSS vendor prefixes automático
- **PostCSS** - Processamento de CSS
- **Class Variance Authority** - Variantes de componentes tipadas

## 🚀 Começando

### Pré-requisitos

- Node.js 18.17 ou superior
- npm ou yarn

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/gustavo91010/bill-manager-app.git
   cd bill-manager-app
   ```

2. **Instale as dependências**
   
   ⚠️ **IMPORTANTE**: Este projeto requer o uso da flag `--legacy-peer-deps` devido a compatibilidade entre algumas dependências:
   
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Execute o projeto em desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Abra o navegador**
   
   Acesse [http://localhost:3000](http://localhost:3000) para ver o aplicativo em execução.

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa a verificação de linting

## 🐳 Docker

O projeto inclui configuração Docker para fácil deployment:

```bash
# Construir a imagem
docker build -t bill-manager-app .

# Executar com docker-compose
docker-compose up -d
```

## 📁 Estrutura do Projeto

```
bill-manager-app/
├── app/                    # App Router do Next.js
│   ├── api/               # Rotas da API
│   │   ├── adapters/      # Adaptadores de dados
│   │   ├── proxy/         # Proxy routes
│   │   └── types/         # Tipos TypeScript
│   ├── test/              # Páginas de teste
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI base
│   ├── dashboard.tsx     # Dashboard principal
│   ├── auth-modal.tsx    # Modal de autenticação
│   └── ...              # Outros componentes
├── hooks/                # Custom hooks
├── lib/                  # Utilitários e configurações
├── public/               # Arquivos estáticos
└── styles/               # Estilos adicionais
```

## 🎯 Principais Componentes

### Dashboard
- **Visão geral** dos gastos
- **Gráficos interativos** com Recharts
- **Lista de despesas** organizadas por data
- **Filtros e ordenação** personalizáveis

### Gerenciamento de Despesas
- **Formulários validados** com React Hook Form e Zod
- **CRUD completo** (Create, Read, Update, Delete)
- **Categorização** de despesas
- **Data de vencimento** e lembretes

### Interface de Usuário
- **Design system** consistente com Radix UI
- **Componentes acessíveis** e responsivos
- **Animações suaves** com Tailwind CSS
- **Feedback visual** com toasts e loading states

## 🔧 Configuração Avançada

### Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Adicione suas variáveis de ambiente aqui
NEXT_PUBLIC_API_URL=sua_api_url
```

### Customização do Tema
O projeto usa Tailwind CSS com configuração personalizada em `tailwind.config.ts`.

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Gustavo91010**
- GitHub: [@gustavo91010](https://github.com/gustavo91010)

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) pela incrível experiência de desenvolvimento
- [Radix UI](https://www.radix-ui.com/) pelos componentes acessíveis
- [Tailwind CSS](https://tailwindcss.com/) pelo framework CSS utilitário
- [Vercel](https://vercel.com/) pela plataforma de deployment

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!
