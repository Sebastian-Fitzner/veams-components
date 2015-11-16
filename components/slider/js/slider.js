// Needs some love to support a more gentle way to handle visible items
/**
 * Represents a responsive slider which can be used as ribbon.
 * @module slider
 *
 * @author Sebastian Fitzner
 */

import App from '../../app';
import Helpers from '../../utils/helpers';
import AppModule from '../_global/module';
const $ = App.$;
require('touchswipe')($);

class Slider extends AppModule {
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
			unresolvedClass: 'is-unresolved',
			activeClass: 'is-active',
			hiddenClass: 'is-hidden',
			actions: '[data-js-atom="slider-actions"]', // Previous Button
			prev: '[data-js-atom="slider-prev"]', // Previous Button
			next: '[data-js-atom="slider-next"]', // Next Button
			items: '[data-js-atom="slider-item"]', // Slide Items
			pagination: '[data-js-atom="slider-pagination"]', // Pagination
			paginationList: '[data-js-atom="slider-pagination-list"]', // Pagination List
			paginationItemClass: '.slider__pagination-list-item', // Define your class which we use in our mini tmpl
			ribbon: '[data-js-atom="slider-ribbon"]',
			wrapper: '[data-js-atom="slider-wrapper"]',
			startAtIndex: 0,
			visibleItems: {
				'desktop': 1,
				'tablet-large': 1,
				'tablet-small': 1,
				'mobile-large': 1,
				'mobile-medium': 1,
				'mobile-small': 1
			}
		};

		super(obj, options);
	}

	/**
	 * Custom getters and setter
	 */

	/**
	 * Get and set visible items.
	 *
	 * @param {number} visible - Number of visible items
	 */
	get visibles() {
		return this._numVisible;
	}

	set visibles(visible) {
		this._numVisible = visible;
	}

	/**
	 * Get and set items length for slider.
	 *
	 * @param {number} len - Number of item length
	 */
	get itemsLength() {
		return this._itemLength;
	}

	set itemsLength(len) {
		this._itemLength = len;
	}

	/**
	 * Get and set the index of slider.
	 *
	 * @param {number} idx - index number of slide
	 */
	get index() {
		return this._index;
	}

	set index(idx) {
		this._index = idx;
	}

	/**
	 * Get controls height.
	 */
	get controlHeight() {
		return Helpers.getOuterHeight(this.prev);
	}

	/**
	 * Initialize the view
	 */
	initialize() {
		this.index = 0;

		this.slideIndex = 0;
		this.prev = this.$el.find(this.options.prev);
		this.next = this.$el.find(this.options.next);
		this.actions = this.$el.find(this.options.actions);
		this.items = this.$el.find(this.options.items);
		this.wrapper = this.$el.find(this.options.wrapper);
		this.ribbon = this.$el.find(this.options.ribbon);
		this.pagination = this.$el.find(this.options.pagination);
		this.paginationList = this.$el.find(this.options.paginationList);
		this.startAtIndex = ~~this.options.startAtIndex;

		this.$el.removeClass(this.options.unresolvedClass);
	}

	/**
	 * Bind all events
	 */
	bindEvents() {
		let render = this.render.bind(this);
		let showPrev = this.showPrevElement.bind(this);
		let showNext = this.showNextElement.bind(this);
		let goTo = this.navigateToElement.bind(this);

		// Global Events
		App.Vent.on(App.EVENTS.resize, render);

		// Local Events
		this.$el.on(App.clickHandler, this.options.prev, showPrev);
		this.$el.on(App.clickHandler, this.options.next, showNext);
		this.$el.on(App.clickHandler, this.options.paginationItemClass, goTo);
	}

	/**
	 * Unbind all events
	 */
	unbindEvents() {
		// Global Events
		App.Vent.off(App.EVENTS.resize);

		// Local Events
		this.$el.off(App.clickHandler);
	}

	// Renders the view's template to the UI
	render() {
		this.visibles = this.options.visibleItems[App.currentMedia];
		this.itemsLength = this.items.length;

		this.unbindEvents();
		this.handleVisibility();
		this.removePagination();
		this.addPagination();
		this.bindEvents();
		this.getAndSetDimensions();
		this.bindSwipes();
		this.goToItem(this.startAtIndex);
	}

	/**
	 * When items length is 0 we hide this view.
	 */
	handleVisibility() {
		if (this.itemsLength === 0) {
			this.$el.addClass(this.options.hiddenClass);
			console.log('There is no item we can use in our slider :(');
		}

		this.$el.css('max-width', 'none');
	}

	/**
	 * Empty pagination.
	 */
	removePagination() {
		this.paginationList.empty();
	}

	/**
	 * Add pagination elements with a simple string template and
	 * save a pagination item reference.
	 */
	addPagination() {
		let paginationItem = 'data-js-atom="slider-pagination-item"';
		let paginationItemClass = 'slider__pagination-list-item';
		let tmpl = this.items.map(function (i) {
			return $('<li class="' + paginationItemClass + '" ' + paginationItem + '><strong>' + (i + 1) + '</strong></li>')[0];
		});

		this.paginationList.append(tmpl);
		this.paginationItems = $('[' + paginationItem + ']', this.$el);
	}

	/**
	 * Navigate to a specific slide.
	 *
	 * @param {object} e - Event object.
	 */
	navigateToElement(e) {
		if ($(e.currentTarget).hasClass(this.options.activeClass)) return;

		this.index = $(e.currentTarget).index();

		this.goToItem(this.index);
	}

	/**
	 * Go to the next slide.
	 *
	 * @param {object} e - Event object.
	 */
	showNextElement(e) {
		if (e) {
			e.preventDefault();
		}

		this.goToItem(this.index + this.numVisible);
	}

	/**
	 * Go to the previous slide.
	 *
	 * @param {object} e - Event object.
	 */
	showPrevElement(e) {
		if (e) {
			e.preventDefault();
		}

		this.goToItem(this.index - this.numVisible);
	}

	/**
	 * Return the direction `next` or `prev`.
	 *
	 * @param {number} index - Index of the pagination element.
	 */
	getDirection(index) {
		return index > this.slideIndex ? "next" : "prev";
	}

	/**
	 * Bind all swipe gestures.
	 */
	bindSwipes() {
		var _this = this;

		if (this.items.length > this.numVisible) {
			this.$el.swipe({
				swipeLeft: function () {
					_this.goToItem(_this.index + _this.numVisible);
				},
				swipeRight: function () {
					_this.goToItem(_this.index - _this.numVisible);
				},
				threshold: 75,
				excludedElements: '.isnt-swipeable'
			});
		}
	}

	/**
	 * Handles the method to go to a specific item.
	 * Further we handle the class
	 *
	 * @param {number} i - Index number.
	 */
	goToItem(i) {
		var maxIndex = this.items.length - this.numVisible;

		if (i < 0) {
			i = maxIndex;
		} else if (i > maxIndex) {
			i = 0;
		}

		this.ribbon.css('left', -i * (this.thumbWidth + this.margin * 2));
		this.index = i;

		this.items.removeClass(this.options.activeClass);
		this.paginationItems.removeClass(this.options.activeClass);

		this.items.eq(i).addClass(this.options.activeClass);
		this.paginationItems.eq(i).addClass(this.options.activeClass);
	}

	/**
	 * Get and set dimensions for our project progress.
	 */
	getAndSetDimensions() {
		this.width = this.$el.outerWidth();
		this.margin = parseInt(this.items.eq(0).css('margin-right'), 10);
		this.thumbWidth = this.width / this.numVisible - this.margin;
		this.wrapper.css('width', this.width);
		this.items.css('width', this.thumbWidth);

		// this.thumbHeight = this.getSlideHeight(); // get max height of slides
		// this.setSlideHeight(this.thumbHeight); // set height to each slide element

		this.ribbon.css({
			'width': this.getRibbonWidth()
		});
	}

	/**
	 * Get ribbon width.
	 */
	getRibbonWidth() {
		var width;

		if (this.items.length <= this.numVisible) {
			width = this.items.length * (this.thumbWidth + this.margin * 2);
		} else {
			width = this.items.length * (this.thumbWidth + this.margin * 2);
		}

		return width;
	}

	/**
	 * Return height of the largest slide.
	 */
	getSlideHeight() {
		var height = 0;

		this.items.each(function (i) {
			height = $(this).outerHeight(true) > height ? $(this).outerHeight(true) : height;
		});

		return height;
	}

	/**
	 * Set height for slides wrapper and each slide.
	 * @param {number} height - Height value
	 */
	setSlideHeight(height) {
		this.ribbon.css({
			'height': height
		});
		this.wrapper.css({
			'height': height
		});
	}
}

export default Slider;