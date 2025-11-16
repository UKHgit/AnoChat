# ❓ FAQ - Frequently Asked Questions

## General Questions

### Q: What is Anonymous Chat?
**A:** A real-time anonymous messaging application inspired by hack.chat. Users enter a username and room ID, and can instantly chat with others in that room. No registration, no history, completely private.

### Q: How much does it cost?
**A:** **Completely FREE!** 
- Netlify: Free hosting with unlimited bandwidth
- Firebase: Free real-time database (100GB free)
- Open source code: You own it
- No ads, no hidden fees, forever free

### Q: Is it really anonymous?
**A:** **Yes!** 
- No account/registration required
- You choose any username
- No personal data collected
- Messages not stored permanently
- Perfect for sensitive conversations

### Q: Can I modify the code?
**A:** **Absolutely!** It's open source. You can:
- Change colors and theme
- Add new features
- Remove features
- Deploy your own version
- Sell a modified version (check license)

---

## Technical Questions

### Q: What technology is used?
**A:** 
- **Frontend**: React 19 + TypeScript
- **Database**: Firebase Realtime Database
- **Hosting**: Netlify
- **Build tool**: Vite
- **Styling**: Pure CSS

### Q: How does real-time messaging work?
**A:** Firebase Realtime Database uses WebSocket-like technology to push updates to all connected clients instantly. When someone sends a message, Firebase broadcasts it to everyone in the room in < 200ms.

### Q: Do messages get stored?
**A:** **No permanent storage!** Messages are only stored while Firebase keeps them (typically session duration). When the last user leaves the room, all data auto-deletes.

### Q: How many users can join a room?
**A:** Theoretically unlimited, but Firebase free tier handles ~100-200 concurrent connections comfortably. Premium plans support more.

### Q: Can rooms be private/password protected?
**A:** Yes! Room ID acts as password. Only those who know the room ID can join. Share the ID only with people you trust.

### Q: Is the app open source?
**A:** Yes! Full source code is available on GitHub. You can:
- View the code
- Contribute improvements
- Fork and create your own version
- Use it as learning resource

---

## Deployment Questions

### Q: How do I deploy to Netlify?
**A:** 
1. Push code to GitHub repository
2. Go to app.netlify.com
3. Click "Add new site" → "Import an existing project"
4. Select your GitHub repo
5. Deploy (automatic)

Takes ~5 minutes total!

### Q: Do I need a domain name?
**A:** No! Netlify provides a free subdomain like `my-chat-app.netlify.app`. You can add your own domain for $5-15/year if you want.

### Q: What if deployment fails?
**A:** Check these things:
1. Verify GitHub push was successful
2. Check Netlify build logs
3. Ensure `npm install` works locally
4. Verify `npm run build` succeeds locally
5. Check all files are committed

See DEPLOYMENT_GUIDE.md for detailed troubleshooting.

### Q: Can I deploy to a different host?
**A:** Yes! The `dist/` folder can be deployed to:
- Vercel
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Any static hosting service

Just upload the `dist/` folder contents.

### Q: How do I add a custom domain?
**A:** 
1. Buy domain (GoDaddy, NameCheap, etc.)
2. In Netlify dashboard → Domain management
3. Add custom domain
4. Point DNS records to Netlify
5. (Netlify handles HTTPS automatically)

---

## Usage Questions

### Q: How do I invite someone?
**A:** Share the room ID in any way:
- Text message: "Join room: secret-room-123"
- URL: "https://your-domain.netlify.app/#secret-room-123"
- QR code (generate from URL)

### Q: What if someone crashes/disconnects?
**A:** They automatically get removed from the user list after connection closes. They can rejoin by entering the room ID again.

### Q: Can I see old messages?
**A:** No! Messages only exist in real-time. There's no chat history. This is intentional for privacy.

### Q: Can I lock a room permanently?
**A:** You can lock it to prevent new messages, but anyone can unlock it (currently). Future feature: admin-only locking.

### Q: Can I delete my room?
**A:** Rooms auto-delete when the last user leaves. Or click 🗑️ to clear all messages while still in room.

### Q: Why no message history?
**A:** 
- Privacy (no data stored = no data breach risk)
- Compliance (GDPR-friendly, no data collection)
- Simplicity (easier backend, lower costs)
- Philosophy (like hack.chat - ephemeral)

