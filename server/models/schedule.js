const mongoose = require('mongoose');


const ScheduleSchema = new mongoose.Schema({
subject: { type: String, required: true },
day: { type: String, required: true },
startTime: { type: String, required: true },
endTime: { type: String, required: true },
instructor: { type: String },
color: { type: String, default: '#60A5FA' },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Schedule', ScheduleSchema);