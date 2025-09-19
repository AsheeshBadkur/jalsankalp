const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    state: String,
    city: String,
    roofType: String,
    roofArea: Number,
    familySize: Number,
   
    result: Object,  // store water potential, recommended system, cost, etc.
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
