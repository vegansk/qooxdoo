/**
 * @require(qxWeb)
 * @require(qx.module.Core)
 */
qx.Class.define("qx.test.performance.element.Html",
{
  extend : qx.test.ui.LayoutTestCase,
  include : qx.dev.unit.MMeasure,

  members :
  {
    CREATEITERATIONS : 1000,

    MODIFYITERATIONS : 500,

    __cont : null,

    __outerStyles : null,

    setUp : function()
    {
      this.__outerStyles = {
        position: "absolute",
        top: "20px",
        left: "20px",
        width: "60px",
        height: "60px",
        border: "1px solid blue",
        padding: "10px"
      };

      qx.ui.core.queue.Manager.flush();
      qx.html.Element.flush();
    },

    tearDown : function()
    {
      qxWeb("body > div").getChildren().remove();
    },

    __createHtmlElement : function()
    {
      var outer = new qx.html.Element();
      outer.setStyles(this.__outerStyles);

      var inner = new qx.html.Element();
      inner.setAttribute("text", "Some Text");
      outer.add(inner);

      this.getRoot(true).getContentElement().add(outer);
    },

    __createQxWeb : function()
    {
      var outer = qxWeb.create("<div>")
      .setStyles(this.__outerStyles);

      var inner = qxWeb.create("<div>")
      .setHtml("Some Text")
      .appendTo(outer);

      outer.appendTo(this.getRoot().getContentElement());
    },

    testStartupQxHtml : function() {
      this.measure(
        "create HTML elements",

        function() {
          for (var i=0; i<= this.CREATEITERATIONS; i++) {
            this.__createHtmlElement();
          }
          qx.html.Element.flush();
        }.bind(this),

        null,

        this.CREATEITERATIONS
      );
    },

    testStartupQxWeb : function() {
      this.measure(
        "create qxWeb elements",

        function() {
          for (var i=0; i<= this.CREATEITERATIONS; i++) {
            this.__createQxWeb();
          }
        }.bind(this),

        null,

        this.CREATEITERATIONS
      );
    },

    testModifyQxHtml : function() {
      for (var i=0; i<= this.MODIFYITERATIONS; i++) {
        this.__createHtmlElement();
      }

      qx.html.Element.flush();
      this.measure(
        "modify HTML elements",

        function() {
          var children = this.getRoot(true).getContentElement().getChildren();
          children.forEach(function(child, index) {
            child.setStyles({
              left: "50px",
              top: "50px",
              backgroundColor: "blue",
              padding: "5px 10px"
            });
            if (index % 100) {
              qx.html.Element.flush();
            }
          });
          qx.html.Element.flush();
        }.bind(this),

        null,

        this.MODIFYITERATIONS
      );
    },

    testModifyQxWeb : function() {
      for (var i=0; i<= this.MODIFYITERATIONS; i++) {
        this.__createQxWeb();
      }

      this.measure(
        "modify qxWeb elements",

        function() {
          var children = this.getRoot().getContentElement().getChildren();
          children.forEach(function(child, index) {
            qxWeb(child).setStyles({
              left: "50px",
              top: "50px",
              backgroundColor: "blue",
              padding: "5px 10px"
            });
          });
        }.bind(this),

        null,

        this.MODIFYITERATIONS
      );
    }
  }
});
