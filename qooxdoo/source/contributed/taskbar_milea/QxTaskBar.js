﻿/* ************************************************************************

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
     * This widget: Jeronimo Milea
        <jeronimomilea at gmail dot com>

************************************************************************ */
function QxTaskBar() {
    qx.ui.layout.HorizontalBoxLayout.call(this);
    this._wins = 0;
    this._tBarPanel = new qx.ui.toolbar.ToolBarPart;
    this.add(this._tBarPanel);
    this._addingWindow = false;
};

QxTaskBar.extend(qx.ui.layout.HorizontalBoxLayout, "TaskBar");

/*!
  Appearance of the widget
*/
QxTaskBar.changeProperty({ name : "appearance", type : qx.Const.TYPEOF_STRING, defaultValue : "toolbar" });

/* Removes a qx.ui.window.Window from the taskbar.
*/
proto.removeWindow = function(win) {
    try{
        var botones = this._tBarPanel.getChildren();
        for(var btn = 0; btn < botones.length; btn++) {
            if(botones[btn] instanceof qx.ui.toolbar.ToolBarCheckBox) {
                if(botones[btn].getUserData("winId") == win.getUserData("winId")) {
                    this._tBarPanel.remove(botones[btn]);
                    win.createDispatchEvent("removedFromTaskbar");
                }
            };
        };
    }
    catch(ex){this.debug("Could not remove window from taskbar. Exeption: " + ex);};
};
/* Updates button status in the taskbar it gets called whe u add a new qx.ui.window.Window
*/
proto._updateButtons = function(selected) {
    try{
        var botones = this._tBarPanel.getChildren();
        for(var btn = 0; btn < botones.length; btn++) {
            if(botones[btn] instanceof qx.ui.toolbar.ToolBarCheckBox) {
                if(botones[btn].getUserData("winId") != selected.getUserData("winId")) {
                    botones[btn].setChecked(false);
                }
            };
        };
    }
    catch(ex){this.debug("Could not update buttons in taskbar. Exeption: " + ex);};
};

/* Adds a qx.ui.window.Window to the taskbar 
    the current implementation doesnt check if there is a win with the same name.
    (I think we have to check this).
*/
proto.addWindow = function(win) {
    var tmpButton = new qx.ui.toolbar.ToolBarCheckBox(win.getCaption(), win.getIcon(), true);
    tmpButton.setUserData("winId", this._wins);
    win.setUserData("winId", this._wins++);
    tmpButton.addEventListener("changeChecked", function(e) {
        if(this.getChecked()) {
            win.restore();
            win.bringToFront();
            win.focus();
        }
        else {
            /*
                this is a hack so when we click anywhere outside the window it gets blurred ;)
            */
            win.blur();
        }
    });
    this._tBarPanel.add(tmpButton);
    this._updateButtons(tmpButton);
    win.addEventListener(qx.Const.EVENT_TYPE_DISAPPEAR, function(e) {
        tmpButton.setChecked(false);
    });
    win.addEventListener(qx.Const.EVENT_TYPE_BLUR, function(e) {
        tmpButton.setChecked(false);
    });
    win.addEventListener(qx.Const.EVENT_TYPE_FOCUS, function(e) {
        tmpButton.setChecked(true);
    });
};


/*
---------------------------------------------------------------------------
  DISPOSER
---------------------------------------------------------------------------
*/

proto.dispose = function()
{
  if (this.getDisposed()) {
    return;
  };

  return qx.ui.layout.HorizontalBoxLayout.prototype.dispose.call(this);
};