/**
 * Placeholder class (use div over input field)
 * @author: Krzysztof Wilczek
 * @since: 20.09.2011
 **/
var Placeholder = new Class({
	
	Implements: [Options, Events],
	
	options: {
		name: null, // Standard placeholder object name
		text: null, // Text for placeholder
		css_class: 'placeholder' // Additional css class for placeholders
	},
	
	/**
	 * Object main parameters initialization
	 */
	initialize: function(element, options)
	{
		if (!element)
		{
			return false;
		}
		this.element = element;
		this.setOptions(options);
		this.createPlaceholder();
	},
	
	/**
	 * Create new placeholder
	 */
	createPlaceholder: function()
	{	
		// Create placeholder element
		var styles = this.element.getStyles('margin', 'color', 'font-weight', 'font-size', 'padding');
		this.placeholder = new Element('div', {'html': this.options.text});
		this.placeholder.setStyles(styles);
		
		// Make wrapper
		this.wrapper = new Element('div');
		this.wrapper.setStyle('position', 'relative');
		this.wrapper.inject(this.element, 'before');
		this.wrapper.grab(this.element);
		
		// Put placeholder in right place
		this.placeholder.setStyles({'position': 'absolute', 'left': '0px' , 'top': '0px'});
		this.placeholder.inject(this.element, 'after');
		if (this.options.css_class)
		{
			this.wrapper.addClass(this.options.css_class);
		}
		
		// Bind all events
		this.element.addEvent('focus', this.onFocus.bind(this));
		this.element.addEvent('blur', this.onBlur.bind(this));
		this.placeholder.addEvent('click', this.onClick.bind(this));
		
	},
	
	/**
	 * Unbind placeholder form element input
	 */
	destroy: function()
	{
		this.element.inject(this.wrapper, 'before');
		this.element.removeEvents('focus', this.onFocus);
		this.element.removeEvents('blur', this.onBlur);
		this.placeholder.removeEvents('click', this.onClick);
		this.placeholder.dispose();
		this.placeholder = null;
		this.wrapper.dispose();
		this.wrapper = null;

	},
	
	/**
	 * Click on placeholder, fire event focus on input field 
	 * @param Object event
	 */
	onClick: function(event)
	{
		this.element.fireEvent('focus'); 
		this.element.focus();	
		this.fireEvent('onClick');
	},
	
	/**
	 * Focus on input field
	 * @param Object event
	 */
	onFocus: function(event)
	{
		this.hidePlaceholder();
		this.fireEvent('onFocus');
	},
	
	/**
	 * Focus drop out from input field
	 * @param Object event
	 */
	onBlur: function(event)
	{
		this.showPlaceholder();
		this.fireEvent('onBlur');
	},
	
	/**
	 * Hide placeholder for user
	 */
	hidePlaceholder: function()
	{
		this.placeholder.setStyle('display', 'none');
	},
	
	/**
	 * Shows placeholder for user
	 */
	showPlaceholder: function()
	{
		if (!this.element.value.length)
		{
			this.placeholder.setStyle('display', 'block');
		}
	}
	
});

/**
 * Standard Mootools Element extension 
 * add new method called: addPlaceholder (create new placeholder on the element)
 * @param Object options 
 * @return Placeholder
 */
Element.implement('addPlaceholder', function(){
	
	var name = arguments[0];
	var options = arguments[1];	
	
	if (!name)
	{
		name = 'placeholder';
	}
	
	if (options != null) {
		var placeholder = new Placeholder(this, options);
		this.store(name, placeholder);		
	} 
	else 
	{
		var placeholder = this.retrieve(name, null);	
		if (placeholder != null) {
			return placeholder;
		}
	}
	return this;

});

Element.implement('removePlaceholder', function(){
	
	var name = arguments[0];	
	
	if (!name)
	{
		name = 'placeholder';
	}
	
	var placeholder = this.retrieve(name, null);
	if (!placeholder)
	{
		return null;
	}
	placeholder.destroy();
	placeholder = null;
	
	return null;

});