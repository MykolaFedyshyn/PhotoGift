var textControlPanel = {
  container: document.querySelector("#textControlPanel"),

	fontFamilyOptions: [ "Arial", "AlexBrush", "GoodDog", "GreatVibes", "KaushanScript", "Pacifico", "Quicksand" ],

  renderFontSizeSelector: function(state) {
    return '<label>' +
              '<span>Font size:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' +
              '<input type="number" name="fontSize" value="' + state.fontSize + '" min="0" max="99" onChange="textControlPanel.onFontSizeChange(event)">' +
            '</label>';
  },

  renderLetterSpacingSelector: function(state) {
    return '<label>' +
              '<span>Letter spacing:&nbsp;&nbsp;&nbsp;&nbsp;</span>' +
              '<input type="number" name="letterSpacing" value="' + state.letterSpacing + '" min="-3" max="9" onChange="textControlPanel.onLetterSpacingChange(event)">' +
            '</label>';
  },

  renderLineHeightSelector: function(state) {
    return '<label>' +
              '<span>Line height:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' +
              '<input type="number" name="lineHeight" value="' + state.lineHeight + '" step=".1" min="0" max="9" onChange="textControlPanel.onLineHeightChange(event)">' +
            '</label>';
  },

  renderFontFamilySelector: function(state) {
    var options = this.fontFamilyOptions.map(function(fontFamilyOption) {
      var isSelected = state.fontFamily === fontFamilyOption ? "selected='selected'" : "";
      return "<option " + isSelected + ">" + fontFamilyOption + "</option>"
    });

    var resultString = options.join("");

    return '<label>' +
              '<span>Font family:&nbsp;&nbsp;</span>' +
              '<select name="fontFamily" onChange="textControlPanel.onFontFamilyChange(event)">' +
                resultString +
              '</select>' +
            '</label>';
  },

  renderFontColorSelector: function(state) {
    return '<label>' +
              '<span>Font color:&nbsp;&nbsp;&nbsp;&nbsp;</span>' +
                '<input type="color" id="favColor" value = "' + state.color + '" onChange="textControlPanel.onFontColorChange(event)">' +
            '</label>';
  },

  renderIsBoldToggler: function(state) {
    var
        isBold = state.isBold === "true",
        isChecked = isBold ? "checked" : "",
        dataSetBold = isBold ? "true" : "false";

    return '<input type="checkbox" id="bold" name="bold" value="bold" data-is-bold="'+dataSetBold+'" '+isChecked+' onclick="textControlPanel.onBoldToggle()">' +
            '<label for="bold"></label>';
  },

  renderIsItalicToggler: function(state) {
    var
        isItalic = state.isItalic === "true",
        isChecked = isItalic ? "checked" : "",
        dataSetItalic = isItalic ? "true" : "false";

    return '<input type="checkbox" id="italic" name="italic" value="italic" data-is-italic="'+dataSetItalic+'" '+isChecked+' onclick="textControlPanel.onItalicToggle()">' +
            '<label for="italic"></label>';
  },

  renderIsUnderlineToggler: function(state) {
    var
        isUnderline = state.isUnderline === "true",
        isChecked = isUnderline ? "checked" : "",
        dataSetUnderline = isUnderline ? "true" : "false";

    return '<input type="checkbox" id="underline" name="underline" value="underline" data-is-underline="'+dataSetUnderline+'" '+isChecked+' onclick="textControlPanel.onUnderlineToggle()">' +
            '<label for="underline"></label>';
  },

  render: function(textBox) {
    this.textBox = textBox;
    this.container.innerHTML =
      '<div class="optionContainer">' +
        this.renderFontSizeSelector(textBox.dataset) +
        '<br/>' +
        this.renderFontFamilySelector(textBox.dataset) +
      '</div>' +
      '<div class="optionContainer">' +
        this.renderLetterSpacingSelector(textBox.dataset) +
        '<br/>' +
        this.renderLineHeightSelector(textBox.dataset) +
      '</div>' +
      '<div class="optionContainer">' +
        this.renderFontColorSelector(textBox.dataset) +
        '<br/>' +
        this.renderIsBoldToggler(textBox.dataset) +
        this.renderIsItalicToggler(textBox.dataset) +
        this.renderIsUnderlineToggler(textBox.dataset) +
      '</div>';
  },

  onFontSizeChange: function(event) {
    this.textBox.dataset.fontSize = event.target.value;
    this.textBox.style.fontSize = event.target.value + "px";
    this.render(this.textBox);
  },

  onLetterSpacingChange: function(event) {
    this.textBox.dataset.letterSpacing = event.target.value;
    this.textBox.style.letterSpacing = event.target.value + "px";
    this.render(this.textBox);
  },

  onLineHeightChange: function(event) {
    this.textBox.dataset.lineHeight = event.target.value;
    this.textBox.style.lineHeight = event.target.value;
    this.render(this.textBox);
  },

  onFontFamilyChange: function(event) {
    this.textBox.dataset.fontFamily = event.target.value;
    this.textBox.style.fontFamily = event.target.value;
    this.render(this.textBox);
  },

  onFontColorChange: function(event) {
    this.textBox.dataset.color = event.target.value;
    this.textBox.style.color = event.target.value;
    this.render(this.textBox);
  },

  onBoldToggle: function() {
    this.textBox.dataset.isBold = this.textBox.dataset.isBold !== "true";
    this.render(this.textBox);
  },

  onItalicToggle: function() {
    this.textBox.dataset.isItalic = this.textBox.dataset.isItalic !== "true";
    this.render(this.textBox);
  },

  onUnderlineToggle: function() {
    this.textBox.dataset.isUnderline = this.textBox.dataset.isUnderline !== "true";
    this.render(this.textBox);
  }
};
