const express = require('express');
const Property = require('../models/property');
const router = express.Router();

// Create Property
router.post('/', async (req, res) => {
    const { address, price, description, images, contactInfo, userId } = req.body;


    try {
        const newProperty = new Property({ address, price, description, images, contactInfo, user: userId });
        await newProperty.save();
        res.status(201).json(newProperty);
    } catch (err) {
        res.status(500).json({ msg: 'Server error',err });
    }
});

// Get All Properties
router.get('/', async (req, res) => {
    try {
        const properties = await Property.find();
        res.status(200).json(properties);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

router.get('/search', async (req, res) => {
    const { location, minPrice, maxPrice, type } = req.query;

    // Debugging: log the incoming query parameters
    console.log('Incoming Query Params:', req.query);
    console.log(minPrice);

    try {
        const query = {};

        if (location) {
            query.address = { $regex: location, $options: 'i' };
        }

        if (type) {
            query.description = { $regex: type, $options: 'i' };
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) {
                const min = Number(minPrice);
                if (!isNaN(min)) {
                    query.price.$gte = min;
                }
            }
            if (maxPrice) {
                const max = Number(maxPrice);
                if (!isNaN(max)) {
                    query.price.$lte = max;
                }
            }
        }

        // Debugging: log the constructed query
        console.log('Query:', query);

        const properties = await Property.find(query);

        res.status(200).json(properties);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Mark as Favorite
router.post('/favorite/:id', async (req, res) => {
    try {
        console.log(req.params.id)
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ msg: 'Property not found' });

        if (property.favorites.includes(req.user.id)) {
            return res.status(400).json({ msg: 'Property already in favorites' });
        }

        property.favorites.push(req.user.id);
        await property.save();

        res.status(200).json(property);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get Favorites
router.get('/favorites', async (req, res) => {
    try {
        const properties = await Property.find({ favorites: req.user.id });
        res.status(200).json(properties);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Delete Property
router.delete('/:id', async (req, res) => {
    try {
        await Property.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: 'Property deleted' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
