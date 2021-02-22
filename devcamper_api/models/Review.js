const mongoose = require('mongoose');


const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Pls add a title for the review'],
        maxlength: 100,
    },
    text: {
        type: String,
        required: [true, 'Pls add a some text']
    },
    rating: {
        type: Number,
        required: [true, 'Pls add a rating between 1 and 10'],
        min: 1,
        max: 10
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

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({
    bootcamp: 1, user: 1
}, {unique: true})


// Static method to get avg rating ans save
/* Статистичка хуйня, которая для всех review,
 * у которых bootcamp один и тотже */
ReviewSchema.statics.getAverageRating = async function (bootcampId) {

    const obj = await this.aggregate([
        {
            $match: {
                bootcamp: bootcampId,
            },
        },
        {
            $group: {
                _id: `$bootcamp`,
                /* находит средний рейтинг */
                averageRating: {
                    $avg: `$rating`,
                },
            },
        },
    ]);

    /* Обновляем среднию цену за курсы*/
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageRating   
        });
    } catch (error) {
        console.error(error);
    }
};

// Call getAverageRating after save
ReviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.bootcamp);
});
// Call getAverageRating after save
ReviewSchema.pre('remove', function () {
    this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);
