const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');
const colors = require('colors');

// типа валидация, схема
const BootcampsScheme = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add name'],
            unique: true,
            true: true,
            maxlength: [50, 'Name can not be more than 50 characters'],
        },
        /* Удобная версия имени для URL
         * Пример: {
         *      name: I enotic poloskun,
         *      slug: i-enotic-poloskun
         * }*/
        slug: String,
        description: {
            type: String,
            required: [true, 'Please add description'],
            maxlength: [300, 'Description cant be more than 300 characters'],
        },
        website: {
            type: String,
            match: [
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                'Please use a valid URL with HTTP or HTTPS',
            ],
        },
        phone: {
            type: String,
            maxlength: [20, 'Phone number can not be longer than 20 characters'],
        },
        email: {
            type: String,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please use a valid email',
            ],
        },
        address: {
            type: String,
            required: [true, 'Pleade add an address'],
        },
        location: {
            // GEOjson point
            type: {
                type: String,
                enum: ['Point'],
                required: false,
            },
            coordinates: {
                type: [Number],
                required: false,
                index: '2dsphere',
            },
            formattedAddress: String,
            street: String,
            city: String,
            state: String,
            zipcode: String,
            country: String,
        },
        careers: {
            // Array of strings
            type: [String],
            required: true,
            enum: [
                'Web Development',
                'Mobile Development',
                'UI/UX',
                'Data Science',
                'Business',
                'Other',
            ],
        },
        averageRating: {
            type: Number,
            min: [1, 'Ratting must be at least 1'],
            max: [10, 'Ratting must can not be more than 10'],
        },
        averageCost: {
            type: Number,
        },
        photo: {
            type: String,
            default: 'no-photo.jpg',
        },
        housing: {
            type: Boolean,
            default: false,
        },
        jobAssistance: {
            type: Boolean,
            default: false,
        },
        jobGuarantee: {
            type: Boolean,
            default: false,
        },
        acceptGi: {
            type: Boolean,
            default: false,
        },
        createAt: {
            type: Date,
            default: Date.now,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            /* Имя модели */
            ref: 'User',
            required: true
        },
    },
    {
        /* Включаение виртуализации. Данные выводятся,
         * например курсы, к которым он принадлежит,
         * но их в самих данных базы Bootcamp нету*/
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    }
);

// Create bootcamp slug from the name
/* Будет запускаться до
 * операции -save- документа
 * this.* - * берется из Схемы*/
BootcampsScheme.pre('save', function (next) {
    this.slug = slugify(this.name, {
        lower: true,
    });
    next();
});

// Geocode & create location field
BootcampsScheme.pre('save', async function (next) {
    const loc = await geocoder.geocode(this.address);
    const {
        longitude,
        latitude,
        formattedAddress,
        streetName,
        city,
        stateCode,
        zipcode,
        countryCode,
    } = loc[0];

    this.location = {
        type: 'Point',
        coordinates: [longitude, latitude],
        formattedAddress: formattedAddress,
        street: streetName,
        city: city,
        state: stateCode,
        zipcode: zipcode,
        country: countryCode,
    };

    // Do not save address in DB
    this.address = undefined;
});

// Cascade delete courses when a bootcamp is deleted
/* Событие, которые запуститься,
 * когда произойдет удаление одного из bootcamp*/
BootcampsScheme.pre('remove', async function (next) {
    console.log(`Courses being removed from bootcamp ${this._id}`.bgRed);
    await this.model('Course').deleteMany({
        bootcamp: this._id,
    });
    next();
});

// Reverse populate with virtuals
BootcampsScheme.virtual('courses', {
    /* Имя модели*/
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false,
});

module.exports = mongoose.model('Bootcamp', BootcampsScheme);
