qx.Bootstrap.define("qx.module.ui.Widget", {
  extend : qxWeb,

  statics : {
    /**
     * Creates a new collection from the given argument. This can either be an
     * HTML string, a single DOM element or an array of elements
     *
     * @attachStatic{qxWeb}
     * @param html {String|Element[]} HTML string or DOM element(s)
     * @return {qxWeb} Collection of elements
     */
    create : function(html) {
      return new qx.module.ui.Widget(qxWeb.create(html));
    },

    _scroll : {}
  },


  construct : function(selector, context) {
    var col = this.base(arguments, selector, context);
    Array.prototype.push.apply(this, Array.prototype.slice.call(col, 0, col.length));
    this.setAttribute("qx-class", this.classname);
  },


  members : {
    setTemplate : function(name, template) {
      this.forEach(function(item) {
        if (!item.templates) {
          item.templates = {};
        }
        item.templates[name] = template;
      });

      this.render();

      return this;
    },


    getTemplate : function(name) {
      var templates = this.getProperty("templates");
      var template;

      if (templates) {
        template = templates[name];
      }

      if (!template && this.constructor._templates) {
        return this.constructor._templates[name];
      }

      return template;
    },

    render : function() {},



    setSelectable : function(value) {
      if (!this[0]) {
        return;
      }
      var contentElement = this.eq(0);
      contentElement.setAttribute("qxSelectable", value ? "on" : "off");
      var userSelect = qx.core.Environment.get("css.userselect");
      if (userSelect) {
        contentElement.setStyle(userSelect, value ? "text" :
          qx.core.Environment.get("css.userselect.none"));
      }
      return this;
    }
  }
});
