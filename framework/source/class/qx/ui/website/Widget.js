/**
 * @require(qx.module.Dataset)
 * @require(qx.module.util.String)
 * @require(qx.module.event.Native)
 */
qx.Bootstrap.define("qx.ui.website.Widget", {
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
      return new qx.ui.website.Widget(qxWeb.create(html));
    },

    _scroll : {}
  },


  construct : function(selector, context) {
    var col = this.base(arguments, selector, context);
    Array.prototype.push.apply(this, Array.prototype.slice.call(col, 0, col.length));
    this.setAttribute("qx-class", this.classname);
    if (!this.hasClass("qx-widget")) {
      this.addClass("qx-widget");
    }
  },


  members : {
    setTemplate : function(name, template) {
      return this._setData("templates", name, template);
    },


    setConfig : function(name, config) {
      return this._setData("config", name, config);
    },


    _setData : function(type, name, data) {
      this.forEach(function(item) {
        if (!item[type]) {
          item[type] = {};
        }
        item[type][name] = data;
      });

      return this;
    },


    getTemplate : function(name) {
      return this._getData("templates", name);
    },


    getConfig : function(name) {
      return this._getData("config", name);
    },


    _getData : function(type, name) {
      var storage = this.getProperty(type);
      var item;

      if (storage) {
        item = storage[name];
      }

      if (!item && type == "config") {
        var attribName = "qx" + qxWeb.string.firstUp(type) +
          qxWeb.string.firstUp(name);
        item = this.getData(attribName);
        try {
          item = JSON.parse(item);
        } catch(e) {}
      }

      if (!item && this.constructor["_" + type]) {
        return this.constructor["_" + type][name];
      }

      return item;
    },


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
