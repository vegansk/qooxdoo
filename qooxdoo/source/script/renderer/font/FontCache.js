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
#require(qx.renderer.font.Font)

************************************************************************ */

qx.renderer.font.FontCache = function(propValue, propData)
{
  var propKey;
  var propKeyAsStyle = false;

  switch(typeof propValue)
  {
    case qx.Const.TYPEOF_STRING:
      if (propValue != qx.Const.CORE_EMPTY)
      {
        propValue = propKey = propValue.toLowerCase();
        break;
      };

      return propValue;

    case qx.Const.TYPEOF_NUMBER:
      propKey = propValue.toString();
      break;

    case qx.Const.TYPEOF_OBJECT:
      if (propValue == null || propValue instanceof qx.renderer.font.Font) {
        return propValue;
      };

      // Try to detect array of RGB values
      if (typeof propValue.join === qx.Const.TYPEOF_FUNCTION)
      {
        propKey = propValue.join(qx.Const.CORE_SPACE).toLowerCase();
        break;
      };

    default:
      return propValue;
  };

  if (qx.renderer.font.FontCache._data[propKey]) {
    return qx.renderer.font.FontCache._data[propKey];
  };

  return qx.renderer.font.FontCache._data[propKey] = qx.renderer.font.Font.fromString(propKey);
};

qx.renderer.font.FontCache._data = {};
