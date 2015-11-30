'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var guid = require('uuid');
var projectName = require('vs_projectname');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
  },
  init: function () {
    this.log(yosay(
      'Welcome to the astonishing ' + chalk.red('akkadotnet') + ' generator!'
      ));

    this.templatedata = {};
  },
  askForApplicationType: function () {
    var done = this.async();

    var prompts = [{
      type: 'list',
      name: 'type',
      message: 'What type of application do you want to create?',
      choices: [{
        name: 'Empty Akka.NET Application',
        value: 'empty'
      }]
    }];

    this.prompt(prompts, function (props) {
      this.type = props.type;

      done();
    }.bind(this));
  },
  askForName: function () {
    var done = this.async();
    var app = '';
    switch (this.type) {
    case 'empty':
      app = 'app';
      break;
    }
    var prompts = [{
      name: 'applicationName',
      message: 'What\'s the name of your Akka.NET application?',
      default: app
    }];
    this.prompt(prompts, function (props) {
      this.templatedata.namespace = projectName(props.applicationName);
      this.templatedata.applicationname = props.applicationName;
      this.applicationName = props.applicationName;
      this.templatedata.guid = guid.v4();
      done();
    }.bind(this));
  },
  writing: function () {
    this.sourceRoot(path.join(__dirname, './templates/projects'));

    switch (this.type) {
    case 'empty':
      this.sourceRoot(path.join(__dirname, './templates/projects/' + this.type));

      this.template(this.sourceRoot() + '/Program.cs', this.applicationName + '/src/' + this.applicationName + '/Program.cs', this.templatedata);

      this.template(this.sourceRoot() + '/project.json', this.applicationName + '/src/' + this.applicationName + '/project.json', this.templatedata);

      this.template(this.sourceRoot() + '/global.json', this.applicationName + '/global.json', this.templatedata);

      this.template(path.join(__dirname, '../../templates/Dockerfile.txt'), this.applicationName + '/Dockerfile', this.templatedata);
      break;
    }
  }
});
