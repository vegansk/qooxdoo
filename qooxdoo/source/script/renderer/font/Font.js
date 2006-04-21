/* ************************************************************************

   qooxdoo - the new era of web interface development

   Copyright:
     (C) 2004-2006 by Schlund + Partner AG, Germany
         All rights reserved

   License:
     LGPL 2.1: http://creativecommons.org/licenses/LGPL/2.1/

   Internet:
     * http://qooxdoo.oss.schlund.de

   Authors:
     * Sebastian Werner (wpbasti)
       <sebastian dot werner at 1und1 dot de>
     * Andreas Ecker (aecker)
       <andreas dot ecker at 1und1 dot de>

************************************************************************ */

/* ************************************************************************

#package(font)

************************************************************************ */

/*!
  Font implementation for qx.ui.core.Widget instances.
*/

qx.renderer.font.Font = function(vSize, vName)
{
  qx.core.Object.call(this);

  this._defs = {};

  if (qx.util.Validation.isValidNumber(vSize)) {
    this.setSize(vSize);
  };

  if (qx.util.Validation.isValidString(vName)) {
    this.setName(vName);
  };
};

qx.renderer.font.Font.extend(qx.core.Object, "qx.renderer.font.Font");



/*
---------------------------------------------------------------------------
  PROPERTIES
---------------------------------------------------------------------------
*/

qx.renderer.font.Font.addProperty({ name : "size", type : qx.Const.TYPEOF_NUMBER, impl : "style" });
qx.renderer.font.Font.addProperty({ name : "name", type : qx.Const.TYPEOF_STRING, impl : "style" });
qx.renderer.font.Font.addProperty({ name : "bold", type : qx.Const.TYPEOF_BOOLEAN, defaultValue : false, impl : "style" });
qx.renderer.font.Font.addProperty({ name : "italic", type : qx.Const.TYPEOF_BOOLEAN, defaultValue : false, impl : "style" });
qx.renderer.font.Font.addProperty({ name : "underline", type : qx.Const.TYPEOF_BOOLEAN, defaultValue : false, impl : "style" });
qx.renderer.font.Font.addProperty({ name : "strikeout", type : qx.Const.TYPEOF_BOOLEAN, defaultValue : false, impl : "style" });



/*
---------------------------------------------------------------------------
  MODIFIER
---------------------------------------------------------------------------
*/

proto._modifyStyle = function(propValue, propOldValue, propData)
{
  this._needsCompilation = true;
  return true;
};




/*
---------------------------------------------------------------------------
  UTILITY
---------------------------------------------------------------------------
*/

qx.renderer.font.Font.fromString = function(s)
{
  var vFont = new qx.renderer.font.Font;
  var vAllParts = s.split(/\s+/);
  var vName = [];
  var vPart;

  for (var i = 0; i < vAllParts.length; i++)
  {
    switch(vPart = vAllParts[i])
    {
      case qx.Const.FONT_STYLE_BOLD:
        vFont.setBold(true);
        break;

      case qx.Const.FONT_STYLE_ITALIC:
        vFont.setItalic(true);
        break;

      case qx.Const.FONT_STYLE_UNDERLINE:
        vFont.setUnderline(true);
        break;

      case qx.Const.FONT_STYLE_STRIKEOUT:
        vFont.setStrikeout(true);
        break;

      default:
        var vTemp = parseFloat(vPart);

        if(vTemp == vPart || vPart.contains(qx.Const.CORE_PIXEL))
        {
          vFont.setSize(vTemp);
        }
        else
        {
          vName.push(vPart);
        };

        break;
    };
  };

  if(vName.length > 0) {
    vFont.setName(vName.join(qx.Const.CORE_SPACE));
  };

  return vFont;
};




/*
---------------------------------------------------------------------------
  UTILITY
---------------------------------------------------------------------------
*/

qx.renderer.font.Font.PROPERTY_FAMILY = "fontFamily";
qx.renderer.font.Font.PROPERTY_SIZE = "fontSize";
qx.renderer.font.Font.PROPERTY_WEIGHT = "fontWeight";
qx.renderer.font.Font.PROPERTY_STYLE = "fontStyle";
qx.renderer.font.Font.PROPERTY_DECORATION = "textDecoration";

proto._needsCompilation = true;

proto._compile = function()
{
  var vName = this.getName();
  var vSize = this.getSize();
  var vBold = this.getBold();
  var vItalic = this.getItalic();
  var vUnderline = this.getUnderline();
  var vStrikeout = this.getStrikeout();
  var vDecoration = qx.Const.CORE_EMPTY;

  if (this.getUnderline()) {
    vDecoration = qx.Const.FONT_STYLE_UNDERLINE;
  };

  if (this.getStrikeout()) {
    vDecoration += qx.Const.CORE_SPACE + qx.Const.FONT_STYLE_STRIKEOUT;
  };

  this._defs.fontFamily = qx.util.Validation.isValidString(vName) ? vName : qx.Const.CORE_EMPTY;
  this._defs.fontSize = qx.util.Validation.isValidNumber(vSize) ? vSize + qx.Const.CORE_PIXEL : qx.Const.CORE_EMPTY;
  this._defs.fontWeight = this.getBold() ? qx.Const.FONT_STYLE_BOLD : qx.Const.FONT_STYLE_NORMAL;
  this._defs.fontStyle = this.getItalic() ? qx.Const.FONT_STYLE_ITALIC : qx.Const.FONT_STYLE_NORMAL;
  this._defs.textDecoration = qx.util.Validation.isValidString(vDecoration) ? vDecoration : qx.Const.CORE_EMPTY;

  this._needsCompilation = false;
};

proto.applyWidget = function(vWidget)
{
  if (this._needsCompilation) {
    this._compile();
  };

  vWidget.setStyleProperty(qx.renderer.font.Font.PROPERTY_FAMILY, this._defs.fontFamily);
  vWidget.setStyleProperty(qx.renderer.font.Font.PROPERTY_SIZE, this._defs.fontSize);
  vWidget.setStyleProperty(qx.renderer.font.Font.PROPERTY_WEIGHT, this._defs.fontWeight);
  vWidget.setStyleProperty(qx.renderer.font.Font.PROPERTY_STYLE, this._defs.fontStyle);
  vWidget.setStyleProperty(qx.renderer.font.Font.PROPERTY_DECORATION, this._defs.textDecoration);
};

proto.resetWidget = function(vWidget)
{
  vWidget.removeStyleProperty(qx.renderer.font.Font.PROPERTY_FAMILY);
  vWidget.removeStyleProperty(qx.renderer.font.Font.PROPERTY_SIZE);
  vWidget.removeStyleProperty(qx.renderer.font.Font.PROPERTY_WEIGHT);
  vWidget.removeStyleProperty(qx.renderer.font.Font.PROPERTY_STYLE);
  vWidget.removeStyleProperty(qx.renderer.font.Font.PROPERTY_DECORATION);
};






/*
---------------------------------------------------------------------------
  DISPOSER
---------------------------------------------------------------------------
*/

proto.dispose = function()
{
  if (this.getDisposed()) {
    return true;
  };

  delete this._defs;

  return qx.core.Object.prototype.dispose.call(this);
};
