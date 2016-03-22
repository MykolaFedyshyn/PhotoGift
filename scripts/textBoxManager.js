/*
addTextBox.addEventListener("click", function(event) {
  var textBox = document.createElement("div");
  textBox.setAttribute("contenteditable", "");
  var current = "textbox" + textBoxCounter;
  textBox.id = current;
  textBox.innertext = "azazaza";
  textBoxCounter++;


  textBoxes.push(textbox
  document.getElementById("tools-panel").appendChild(textBox);
});
*/

var TextBoxManager = {

	textBoxInstances: [],

	init: function() {
		// Reference already existing addButton
		this.addButtonDOMNode = document.querySelector('#addTextBox');
		this.workFieldDOMNode = document.getElementById("work-field-container");

		// Setup event listener for onClick event
		this.addButtonDOMNode.addEventListener("click", this.add.bind(this), false);

		// Observe changes made to textBoxInstances
		Array.observe(this.textBoxInstances, this.onChange.bind(this));

		// Create and add into the DOM textBoxes wrapper
		var textBoxesNode = document.createElement("div");
		textBoxesNode.setAttribute("id", "textBoxes");
		textBoxesNode.setAttribute("class", "textBoxes");
		this.workFieldDOMNode.appendChild(textBoxesNode);

		// Save the reference to it for later
		this.textBoxesDOMNode = document.querySelector("#textBoxes");
	},

	add: function(event) {
		var newTextBox = document.createElement("div");

		// Specify textBox attributes
		newTextBox.setAttribute("contenteditable", "");
		newTextBox.setAttribute("class", "textBox");
		newTextBox.setAttribute("id", "textBox-" + (this.textBoxInstances.length + 1));

		// Position every new textBox in a chess like cascade
		newTextBox.style.top = (this.textBoxInstances.length)*60 + "px";
		// newTextBox.style.left = (this.textBoxInstances.length)*100 + "px";

	  // textBox.innerText = "azazaza";
	  this.textBoxInstances.push(newTextBox);
	  console.log("Added new textbox");
	},

	remove: function(textBox) {
		/* var indexOfRemovedTextBox = this.textBoxInstances.findIndex(function(instance) { return instance === textBox; });
		this.textBoxInstances = Array.concat(this.textBoxInstances.slice(0, indexOfRemovedTextBox), this.textBoxInstances.slice(indexOfRemovedTextBox + 1, this.textBoxInstances.length - 1)) */
	},

	/**
	 * Triggered whenever any textBox is added, updated or removed
	 * @param  {Array} changes - Array of changes
	 */
	onChange: function(changes) {
		console.log("changes: ", changes);

		// Deal with added textBoxes
		changes[0].object.forEach(function(textBox, index, changes) {
			this.textBoxesDOMNode.appendChild(textBox);
			this.mountedInTheDOM(textBox);
			index + 1 === changes.length && textBox.focus();
		}.bind(this));

		// Deal with removed textBoxes
		changes[0].removed.forEach(function(textBox) {
			this.unmountedFromTheDOM(textBox);
		}.bind(this));

	},

	onClick: function(event) {},

	onMouseDown: function(textBox, event) {
		textBox.dataset.draggable = true;
	},

	onMove: function(textBox, event) {
		if(textBox.dataset.draggable === "true") {
			textBox.style.left= (event.pageX - this.workFieldDOMNode.offsetLeft) + "px";
			// textBox.style.left= (event.pageX - event.offsetX - this.workFieldDOMNode.offsetLeft) + "px";
			textBox.style.top = (event.pageY - this.workFieldDOMNode.offsetTop) + "px";
			// textBox.style.top = (event.pageY - event.offsetY - this.workFieldDOMNode.offsetTop) + "px";
		}
	},

	onMouseUp: function(textBox, event) {
		textBox.dataset.draggable = false;
	},

	onResize: function(textBox, event) {
		event.stopPropagation();

		// textBox.style.width =
		// textBox.style.height =

		document.body.addEventListener("mouseup", function() {});
	},

	onClose: function(textBox, event) {
		this.remove(textBox);
	},

	/**
	 * Triggered whenever specified textBox is added to the DOM
	 * @param  {Object} textBox - DOM node reference
	 */
	mountedInTheDOM: function(textBox) {
		textBox.addEventListener("click", 		this.onClick.bind(this), false);
		textBox.addEventListener("mousedown", this.onMouseDown.bind(this, textBox), false);

		Array.prototype.forEach.call(textBox.querySelectorAll("button.resize"), function(button) {
			button.addEventListener("mousedown", this.onResize.bind(this, textBox), false);
		});

		Array.prototype.forEach.call(textBox.querySelectorAll("button.close"), function(button) {
			button.addEventListener("click", this.onClose.bind(this, textBox), false);
		});

		this.textBoxesDOMNode.addEventListener("mousemove", this.onMove.bind(this, textBox), false);
		this.textBoxesDOMNode.addEventListener("mouseup",   this.onMouseUp.bind(this, textBox), false);
	},

	/**
	 * Triggered whenever specified textBox is removed from the DOM
	 * @param  {Object} textBox - DOM node reference
	 */
	unmountedFromTheDOM: function(textBox) {
		textBox.removeEventListener("click");
		textBox.removeEventListener("onmousedown");
		textBox.removeEventListener("onmousemove");
		textBox.removeEventListener("onmouseup");
	}

}

TextBoxManager.init();
