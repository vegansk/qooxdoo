/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2013 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Daniel Wagner (danielwagner)

************************************************************************ */

qx.Bootstrap.define("qx.ui.website.Accordion", {
  extend : qx.ui.website.Tabs,

  statics : {

    _templates : {
      button : "<li><button>{{{content}}}</button></li>"
    },

    _config : {
      animationTiming : "parallel",

      hideAnimation : {
        duration: 200,
        delay: 0,
        keep: 100,
        timing: "linear",
        keyFrames: {
          0: {
            height : "{{height}}px"
          },
          100: {
            height : "0px"
          }
        }
      },

      showAnimation : {
        duration: 200,
        delay: 0,
        keep: 100,
        timing: "linear",
        keyFrames: {
          0: {
            height : "0px"
          },
          100 : {
            height :  "{{height}}px"
          }
        }
      }
    }

  },


  construct : function(selector, context) {
    this.base(arguments, selector, context);
  },


  members : {

    init : function() {
      this._forEachElementWrapped(function(tabs) {
        tabs.find("> ul > .qx-accordion-page")._forEachElementWrapped(function(page) {
          page.setProperty("initialHeight", page.getHeight());
        });
      });

      if (!this.base(arguments)) {
        return false;
      }
    },


    render : function() {
      this._forEachElementWrapped(function(tabs) {
        tabs.find("> ul > .qx-accordion-page")._forEachElementWrapped(function(page) {
          var isHidden = page.getStyle("display") === "none";
          if (isHidden) {
            page.show();
          }

          var showAnim = tabs.getConfig("showAnimation");
          if (showAnim) {
            //TODO: q.object.clone
            showAnim = qx.lang.Object.clone(showAnim, true);
            showAnim.duration = 1;
            page.once("animationEnd",  function() {
              page.setProperty("initialHeight", page.getHeight());
              if (isHidden) {
                page.hide();
              }
            })
            .animate(showAnim);
          } else {
            page.setProperty("initialHeight", page.getHeight());
            if (isHidden) {
              page.hide();
            }
          }
        });
      }.bind(this));
    },


    _showPage : function(newButton, oldButton) {
      var oldPage = this._getPage(oldButton);
      var newPage = this._getPage(newButton);
      if (oldPage[0] == newPage[0]) {
        return;
      }

      var showAnimation = this.getConfig("showAnimation");
      if (showAnimation) {
        showAnimation = JSON.parse(qxWeb.template.render(
          JSON.stringify(showAnimation),
          {height: newPage.getProperty("initialHeight")}
        ));
      }

      var hideAnimation = this.getConfig("hideAnimation");
      if (hideAnimation) {
        hideAnimation = JSON.parse(qxWeb.template.render(
          JSON.stringify(hideAnimation),
          {height: oldPage.getHeight()}
        ));
      }

      this._switchPages(oldPage, newPage, hideAnimation, showAnimation);
    },


    /**
     * Allows content selection using the up and down arrow keys
     * @param e {Event} keydown event
     */
    _onKeyDown : function(e) {
      var cssPrefix = this.getCssPrefix();
      var key = e.getKeyIdentifier();
      if (!(key == "Up" || key == "Down")) {
        return;
      }
      var buttons = this.find("> ul > ." + cssPrefix + "-button");
      var active = this.find("> ul > ." + cssPrefix + "-button-active");
      var next;
      if (key == "Down") {
        next = active.getNextAll("." + cssPrefix + "-button").eq(0);
      } else {
        next = active.getPrevAll("." + cssPrefix + "-button").eq(0);
      }

      if (next.length > 0) {
        var idx = buttons.indexOf(next);
        this.select(idx);
        next.getChildren("button").focus();
      }
    }
  },


  defer : function(statics) {
    qxWeb.$attach({
      accordion : function(align) {
        var accordion =  new qx.ui.website.Accordion(this);
        accordion.init();

        return accordion;
      }
    });
  }
});
