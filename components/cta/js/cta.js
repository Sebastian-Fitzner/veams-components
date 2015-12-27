/**
 * Represents a button with custom click handlers.
 * @module button
 *
 * @author Sebastian Fitzner
 */

import Helpers from '../../utils/helpers';
import App from '../../app';
import AppModule from '../_global/module';
const $ = App.$;

class CTA extends AppModule {
	/**
	 * Constructor for our class
	 *
	 * @see module.js
	 *
	 * @param {obj} obj - Object which is passed to our class
	 * @param {obj.el} obj - element which will be saved in this.el
	 * @param {obj.options} obj - options which will be passed in as JSON object
	 */
	constructor(obj) {
		let options = {
			activeClass: 'is-active',
			context: false,
			singleOpen: false
		};
		super(obj, options);
	}

	/**
	 * Initialize the view and merge options
	 *
	 */
	initialize() {
		super.initialize();
	}

	/**
	 * Bind events
	 *
	 * Listen to open and close events
	 */
	bindEvents() {
		let close = this.close.bind(this);
		let open = this.open.bind(this);
		let onClick = this.onClick.bind(this);

		// Global events
		App.Vent.on(App.EVENTS.btnClose, close);
		App.Vent.on(App.EVENTS.btnOpen, open);

		// Local events
		this.$el.on(App.clickHandler, onClick);
	}

	/**
	 * Handle classes
	 *
	 * Trigger events so that each button can listen to that and react by option singleOpen
	 */
	handleClasses() {
		this.$el.is('.' + this.options.activeClass) ? App.Vent.trigger(App.EVENTS.btnClose, {
			'el': this.$el
		}) : App.Vent.trigger(App.EVENTS.btnOpen, {
			'el': this.$el
		});
	}

	/**
	 * Close method
	 *
	 * When the node is equal the object we remove the active class
	 *
	 * @param {obj} obj - the event object with our element
	 * @param {obj} obj.el - element
	 */
	close(obj) {
		if (Helpers.checkNodeEquality(this.$el[0], obj.el[0])) {
			if (this.options.activeClass) this.$el.removeClass(this.options.activeClass);
			if (this.options.context) this.$el.closest(this.options.context).removeClass(this.options.activeClass);
		}
	}

	/**
	 * Open method
	 *
	 * When the node is equal the object we add the active class
	 * When furthermore the options singleOpen is defined,
	 * we remove all active classes on elements in the same context
	 *
	 * @param {obj} obj - the event object with our element
	 * @param {obj} obj.el - element
	 */
	open(obj) {
		if (Helpers.checkNodeEquality(this.$el[0], obj.el[0])) {
			if (this.options.activeClass) this.$el.addClass(this.options.activeClass);
			if (this.options.context) this.$el.closest(this.options.context).addClass(this.options.activeClass);
		} else {
			if (Helpers.checkElementInContext(obj.el, this.options.context) && this.options.singleOpen === "true") {
				if (this.options.activeClass) this.$el.removeClass(this.options.activeClass);
			}
		}
	}

	/**
	 * Click event method
	 *
	 * This method should be overriden when you want to use the button view
	 * @see button-init.js
	 *
	 * @param {event} e - event object
	 */
	onClick(e) {
		e.preventDefault();

		if (typeof this.clickHandler === 'function') {
			this.clickHandler.apply(this, arguments);
			if (this.options.activeClass) this.handleClasses();
		} else {
			console.log('You need to inherit from ' + this + ' and override the onClick method or pass a function to ' + this + '.clickHandler !');
		}
	}

	/**
	 * Click handler
	 *
	 * This method is public and can be overridden by
	 * other instances to support a generic button module
	 */
	clickHandler() {
		App.Vent.trigger(this.options.globalEvent, {
			el: this.$el,
			options: this.options
		});
	}
}

export default CTA;