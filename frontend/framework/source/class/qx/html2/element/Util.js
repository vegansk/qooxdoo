/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2007 1&1 Internet AG, Germany, http://www.1and1.org

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)

   ======================================================================

   This class contains code based on the following work:

   * Prototype JS
     http://www.prototypejs.org/
     Version 1.5

     Copyright:
       (c) 2006-2007, Prototype Core Team

     License:
       MIT: http://www.opensource.org/licenses/mit-license.php

     Authors:
       * Prototype Core Team


************************************************************************ */

/* ************************************************************************

#module(html2)

************************************************************************ */

/**
 * High performance DOM element interaction.
 */
qx.Class.define("qx.html2.element.Util",
{
  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /*
    ---------------------------------------------------------------------------
      NODE CREATION & TYPES
    ---------------------------------------------------------------------------
    */

    /**
     * Creates an DOM element
     *
     * @type static
     * @param name {String} Tag name of the element
     * @param xhtml {Boolean?false} Enable XHTML
     * @return {Element} the created element node
     */
    createElement : function(name, xhtml)
    {
      if (xhtml) {
        return document.createElementNS("http://www.w3.org/1999/xhtml", name);
      } else {
        return document.createElement(name);
      }
    },


    /**
     * Whether the given node is a DOM element
     *
     * @type static
     * @param node {Node} the node which should be tested
     * @return {Boolean} true if the node is a DOM element
     */
    isElement : function(node) {
      return !!(node && node.nodeType === qx.dom.Node.ELEMENT);
    },


    /**
     * Whether the given node is a document
     *
     * @type static
     * @param node {Node} the node which should be tested
     * @return {Boolean} true when the node is a document
     */
    isDocument : function(node) {
      return !!(node && node.nodeType === qx.dom.Node.DOCUMENT);
    },






    /*
    ---------------------------------------------------------------------------
      STRING HELPERS
    ---------------------------------------------------------------------------
    */
    
    /**
     * Converts a script style property name to the CSS variant e.g. marginTop => margin-top
     *
     * @type static
     * @param name {String} Name of the style attribute (CSS variant e.g. marginTop, wordSpacing)
     * @return {String} the CSS style name e.g. margin-top, word-spacing
     */
    toCssStyle : function(name) {
      return name.replace(/([A-Z])/g, '-$1').toLowerCase();
    },


    /**
     * Converts a CSS style property name to the script variant e.g. margin-top => marginTop
     *
     * @type static
     * @param name {String} Name of the style attribute (CSS variant e.g. margin-top, word-spacing)
     * @return {String} the script style name e.g. marginTop, wordSpacing
     */
    toScriptStyle : function(name)
    {
      return name.replace(/\-([a-z])/g, function(match, chr) {
        return chr.toUpperCase();
      });
    },
    
    



    /*
    ---------------------------------------------------------------------------
      ELEMENT CSS
    ---------------------------------------------------------------------------
    */
    
    /**
     * Set the full CSS content of the style attribute
     *
     * @type static
     * @param el {Element} The DOM element to modify
     * @param value {String} The full CSS string
     * @signature function(el, value)
     * @return {void}
     */
    setCss : qx.core.Variant.select("qx.client",
    {
      "mshtml" : function(el, value) {
        el.style.cssText = value;
      },

      "default" : function(el, value) {
        el.setAttribute("style", value);
      }
    }),


    /**
     * Returns the full content of the style attribute.
     *
     * @type static
     * @param el {Element} The DOM element to query
     * @return {String} the full CSS string
     * @signature function(el)
     */
    getCss : qx.core.Variant.select("qx.client",
    {
      "mshtml" : function(el) {
        return el.style.cssText.toLowerCase();
      },

      "default" : function(el) {
        return el.getAttribute("style");
      }
    }),







    /*
    ---------------------------------------------------------------------------
      NODE STRUCTURE
    ---------------------------------------------------------------------------
    */

    /**
     * Returns the owner document of the given node
     *
     * @type static
     * @param node {Node} the node which should be tested
     * @return {Document|null} The document of the given DOM node
     */
    getDocument : function(node) {
      return node.ownerDocument || node.document || null;
    },


    /**
     * Returns the DOM2 "defaultView" which represents the window
     * of a DOM node
     *
     * @type static
     * @param node {Node} TODOC
     * @return {var} TODOC
     */
    getDefaultView : qx.core.Variant.select("qx.client",
    {
      "mshtml" : function(node) {
        return this.getDocument(node).parentWindow;
      },

      "default" : function(node) {
        return this.getDocument(node).defaultView;
      }
    }),


    /**
     * Whether the first element contains the second one
     *
     * @type static
     * @param el {Element} Parent element
     * @param target {Node} Child node
     * @return {Boolean}
     */
    contains : function(el, target)
    {
      if (el.contains)
      {
        return this.isDocument(el) ?
          el === this.getOwnerDocument(target) :
          el !== target && el.contains(target);
      }
      else
      {
        while (target && (target = target.parentNode) && el != target) {
          continue;
        }

        return !!target;
      }
    },
    

    /**
     * Get the common parent element of two given elements. Returns 
     * <code>null</code> when no common element has been found.
     *
     * @type static
     * @param el1 {Element} First element
     * @param el1 {Element} Second element
     * @return {Element|null} Common parent
     */
    getCommonParent : qx.core.Variant.select(
    {
      "mshtml|opera" : function(el1, el2)
      { 
        if (el1 === el2) {
          return el1;  
        }
        
        while(el1)
        {
          if (el1.contains(el2)) {
            return el1; 
          }
          
          el1 = el1.parentNode;
        }
        
        return null;
      },
            
      "default" : function(el1, el2)
      {
        if (el1 === el2) {
          return el1;  
        }

        var known = {};
        var obj = qx.core.Object;
        var h1, h2;
        
        while(el1 || el2)
        {
          if (el1) 
          {
            h1 = obj.toHashCode(el1);
            
            if (known[h1]) {
              return known[h1];
            }
            
            known[h1] = el1;
            el1 = el1.parentNode;
          }
          
          if (el2) 
          {
            h2 = obj.toHashCode(el2);
            
            if (known[h2]) {
              return known[h2];
            }
            
            known[h2] = el2;
            el2 = el2.parentNode; 
          }
        }
        
        return null;
      }
    }),


    /**
     * Whether the given element is empty
     *
     * @type static
     * @param el {Element} The element to check
     * @return {Boolean} true when the element is empty
     */
    isEmpty : function(el)
    {
      el = el.firstChild;

      while (el)
      {
        if (el.nodeType === qx.dom.Node.ELEMENT || el.nodeType === qx.dom.Node.TEXT) {
          return false;
        }

        el = el.nextSibling;
      }

      return true;
    },


    /**
     * Returns the DOM index of the given node
     *
     * @type static
     * @param node {Node} Node to look for
     * @return {Integer} The DOM index
     */
    getNodeIndex : function(node)
    {
      var index = 0;

      while (node && (node = node.previousSibling)) {
        index++;
      }

      return index;
    },


    /**
     * Return the next element to the supplied element
     *
     * "nextSibling" is not good enough as it might return a text or comment el
     *
     * @type static
     * @param el {Element} Starting element node
     * @return {Element|null} Next element node
     */
    getNextElementSibling : function(el)
    {
      while (el && (el = el.nextSibling) && !this.isElement(el)) {
        continue;
      }

      return el || null;
    },


    /**
     * Return the previous element to the supplied element
     *
     * "previousSibling" is not good enough as it might return a text or comment el
     *
     * @type static
     * @param el {Element} Starting element node
     * @return {Element|null} Previous element node
     */
    getPreviousElementSibling : function(el)
    {
      while (el && (el = el.previousSibling) && !this.isElement(el)) {
        continue;
      }

      return el || null;
    },


    /**
     * Removes whitespace-only text node children
     *
     * @type static
     * @param el {Element} Element to cleanup
     * @return {void}
     */
    cleanWhitespace: function(el)
    {
      var node = el.firstChild;

      while (node)
      {
        var nextNode = node.nextSibling;

        if (node.nodeType == 3 && !/\S/.test(node.nodeValue)) {
          el.removeChild(node);
        }

        node = nextNode;
      }
    },
    
    
    /**
     * 
     *
     */
    empty: function(element) {
      return el.innerHTML = "";
    },    





    /*
    ---------------------------------------------------------------------------
      SCROLL HANDLING
    ---------------------------------------------------------------------------
    */

    scrollToX : function(el, x) {
      el.scrollLeft = x;
    },

    scrollToY : function(el, y) {
      el.scrollTop = y;
    },












    /*
    ---------------------------------------------------------------------------
      ELEMENT VISIBILITY
    ---------------------------------------------------------------------------
    */

    /**
     * Shows the given element
     *
     * @type static
     * @param el {Element} DOM element to show
     * @return {void}
     */
    show : function(el) {
      el.style.visibility = "visible";
    },


    /**
     * Hides the given element
     *
     * @type static
     * @param el {Element} DOM element to show
     * @return {void}
     */
    hide : function(el) {
      el.style.visibility = "hidden";
    },


    /**
     * Toggle the visibility of the given element
     *
     * @type static
     * @param el {Element} DOM element to show
     * @return {void}
     */
    toggle : function(el) {
      el.style.visibility = this.isHidden(el) ? "visible" : "hidden";
    },


    /**
     * Whether the given element is visible
     *
     * @type static
     * @param el {Element} DOM element to query
     * @return {Boolean} true when the element is visible
     */
    isVisible : function(el) {
      return this.getStyle(el, "visibility") !== "hidden";
    },


    /**
     * Whether the given element is visible
     *
     * @type static
     * @param el {Element} DOM element to query
     * @return {Boolean} true when the element is visible
     */
    isHidden : function(el) {
      return this.getStyle(el, "visibility") === "hidden";
    }
  }
});
