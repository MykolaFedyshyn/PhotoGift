var textBoxcounter = 0;
var TextBoxManager = {

	/**
	 * Cached DOM queries
	 */
	addButtonDOMNode: document.querySelector('#addTextBox'),
	workFieldDOMNode: document.getElementById("work-field"),

	init: function() {
		// Setup event listener for onClick event
		this.addButtonDOMNode.addEventListener("click", this.add.bind(this), false);
	},

	/**
	 * Create new textBox
	 * @param {Object} event - Click event object
	 */
	add: function(event) {
		var newTextBox = document.createElement("div");

		// Specify textBox attributes
		newTextBox.setAttribute("id", "textBox" + "-" + textBoxcounter);
		textBoxcounter++;

		newTextBox.innerHTML =
			"<button class='remove'>" +
				"<span class='label'>Remove</span>" +
			"</button>" +
			"<canvas></canvas>" +
			"<button class='resize'>" +
				"<span class='label'>Resize</span>" +
			"</button>";

		var newTextBoxCanvas = newTextBox.querySelector("canvas");

		// Instantiate the Input element within newly created canvas
		new CanvasInput({
			x: 0,
			y: 0,
			extraX: 0,
			extraY: 0,
			canvas: newTextBoxCanvas,
			fontSize: 36,
			fontFamily: "Arial",
			fontColor: "#212121",
			fontWeight: "normal",
			width: 300,
			height: 150,
			padding: 0,
			borderWidth: 0,
			borderColor: "transparent",
			borderRadius: 0,
			boxShadow: "0px 0px 0px #fff",
			innerShadow: "0px 0px 0px rgba(0, 0, 0, 0.5)",
			placeHolder: "Enter text here...",
			backgroundColor: "transparent"
		});

		this.mountedInTheDOM(newTextBox);

		this.workFieldDOMNode.appendChild(newTextBox);
	},

	/**
	 * Remove existing textBox once X button is clicked
	 * @param  {Node}   textBox - TextBox DOM Node that needs to be removed
	 * @return {null}
	 */
	remove: function(textBox) {
		this.workFieldDOMNode.removeChild(textBox);
	},

	/**
	 * Handle textBox "mousedown" event
	 * @param  {Node} textBox - textBox DOM Node
	 * @param  {Object} event - mousedown event object
	 * @return {null}
	 */
	onDragStart: function(textBox, event) {
		textBox.dataset.draggable = true;

		textBox.startX = event.offsetX;
		textBox.startY = event.offsetY;
	},

	/**
	 * Handle textBox "move" event
	 * @param  {Node} textBox - textBox DOM Node
	 * @param  {Object} event - "move" event object
	 * @return {null}
	 */
	onDrag: function(textBox, event) {
		if(textBox.dataset.draggable !== "true") return null;

		event.stopPropagation();

		textBox.style.left =
			(event.pageX - this.workFieldDOMNode.getBoundingClientRect().left - textBox.startX) + "px";
		textBox.style.top =
			(event.pageY - this.workFieldDOMNode.getBoundingClientRect().top - textBox.startY) + "px";
	},

	/**
	 * Handle textBox "mouseup" event
	 * @param  {Node} textBox - textBox DOM Node
	 * @param  {Object} event - "mouseup" event object
	 * @return {null}
	 */
	onDragEnd: function(textBox, event) {
		textBox.dataset.draggable = false;
	},


	/**
	 * Event handlers for resize
	 */
	onResizeStart: function(textBox, event) {
		event.stopPropagation();
		textBox.dataset.resizable = true;

		textBox.startX = event.clientX,
		textBox.startY = event.clientY,
		textBox.startWidth = parseInt(textBox.getBoundingClientRect().width, 10),
		textBox.startHeight = parseInt(textBox.getBoundingClientRect().height, 10);
	},

	onResize: function(textBox, event) {
		if(textBox.dataset.resizable !== "true") return;

		event.stopPropagation();

		textBox.style.width = (textBox.startWidth + event.clientX - textBox.startX) + "px";
		textBox.style.height = (textBox.startHeight + event.clientY - textBox.startY) + "px";
	},

	onResizeEnd: function(textBox, event) {
		event.stopPropagation();
		textBox.dataset.resizable = false;
	},

	/**
	 * Handle textBox removal
	 * @param  {Node} textBox - textBox DOM Node
	 * @param  {Object} event - "click" event object
	 * @return {null}
	 */
	onRemove: function(textBox, event) {
		event.stopPropagation();
		this.unmountedFromTheDOM(textBox);
		this.remove(textBox);
	},

	/**
	 * Triggered whenever specified textBox is added to the DOM
	 * @param  {Object} textBox - DOM node reference
	 */
	mountedInTheDOM: function(textBox) {
		/**
		 * Reapply newly created event listeners,
		 * so that they could be removed, once textBox is unmounted from the DOM
		 */
		textBox.onDragStart = this.onDragStart.bind(this, textBox);
		textBox.onDrag = this.onDrag.bind(this, textBox);
		textBox.onDragEnd = this.onDragEnd.bind(this, textBox);

		textBox.onResizeStart = this.onResizeStart.bind(this, textBox);
		textBox.onResize = this.onResize.bind(this, textBox);
		textBox.onResizeEnd = this.onResizeEnd.bind(this, textBox);

		textBox.onRemove = this.onRemove.bind(this, textBox);

		/**
		 * Now assign them to DOM Nodes
		 */
		textBox.addEventListener("mousedown", textBox.onDragStart, false);
		this.workFieldDOMNode.addEventListener("mousemove", textBox.onDrag, false);
		this.workFieldDOMNode.addEventListener("mouseup",   textBox.onDragEnd, false);

		textBox.querySelector("button.resize").addEventListener("mousedown", textBox.onResizeStart, false);
		this.workFieldDOMNode.addEventListener("mousemove", textBox.onResize, false);
		this.workFieldDOMNode.addEventListener("mouseup", textBox.onResizeEnd, false);

		textBox.querySelector("button.remove").addEventListener("click", textBox.onRemove, false);
	},

	/**
	 * Triggered whenever specified textBox is removed from the DOM
	 * @param  {Object} textBox - DOM node reference
	 */
	unmountedFromTheDOM: function(textBox) {
		textBox.removeEventListener("mousedown", textBox.onDragStart);
		this.workFieldDOMNode.removeEventListener("mousemove", textBox.onDrag);
		this.workFieldDOMNode.removeEventListener("mouseup", textBox.onDragEnd);

		textBox.querySelector("button.resize").removeEventListener("mousedown", textBox.onResize);
		this.workFieldDOMNode.removeEventListener("mousemove", textBox.onResize);
		this.workFieldDOMNode.removeEventListener("mouseup", textBox.onResizeEnd);

		textBox.querySelector("button.remove").removeEventListener("click", textBox.onRemove);
	}
}

TextBoxManager.init();
