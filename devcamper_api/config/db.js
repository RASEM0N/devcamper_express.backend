const mongoose = require('mongoose');

/* Асинхронная ф-ия, которая делает
 * запрос на сервер, чтобы получить БД */
async function connectDB() {
    // получаем нашу БД по URL
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });

    console.log(
        `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    );
}

module.exports = connectDB;
