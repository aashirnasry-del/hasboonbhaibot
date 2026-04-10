const mineflayer = require('mineflayer')

const HOST = 'PVPpracticeO.aternos.me'
const PORT = 60322
const USERNAME = 'HasboonBotYT_99'
const PASSWORD = 'hasboon99'

let bot
let loggedIn = false
let reconnecting = false

function createBot () {
  bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME
  })

  console.log('🔄 Bot starting...')

  bot.on('spawn', () => {
    console.log('✅ Bot spawned in server')
    loggedIn = false

    // try login after spawn
    setTimeout(() => {
      if (!loggedIn) {
        bot.chat(`/login ${PASSWORD}`)
        console.log('🔐 Sent login command')
      }
    }, 4000)

    // message every 20 minutes
    setInterval(() => {
      if (bot && loggedIn) {
        bot.chat('subscribe to hasboonbhai')
      }
    }, 20 * 60 * 1000)

    // light random movement
    setInterval(() => {
      if (!bot || !loggedIn) return

      const yaw = Math.random() * Math.PI * 2
      bot.look(yaw, 0)

      bot.setControlState('forward', true)
      setTimeout(() => {
        bot.setControlState('forward', false)
      }, 1500)

    }, 30000)
  })

  // detect messages (login system)
  bot.on('messagestr', (msg) => {
    const text = msg.toLowerCase()

    if (!loggedIn && (text.includes('login') || text.includes('password'))) {
      bot.chat(`/login ${PASSWORD}`)
      console.log('🔐 Auto login sent')
    }

    if (text.includes('logged in') || text.includes('successfully')) {
      loggedIn = true
      console.log('✅ Login successful')
    }
  })

  bot.on('kicked', (reason) => {
    console.log('❌ Kicked:', reason)
  })

  bot.on('error', (err) => {
    console.log('⚠️ Error:', err.message)
  })

  bot.on('end', () => {
    if (reconnecting) return
    reconnecting = true

    console.log('🔄 Disconnected. Reconnecting in 10s...')

    setTimeout(() => {
      reconnecting = false
      createBot()
    }, 10000)
  })
}

createBot()
