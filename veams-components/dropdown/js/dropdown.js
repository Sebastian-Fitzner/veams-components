/**
 * Based on selectFx.js v1.0.0
 * http://www.codrops.com
 */
import Helpers from '../../utils/helpers';
import App from '../../app';

var $ = App.$;

var SelectFx = App.ComponentView.extend({
	options: {
		// if true all the links will open in a new tab.
		// if we want to be redirected when we click an option, we need to define a data-link attr on the option of the native select element
		newTab: true,
		// when opening the select element, the default placeholder (if any) is shown
		stickyPlaceholder: false,
		// callback when changing the value
		onChange: function (val) {
			return false;
		}
	},

	initialize: function (obj) {
		this.options = Helpers.defaults(obj.options || {}, this.options); // get/set default options

		var selectedOpt = this.el.querySelector('option[selected]');
		this.hasDefaultPlaceholder = selectedOpt && selectedOpt.disabled;

		// get selected option (either the first option with attr selected or just the first option)
		this.selectedOpt = selectedOpt || this.el.querySelector('option');

		// create structure
		this._createSelectEl();

		// all options
		this.selOpts = [].slice.call(this.selEl.querySelectorAll('li[data-option]'));

		// total options
		this.selOptsCount = this.selOpts.length;

		// current index
		this.current = this.selOpts.indexOf(this.selEl.querySelector('li.is-selected')) || -1;

		// placeholder elem
		this.selPlaceholder = this.selEl.querySelector('span.form__select-placeholder');

		// init events
		this._initEvents();
	},

	_createSelectEl: function () {
		var self = this,
			options = '',
			createOptionHTML = function (el) {
				var optclass = '',
					classes = 'form__select-element ',
					link = '';

				if (el.selectedOpt && !this.foundSelected && !this.hasDefaultPlaceholder) {
					classes += 'is-selected ';
					this.foundSelected = true;
				}
				// extra classes
				if (el.getAttribute('data-class')) {
					classes += el.getAttribute('data-class');
				}
				// link options
				if (el.getAttribute('data-link')) {
					link = 'data-link=' + el.getAttribute('data-link');
				}

				if (classes !== '') {
					optclass = 'class="' + classes + '" ';
				}

				return '<li ' + optclass + link + ' data-option data-value="' + el.value + '"><span>' + el.textContent + '</span></li>';
			};

		[].slice.call(this.el.children).forEach(function (el) {
			if (el.disabled) {
				return;
			}

			var tag = el.tagName.toLowerCase();

			if (tag === 'option') {
				options += createOptionHTML(el);
			} else if (tag === 'optgroup') {
				options += '<li class="form__select-optgroup"><span>' + el.label + '</span><ul>';
				[].slice.call(el.children).forEach(function (opt) {
					options += createOptionHTML(opt);
				});
				options += '</ul></li>';
			}
		});

		var opts_el = '<div class="form__select-options"><ul>' + options + '</ul></div>';
		this.selEl = document.createElement('div');
		this.selEl.className = this.el.className;
		this.selEl.tabIndex = this.el.tabIndex;
		this.selEl.innerHTML = '<span class="form__select-placeholder">' + this.selectedOpt.textContent + '</span>' + opts_el;
		this.el.parentNode.appendChild(this.selEl);
		this.selEl.appendChild(this.el);
	},

	_initEvents: function () {
		var self = this;

		// open/close select
		this.selPlaceholder.addEventListener('click', function () {
			self._toggleSelect();
		});

		// clicking the options
		this.selOpts.forEach(function (opt, idx) {
			opt.addEventListener('click', function () {
				self.current = idx;
				self._changeOption();
				// close select elem
				self._toggleSelect();
			});
		});

		// close the select element if the target it´s not the select element or one of its descendants..
		document.addEventListener('click', function (ev) {
			var target = ev.target;
			if (self._isOpen() && target !== self.selEl && !Helpers.hasParent(target, self.selEl)) {
				self._toggleSelect();
			}
		});

		// keyboard navigation events
		this.selEl.addEventListener('keydown', function (ev) {
			var keyCode = ev.keyCode || ev.which;

			switch (keyCode) {
				// up key
				case 38:
					ev.preventDefault();
					self._navigateOpts('prev');
					break;
				// down key
				case 40:
					ev.preventDefault();
					self._navigateOpts('next');
					break;
				// space key
				case 32:
					ev.preventDefault();
					if (self._isOpen() && typeof self.preSelCurrent != 'undefined' && self.preSelCurrent !== -1) {
						self._changeOption();
					}
					self._toggleSelect();
					break;
				// enter key
				case 13:
					ev.preventDefault();
					if (self._isOpen() && typeof self.preSelCurrent != 'undefined' && self.preSelCurrent !== -1) {
						self._changeOption();
						self._toggleSelect();
					}
					break;
				// esc key
				case 27:
					ev.preventDefault();
					if (self._isOpen()) {
						self._toggleSelect();
					}
					break;
			}
		});
	},
	_navigateOpts: function (dir) {
		if (!this._isOpen()) {
			this._toggleSelect();
		}

		var tmpcurrent = typeof this.preSelCurrent != 'undefined' && this.preSelCurrent !== -1 ? this.preSelCurrent : this.current;

		if (dir === 'prev' && tmpcurrent > 0 || dir === 'next' && tmpcurrent < this.selOptsCount - 1) {
			// save pre selected current - if we click on option, or press enter, or press space this is going to be the index of the current option
			this.preSelCurrent = dir === 'next' ? tmpcurrent + 1 : tmpcurrent - 1;
			// remove focus class if any..
			this._removeFocus();
			// add class focus - track which option we are navigating
			Helpers.addClass(this.selOpts[this.preSelCurrent], 'is-focus');
		}
	},

	_toggleSelect: function () {
		// remove focus class if any..
		this._removeFocus();

		if (this._isOpen()) {
			if (this.current !== -1) {
				// update placeholder text
				this.selPlaceholder.textContent = this.selOpts[this.current].textContent;
			}
			Helpers.removeClass(this.selEl, 'is-active');
		} else {
			if (this.hasDefaultPlaceholder && this.options.stickyPlaceholder) {
				// everytime we open we wanna see the default placeholder text
				this.selPlaceholder.textContent = this.selectedOpt.textContent;
			}
			Helpers.addClass(this.selEl, 'is-active');
		}
	},

	_changeOption: function () {
		// if pre selected current (if we navigate with the keyboard)...
		if (typeof this.preSelCurrent != 'undefined' && this.preSelCurrent !== -1) {
			this.current = this.preSelCurrent;
			this.preSelCurrent = -1;
		}

		// current option
		var opt = this.selOpts[this.current];

		// update current selected value
		this.selPlaceholder.textContent = opt.textContent;

		// change native select element´s value
		this.el.value = opt.getAttribute('data-value');

		// remove class cs-selected from old selected option and add it to current selected option
		var oldOpt = this.selEl.querySelector('li.is-selected');
		if (oldOpt) {
			Helpers.removeClass(oldOpt, 'is-selected');
		}
		Helpers.addClass(opt, 'is-selected');
		App.Vent.trigger(App.EVENTS.selectChanged, this.el);

		// if there´s a link defined
		if (opt.getAttribute('data-link')) {
			// open in new tab?
			if (this.options.newTab) {
				window.open(opt.getAttribute('data-link'), '_blank');
			} else {
				window.location = opt.getAttribute('data-link');
			}
		}

		// callback
		this.options.onChange(this.el.value);
	},
	_isOpen: function (opt) {
		return Helpers.hasClass(this.selEl, 'is-active');
	},
	_removeFocus: function (opt) {
		var focusEl = this.selEl.querySelector('li.is-focus')
		if (focusEl) {
			Helpers.removeClass(focusEl, 'is-focus');
		}
	}
});

export default SelectFx;