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





    // ////////////
    // TODO cleanup!!!
    // ////////////
    activate : function() {},


    isNativelyFocusable : function() {
      if (this[0]) {
        var nodeName = qxWeb.getNodeName(this[0]);
        return !!qx.event.handler.Focus.FOCUSABLE_ELEMENTS[nodeName];
      }
      return false;
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
    },

    /*
    ---------------------------------------------------------------------------
      SCROLL SUPPORT
    ---------------------------------------------------------------------------
    */

    /**
     * Scrolls the given child element into view. Only scrolls children.
     * Do not influence elements on top of this element.
     *
     * If the element is currently invisible it gets scrolled automatically
     * at the next time it is visible again (queued).
     *
     * @param elem {qx.html.Element} The element to scroll into the viewport.
     * @param align {String?null} Alignment of the element. Allowed values:
     *   <code>left</code> or <code>right</code>. Could also be null.
     *   Without a given alignment the method tries to scroll the widget
     *   with the minimum effort needed.
     * @param direct {Boolean?true} Whether the execution should be made
     *   directly when possible
     *
     * @attach{qxWeb}
     */
    scrollChildIntoViewX : function(elem, align, direct)
    {
      var thisEl = this.eq(0);
      var childEl = elem.eq(0);

      if (direct !== false && thisEl && thisEl.offsetWidth && childEl && childEl.offsetWidth)
      {
        qx.bom.element.Scroll.intoViewX(childEl, thisEl, align);
      }
      else
      {
        this.__lazyScrollIntoViewX =
        {
          element : elem,
          align : align
        };

        qx.module.ui.Widget._scroll[this.$$hash] = this;
        //qx.html.Element._scheduleFlush("element");
      }

      delete this.__lazyScrollX;
      return this;
    },

    /**
     * Scrolls the given child element into view. Only scrolls children.
     * Do not influence elements on top of this element.
     *
     * If the element is currently invisible it gets scrolled automatically
     * at the next time it is visible again (queued).
     *
     * @param elem {qx.html.Element} The element to scroll into the viewport.
     * @param align {String?null} Alignment of the element. Allowed values:
     *   <code>top</code> or <code>bottom</code>. Could also be null.
     *   Without a given alignment the method tries to scroll the widget
     *   with the minimum effort needed.
     * @param direct {Boolean?true} Whether the execution should be made
     *   directly when possible
     *
     * @attach{qxWeb}
     */
    scrollChildIntoViewY : function(elem, align, direct)
    {
      var thisEl = this.eq(0);
      var childEl = elem.eq(0);

      if (direct !== false && thisEl && thisEl.offsetWidth && childEl && childEl.offsetWidth)
      {
        qx.bom.element.Scroll.intoViewY(childEl, thisEl, align);
      }
      else
      {
        this.__lazyScrollIntoViewY =
        {
          element : elem,
          align : align
        };

        qx.module.ui.Widget._scroll[this.$$hash] = this;
        //qx.html.Element._scheduleFlush("element");
      }

      delete this.__lazyScrollY;
      return this;
    },


    /**
     * Disables browser-native scrolling
     * @attach{qxWeb}
     */
    disableScrolling : function()
    {
      this.enableScrolling();
      this.setScrollLeft(0);
      this.setScrollTop(0);
      this.on("scroll", this.__onScroll, this);
      return this;
    },


    /**
     * Re-enables browser-native scrolling
     * @attach{qxWeb}
     */
    enableScrolling : function() {
      this.off("scroll", this.__onScroll, this);
      return this;
    },


    /**
     * Handler for the scroll-event
     * @attach{qxWeb}
     *
     * @param e {qx.event.type.Native} scroll-event
     */
    __onScroll : function(e)
    {
      if (!this.__inScroll)
      {
        this.__inScroll = true;
        this.setScrollTop(0);
        this.setScrollLeft(0);
        delete this.__inScroll;
      }
    },


    /*
    ---------------------------------------------------------------------------
      EVENT SUPPORT
    ---------------------------------------------------------------------------
    */

    capture : function() {},
    releaseCapture : function() {}
  }
});
