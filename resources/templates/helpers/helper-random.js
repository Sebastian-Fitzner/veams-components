(function () {
	module.exports.register = function (Handlebars) {

		/**
		 * Random number helper.
		 *
		 * @return random number
		 */
		Handlebars.registerHelper('random', function () {
			var randomNum = Math.floor(Math.random() * 1001);
			return randomNum;
		});
	};
}).call(this);
