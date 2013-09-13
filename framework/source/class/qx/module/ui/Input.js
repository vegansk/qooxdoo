/**
 * @require(qx.module.TextSelection)
 */
qx.Bootstrap.define("qx.module.ui.Input", {
  extend : qx.module.ui.Widget,


  construct : function(selector, context) {
     this.base(arguments, selector, context);
  },


  members : {
    // used for webkit only
    __selectable : null,
    __enabled : null,


    /**
     * Set the input element enabled / disabled.
     * Webkit needs a special treatment because the set color of the input
     * field changes automatically. Therefore, we use
     * <code>-webkit-user-modify: read-only</code> and
     * <code>-webkit-user-select: none</code>
     * for disabling the fields in webkit. All other browsers use the disabled
     * attribute.
     *
     * @param value {Boolean} true, if the input element should be enabled.
     */
    setEnabled : function(value) {
      this.setAttribute("disabled", value===false);

      if (qxWeb.env.get("engine.name") == "webkit") {
        this.__enabled = value;

        if (!value) {
          this.setStyles({
            "userModify": "read-only",
            "userSelect": "none"
          });
        } else {
          this.setStyles({
            "userModify": null,
            "userSelect": this.__selectable ? null : "none"
          });
        }
      }
    },


    /**
     * Set whether the element is selectable. It uses the qooxdoo attribute
     * qxSelectable with the values 'on' or 'off'.
     * In webkit, a special css property will be used and checks for the
     * enabled state.
     *
     * @param value {Boolean} True, if the element should be selectable.
     */
    setSelectable : function(value) {
      var enabled = this.__enabled;
      if (qxWeb.env.get("engine.name") != "webkit") {
        enabled = true;
      } else {
        this.__selectable = value;
      }
      this.base(arguments, enabled && value);
    }
  }
});
