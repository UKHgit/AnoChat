# Anonymous Chat - Hacker Edition 🔐⚡

A real-time, peer-to-peer anonymous chat application inspired by **hack.chat**, built with React, TypeScript, Firebase, and Vite. No message history, no accounts, just pure anonymous communication!

## Features ✨

### Core Features
- ✅ **Real-time messaging** via Firebase Realtime Database
- ✅ **Ephemeral messages** - No history stored
- ✅ **Anonymous** - No registration, no accounts
- ✅ **Dynamic chatrooms** - Create rooms on-the-fly
- ✅ **Private tunnels** - Share room ID to invite others

### Advanced Features
- 🔒 **Room locking** - Lock/unlock rooms to control access
- 👥 **User list** - See who's online (collapsible & pinnable)
- ✍️ **Typing indicators** - Know when someone is typing
- ✓ **Read receipts** - Single & double check marks
- 💬 **Message replies** - Click message to reply (with context)
- 🎨 **Hacker aesthetic** - Neon colors, terminal-style UI, glitch effects
- 🌙 **Dark mode** - Always on, eye-friendly
- 📱 **Responsive design** - Works on desktop, tablet, mobile

## Quick Start 🚀

### Prerequisites
- Node.js (v18+)
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/anonymous-chat.git
cd anonymous-chat

# Install dependencies
npm install

# Run development server
npm run dev
```

Open `http://localhost:5173` in your browser!

### Build for Production
```bash
npm run build
```

## Deployment to Netlify 🌐

### Step-by-Step

1. **Push to GitHub**
   ```bash
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select GitHub and authorize
   - Choose `anonymous-chat` repository
   - Auto-detects build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Deploy!

3. **Get Your Live URL** ✅
   - Netlify provides: `https://your-site-name.netlify.app`
   - Share with friends!

## Tech Stack 🛠️

- **Frontend**: React 19 + TypeScript
- **Bundler**: Vite
- **Real-time**: Firebase Realtime Database
- **Hosting**: Netlify
- **Styling**: CSS with Animations

## Firebase Configuration

The app includes a pre-configured Firebase project. For production, create your own:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Enable **Realtime Database** (test mode)
4. Copy config and update `src/firebase.ts`

## How It Works ⚡

1. **Enter username** & **room ID** on landing page
2. **Share room ID** with others to invite
3. **Type messages** that appear in real-time
4. **Click message** to reply
5. **Lock room** to prevent new messages
6. **See typing indicators** while others compose

### Data Flow
```
User Input → Firebase Realtime Database → Instant Broadcast to All Users
                         ↑                              ↓
                   Real-time Listeners ←────────────────┘
```

## Usage Tips 💡

- **Share Room ID**: `https://your-domain.netlify.app/#your-room-id`
- **Lock Room**: Click 🔒 to prevent new messages
- **Reply to Message**: Click any message
- **See Typing**: Watch the typing indicator in messages area
- **User Presence**: Check right sidebar for online users

## Customization 🎨

Edit these files to customize:

- **Colors**: `src/index.css` & `src/styles/ChatRoom.css`
- **Landing Page**: `src/components/LandingPage.tsx`
- **Chat UI**: `src/components/ChatRoom.tsx`

## File Structure

```
src/
├── components/
│   ├── LandingPage.tsx
│   └── ChatRoom.tsx
├── styles/
│   └── ChatRoom.css
├── App.tsx
├── App.css
├── firebase.ts
├── index.css
└── main.tsx
```

## Security 🔐

- **Anonymous by default** - No personal data stored
- **Firebase security** - Handled by Google infrastructure
- **No history** - Messages aren't persistently stored
- **Real-time only** - Perfect for ephemeral conversations

## Troubleshooting 🔧

**Messages not showing?**
- Check Firebase connectivity
- Verify same room ID across users
- Check if room is locked

**Build fails?**
```bash
npm install
npm run build
```

**Deployment issues?**
- Check Netlify build logs
- Verify `dist/` folder is created locally
- Ensure all dependencies installed

## Performance ⚡

- Firebase free tier supports thousands of concurrent users
- Netlify free tier includes unlimited bandwidth
- CSS is optimized with GPU acceleration
- Real-time messaging uses efficient event listeners

## Contributing 🤝

1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push & create Pull Request

## License 📄

MIT License - feel free to use for anything!

## Inspiration

Built inspired by [hack.chat](https://hack.chat/) - a minimalist, open-source chat application.

---

**Made with ❤️ for anonymous, real-time communication.**

*Questions? Found a bug? Create an issue on GitHub!*

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

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

export default defineConfig([
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
