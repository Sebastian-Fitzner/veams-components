/**
 * Represents an overlay module.
 *
 * This module is responsible to create an overlay
 * without predefining any inner overlay template.
 *
 * It should be used by other modules
 * to display their content in an overlay.
 *
 * @module overlay
 *
 * @author Sebastian Fitzner
 */

import Helpers from '../../utils/helpers';
import App from '../../app';
import AppModule from '../_global/module';

const $ = App.$;

let Handlebars = require('handlebars/runtime')['default'];
let Template = require('../../templates/templates')(Handlebars);

class Overlay extends AppModule {
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
			openClass: 'is-open',
			closeBtn: '[data-js-atom="overlay-close"]',
			overlay: '[data-js-atom="overlay"]',
			mask: '[data-js-atom="overlay-mask"]',
			regionContent: '[data-js-atom="overlay-content"]'
		};

		super(obj, options);
	}

	// GETTER AND SETTER

	// set and get infos if overlay is created
	get overlayCreated() {
		return this._overlayCreated;
	}
	set overlayCreated(bol) {
		this._overlayCreated = bol;
	}

	// set and get infos if overlay is open
	get isOpen() {
		return this._isOpen;
	}
	set isOpen(bol) {
		this._isOpen = bol;
	}

	// set and get overlay element after creation
	get overlay() {
		return this._overlay;
	}
	set overlay(el) {
		this._overlay = el;
	}

	// set and get overlay mask after creation
	get mask() {
		return this._mask;
	}
	set mask(el) {
		this._mask = el;
	}

	// set and get close button after creation
	get closeBtn() {
		return this._closeBtn;
	}
	set closeBtn(el) {
		this._closeBtn = el;
	}

	// set and get content region
	get regionContent() {
		return this._regionContent;
	}
	set regionContent(el) {
		this._regionContent = el;
	}

	/**
	 * Initialize the view and merge options
	 *
	 */
	initialize() {
		this.body = $('body');

		this.bindEvents();
	}

	/**
	 * Bind global events
	 *
	 * Listen to open and close events
	 */
	bindEvents() {
		let render = this.render.bind(this);

		// Global events
		App.Vent.on(App.EVENTS.overlayOpen, render);

		// Close overlay with ESC
		$(window).on('keyup', (e) => {
			if (e.keyCode == 27 && this.isOpen) this.close();
		})
	}

	/**
	 * Bind local events
	 */
	bindLocalEvents() {
		let close = this.close.bind(this);

		// Local events
		this.closeBtn.on('click', close);
	}

	/**
	 * Pre-Render the overlay and save references
	 */
	preRender() {
		// Append FE template
		this.body.append(Template.OVERLAY);

		// Set some references
		this.overlay = $(this.options.overlay);
		this.closeBtn = $(this.options.closeBtn, this.overlay);
		this.regionContent = $(this.options.regionContent, this.overlay);
		this.mask = $(this.options.mask, this.overlay);
		this.overlayCreated = true;
	}

	/**
	 * Render the overlay
	 */
	render(obj) {
		// Check if data object is provided
		if (!obj.data) {
			console.log('You have to provide an object with data (obj.data)!');
			return;
		}

		// Check if overlay is already created
		if (!this.overlayCreated) {
			this.preRender();
			this.bindLocalEvents();
		}

		// Append data to overlay region
		this.regionContent.html(obj.data);

		// Open overlay
		this.open();
	}

	/**
	 * Open Overlay
	 */
	open() {
		this.overlay.addClass(this.options.openClass);
		this.isOpen = true;
	}

	/**
	 * Close overlay
	 */
	close() {
		this.overlay.removeClass(this.options.openClass);
		this.isOpen = false;
	}
}

export default Overlay;