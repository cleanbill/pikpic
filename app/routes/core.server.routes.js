'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core');
	app.route('/').get(core.index);
	app.route('/unpicked').get(core.unpicked);
	app.route('/done').post(core.done);


};
