# Features Documentation - Anonymous Chat 🔐

## Core Features Explained

### 1. Real-Time Messaging ⚡

**How it works:**
- Firebase Realtime Database stores messages
- All connected users get instant updates
- No page refresh needed
- WebSocket-like experience with HTTP

**Behind the scenes:**
```
User A sends → Firebase → All users receive instantly
```

**Limitations:**
- Free tier: ~100 concurrent connections
- Messages stored only in active session
- No persistence after room clears

---

### 2. Anonymous Chatrooms 👥

**Room Creation:**
- No registration needed
- Enter any username (change per session)
- Enter any room ID (auto-creates if new)
- Room ID is the "password" - only those who know it can join

**Room URL Format:**
```
https://anonymous-chat.netlify.app/#my-secret-room
```

**Features:**
- Share room ID with anyone to invite
- Multiple independent rooms work simultaneously
- Old rooms auto-delete when everyone leaves

**Privacy:**
- ✅ No account tracking
- ✅ No IP logging visible to other users
- ✅ Anonymous by default

---

### 3. User Presence Tracking 👤

**What you see in User List:**
```
[●] Alice (YOU)    ← Green dot = online, your user
[●] Bob typing...  ← Typing indicator
[●] Charlie        ← Online, idle
```

**Status Indicators:**
- **Green dot**: User is online
- **Pulsing pink dot**: User is typing
- **"(YOU)"**: Your own user
- **"typing..."**: User composing message

**Automatic cleanup:**
- User removed when they close tab/leave
- Inactive users cleared after disconnect
- No stale user entries

---

### 4. Typing Indicators 📝

**How it works:**
1. Start typing → System broadcasts "isTyping: true"
2. Others see "Alice typing..." in user list
3. Stop typing for 3 seconds → Auto-clears
4. Send message → Auto-clears typing status

**Prevents:**
- Duplicate "typing" indicators
- Network spam
- False "still typing" states

**Server optimization:**
- Only sent when typing (no constant updates)
- Auto-timeout prevents stale indicators

---

### 5. Read Receipts ✓

**Visual indicators on your sent messages:**

```
✓  = Message sent to Firebase (not yet read)
✓✓ = At least one person opened the message
```

**How it works:**
1. You send message
2. Firebase confirms receipt (✓)
3. When recipient opens message, you get (✓✓)
4. Hover over message to see receipts

**Privacy:**
- Doesn't show WHO read it
- Just confirms "someone read it"
- Optional, can be disabled

**Timing:**
- ✓ appears instantly
- ✓✓ appears ~500ms after recipient loads message

---

### 6. Message Replies & Tagging 💬

**How to reply:**
1. Click on any message
2. Message appears in reply box at bottom
3. Type your reply
4. Send - it includes original message context

**What you see:**
```
┌─────────────────────┐
│ Original message    │  ← Shows what you're replying to
│ from @Alice         │
├─────────────────────┤
│ → Alice             │
│ "That's awesome!"   │  ← Your reply with context
│ 2:45 PM             │
└─────────────────────┘
```

**Features:**
- Click reply preview to see full original message
- Can reply to your own messages
- Can reply to replies (chains work)
- Click ✕ to cancel reply

**Storage:**
- Reply context stored in message
- Shows sender & original text
- Survives message deletion

---

### 7. Room Locking 🔒

**What does it do:**
- Locks: Prevents NEW messages from being sent
- Unlock: Re-enables messaging
- Existing messages remain visible

**Use cases:**
1. End of conversation
2. Switch to different platform
3. Prevent spam
4. Create "read-only" mode

**Who can lock?**
- Currently: anyone in room
- Can be restricted to room creator (future feature)

**Visual indicator:**
```
Header shows: 🔒 LOCKED  (red glow)
Input shows: 🔒 Room is locked...
Send button: Disabled
```

---

### 8. Message History (or lack thereof!) 📋

**This app has NO persistent history:**

**Feature: Ephemeral Messages**
- Messages only stored while room is active
- When last user leaves → data cleared
- Perfect for sensitive conversations
- No data trail

**Advantages:**
- ✅ Privacy - nothing stored permanently
- ✅ Security - nothing to hack
- ✅ Compliance - GDPR compliant
- ✅ No management - automatic cleanup

**Why not store?**
- Keeps infrastructure simple
- Firebase free tier covers it
- Matches hack.chat philosophy

---

### 9. Collapsible User Sidebar 📌

**Sidebar Features:**
```
┌─────────────┐
│ [4 ONLINE] │ ← Shows user count
│ 📌 ▼       │ ← Pin & Collapse buttons
├─────────────┤
│ ● Alice (YOU)│
│ ● Bob typing │
│ ● Charlie    │
└─────────────┘
```

