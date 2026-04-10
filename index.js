const mineflayer = require('mineflayer')

let reconnectDelay = 30000 // 30 sec
let canReconnect = true
let loggedIn = false
let registered = false

function createBot() {
  const bot = mineflayer.createBot({
    host: 'PVPpracticeO.aternos.me',
    port: 60322,
    username: 'HasboonBotYT_99'
  })

  console.log("Bot starting...")

  // =========================
  // WHEN BOT JOINS
  // =========================
  bot.on('spawn', () => {
    console.log("✅ Bot joined server!")

    loggedIn = false
    reconnectDelay = 15000

    startChatSpam(bot)
    startRandomMovement(bot)
  })

  // =========================
  // LOGIN / REGISTER SYSTEM
  // =========================
  bot.on('messagestr', (msg) => {
    const m = msg.toLowerCase()

    // REGISTER ONLY IF NEEDED (FIRST TIME)
    if (!registered && m.includes('register')) {
      console.log("Registering...")
      setTimeout(() => {
        bot.chat('/register hasboon99 hasboon99')
        registered = true
      }, 4000)
    }

    // LOGIN ONLY ONCE
    if (!loggedIn && m.includes('login')) {
      console.log("Logging in...")
      setTimeout(() => {
        bot.chat('/login hasboon99')
        loggedIn = true
      }, 3000)
    }
  })

  // =========================
  // AUTO CHAT EVERY 20 MIN
  // =========================
  function startChatSpam(bot) {
    setInterval(() => {
      if (!bot || !bot.entity) return

      bot.chat('subscribe to hasboonbhai')
      console.log("📢 Sent promo message")

    }, 20 * 60 * 1000) // 20 minutes
  }

  // =========================
  // RANDOM MOVEMENT
  // =========================
  function startRandomMovement(bot) {
    setInterval(() => {
      if (!bot || !bot.entity) return

      const actions = ['forward', 'back', 'left', 'right', 'jump']
      const action = actions[Math.floor(Math.random() * actions.length)]
      const duration = Math.floor(Math.random() * 2000) + 1000

      bot.setControlState(action, true)

      setTimeout(() => {
        bot.setControlState(action, false)
      }, duration)

      const yaw = Math.random() * Math.PI * 2
      const pitch = (Math.random() - 0.5) * Math.PI / 2
      bot.look(yaw, pitch, true)

    }, 6000)
  }

  // =========================
  // SAFE RECONNECT SYSTEM
  // =========================
  function reconnect() {
    if (!canReconnect) return

    canReconnect = false

    console.log(`🔄 Reconnecting in ${reconnectDelay / 1000}s...`)

    setTimeout(() => {
      createBot()
    }, reconnectDelay)

    reconnectDelay = Math.min(reconnectDelay + 10000, 60000)

    setTimeout(() => {
      canReconnect = true
    }, 20000)
  }

  // =========================
  // EVENTS
  // =========================
  bot.on('end', () => {
    console.log("❌ Disconnected")
    reconnect()
  })

  bot.on('kicked', (reason) => {
    console.log("❌ Kicked:", reason)

    setTimeout(() => {
      reconnect()
    }, 20000)
  })

  bot.on('error', (err) => {
    console.log("⚠️ Error:", err.message)

    setTimeout(() => {
      reconnect()
    }, 20000)
  })
}

createBot()
