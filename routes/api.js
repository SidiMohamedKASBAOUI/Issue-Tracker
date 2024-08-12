'use strict';
require('dotenv').config();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser  = require('body-parser');


const express = require('express');
// const router = express.Router();

mongoose.connect(process.env.MONGO_URI);

let issueSchema  = new mongoose.Schema({
  project:{
        type: String,
        required: true
  },
  issue_title: {
        type : String,
        required: true
  },
  issue_text:{
        type : String,
        required: true
  },
  status_text: {
    type : String,
  },
  created_by: {
  type : String,
  required: true
  },
  open: {
    type: Boolean,
    default: true      // Default value is true
  },
  assigned_to: {
    type:String,
  }, 
  created_on:{
    type:Date, 
    default: Date.now
  }, 
  updated_on:{
    type:Date, 
    default: Date.now
  } 
});

let Issue;

Issue = mongoose.model('Issue', issueSchema);
var test =  new Issue(
  {
    "project": "Website Redesign",
    "issue_title": "Homepage Layout Issue",
    "issue_text": "In Progress",
    "status_text": "",
    "created_by": "Alice Johnson",  
    "open": true,
    "assigned_to": "Bob Smith",
    "created_on": "2024-08-01T10:00:00Z",
    "updated_on": "2024-08-05T15:30:00Z"
}
)
//test.save().then(doc=>{console.log('document saved :', doc);}).catch(err=>{console.log('Error while saving', err);})
module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
       console.log(req.query);
       const query = {project, ...req.query}; 
      // console.log(req.params);
      //console.log(req.body);
      // console.log(req.query._id);
      // console.log(req.query.vscodeBrowserReqId);
      // console.log(project);   
      Issue.find(query)
      .then(issues=>{
        const issuesWithoutPandV = issues.map(issue=>{
          const {project, __v, ...issueWithoutPandV} = issue.toObject();
          return issueWithoutPandV; 
        }); 
        res.json(issuesWithoutPandV);
        console.log('/get is getting called');
      })
      .catch(err=>{console.log('error fetching issues', err)});
      
      

      
    })
    
    .post(function (req, res){
      let project = req.params.project;
      console.log(req.body);
      // var {temp} = req.body; 
      // console.log(temp);
      // Issue.findOneAndUpdate({project: `${project}`},
      //   {issue_title:req.body.issue_title, 
      //   issue_text: req.body.issue_text,
      //   created_by: req.body.created_by, 
      //   assigned_to: req.body.assigned_to,
      //   status_text:req.body.status_text}, 
      //   {new:true, upsert:true})
      // .then(issue=>{
      //     const {project, __v, ...issueWithoutPandV} =issue.toObject(); 
      //     res.json(issueWithoutPandV);
      //  // console.log(updatedIssue); 
      // }).catch(err=>{
      //   console.error('Error updating issue', err); 
      // })
      if(!req.body.issue_text || !req.body.issue_title || !req.body.created_by){res.json({ error: 'required field(s) missing' })}
      const newIssue = new Issue({
        project:project,
        issue_title:req.body.issue_title, 
        issue_text: req.body.issue_text,
        status_text: req.body.status_text !== undefined ? req.body.status_text : '',
        created_by: req.body.created_by, 
        assigned_to: req.body.assigned_to !== undefined ? req.body.assigned_to : '',
        status_text:req.body.status_text !== undefined ? req.body.status_text : '',
        created_on: Date.now(), 
        updated_on: Date.now(), 
      })
      newIssue.save().then(doc=>{
        console.log('document saved :', doc);
        const {project, __v, ...issueWithoutPandV} =doc.toObject(); 
        res.json(issueWithoutPandV);
        console.log(res.body);
        
      })
        .catch(err=>{console.log('Error while saving', err);})
      //console.log(newIssue);
    })
    
    .put(function (req, res){
      let project = req.params.project;
      if (!req.body._id) {
       return res.json({ error: 'missing _id' });}
       //if(!req.body.issue_text || !req.body.issue_title || !req.body.created_by){return res.json({ error: 'required field(s) missing' })}
    
    if(req.body.issue_title === undefined && req.body.issue_text === undefined &&   req.body.created_by === undefined && req.body.assigned_to===undefined && req.body.status_text ===undefined)
      {return res.json({ error: 'no update field(s) sent', '_id': req.body._id })}
    console.log(req.body);
    const idToUpdate = req.body._id; 

    const updateFields = {
      updated_on: new Date(),  // to pass the test, i think this is failing because if no update fields this does not update
    };
  
    // Only add fields to update if they are provided
    if (req.body.issue_title) updateFields.issue_title = req.body.issue_title;
    if (req.body.issue_text) updateFields.issue_text = req.body.issue_text;
    if (req.body.created_by) updateFields.created_by = req.body.created_by;
    if (req.body.assigned_to) updateFields.assigned_to = req.body.assigned_to;
    if (req.body.status_text) updateFields.status_text = req.body.status_text;


    console.log('Update Fields:', updateFields); // Log update fields

     // console.log(req.body, req.query, req.params);
      Issue.findOneAndUpdate({_id: req.body._id,  project: req.params.project}, 
        updateFields
      , {new: true})
    .then((issue)=>{
      if (!issue) {
        return res.json({ error: 'could not update', '_id': idToUpdate });
      }
      // const response = {
      //   result : 'successfully updated', 
      //   _id: idToUpdate
      // }
      return res.json({ result: 'successfully updated', _id: idToUpdate }); 
    })
    .catch((err)=>{
      return res.json({ error: 'could not update', '_id': req.body._id });}
  )

      
    })
    
    .delete(async function (req, res){
      let project = req.params.project;
      console.log(req.params); 
      let idToDelete= req.body._id;
      if (!idToDelete) {
        return res.json({ error: 'missing _id' });
    }

      // Issue.find({project:req.params.project})
      // .then(issue=>{
      //   //console.log('About to delete:', issue);
      //   if (issue.length === 0) {
      //     return res.status(404).json({ error: 'No issues found for this project' });
      // }
      // Issue.findById(idToDelete)
      // .then(issue=>{
        
      //   if(issue){
      //     return issue.remove();
          
      //   }
      //   else{ res.json({ error: 'could not delete', _id: idToDelete });}
      // }).then(()=>{
      //   const message = {
      //     result:"successfully deleted",
      //     _id:deletedIssue._id
      //     }
      //     res.json(message);
      // })
      // })
      try{
      const filter ={
        project: req.params.project,
        _id : idToDelete
      }
      const result = await Issue.deleteOne(filter)
      
      if (result.deletedCount===0) {
        console.log('No document found with the given criteria.', filter);
        return res.json({error:"could not delete", _id:idToDelete}); 

      }
      else {const message = {
            result:"successfully deleted",
            _id:idToDelete
            }
           return res.json(message);}
    }catch(err){
      return res.json({error:"could not delete", _id:idToDelete}); 
    }
    })
    
};

// module.exports = router;