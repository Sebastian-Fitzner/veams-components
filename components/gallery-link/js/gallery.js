/**
 * Represents a gallery module.
 *
 * This module provides a way to open images in the overlay and
 * create a group of images as gallery
 *
 * @module gallery
 *
 * @author Sebastian Fitzner
 */

import Helpers from '../../utils/helpers';
import App from '../../app';
import AppModule from '../_global/module';

const $ = App.$;

// FE templates
let Handlebars = require('handlebars/runtime')['default'];
let Template = require('../../templates/templates')(Handlebars);

// Handlebar helpers
require('../../utils/template-helpers/for-helper');
require('../../utils/template-helpers/comparison-helper');

class Gallery extends AppModule {
	/**
	 * Constructor for our class
	 *
	 * @see module.js
	 *
	 * @param {Object} obj - Object which is passed to our class
	 * @param {Object} obj.el - element which will be saved in this.el
	 * @param {Object} obj.options - options which will be passed in as JSON object
	 */
	constructor(obj) {
		let options = {
			element: '[data-js-atom="gallery-link"]', // element which executes opening of gallery
			dataAttr: 'js-content',
			groupedBy: 'data-js-group' // attribute which will be used for grouping
		};

		super(obj, options);
	}

	// GETTER AND SETTER
	get data() {
		return this._data;
	}

	set data(data) {
		this._data = data;
	}

	get filteredData() {
		return this._filteredData;
	}

	set filteredData(data) {
		this._filteredData = data;
	}

	get group() {
		return this._group;
	}

	set group(name) {
		this._group = name;
	}

	get links() {
		return this._links;
	}

	set links(links) {
		this._links = links;
	}

	/**
	 * Initialize our gallery
	 */
	initialize() {
		this.links = $(this.options.element);

		super.initialize();
	}

	/**
	 * Bind global events
	 *
	 * Listen to open and close events
	 */
	bindEvents() {
		let render = this.render.bind(this);
		let handleClick = this.handleClick.bind(this);

		// Global events
		App.Vent.on(App.EVENTS.galleryOpen, render);

		// Local events
		this.links.on(App.clickHandler, handleClick);
	}

	/**
	 * Render the overlay
	 */
	render(obj) {
		if (!obj) {
			console.warn('To use gallery you have to provide an object (obj.data)!');
			return;
		}

		// save data and template
		this.data = obj.data;
		let content = Template.GALLERY(this.data);

		// Publish pre-rendered content to overlay
		this.publish(content);
	}

	/**
	 * Handle click events
	 */
	handleClick(e) {
		e.preventDefault();

		let el = $(e.currentTarget);
		let data = el.data(this.options.dataAttr);
		let group = el.attr(this.options.groupedBy);
		let obj = {};
		obj.data = data;

		if(group && group !== this.group) {
			this.group = el.attr(this.options.groupedBy);
			this.filteredData = this.links.filter((item) => {
				console.log('item: ');
			});
		}

		console.log('data: ', obj);


		this.render(obj);
	}

	publish(data) {
		App.Vent.trigger(App.EVENTS.overlayOpen, {
				data: data
			}
		);
	}

}

export default Gallery;