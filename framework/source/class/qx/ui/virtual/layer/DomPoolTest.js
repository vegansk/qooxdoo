/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

qx.Class.define("qx.ui.virtual.layer.DomPoolTest",
{
  extend : qx.ui.core.Widget,
  
  construct : function() 
  {
    this.base(arguments);
    this._nodePool = [];
  },
  
  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    _nodePool: null,
  
    fullUpdate : function(visibleCells, lastVisibleCells, rowSizes, columnSizes)
    {
      qx.ui.core.queue.Manager.flush();
      var start = new Date();
      var el = this.getContainerElement().getDomElement();
      if (!el) {
        return;
      }
      var childNodes = el.childNodes;
      var i=0;
      el.innerHTML = "";
      
      var Style = qx.bom.element.Style;
      var Attribute = qx.bom.element.Attribute;
        
      var left = 0;
      var top = 0;
      var row = visibleCells.firstRow;
      var col = visibleCells.firstColumn;
      for (var x=0; x<rowSizes.length; x++)
      {
        var left = 0;
        var col = visibleCells.firstColumn;
        for(var y=0; y<columnSizes.length; y++)
        {
          var color = (row+col) % 2 == 0 ? "blue" : "yellow";
          var content = col + "x" + row;
          
          var cell = childNodes[i++];
          if (!cell) {
            var cell = document.createElement("div");
            var doAppend = true;
          }          

          Style.setCss(cell, [
            "position:absolute;",
            "left:", left, "px;",
            "top:", top, "px;",
            "width:", columnSizes[y], "px;",
            "height:", rowSizes[x], "px;"
          ].join(""));

          Attribute.set(cell, "text", content);
          left += columnSizes[y];
          
          if (doAppend) {
            el.appendChild(cell);
          }
        }
        top += rowSizes[x];
        row++;
      }
      
      for (j=i; j<childNodes.length; i++) {
        el.removeChild(childNodes[i]);
      }
      
      this.debug("dom - update: " + (new Date() - start) + "ms");
      var start = new Date();
      qx.ui.core.queue.Manager.flush();
      this.debug("dom - flush: " + (new Date() - start) + "ms");
    },
    
    
    updateScrollPosition : function(visibleCells, lastVisibleCells, rowSizes, columnSizes) {
      this.fullUpdate(visibleCells, lastVisibleCells, rowSizes, columnSizes);
    }
  }
});
