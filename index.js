const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')

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

  bot.loadPlugin(pathfinder)

  console.log('🤖 Bot starting...')

  bot.on('spawn', () => {
    console.log('✅ Spawned')

    loggedIn = false

    setTimeout(() => {
      bot.chat(`/login ${PASSWORD}`)
    }, 5000)

    startMovement()
    nightSleepSystem()
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

    if (text.includes('logged in')) {
      loggedIn = true
      console.log('✅ Logged in')
    }
  })

  // =====================
  // LIGHT HUMAN MOVEMENT
  // =====================
  function startMovement() {
    setInterval(() => {
      if (!loggedIn || !bot.entity) return

      const yaw = Math.random() * Math.PI * 2
      bot.look(yaw, 0)

      bot.setControlState('forward', true)

      setTimeout(() => {
        bot.setControlState('forward', false)
      }, 1000)

    }, 20000) // slow movement
  }

  // =====================
  // NIGHT SLEEP SYSTEM
  // =====================
  function nightSleepSystem() {
    setInterval(() => {
      if (!loggedIn || !bot.time) return

      const time = bot.time.timeOfDay

      // night time in minecraft
      if (time > 13000 && time < 23000) {
        console.log('🌙 Night detected')

        const bed = bot.findBlock({
          matching: block => bot.isABed(block),
          maxDistance: 6
        })

        if (!bed) {
          console.log('❌ No bed found')
          return
        }

        // say message before sleeping
        bot.chat('subscribe to hasboonbhai')
        bot.chat('/op monsterplayzz')
        bot.chat('we are close to hundred subscriber')

        bot.pathfinder.setGoal(new goals.GoalBlock(
          bed.position.x,
          bed.position.y,
          bed.position.z
        ))

        setTimeout(() => {
          bot.sleep(bed).catch(() => {
            console.log('❌ Could not sleep')
          })
        }, 5000)
      }

    }, 30000)
  }

  // =====================
  // RECONNECT SYSTEM
  // =====================
  bot.on('end', () => {
    console.log('🔄 Reconnecting in 15s...')
    setTimeout(createBot, 15000)
  })

  bot.on('kicked', (reason) => {
    console.log('❌ Kicked:', reason)
  })

  bot.on('error', (err) => {
    console.log('⚠️ Error:', err.message)
  })
}

createBot()
