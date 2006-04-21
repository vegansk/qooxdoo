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

#package(form)
#require(qx.ui.basic.Atom)
#appearance(fieldset)

************************************************************************ */

qx.ui.groupbox.GroupBox = function(vLegend, vIcon)
{
  qx.ui.layout.CanvasLayout.call(this);


  // ************************************************************************
  //   SUB WIDGETS
  // ************************************************************************
  this._createFrameObject();
  this._createLegendObject();


  // ************************************************************************
  //   INIT
  // ************************************************************************
  this.setLegend(vLegend);

  if (qx.util.Validation.isValidString(vIcon)) {
    this.setIcon(vIcon);
  };


  // ************************************************************************
  //   REMAPPING
  // ************************************************************************
  this.remapChildrenHandlingTo(this._frameObject);
};

qx.ui.groupbox.GroupBox.extend(qx.ui.layout.CanvasLayout, "qx.ui.groupbox.GroupBox");

qx.ui.groupbox.GroupBox.changeProperty({ name : "appearance", type : qx.Const.TYPEOF_STRING, defaultValue : "field-set" });




/*
---------------------------------------------------------------------------
  SUB WIDGET CREATION
---------------------------------------------------------------------------
*/

proto._createLegendObject = function()
{
  this._legendObject = new qx.ui.basic.Atom;
  this._legendObject.setAppearance("field-set-legend");

  this.add(this._legendObject);
};

proto._createFrameObject = function()
{
  this._frameObject = new qx.ui.layout.CanvasLayout;
  this._frameObject.setAppearance("field-set-frame");

  this.add(this._frameObject);
};





/*
---------------------------------------------------------------------------
  GETTER FOR SUB WIDGETS
---------------------------------------------------------------------------
*/

proto.getFrameObject = function() {
  return this._frameObject;
};

proto.getLegendObject = function() {
  return this._legendObject;
};






/*
---------------------------------------------------------------------------
  SETTER/GETTER
---------------------------------------------------------------------------
*/

proto.setLegend = function(vLegend) {
  this._legendObject.setLabel(vLegend);
};

proto.getLegend = function() {
  return this._legendObject.getLabel();
};

proto.setIcon = function(vIcon) {
  this._legendObject.setIcon(vIcon);
};

proto.getIcon = function() {
  this._legendObject.getIcon();
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

  if (this._legendObject)
  {
    this._legendObject.dispose();
    this._legendObject = null;
  };

  if (this._frameObject)
  {
    this._frameObject.dispose();
    this._frameObject = null;
  };

  return qx.ui.layout.CanvasLayout.prototype.dispose.call(this);
};
