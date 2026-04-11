const mineflayer = require('mineflayer')

const HOST = 'PVPpracticeO.aternos.me'
const PORT = 60322
const USERNAME = 'HasboonBotYT_99'
const PASSWORD = 'hasboon99'

let bot
let loggedIn = false
let registered = false

function createBot() {
  bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME
  })

  console.log('🤖 Bot starting...')

  bot.on('spawn', () => {
    console.log('✅ Spawned')

    setTimeout(() => {
      bot.chat(`/login ${PASSWORD}`)
    }, 5000)

    lookAtPlayers()
    lightMovement()
    chatSystem()
  })

  // =====================
  // LOGIN + REGISTER
  // =====================
  bot.on('messagestr', (msg) => {
    const text = msg.toLowerCase()

    if (!registered && text.includes('register')) {
      bot.chat(`/register ${PASSWORD}`)
      registered = true
      console.log('📝 Registered')
    }

    if (!loggedIn && text.includes('login')) {
      bot.chat(`/login ${PASSWORD}`)
      console.log('🔐 Logging in...')
    }

    if (text.includes('logged')) {
      loggedIn = true
      console.log('✅ Logged in')
    }
  })

  // =====================
  // LOOK AT NEAREST PLAYER 👀
  // =====================
  function lookAtPlayers() {
    setInterval(() => {
      if (!loggedIn || !bot.entity) return

      const players = Object.values(bot.players)
        .filter(p => p.entity)

      if (players.length === 0) return

      const target = players[Math.floor(Math.random() * players.length)]

      bot.lookAt(target.entity.position.offset(0, 1.6, 0))

    }, 5000)
  }

  // =====================
  // SMALL MOVEMENT (ANTI BOT)
  // =====================
  function lightMovement() {
    setInterval(() => {
      if (!loggedIn || !bot.entity) return

      const actions = ['forward', 'left', 'right']
      const action = actions[Math.floor(Math.random() * actions.length)]

      bot.setControlState(action, true)

      setTimeout(() => {
        bot.setControlState(action, false)
      }, 800)

    }, 20000)
  }

  // =====================
  // CHAT SYSTEM
  // =====================
  function chatSystem() {
    setInterval(() => {
      if (!loggedIn) return

      bot.chat('subscribe to hasboonbhai')
      bot.chat('we are close to hundred subscriber')

    }, 20 * 60 * 1000)
  }

  // =====================
  // RECONNECT
  // =====================
  bot.on('end', () => {
    console.log('🔄 Reconnecting...')
    setTimeout(createBot, 15000)
  })

  bot.on('error', (err) => {
    console.log('⚠️ Error:', err.message)
  })

  bot.on('kicked', (reason) => {
    console.log('❌ Kicked:', reason)
  })
}

createBot()