**Collapse Button (▼/▶):**
- Click to minimize sidebar
- Shows just collapsed indicator
- Useful on mobile
- Saves screen space

**Pin Button (📍/📌):**
- Unpin: Sidebar hides on desktop when scrolling (future)
- Pin: Sidebar always visible
- Visual indicator shows state
- Persists per session

**Responsive:**
- Desktop: Full width sidebar on right
- Tablet: Collapsible by default
- Mobile: Expands to full width as overlay

---

### 10. Message Search & Filter (Future)

**Planned features:**
- Search by username
- Filter by time range
- Highlight keywords
- See-all-from-user

**Current workaround:**
- Ctrl+F to search in browser
- Messages only during active session

---

### 11. Hacker Aesthetic UI 🎨

**Design Elements:**

**Colors:**
- Neon Green (#00ff88) - Primary text
- Neon Cyan (#00ffff) - Headers, borders
- Magenta (#ff00ff) - Accents, typing
- Dark background - Reduces eye strain

**Effects:**
- Glitch text on landing page
- Terminal-style window
- Scanning lines animation
- Glow effects on hover
- Smooth transitions

**Typography:**
- Monospace font (Courier New)
- Uppercase headers
- Letter spacing for retro feel
- Text shadows for depth

**Animations:**
```css
✨ Glitch effect
💫 Pulse animations
⚡ Hover glow
🎬 Fade in/out messages
🌊 Typing indicator bounce
```

---

### 12. Mobile Responsiveness 📱

**Desktop View:**
- Messages on left (70%)
- User list on right (30%)
- Full keyboard support

**Tablet View:**
- Messages take more space
- User list collapsible
- Touch-friendly buttons
- Landscape orientation supported

**Mobile View:**
- Full-width messages
- User list as overlay/tab
- Tap to reply
- Optimized for small screens

**Testing:**
```bash
DevTools → Toggle device toolbar (Ctrl+Shift+M)
```

---

## Settings & Customization

### localStorage Persistence

**What's saved locally:**
- Your username (per device)
- User preferences (future)
- Theme settings (future)

**Privacy:**
- Nothing about messages saved
- No chat history
- Stored only in your browser
- Cleared if browser cache cleared

### Firebase Configuration

**Current setup:**
- Pre-configured Firebase project
- Test mode (permissive)
- No auth required
- Suitable for production (with security rules)

**To use own Firebase:**

1. Create Firebase project
2. Enable Realtime Database
3. Update `src/firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  databaseURL: "YOUR_URL",
  // ... other config
};
```

---

## Advanced Features (Technical)

### Real-Time Listeners

**Active listeners:**
```typescript
onChildAdded()   // New messages
onValue()        // User presence changes
update()         // Typing indicators
remove()         // Cleanup on disconnect
```

**Event flow:**
```
User action → Firebase write
             ↓
        Database update
             ↓
     All listeners triggered
             ↓
      UI updates instantly
```

### Performance Optimization

**Implemented:**
- ✅ Debounced typing indicator (3s timeout)
- ✅ Efficient message rendering (one-way binding)
- ✅ Auto-scroll only when needed
- ✅ CSS GPU acceleration
- ✅ Minimal re-renders

**Limits:**
- Max room size: ~100-200 users (free Firebase)
- Message size: 500 characters (configurable)
- Room ID: 30 characters max
- Username: 20 characters max

---

## Security & Privacy Details

### What's Transmitted

**Sent to Firebase:**
- Message text
- Username
- Timestamp
- Read status
- Typing status

**NOT sent:**
- Browser history
- IP address (Firebase handles)
- Cookie data
- Location information

### Frontend Validation

**Implemented:**
- Max message length check
- Username format validation
- Room ID validation
- HTML escaping (React default)

### Backend Security (Firebase)

**Future improvements:**
- Message content filtering
- Rate limiting
- Abuse reporting
- Auto-delete after 24h

---

## Common Scenarios

### Scenario 1: Private Team Chat
1. Create room: `team-2024-private`
2. Share with team only
3. Lock room after done
4. Start new room next time

### Scenario 2: Interview Candidate Discussion
1. Create room: `candidate-alice-interview`
2. Interview team joins
3. All discuss in real-time
4. Room auto-disappears when empty

### Scenario 3: Support Q&A
1. Create room: `support-emergency`
2. Support team joins
3. Reply to customer messages
4. Lock when resolved

---

## Troubleshooting Features

### Message not sending?
- Check if room is locked
- Maximum message length is 500 chars
- Check connection

### User list not updating?
- Network latency issue
- Refresh page
- Check Firebase connectivity

### Typing indicator stuck?
- Appears for 3 seconds
- Auto-clears on message send
- Refresh if truly stuck

---

**Need more features? Have ideas? Create a GitHub issue!** 🚀
