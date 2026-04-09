const mineflayer = require('mineflayer')

let reconnectDelay = 15000
let canReconnect = true
let loggedIn = false

function createBot() {
  const bot = mineflayer.createBot({
    host: 'YOUR_SERVER_IP',
    port: 25565,
    username: 'Bot123'
  })

  console.log("Bot starting...")

  // =========================
  // WHEN BOT JOINS
  // =========================
  bot.on('spawn', () => {
    console.log("✅ Bot joined server!")

    loggedIn = false
    reconnectDelay = 15000

    // LOGIN ONLY ONCE
    setTimeout(() => {
      if (!loggedIn) {
        bot.chat('/login 123456')
        loggedIn = true
      }
    }, 5000)

    startRandomMovement(bot)
  })

  // =========================
  // SMART LOGIN DETECTOR
  // =========================
  bot.on('messagestr', (msg) => {
    const m = msg.toLowerCase()

    if (!loggedIn && m.includes('login')) {
      setTimeout(() => {
        bot.chat('/login 123456')
        loggedIn = true
      }, 3000)
    }
  })

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
