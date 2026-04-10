const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
  host: 'PVPpracticeO.aternos.me',
  port: 60322,
  username: 'HasboonBotYT_99'
})

const PASSWORD = 'hasboon99'

let loggedIn = false

bot.on('messagestr', (msg) => {
  const text = msg.toLowerCase()

  if (!loggedIn && (text.includes('login') || text.includes('password'))) {
    bot.chat(`/login ${hasboon99}`)
    console.log('🔐 Trying login...')
  }

  if (text.includes('logged in')) {
    loggedIn = true
    console.log('✅ Logged in!')
  }
})

bot.on('spawn', () => {
  console.log('🤖 Bot spawned')
})

bot.on('kicked', (reason) => {
  console.log('❌ Kicked:', reason)
})

bot.on('error', (err) => {
  console.log('⚠️ Error:', err.message)
})

bot.on('end', () => {
  console.log('🔄 Reconnecting...')
  setTimeout(() => process.exit(1), 10000)
})
