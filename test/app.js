'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-generator').test;

describe('generator-akkadotnet:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({ type: 'empty', applicationName: 'test' })
      .on('end', done);
  });

  it('creates files for empty project', function () {
    assert.file([
      'test/src/test/Program.cs',
      'test/src/test/project.json',
      'test/Dockerfile',
      'test/global.json'
    ]);
  });
});
