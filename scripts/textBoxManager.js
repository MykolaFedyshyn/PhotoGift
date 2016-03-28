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
		document.getElementById("work-field").appendChild(textBoxesNode);

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
		newTextBox.style.top = (this.textBoxInstances.length)*100 + "px";
		newTextBox.style.left = (this.textBoxInstances.length)*100 + "px";

	  // textBox.innerText = "azazaza";
	  this.textBoxInstances.push(newTextBox);
	  console.log("Added new textbox");
	},

	remove: function() {},

	/**
	 * Triggered whenever any textBox is added, updated or removed
	 * @param  {Array} changes - Array of changes
	 */
	onChange: function(changes) {
		console.log("changes: ", changes);

		// this.textBoxesDOMNode.innerHTML = "";

		// Deal with added textBoxes
		changes[0].object.forEach(function(textBox) {
			this.textBoxesDOMNode.appendChild(textBox);
			this.mountedInTheDOM(textBox);
		}.bind(this));

		// Deal with removed textBoxes
		changes[0].removed.forEach(function(textBox) {
			this.unmountedFromTheDOM(textBox);
		}.bind(this));

	},

	onClick: function(event) {},
	onMouseDown: function(event) {
		event.target.setAttribute("draggable", true);
	},

	onMove: function(textBox, event) {
		if(event.target.getAttribute("draggable") === "true") {
			textBox.style.left= (event.pageX - this.workFieldDOMNode.offsetLeft) + "px";
			// textBox.style.left= (event.pageX - event.offsetX - this.workFieldDOMNode.offsetLeft) + "px";
			textBox.style.top = (event.pageY - this.workFieldDOMNode.offsetTop) + "px";
			// textBox.style.top = (event.pageY - event.offsetY - this.workFieldDOMNode.offsetTop) + "px";

    	console.log("textBox.style.left: ", textBox.style.left);
    	console.log("textBox.style.top: ", textBox.style.top);

    	console.log("event.target.style.left: ", event.target.style.left);
    	console.log("event.target.style.top: ", event.target.style.top);

    	console.log("workFieldDOMNode.offsetLeft: ", this.workFieldDOMNode.offsetLeft);
    	console.log("workFieldDOMNode.offsetTop: ", this.workFieldDOMNode.offsetTop);

    	console.log("event.pageX: ", event.pageX + "px");
    	console.log("event.pageY: ", event.pageY + "px");

    	// console.log("Applied left: " + event.target.style.left +
    	// 													" and top: " + event.target.style.top);
		}
	},

	onMouseUp: function(textBox, event) {
		textBox.setAttribute("draggable", false);
	},

	/**
	 * Triggered whenever specified textBox is added to the DOM
	 * @param  {Object} textBox - DOM node reference
	 */
	mountedInTheDOM: function(textBox) {
		textBox.addEventListener("click", 		this.onClick.bind(this), false);
		textBox.addEventListener("mousedown", this.onMouseDown.bind(this), false);
		textBox.addEventListener("mousemove", this.onMove.bind(this, textBox), false);

		document.body.addEventListener("mouseup",   this.onMouseUp.bind(this, textBox), false);
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
