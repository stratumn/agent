/**
@toc
2. load grunt plugins
3. init
4. setup variables
5. grunt.initConfig
6. register grunt tasks

*/

'use strict';

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-angular-templates');

	function init() {
		/**
		Project configuration.
		@toc 5.
		*/
		grunt.initConfig({
			ngtemplates: {
				'stratumn.angular-mapexplorer': {
					src:      'views/**/*.html', // where my view files are
					dest:     'src/templates.js', // single file of $templateCache
          options:      {
            bootstrap:  function(module, script) {
              // return 'define("' + module + '", [], function() { return { init: function() {' + script + '} }; });';
              return 'export default function($templateCache) { ' + script + '};';
            }
          }
				}
			}
		});


		grunt.registerTask('default', ['ngtemplates:stratumn.angular-mapexplorer']);

	}
	init({});		//initialize here for defaults (init may be called again later within a task)

};
