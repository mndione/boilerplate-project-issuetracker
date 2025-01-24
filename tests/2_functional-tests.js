const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const Issue = require ('../model.js');

suite('Functional Tests', function() {
  this.timeout(5000);
 
   // #1
   test('post all fields', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/apitest')
      .send({
        issue_title: 'test all fields',
        issue_text: 'text test all fields',
        created_by:  'testc',
        assigned_to: 'testa',
        status_text: 'status test'
      })
      .end(function (err, res) {
        //console.log(res);
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.issue_title, 'test all fields');
        assert.equal(res.body.issue_text, 'text test all fields');
        assert.equal(res.body.created_by,  'testc',);
        assert.equal(res.body.assigned_to, 'testa');
        assert.equal(res.body.status_text, 'status test');
        assert.isUndefined(res.body.updated_on, 'updated_on undefined on creation');
        assert.strictEqual(res.body.open, true);
        assert.isBelow(new Date().getTime() - new Date(res.body.created_on).getTime(), 5000);
        done();
      });
  });
 
  // #2
  test('post only required fields', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/apitest')
      .send({
        issue_title: 'test only required fields',
        issue_text: 'text test  only required fields',
        created_by:  'testc'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.issue_title, 'test only required fields');
        assert.equal(res.body.issue_text, 'text test  only required fields');
        assert.equal(res.body.created_by,  'testc');
        assert.isUndefined(res.body.assigned_to, 'assigned_to not fill');
        assert.isUndefined(res.body.status_text, 'status_text not fill');
        assert.isUndefined(res.body.updated_on, 'updated_on undefined on creation');
        assert.strictEqual(res.body.open, true);
        assert.isBelow(new Date().getTime() - new Date(res.body.created_on).getTime(), 5000);
        done();
      });
  });

  // #3
  test('post missing required fields', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/apitest')
      .send({
        issue_title: 'test missing required fields',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, 'missing required field(s) !');
        done();
      });
  });

  // #4
  test('get all issues of project apitest', function (done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/apitest')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.isArray(res.body.issues, 'return an array of issues');
        done();
      });
  });

  // #5
  test('get all issues of project apitest with filter open=true', function (done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/apitest?open=true')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.issues.length, res.body.issues.filter(el => el.open === true).length);
        done();
      });
  });

   // #6
   test('get all issues of project apitest with filter open=true and created_by=testc', function (done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/apitest?open=true&created_by=testc')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.issues.length, res.body.issues.filter(el => el.open === true && el.created_by === 'testc').length);
        done();
      });
  });

  // #7
  test('put one field', function (done) {
    const issue = new Issue();
    issue.project = 'apitest';
    issue.issue_title = 'test put ini';
    issue.issue_text = 'text test put ini';
    issue.created_by = 'testp';
    issue.save();

    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        issue_title: 'test put updated',
        _id: issue._id
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.issue_title, 'test put updated');
        assert.isBelow(new Date().getTime() - new Date(res.body.updated_on).getTime(), 5000);
        done();
      });
  });

  // #8
  test('put multiple fields', function (done) {
    const issue = new Issue();
    issue.project = 'apitest';
    issue.issue_title = 'test put ini';
    issue.issue_text = 'text test put ini';
    issue.created_by = 'testp';
    issue.save();

    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        issue_title: 'test put mod',
        issue_text: 'text test put mod',
        _id: issue._id
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.issue_title, 'test put mod');
        assert.equal(res.body.issue_text, 'text test put mod');
        assert.isBelow(new Date().getTime() - new Date(res.body.updated_on).getTime(), 5000);
        done();
      });
  });

  // #9
  test('put missing _id', function (done) {
    
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        issue_title: 'test put mod',
        issue_text: 'text test put mod'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, 'Issue not found');
        done();
      });
  });

  // #10
  test('put no field to update', function (done) {
    const issue = new Issue();
    issue.project = 'apitest';
    issue.issue_title = 'test put ini';
    issue.issue_text = 'text test put ini';
    issue.created_by = 'testp';
    issue.save();

    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        _id: issue._id
      })
      .end(function (err, res) {
        //console.log(res.body);
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.isBelow(new Date().getTime() - new Date(res.body.updated_on).getTime(), 5000);
        done();
      });
  });

  // #11
  test('put invalid _id', function (done) {
    
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        issue_title: 'test put mod',
        issue_text: 'text test put mod',
        _id: '00000f14fc0df4c8491f0000'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, 'Issue not found');
        done();
      });
  });

  // #12
  test('delete issue', function (done) {
    const issue = new Issue();
    issue.project = 'apitest';
    issue.issue_title = 'test put ini';
    issue.issue_text = 'text test put ini';
    issue.created_by = 'testp';
    issue.save();

    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/apitest')
      .send({
        _id: issue._id
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body._id, issue._id);
        done();
      });
  });

   // #13
   test('delete invalid _id', function (done) {
    
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        _id: '00000f14fc0df4c8491f0000'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, 'Issue not found');
        done();
      });
  });

  // #14
  test('delete missing _id', function (done) {
    
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/apitest')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, 'Issue not found');
        done();
      });
  });


});
