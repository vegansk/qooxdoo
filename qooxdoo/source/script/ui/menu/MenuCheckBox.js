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

#package(menu)

************************************************************************ */

/*!
  A checkbox for the menu system.
*/
qx.ui.menu.MenuCheckBox = function(vLabel, vCommand, vChecked)
{
  qx.ui.menu.MenuButton.call(this, vLabel, qx.Const.IMAGE_BLANK, vCommand);

  if (qx.util.Validation.isValidBoolean(vChecked)) {
    this.setChecked(vChecked);
  };

  this._iconObject.setAppearance("menu-check-box-icon");
};

qx.ui.menu.MenuCheckBox.extend(qx.ui.menu.MenuButton, "qx.ui.menu.MenuCheckBox");



/*
---------------------------------------------------------------------------
  PROPERTIES
---------------------------------------------------------------------------
*/

qx.ui.menu.MenuCheckBox.changeProperty({ name : "appearance", type : qx.Const.TYPEOF_STRING, defaultValue : "menu-check-box" });
qx.ui.menu.MenuCheckBox.addProperty({ name : "name", type : qx.Const.TYPEOF_STRING });
qx.ui.menu.MenuCheckBox.addProperty({ name : "value", type : qx.Const.TYPEOF_STRING });
qx.ui.menu.MenuCheckBox.addProperty({ name : "checked", type : qx.Const.TYPEOF_BOOLEAN, defaultValue : false, getAlias : "isChecked" });





/*
---------------------------------------------------------------------------
  MODIFIERS
---------------------------------------------------------------------------
*/

proto._modifyChecked = function(propValue, propOldValue, propData)
{
  if (propValue)
  {
    this.addState(qx.Const.STATE_CHECKED);
    this.getIconObject().addState(qx.Const.STATE_CHECKED);
  }
  else
  {
    this.removeState(qx.Const.STATE_CHECKED);
    this.getIconObject().removeState(qx.Const.STATE_CHECKED);
  };

  return true;
};





/*
---------------------------------------------------------------------------
  EXECUTE
---------------------------------------------------------------------------
*/

proto.execute = function()
{
  this.setChecked(!this.getChecked());
  qx.ui.menu.MenuButton.prototype.execute.call(this);
};
