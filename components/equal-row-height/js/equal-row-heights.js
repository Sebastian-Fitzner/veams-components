/**
 * A module which takes elements and set the height of the elements equal.
 * @module Equal Height
 *
 * @author Sebastian Fitzner
 */
import Helpers from '../../utils/helpers';
import App from '../../app';
import AppModule from '../_global/module';
import ImageLoader from '../../utils/mixins/imageLoader';

const $ = App.$;

class EqualHeight extends AppModule {
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
			childElements: '[data-js-atom="equal-child"]',
			lastRowClass: 'is-last-row',
			addPadding: false
		};

		super(obj, options);
	}

	initialize() {
		this.childElements = $(this.options.childElements, this.$el);
		this.firstChild = this.childElements.eq(0);

		super.initialize();
	}

	bindEvents() {
		let render = this.render.bind(this);

		App.Vent.on(App.EVENTS.resize, render);
	}

	_resetStyles(el) {
		el.removeAttr('style');
	}

	_setLastRowClass(element) {
		Helpers.forEach($(element), (el) => {
			$(el).addClass(this.options.lastRowClass);
		});
	}

	buildRow() {
		let rows = [];
		let posArray = [];
		let firstElTopPos = this.firstChild.offsetTop;

		Helpers.forEach(this.childElements, (i, element) => {
			let el = $(element);

			this._resetStyles(el);

			if (el.offsetTop === firstElTopPos) {
				posArray.push(el);
			} else {
				rows.push(posArray);
				posArray = [];
				posArray.push(el);
				firstElTopPos = el.offsetTop;
			}

		});

		rows.push(posArray);
		this.defineRowHeight(rows);
	}

	defineRowHeight(rows) {
		let i = 0;
		let padding = ~~this.options.addPadding;

		for (i; i < rows.length; i++) {
			let height = this.getRowHeight(rows[i]);

			this.setHeight(rows[i], height, padding);

			if (i > 0 && i === rows.length - 1) {
				this._setLastRowClass(rows[i]);
			}
		}
	}

	getRowHeight(elements) {
		let height = 0;

		Helpers.forEach(elements, (i, el) => {
			height = Helpers.getOuterHeight(el) > height ? Helpers.getOuterHeight(el) : height;
		});

		return height;
	}

	setHeight(elements, height, padding) {
		let addPadding = padding || 0;

		Helpers.forEach(elements, (i, el) => {
			el[0].style.height = height + addPadding + 'px';
		});
	}

	// Renders the view's template to the UI
	render() {
		this.buildRow();

		setTimeout(() => {
			App.Vent.trigger(App.EVENTS.equalRender, {
				el: this.$el,
				childElements: this.childElements
			});
		}, 0);

		// Maintains chainability
		return this;
	}
}

EqualHeight.classMixin(ImageLoader);

// Returns the View class
export default EqualHeight;