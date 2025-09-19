// Example static data
const rainfallData = {
    andhra: 900,
    delhi: 800,
    maharashtra: 1200,
    karnataka: 1100,
};

const roofCoefficients = {
    metal: 0.9,
    concrete: 0.8,
    tiles: 0.85,
    asbestos: 0.75,
};

function calculateRainwaterPotential({ state, roofType, roofArea }) {
    const rainfall = rainfallData[state] || 1000; // default if not found
    const coefficient = roofCoefficients[roofType] || 0.8;

    const potentialLiters = roofArea * rainfall * coefficient * 0.0283; // convert sq.ft * mm to liters
    return potentialLiters.toFixed(0);
}

function recommendSystem(potential, purpose) {
    if (purpose === 'domestic') {
        return `Install a ${Math.ceil(potential / 1000)}-liter storage tank`;
    } else {
        return 'Construct recharge pit system';
    }
}

function estimateCost(potential) {
    return {
        min: Math.round(potential * 0.4),
        max: Math.round(potential * 0.5),
    };
}

module.exports = { calculateRainwaterPotential, recommendSystem, estimateCost };
