module.exports = {
	options: {
		assets: '<%= paths.dev %>',
		data: [
			'<%= paths.src %>/data/**/*.{json,yml}',
			'components/**/*.{json,yml}',
			'panels/**/*.{json,yml}',
			'data/**/*.json'
		],
		helpers: '<%= paths.src %>/templates/helpers/**/*.js',
		layoutdir: '<%= paths.src %>/templates/layouts/',
		layout: false,
		partials: [
			'components/**/*.hbs',
			'panels/**/*.hbs',
			'<%= paths.src %>/templates/partials/**/*.hbs',
			'<%= paths.src %>/templates/layouts/*.hbs'
		],
		collections: [
			'sitemap'
		]
	},
	pages: {
		options: {},
		files: [{
			cwd: '<%= paths.src %>/templates/pages/',
			dest: '<%= paths.dev %>/',
			expand: true,
			flatten: true,
			src: ['**/*.hbs']
		}]
	}
};