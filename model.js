const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  
const issueSchema = new mongoose.Schema({
project: {
    type: String,
    required: true
},
issue_title: {
    type: String,
    required: true
},
issue_text: {
    type: String,
    required: true
},
created_on: {
    type: Date,
    default: new Date()
},
updated_on: Date,
created_by:  {
    type: String,
    required: true
},
assigned_to: String,
open: {
    type: Boolean,
    default: true
},
status_text: String
});

module.exports = mongoose.model('Issue', issueSchema);