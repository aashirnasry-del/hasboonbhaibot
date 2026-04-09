const mineflayer = require('mineflayer')

let reconnectDelay = 3000 // start fast

function createBot() {
  const bot = mineflayer.createBot({
    host: 'PVPpracticeO.aternos.me',
    port: 60322,
    username: 'mr_beast'
  })

  // When bot joins
  bot.on('spawn', () => {
    console.log('✅ Bot joined!')
    reconnectDelay = 3000

    // Login after join
    setTimeout(() => {
      bot.chat('/login 123456')
    }, 2000)

    // Start random movement
    startRandomMovement()
  })

  // Auto register/login detection
  bot.on('messagestr', (message) => {
    const msg = message.toLowerCase()

    if (msg.includes('register')) {
      bot.chat('/register 123456 123456')
    }

    if (msg.includes('login')) {
      bot.chat('/login 123456')
    }
  })

  // Light chat every 90 sec
  setInterval(() => {
    bot.chat('still here :)')
  }, 90000)

  // 🎮 Random Movement System
  function startRandomMovement() {
    setInterval(() => {
      const actions = ['forward', 'back', 'left', 'right', 'jump']
      const action = actions[Math.floor(Math.random() * actions.length)]
      const duration = Math.floor(Math.random() * 2000) + 1000

      bot.setControlState(action, true)

      setTimeout(() => {
        bot.setControlState(action, false)
      }, duration)

      // Random look
      const yaw = Math.random() * Math.PI * 2
      const pitch = (Math.random() - 0.5) * Math.PI / 2
      bot.look(yaw, pitch, true)

    }, 5000)
  }

  // 🔁 Smart reconnect
  function reconnect() {
    console.log(`🔄 Reconnecting in ${reconnectDelay / 1000}s...`)
    setTimeout(createBot, reconnectDelay)

    reconnectDelay = Math.min(reconnectDelay + 2000, 15000)
  }

  bot.on('end', reconnect)

  bot.on('kicked', (reason) => {
    console.log('❌ Kicked:', reason)
    reconnect()
  })

  bot.on('error', (err) => {
    console.log('⚠️ Error:', err.message)
  })
}

createBot()
