'use strict';

module.exports = function (app) {
 
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

  const Issue = mongoose.model('Issue', issueSchema);
  
  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      let project = req.params.project;
      
      let cond = {project: project, ...req.query};
      console.log(cond);
      const issues = await Issue.find(cond);
      console.log(issues);
      res.json(issues);
    })
    
    .post(async function (req, res){
      let project = req.params.project;
      //console.log(req.body);
      if(!req.body.issue_title || !req.body.issue_text || !req.body.created_by){
        res.json({error: "missing required fields!"})
      }
      const issue = new Issue();
      issue.project = project;
      issue.issue_title = req.body.issue_title;
      issue.issue_text = req.body.issue_text;
      issue.created_by = req.body.created_by;
      issue.assigned_to = req.body.assigned_to;
      issue.status_text = req.body.status_text;
      await issue.save();

      res.json(issue);
    })
    
    .put(async function (req, res){
      let project = req.params.project;
      const _id = req.body._id;
      let issue = await Issue.findById(_id);
      issue.updated_on = new Date();
      if(req.body.issue_title) issue.title = req.body.issue_title;
      if(req.body.issue_text) issue.issue_text = req.body.issue_text;
      if(req.body.created_by) issue.created_by = req.body.created_by;
      if(req.body.assigned_to) issue.assigned_to = req.body.assign_to;
      if(req.body.status_text) issue.status_text = req.body.status_text;
      if(req.body.open===false) issue.open = false;
      await issue.save();
      res.json(issue);
    })
    
    .delete(async function (req, res){
      let project = req.params.project;
      const _id = req.body._id;
      const issue = await Issue.findOneAndDelete({_id: _id});
      res.json(issue);
    });
    
};
