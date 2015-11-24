/**
 * Represents an overlay module.
 *
 * This module is responsible to create an overlay
 * without predefine an inner overlay template.
 *
 * @module overlay
 *
 * @author Sebastian Fitzner
 */

import Helpers from '../../utils/helpers';
import App from '../../app';
import AppModule from '../_global/module';

const $ = App.$;

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
			grouped: false,
			closeBtn: '[data-js-atom="overlay-close"]'
		};

		super(obj, options);
	}

	// GETTER AND SETTER
	get overlayCreated() {
		return this._overlayCreated;
	}

	set overlayCreated(bol) {
		this._overlayCreated = bol;
	}

	/**
	 * Initialize the view and merge options
	 *
	 */
	initialize() {
		this.body = $('body');

		super.initialize()
	}

	/**
	 * Bind events
	 *
	 * Listen to open and close events
	 */
	bindEvents() {
	}

	/**
	 * Pre-Render the overlay and bind events
	 */
	preRender() {
		if (this.overlayCreated) return;

		this.body.append(Tpl);

		this.overlayCreated = true;
	}

	/**
	 * Render the overlay
	 */
	render() {

	}
}

export default Overlay;