'use strict';
const Issue = require ('../model.js');
module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      let project = req.params.project;
      
      let cond = {project: project, ...req.query};
      //console.log(cond);
      const issues = await Issue.find(cond);
      //console.log(issues);
      res.json({issues: issues});
    })
    
    .post(async function (req, res){
      let project = req.params.project;
      let issue;
      //console.log(req.body);
      if(req.body.issue_title && req.body.issue_text && req.body.created_by){
        
        issue = new Issue();
        issue.project = project;
        issue.issue_title = req.body.issue_title;
        issue.issue_text = req.body.issue_text;
        issue.created_by = req.body.created_by;
        issue.assigned_to = req.body.assigned_to;
        issue.status_text = req.body.status_text;
        await issue.save();
  
      }
      else { 
        issue = {error: "missing required field(s) !"};
      }
      
      res.json(issue);
    })
    
    .put(async function (req, res){
      //let project = req.params.project;
      const _id = req.body._id;
      const data = {};
      if(req.body.issue_title) data.issue_title = req.body.issue_title;
      if(req.body.issue_text) data.issue_text = req.body.issue_text;
      if(req.body.created_by) data.created_by = req.body.created_by;
      if(req.body.assigned_to) data.assigned_to = req.body.assign_to;
      if(req.body.status_text) data.status_text = req.body.status_text;
      if(req.body.open==="false") data.open = false;
      //console.log(data);
      let issue = await Issue.findById(_id);
      if(issue) {
        issue.updated_on = new Date();
        if(data.issue_title) issue.issue_title = data.issue_title;
        if(data.issue_text) issue.issue_text = data.issue_text;
        if(data.created_by) issue.created_by = data.created_by;
        if(data.assigned_to) issue.assigned_to = data.assign_to;
        if(data.status_text) issue.status_text = data.status_text;
        if(data.open===false) issue.open = false;
        await issue.save();
        //console.log(issue);
      }
      else {
        issue = {error: "Issue not found"};
      }
     
      res.json(issue);
    })
    
    .delete(async function (req, res){
      //let project = req.params.project;
      const _id = req.body._id;
      let issue = await Issue.findOneAndDelete({_id: _id});
      if(!issue) {
        issue = {error: "Issue not found"};
      }

      res.json(issue);
    });
    
};
