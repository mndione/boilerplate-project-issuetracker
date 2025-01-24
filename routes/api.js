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
      res.json(issues);
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
        issue.assigned_to = req.body.assigned_to ? req.body.assigned_to : '';
        issue.status_text = req.body.status_text ? req.body.status_text : '';
        issue.updated_on = issue.created_on;
        await issue.save();
      }
      else { 
        issue = {error: "required field(s) missing"};
      }
      
      res.json(issue);
    })
    
    .put(async function (req, res){
      //let project = req.params.project;
      if(!req.body._id) {
        res.json({error: 'missing _id'});
        return;
      }
      const _id = req.body._id;
      let issue = await Issue.findById(_id);
      if(issue) {
        let toUpdate = false;
        if(req.body.issue_title ) {
          issue.issue_title = req.body.issue_title;
          toUpdate = true;
        }
        if(req.body.issue_text ) {
          issue.issue_text = req.body.issue_text;
          toUpdate = true;
        }
        if(req.body.created_by ) {
          issue.created_by = req.body.created_by;
          toUpdate = true;
        }
        if(req.body.assigned_to ) {
          issue.assigned_to = req.body.assigned_to;
          toUpdate = true;
        }
        if(req.body.status_text ) {
          issue.status_text = req.body.status_text;
          toUpdate = true;
        }
        const openSended = req.body.open==="false" ? false : true;
        if(openSended != issue.open ) {
          issue.open = openSended;
          toUpdate = true;
        }
        if(toUpdate){
          issue.updated_on = new Date();
          await issue.save();
          res.json({result: 'successfully updated', '_id': _id});
        }
        else{
          res.json({ error: 'no update field(s) sent', '_id': _id });
        }
        //console.log(issue);
      }
      else {
        res.json({ error: 'could not update', '_id': _id });
      }
     
      
    })
    
    .delete(async function (req, res){
      //let project = req.params.project;
      if(!req.body._id) {
        res.json({error: 'missing _id'});
        return;
      }
      const _id = req.body._id;
      let issue = await Issue.findOneAndDelete({_id: _id});
      if(!issue) {
        res.json({ error: 'could not delete', '_id': _id });
      }
      else {
        res.json({ result: 'successfully deleted', '_id': _id });
      }
      
    });
    
};
