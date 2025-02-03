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
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/711/2ce/7112ce51-3cc1-42ca-8de7-62e7525dc332/1.webp")
            return bot.sendMessage(chatId, "Привет, " + msg.from.first_name);
        }
        if (text === "/info"){
            await bot.sendMessage(chatId, "Ты пес");
            return bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/8eb/10f/8eb10f4b-8f4f-4958-aa48-80e7af90470a/1.webp")
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
            return await bot.sendMessage(chatId, "Молодец!!", againOptions)
        }else{
            return await bot.sendMessage(chatId, "неа, цифра " +  chats[chatId], againOptions)
        }
    })
}

start()