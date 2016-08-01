'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var path = require('path');
var guid = require('uuid');
var projectName = require('vs_projectname');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('type', { type: String, required: false, desc: 'the project type to create' });
    this.argument('applicationName', { type: String, required: false, desc: 'the name of the application' });
  },

  init: function () {
    this.log(yosay('Welcome to the marvellous Akka.NET generator!'));
    this.templatedata = {};
  },

  _checkProjectType: function() {
    if (this.type) {
      //normalize to lower case
      this.type = this.type.toLowerCase();
      var validProjectTypes = ['empty'];
      if (validProjectTypes.indexOf(this.type) === -1) {
        //if it's not in the list, send them through the normal path
        this.log('"%s" is not a valid project type', chalk.cyan(this.type));
        this.type = undefined;
        this.applicationName = undefined;
      } else {
        this.log('Creating "%s" project', chalk.cyan(this.type));
      }
    }
  },

  askFor: function() {
    this._checkProjectType();
    if (!this.type) {
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
    }
  },

  _buildTemplateData: function() {
    this.templatedata.namespace = projectName(this.applicationName);
    this.templatedata.applicationname = this.applicationName;
    this.templatedata.guid = guid.v4();
  },

  askForName: function () {
    if (!this.applicationName) {
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
        this.applicationName = props.applicationName;
        this._buildTemplateData();
        done();
      }.bind(this));
    } else {
      this._buildTemplateData();
    }
  },

  writing: function () {
    this.sourceRoot(path.join(__dirname, './templates/projects'));

    switch (this.type) {
      case 'empty':
        this.sourceRoot(path.join(__dirname, './templates/projects/' + this.type));
        this.template(this.sourceRoot() + '/Program.cs', this.applicationName + '/src/' + this.applicationName + '/Program.cs', this.templatedata);
        this.template(this.sourceRoot() + '/GreetingActor.cs', this.applicationName + '/src/'  + this.applicationName +  '/Actors/GreetingActor.cs', this.templatedata);
        this.template(this.sourceRoot() + '/Greet.cs', this.applicationName + '/src/'  + this.applicationName +  '/Messages/Greet.cs', this.templatedata);
        this.template(this.sourceRoot() + '/project.json', this.applicationName + '/src/' + this.applicationName + '/project.json', this.templatedata);
        this.template(this.sourceRoot() + '/reference.conf', this.applicationName + '/src/'  + this.applicationName +  '/reference.conf', this.templatedata);
        this.template(this.sourceRoot() + '/global.json', this.applicationName + '/global.json', this.templatedata);
        break;
    }
  },

   /**
   * Called on the very end of Yo execution
   * Dependencies are installed only for web type
   * of projects that depends on client side libraries
   * and tools like Gulp or Grunt
   * Uses can skip installing dependencies using built-in yo
   * --skip-install option
   */
  end: function() {
    this._showUsageHints();
  },

   /**
   * Shows usage hints to end user
   * Called on the very end of all processes
   */
  _showUsageHints: function() {
    this.log('\r\n');
    this.log('Your project is now created, you can use the following commands to get going');
    this.log(chalk.green('    cd "' + this.applicationName + '/src/' + this.applicationName + '"'));
    this.log(chalk.green('    dotnet restore'));
    this.log(chalk.green('    dotnet build') + ' (optional, build will also happen when it\'s run)');
    switch (this.type) {
      case 'empty':
        this.log(chalk.green('    dotnet run'));
        break;
    }

    this.log('\r\n');
  }
});
