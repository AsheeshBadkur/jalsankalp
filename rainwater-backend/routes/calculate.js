const express = require('express');
const router = express.Router();
const { calculateRainwaterPotential, recommendSystem, estimateCost } = require('../utils/calculation');

// POST /api/calculate
router.post('/', (req, res) => {
    const { state,city, roofType, roofArea ,name,purpose} = req.body;

    if (!state || !roofType || !roofArea ) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const potential = calculateRainwaterPotential({ state, roofType, roofArea });
    const system = recommendSystem(potential);
    const cost = estimateCost(potential);

     const materials = [
        { name: 'PVC Pipe', cost: '₹2000' },
        { name: 'Storage Tank', cost: '₹10000' }
    ];
    const savings = `${Math.floor(potential * 0.1)} liters annually`;
    const savingsText = 'This helps reduce reliance on municipal water and prevents runoff.';

    const steps = [
        'Survey roof and estimate dimensions',
        'Install rainwater collection system',
        'Connect pipes to storage or recharge pit',
        'Implement filtration as necessary',
        'Perform regular maintenance'
    ];

    res.json({
        name: name || 'N/A',          // populate from request
        state,
        city,
        averageAnnualRainfall: '2000 mm', // you can calculate or fetch from IMD data
        roofType,
        purpose: purpose || 'N/A',
        potentialLiters: potential,
        recommendedSystem: system,
        estimatedCost: cost,
         materials,
        savings,
        savingsText,
        steps
    });
});

module.exports = router;
