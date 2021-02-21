const mongoose = require('mongoose');
const colors = require('colors');

const CourseScheme = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Pls add a course title'],
        unique: true,
        maxlength: [50, 'Title can not be more than 50 characters'],
    },
    description: {
        type: String,
        required: [true, 'Pls add a course title'],
        maxlength: [300, 'Description can not be more than 300 characters'],
    },
    weeks: {
        type: Number,
        required: [true, 'Pls add a number of weeks'],
        min: [1, 'weeks less than zero'],
    },
    tuition: {
        type: Number,
        required: [true, 'Pls add a tuition cost'],
        min: [0, 'tuition less than zero'],
    },
    minimumSkill: {
        type: String,
        required: [true, 'Pls add a minimul skill'],
        enum: ['beginner', 'intermediate', 'advanced'],
    },
    scholarhipsAvailable: {
        type: Boolean,
        default: false,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        /* Имя модели */
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        /* Имя модели */
        ref: 'User',
        required: true
    },
});

// Static method to get avg of course tuitions
/* Статистичка хуйня, которая для всех курсов,
 * у которых bootcamp один и тотже */
CourseScheme.statics.getAverageCost = async function (bootcampId) {
    console.log(`Calculating avg cost...`.blue);

    const obj = await this.aggregate([
        {
            $match: {
                bootcamp: bootcampId,
            },
        },
        {
            $group: {
                _id: `$bootcamp`,
                /* находит среднию */
                averageCost: {
                    $avg: `$tuition`,
                },
            },
        },
    ]);

    /* Обновляем среднию цену за курсы*/
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
        });
    } catch (error) {
        console.error(error);
    }
};

// Call getAverageCost after save
CourseScheme.post('save', function () {
    this.constructor.getAverageCost(this.bootcamp);
});
// Call getAverageCost after save
CourseScheme.pre('remove', function () {
    this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseScheme);