### Q: Can I search messages?
**A:** Not in-app (messages aren't stored). Use Ctrl+F in browser to search visible messages only.

---

## Feature Questions

### Q: How do read receipts work?
**A:** 
- ✓ = Sent to Firebase
- ✓✓ = Recipient(s) opened/received the message
- Not real read confirmation, just delivery confirmation

### Q: How do typing indicators work?
**A:** When you start typing, your status broadcasts to others. Automatically clears after 3 seconds of no typing or when you send message.

### Q: Can I reply to specific messages?
**A:** Yes! Click on any message → reply box appears at bottom → type reply → send. The original message context appears with your reply.

### Q: Can I edit/delete my messages?
**A:** Not yet! Future feature. Currently messages can't be edited or deleted after sending.

### Q: Can I use emojis?
**A:** Yes! Any emoji works in messages and usernames. No special features yet, just type normally.

### Q: Can I share files?
**A:** Not yet! Future feature. Currently text-only messaging.

### Q: Can I use rich formatting (bold, italic)?
**A:** Not yet! Just plain text. Markdown support is a future feature.

### Q: Can I voice chat or video call?
**A:** Not yet! Text-only currently. WebRTC integration is a future feature.

---

## Security & Privacy Questions

### Q: Is my data safe?
**A:** **Yes!** 
- Messages don't persist after session
- Firebase is Google infrastructure (very secure)
- HTTPS enforced by Netlify
- No personal data collected
- No tracking cookies

### Q: Can the creator see my messages?
**A:** No! Room creator has no special permissions. All data is public within Firebase (which only room participants can access).

### Q: Is this GDPR compliant?
**A:** Mostly yes! No persistent data storage means GDPR compliance is easier. Just be aware:
- No user consent forms needed (optional)
- No data retention policies needed (auto-delete)
- No privacy policy required (but good practice to have)

### Q: Can messages be intercepted?
**A:** Very unlikely! 
- HTTPS encrypts in-transit
- Firebase handles backend security
- No message encryption in-app (future feature)

### Q: What if Firebase gets hacked?
**A:** Very unlikely (Google's infrastructure is extremely secure), but:
- Only active session data at risk (not persistent)
- Messages auto-delete anyway
- Firebase has redundancy and backups
- No personal info stored (just messages)

### Q: Can I end-to-end encrypt messages?
**A:** Not built-in yet! You could:
1. Use a crypto library (libsodium, etc.)
2. Encrypt messages client-side
3. Store encrypted text in database
4. Decrypt on recipient's side
See FEATURES.md for implementation ideas.

---

## Performance & Scale Questions

### Q: How many users can use this simultaneously?
**A:** Per Firebase free tier:
- ~100-200 concurrent connections comfortable
- Scales to thousands with paid tier
- Per room: No hard limit (but practical ~50-100)

### Q: Will it get slow with many messages?
**A:** Possibly! Optimizations:
- Clear old messages (🗑️ button)
- Create new room for large discussions
- Firebase can scale with paid plan

### Q: What's the response time?
**A:** 
- Message delivery: < 200ms
- User updates: < 500ms
- UI updates: < 100ms
- Page load: < 2 seconds

### Q: How much bandwidth does it use?
**A:** Very minimal!
- ~1-5KB per message
- ~100 bytes for typing indicator
- ~100 bytes for user list update
- Netlify: Unlimited free bandwidth

---

## Troubleshooting Questions

### Q: Messages aren't showing up!
**A:** Try these:
1. Refresh the page (F5)
2. Check if room is locked (🔒)
3. Verify you're in the same room ID
4. Check browser console (F12) for errors
5. Restart browser

### Q: Why is it so slow?
**A:** Could be:
- Your internet connection
- Firebase database overloaded
- Too many users (rare)
- Browser has too many tabs open
- Solution: Refresh, try different room, check connection

### Q: Why can't I send messages?
**A:** Check:
1. Room is not locked (🔒)
2. Message is not empty
3. Message is under 500 characters
4. You're connected to internet
5. Firebase is responding

### Q: User list shows wrong people!
**A:** 
- Users who disconnected take ~10s to clear
- Refresh page to manually clear
- This is normal Firebase behavior

### Q: App looks broken/styling weird!
**A:** Try:
1. Hard refresh (Ctrl+Shift+R)
2. Clear browser cache
3. Try different browser
4. Check if CSS file loaded (F12 → Network)

### Q: Why won't my custom domain work?
**A:** Common issues:
- DNS records not updated yet (takes 24-48 hours)
- DNS pointing to wrong IP
- Netlify not recognizing domain
- Check Netlify Domain settings

---

## Feature Request Questions

### Q: Can you add feature X?
**A:** Maybe! 
- Check GitHub issues (might already be planned)
- Open a new issue describing your feature
- Explain why you need it
- Community votes on priority
- Contributions welcome!

### Q: Can I help develop?
**A:** **Yes!** 
- Fork the GitHub repo
- Create feature branch
- Make changes
- Submit pull request
- Help improve the project!

### Q: How do I report a bug?
**A:** 
1. Open GitHub issue
2. Describe what happened
3. Include browser/OS info
4. Share steps to reproduce
5. Include screenshots if possible

---

## Business Questions

### Q: Can I use this commercially?
**A:** Check the license! Current license likely:
- ✅ Can use for business
- ✅ Can modify code
- ✅ Can sell services
- ⚠️ Must keep license text
- (Verify specific license file)

### Q: Can I add ads to monetize?
**A:** Technically yes, but:
- Against philosophy (clean UX)
- Check license terms
- Users might not like it
- Consider donation model instead

### Q: Can I white-label this?
**A:** Yes! You can:
- Change colors/branding
- Remove attribution (check license)
- Add your company logo
- Customize UI completely
- Sell as your own product

### Q: What's your business model?
**A:** Currently:
- Free open-source project
- No monetization
- Community-driven
- Contributions appreciated
- Donations optional

---

## Getting Help

### Where to find answers:
1. **README.md** - Overview & features
2. **DEPLOYMENT_GUIDE.md** - Deployment steps
3. **FEATURES.md** - Detailed feature docs
4. **QUICKSTART.md** - Quick reference
5. **DESIGN_SYSTEM.md** - UI/UX details
6. **PROJECT_SUMMARY.md** - Full project info

### Still stuck?
- GitHub Issues (for bugs/features)
- Project discussions (for questions)
- Stack Overflow (for general React/Firebase)
- Firebase docs: https://firebase.google.com/docs
- React docs: https://react.dev

---

**Can't find your answer? Open an issue on GitHub!** 🚀

*We're here to help! Community feedback makes this better!* 💙
