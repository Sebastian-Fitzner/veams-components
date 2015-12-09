/**
 * @module Slide Fox
 *
 * @author Andy Gutsche
 * @refactoring Sebastian Fitzner
 */

import Helpers from '../../utils/helpers';
import App from '../../app';
import AppModule from '../_global/module';

const $ = App.$;

class SlideFox extends AppModule {
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
			visibleClass: 'is-visible'
		};

		super(obj, options);
	}

	bindEvents() {
		let render = this.render.bind(this);

		App.Vent.on(App.EVENTS.scroll, render);
	}

	showSlideFox() {
		this.$el.addClass(this.options.visibleClass);
	}

	hideSlideFox() {
		this.$el.removeClass(this.options.visibleClass);
	}

	render() {
		Helpers.isInViewport(this.$el) ? this.showSlideFox() : this.hideSlideFox();
	}
}

// Returns the constructor
export default SlideFox;