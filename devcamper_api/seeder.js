const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const colors = require('colors');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Bootcamp = require('./models/Bootcamps');
const Course = require('./models/Course');

// Conntect to DB
/* Подключаемся к серваку */
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

// Read JSON files
/* читаем данные из bootcamps.json и переводим в обьект */
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));

// Import into DB
/* Закидываем bootcamps.json в БД*/
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        console.log(`Data Imported...`.green.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
};

// Delete data
/* Удаляем все из БД*/
const deletetData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log(`Data destroyes...`.red.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
};

/* Запускаем в консоли через node seeder -i или -d.
 * Все .pre остаются в рабочем состояние*/
if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') deletetData();
