# FinBoard - AI-Powered Financial Dashboard

A modern financial dashboard built with React, TypeScript, and Vite, featuring AI-powered transaction categorization and insights.

## Features

- 🚀 **Modern UI**: Built with shadcn/ui and Tailwind CSS
- 🤖 **AI-Powered**: Automatic transaction categorization using OpenAI
- 📊 **Financial Insights**: Smart spending analysis and recommendations
- 🔐 **Secure Authentication**: Powered by Appwrite
- 📱 **Responsive Design**: Works on all devices
- ⚡ **Fast Performance**: Built with Vite for optimal speed

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Appwrite (Authentication, Database, Storage)
- **AI**: OpenAI API for transaction categorization
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/finboard.git
cd finboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template and fill in your values:

```bash
cp env.example .env
```

Edit `.env` with your actual values:

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id-here

# Database Configuration
VITE_APPWRITE_DATABASE_ID=finboard-db
VITE_APPWRITE_COLLECTION_USERS=users
VITE_APPWRITE_COLLECTION_TRANSACTIONS=transactions

# OpenAI Configuration (Optional)
VITE_OPENAI_API_KEY=your-openai-api-key-here
```

### 4. Set Up Appwrite

Follow the detailed setup guide: [APPWRITE_SETUP_GUIDE.md](./APPWRITE_SETUP_GUIDE.md)

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_APPWRITE_ENDPOINT` | Appwrite API endpoint | Yes |
| `VITE_APPWRITE_PROJECT_ID` | Your Appwrite project ID | Yes |
| `VITE_APPWRITE_DATABASE_ID` | Database ID for storing data | Yes |
| `VITE_APPWRITE_COLLECTION_USERS` | Users collection ID | Yes |
| `VITE_APPWRITE_COLLECTION_TRANSACTIONS` | Transactions collection ID | Yes |
| `VITE_OPENAI_API_KEY` | OpenAI API key for AI features | No |

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
