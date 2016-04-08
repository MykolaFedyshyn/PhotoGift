var textBoxCounter = 0;
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
		var newTextBoxId = "textBox-" + textBoxCounter;
		var newTextBox = document.createElement("div");

		// Specify textBox attributes
		newTextBox.setAttribute("style", "z-index: 1");
		newTextBox.setAttribute("id", newTextBoxId);
		textBoxCounter++;

		newTextBox.innerHTML =
			"<button class='remove'>" +
				"<span class='label'>Remove</span>" +
			"</button>" +
			"<div></div>" +
			"<canvas></canvas>" +
			"<button class='resize'>" +
				"<span class='label'>Resize</span>" +
			"</button>";

		newTextBox.dataset.isBold = false;
		newTextBox.dataset.isItalic = false;
		newTextBox.dataset.isUnderline = false;
		newTextBox.dataset.fontSize = 16;
		newTextBox.dataset.letterSpacing = 0;
		newTextBox.dataset.lineHeight = 1.2;
		newTextBox.dataset.fontFamily = "Arial";
		newTextBox.dataset.color = "#000000";

		var newTextBoxEditArea = newTextBox.querySelector("div");
		newTextBoxEditArea.setAttribute("contenteditable", "true");
		newTextBoxEditArea.setAttribute("class", "edit-area");

		this.mountedInTheDOM(newTextBox);

		this.workFieldDOMNode.appendChild(newTextBox);
		// Simulate click on a newly created textBox to trigger onSelect method,
		// which will render the textControlPanel
		this.workFieldDOMNode.querySelector("#" + newTextBoxId).click();
		// Focus on the edit-area of the newly created textBox so that user can type the text right away
		this.workFieldDOMNode.querySelector("#" + newTextBoxId).querySelector(".edit-area").focus();
	},

	renderCanvas: function(textBox) {
		if(textBox.querySelector("canvas")) {
			textBox.removeChild(textBox.querySelector("canvas"));
		};

		html2canvas(textBox.querySelector("div[contenteditable]"), {
  		onrendered: function(canvas) {
    	textBox.appendChild(canvas);
  		}
		});
	},

	/**
	 * Remove existing textBox once X button is clicked
	 * @param  {Node}   textBox - TextBox DOM Node that needs to be removed
	 * @return {null}
	 */
	remove: function(textBox) {
		this.workFieldDOMNode.removeChild(textBox);
	},

	onSelect: function(textBox, event) {
		event.stopPropagation();
		textControlPanel.render(textBox);
		var allElems = textBox.parentNode.children;
		for (var i = 0; i < allElems.length; i++) {
        allElems[i].className = '';
        changeZindex(allElems[i], ['canvAncor', 'canvDel fa fa-times'], -5, 0);
    };
		textBox.dataset.isActive = true;
		textBox.querySelector("div[contenteditable]").setAttribute("contenteditable", "true");
		var textPanel = document.getElementById("textControlPanel");
		drawPanelAnime(textPanel, '80px', 1, '0px', '0 0 10px', 'relative');
		this.onDragEnd(textBox);
	},

	onUnselect: function(event) {
		var activeTextBoxes = Array.prototype.slice.call(this.workFieldDOMNode.querySelectorAll("[data-is-active = 'true']"));
		console.log(this.workFieldDOMNode.querySelectorAll(".active"));
		activeTextBoxes.forEach(function(activeTextBox) {
			activeTextBox.dataset.isActive = false;
			activeTextBox.querySelector("div[contenteditable]").setAttribute("contenteditable", "false");
		});
	},

	/**
	 * Handle textBox "mousedown" event
	 * @param  {Node} textBox - textBox DOM Node
	 * @param  {Object} event - mousedown event object
	 * @return {null}
	 */
	onDragStart: function(textBox, event) {
		event.stopPropagation();

		textBox.dataset.draggable = true;

		textBox.startX = event.offsetX;
		textBox.startY = event.offsetY;

		/**
		 * Start listening to mousemove event.
		 */
		this.workFieldDOMNode.addEventListener("mousemove", textBox.onDrag, false);
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

		/**
		 * Start listening to mouseup to prevent further onDrag calls,
		 * once left mouse button is released.
		 */
		this.workFieldDOMNode.addEventListener("mouseup",   textBox.onDragEnd, false);
	},

	/**
	 * Handle textBox "mouseup" event
	 * @param  {Node} textBox - textBox DOM Node
	 * @param  {Object} event - "mouseup" event object
	 * @return {null}
	 */
	 onDragEnd: function(textBox, event) {
 		textBox.dataset.draggable = false;
 		/**
 		 * Stop listening to mousemove and mouseup,
 		 * since user has released the left mouse button.
 		 */
 		this.workFieldDOMNode.removeEventListener("mousemove", textBox.onDrag);
 		this.workFieldDOMNode.removeEventListener("mouseup", textBox.onDragEnd);
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

 		/**
 		 * Start listening to mousemove event to change the size of the textBox
 		 * based on cursor's new position.
 		 */
 		this.workFieldDOMNode.addEventListener("mousemove", textBox.onResize, false);
 	},

 	onResize: function(textBox, event) {
 		if(textBox.dataset.resizable !== "true") return;

 		event.stopPropagation();

 		textBox.style.width = (textBox.startWidth + event.clientX - textBox.startX) + "px";
 		textBox.style.height = (textBox.startHeight + event.clientY - textBox.startY) + "px";

 		/**
 		 * Start listening to mouseup to prevent further onResize calls,
 		 * once left mouse button is released.
 		 */
 		this.workFieldDOMNode.addEventListener("mouseup", textBox.onResizeEnd, false);
 	},

 	onResizeEnd: function(textBox, event) {
 		event.stopPropagation();
 		textBox.dataset.resizable = false;

 		/**
 		 * Stop listening to mousemove and mouseup,
 		 * since user has released the left mouse button.
 		 */
 		this.workFieldDOMNode.removeEventListener("mousemove", textBox.onResize);
 		this.workFieldDOMNode.removeEventListener("mouseup", textBox.onResizeEnd);
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
 		textBox.onSelect = this.onSelect.bind(this, textBox);

 		textBox.onDragStart = this.onDragStart.bind(this, textBox);
 		textBox.onDrag = this.onDrag.bind(this, textBox);
 		textBox.onDragEnd = this.onDragEnd.bind(this, textBox);

 		textBox.onResizeStart = this.onResizeStart.bind(this, textBox);
 		textBox.onResize = this.onResize.bind(this, textBox);
 		textBox.onResizeEnd = this.onResizeEnd.bind(this, textBox);

 		textBox.onRemove = this.onRemove.bind(this, textBox);

		textBox.renderCanvas = this.renderCanvas.bind(this, textBox);




 		/**
 		 * Now assign them to DOM Nodes
 		 */
 		textBox.addEventListener("mousedown", textBox.onDragStart, false);
		textBox.addEventListener("click", textBox.onSelect, false);
		textBox.querySelector("div[contenteditable='true']").addEventListener("mouseout", textBox.renderCanvas, false);
 		textBox.querySelector("button.resize").addEventListener("mousedown", textBox.onResizeStart, false);
 		textBox.querySelector("button.remove").addEventListener("click", textBox.onRemove, false);
		document.addEventListener("click", this.onUnselect.bind(this), false);

 	},

 	/**
 	 * Triggered whenever specified textBox is removed from the DOM
 	 * @param  {Object} textBox - DOM node reference
 	 */
 	unmountedFromTheDOM: function(textBox) {
 		textBox.removeEventListener("mousedown", textBox.onDragStart);
		textBox.removeEventListener("click", textBox.onSelect);
		textBox.querySelector("div[contenteditable='true']").removeEventListener("mouseout", textBox.renderCanvas, false);
 		textBox.querySelector("button.resize").removeEventListener("mousedown", textBox.onResize);
 		textBox.querySelector("button.remove").removeEventListener("click", textBox.onRemove);
 	}
 }

 TextBoxManager.init();
