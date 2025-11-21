const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')
const token = "7236835201:AAG2aPt8JkLe-5V3llYoNqRN6dnmauA37eI";

const bot = new TelegramApi(token,{polling:true});

const chats = {}

const startGame = async (chatId) =>{
    await bot.sendMessage(chatId, "Загадываю цифру от 1 до 9...");
    const randomNumber = Math.floor(Math.random()*10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Загадал", gameOptions )
}

const start = () =>{
    bot.setMyCommands([
        {command:'/start', description: "Начальное приветствие"},
        {command:'/info', description: "Получить информацию"},
        {command:'/game', description: "Игра угадай цифру"}
    ])

    bot.on("message", async msg=>{
        const text= msg.text;
        const chatId = msg.chat.id;
        if (text ==='/start'){
            return bot.sendMessage(chatId, "Привет, " + msg.from.first_name);
        }
        if (text === "/info"){
            return bot.sendMessage(chatId, "Это бот на JS, который может угадать твое число, " + msg.from.first_name);
        }

        if (text === "/game"){
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, "Я тебя не понимаю!")

    })

    bot.on('callback_query', async msg=>{
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data ==="/again"){
            return startGame(chatId)
        }
        if (data === chats[chatId]){
            return await bot.sendMessage(chatId, "Верно!", againOptions)
        }else{
            return await bot.sendMessage(chatId, "К сожалению нет,  " +  chats[chatId], againOptions)
        }
    })
}

start()