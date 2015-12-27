/**
 * Represents a ajax form class.
 * @module ajaxForm
 *
 * @author Sebastian Fitzner
 */

import Helpers from '../../utils/helpers';
import App from '../../app';
import AppModule from '../_global/module';

const $ = App.$;

class FormAjax extends AppModule {
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
			submitOnLoad: false,
			submitOnChange: true,
			showLoader: false, // loading class
			eventName: App.EVENTS.formComplete
		};

		super(obj, options);
	}

	initialize() {
		// save some references
		this.fields = $('input', this.$el);
		this.selects = $('select', this.$el);

		// Fetch data if option is true
		if (this.options.submitOnLoad) this.fetchData(this.$el);

		// call super
		super.initialize();
	}

	/**
	 * Bind all evente
	 */
	bindEvents() {
		let fetchData = this.fetchData.bind(this);
		let reset = this.resetFilters.bind(this);
		/**
		 * On submit event fetch data
		 */
		this.$el.on('submit reset', fetchData);

		/**
		 * Reset filters on reset event
		 */
		App.Vent.on(App.EVENTS.formReset, reset);

		/**
		 * If submitOnChange is true
		 *
		 * fetch data
		 * show reset button
		 *
		 */
		if (this.options.submitOnChange) {
			this.$el.on('blur change', this.fields, fetchData);
			App.Vent.on(App.EVENTS.selectChanged, fetchData);
		}
	}


	/**
	 * Ajax call to get data object with results or error message.
	 *
	 * @param {Object} e - object or event
	 */
	fetchData(e) {
		let el;

		if (e && e.preventDefault) {
			el = e.target;
			e.preventDefault();
		} else {
			el = e;
		}

		if (this.options.showLoader) this.$el.addClass(this.options.showLoader);

		let action = this.$el.attr('action');
		let method = this.$el.attr('method');
		let serialize = this.$el.serialize();
		let url = action + '?' + serialize;

		$.ajax({
			dataType: "json",
			url: url
		})
			.done((data) => {
				this.onSuccess(data, el);
			}).
			fail(this.onError.bind(this));
	}

	onSuccess(data, el) {
		this.fields = $('input', this.$el);
		this.selects = $('select', this.$el);

		App.Vent.trigger(this.options.eventName, {
			data: data,
			el: el
		});

		if (this.options.showLoader) this.$el.removeClass(this.options.showLoader);
		this.$el.addClass('is-success');
	}

	onError() {
		console.log("error");
		if (this.options.showLoader) this.$el.removeClass(this.options.showLoader);
		this.$el.addClass('is-error');
	}

	/**
	 * Reset filters, currently supported
	 *
	 * checkboxes
	 * selects
	 */
	resetFilters() {
		this.resetChecks();
		this.resetSelects();
	}

	/**
	 * Reset checkboxes
	 */
	resetChecks() {
		this.fields.each(function () {
			$(this).removeAttr('checked');
		});
	}

	/**
	 * Resest selects
	 */
	resetSelects() {
		this.selects.each(function () {
			$(this).removeAttr('selected').find('option').eq(0).attr('selected', 'selected');
		});
	}
}

// Returns constructor
export default FormAjax;