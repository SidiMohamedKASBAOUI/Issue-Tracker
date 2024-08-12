const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { Test } = require('mocha');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    suite('POST /api/issues/{project}', ()=>{
        test('Create an issue with every field', (done)=>{
            chai
            .request(server)
            .keepOpen()
            .post('/api/issues/apitest')
            .send({
                issue_title: 'Test Issue Title',
                issue_text: 'Test Issue Text',
                created_by: 'Tester',
                assigned_to: 'Tested',
                status_text: 'In Progress',
                open: true
            })
            .end((err, res) => {
                if (err) {
                  console.error('Error:', err);
                  return done(err);
                }
                
                console.log('Response Body:', res.body); // Log the response body
                let {created_on, updated_on, _id, ...rest}= res.body
                assert.equal(res.status, 200);
                assert.deepEqual({issue_title: 'Test Issue Title',
                    issue_text: 'Test Issue Text',
                    status_text: 'In Progress',
                    created_by: 'Tester',
                    open: true,
                    assigned_to: 'Tested'}, rest)
                done();


            })
        })
        test('Create an issue with only required fields', (done)=>{
            chai
            .request(server)
            .keepOpen()
            .post('/api/issues/apitest')
            .send({
                issue_title: 'Test Issue Title',
                issue_text: 'Test Issue Text',
                created_by: 'Tester',
            })
            .end((err, res) => {
                if (err) {
                  console.error('Error:', err);
                  return done(err);
                }
                
                console.log('Response Body:', res.body); // Log the response body
                let {created_on, updated_on, _id, ...rest}= res.body
                assert.equal(res.status, 200);
                assert.deepEqual({issue_title: 'Test Issue Title',
                    issue_text: 'Test Issue Text',
                    status_text: '' ,
                    created_by: 'Tester',
                    open: true,
                    assigned_to: ''}, rest)
                done();


            })
        })
        test('Create an issue with missing required fields', (done)=>{
            chai
            .request(server)
            .keepOpen()
            .post('/api/issues/apitest')
            .send({
                issue_title: 'Test Issue Title',
                // issue_text: 'Test Issue Text',
                created_by: 'Tester',
            })
            .end((err, res) => {
                if (err) {
                  //console.error('Error:', err);
                  return done(err);
                }
                
                //console.log('Response Body:', res.body); // Log the response body
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'required field(s) missing' });
                done();


            })
        })
        test('View issues with a get request', (done)=>{
            chai
            .request(server)
            .keepOpen()
            .get('/api/issues/apitest')
            
            .end((err, res) => {
                if (err) {
                  console.error('Error:', err);
                  return done(err);
                }
                
                console.log('Response Body:', res.body); // Log the response body
                assert.equal(res.status, 200);
                assert.isArray(res.body, 'An array will all the issues');
                done();


            })
        })
        test('View issues with a get request using one filter ie. /api/issues/apitest?open=true', (done)=>{
            chai
            .request(server)
            .keepOpen()
            .get('/api/issues/apitest?open=true')
            
            .end((err, res) => {
                if (err) {
                  console.error('Error:', err);
                  return done(err);
                }
                
                console.log('Response Body:', res.body); // Log the response body
                assert.equal(res.status, 200);
                res.body.forEach(issue => {
                assert.equal(issue.open, true);                    
                });
                done();


            })

        })
        test('View issues with a get request using multiple  filters ie. /api/issues/apitest?open=true&created_by=ze', (done)=>{
            chai
            .request(server)
            .keepOpen()
            .get('/api/issues/apitest?open=true&created_by=ze')
            
            .end((err, res) => {
                if (err) {
                  console.error('Error:', err);
                  return done(err);
                }
                
                console.log('Response Body:', res.body); // Log the response body
                assert.equal(res.status, 200);
                res.body.forEach(issue => {
                assert.equal(issue.open, true);     
                assert.equal(issue.created_by, 'ze')
                });
                done();


            })
            
        })
        test('Update One field of an issue', (done)=>{
            chai
            .request(server)
            .keepOpen()
            .put('/api/issues/apitest')
            .send({
                _id: '66b928ee14045b0f5b925531', 
                issue_title: 'Updated Title'
              })
             .end((err, res) => {
                if (err) {
                  console.error('Error:', err);
                  return done(err);
                }
                
                console.log('Response Body:', res.body); // Log the response body
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { result: 'successfully updated', _id: '66b928ee14045b0f5b925531' })
                
                done();


            })

        })
        test('Update multiple field of an issue', (done)=>{
            chai
            .request(server)
            .keepOpen()
            .put('/api/issues/apitest')
            .send({
                _id: '66b928ee14045b0f5b925531', 
                issue_title: 'Updated Title',
                issue_text: 'updated text'
              })
             .end((err, res) => {
                if (err) {
                  console.error('Error:', err);
                  return done(err);
                }
                
                console.log('Response Body:', res.body); // Log the response body
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { result: 'successfully updated', _id: '66b928ee14045b0f5b925531' })
                
                done();


            })

        })
        test('Update an issue with missing id', (done)=>{
            chai
            .request(server)
            .keepOpen()
            .put('/api/issues/apitest')
            .send({ 
                issue_title: 'Updated Title',   
              })
             .end((err, res) => {
                if (err) {
                  console.error('Error:', err);
                  return done(err);
                }
                
                console.log('Response Body:', res.body); // Log the response body
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'missing _id' })
                
                done(); 


            })

        })
        test('Update issue no fields to update', (done)=>{
            chai
            .request(server)
            .keepOpen()
            .put('/api/issues/apitest')
            .send({ 
                _id:'66b928ee14045b0f5b925531',   
              })
             .end((err, res) => {
                if (err) {
                  console.error('Error:', err);
                  return done(err);
                }
                
                console.log('Response Body:', res.body); // Log the response body
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'no update field(s) sent', '_id': '66b928ee14045b0f5b925531' })
                
                done(); 


            })

        })
        test('Update issue with an invalid id', (done)=>{
            chai
            .request(server)
            .keepOpen()
            .put('/api/issues/apitest')
            .send({ 
                _id:'invalid ID',   
                issue_title:'title to update'
              })
             .end((err, res) => {
                if (err) {
                  console.error('Error:', err);
                  return done(err);
                }
                
                console.log('Response Body:', res.body); // Log the response body
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'could not update', '_id': 'invalid ID' })
                
                done(); 


            })

        })
        test('Delete an issue', (done)=>{
            chai
            .request(server)
            .keepOpen()
            .delete('/api/issues/apitest')
            .send({ 
                _id:'66b9ea8a28eb67a737301ed5',   
              })
             .end((err, res) => {
                if (err) {
                  console.error('Error:', err);
                  return done(err);
                }
                
                console.log('Response Body:', res.body); // Log the response body
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {"result":"successfully deleted","_id":"66b9ea8a28eb67a737301ed5"})
                
                done(); 


            })

        })
        test('case invalid ID', (done)=>{
            chai
            .request(server)
            .keepOpen()
            .delete('/api/issues/apitest')
            .send({ 
                _id:'invalid ID',   
              })
             .end((err, res) => {
                if (err) {
                  console.error('Error:', err);
                  return done(err);
                }
                
                console.log('Response Body:', res.body); // Log the response body
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {error:"could not delete", _id:'invalid ID'})
                
                done(); 


            })

        })
        test('case missing ID', (done)=>{
            chai
            .request(server)
            .keepOpen()
            .delete('/api/issues/apitest')
            .send({ 
                 
              })
             .end((err, res) => {
                if (err) {
                  console.error('Error:', err);
                  return done(err);
                }
                
                console.log('Response Body:', res.body); // Log the response body
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'missing _id' })
                
                done(); 


            })

        })
    })
  
});
