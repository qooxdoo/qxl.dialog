(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Theme": {
        "usage": "dynamic",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Andreas Ecker (ecker)
  
  ************************************************************************ */

  /**
   * Tango icons
   *
   * @asset(qx/icon/Tango/22/actions/dialog-cancel.png)
   * @asset(qx/icon/Tango/22/actions/dialog-ok.png)
   * @asset(qx/icon/Tango/48/status/dialog-information.png)
   * @asset(qx/icon/Tango/48/status/dialog-error.png)
   * @asset(qx/icon/Tango/48/status/dialog-warning.png)
   * @asset(qx/icon/Tango/16/apps/office-calendar.png)
   */
  qx.Theme.define("qxl.dialog.theme.icon.Tango", {
    title: "Tango",
    aliases: {
      "icon": "qx/icon/Tango",
      "qxl.dialog.icon.cancel": "qx/icon/Tango/22/actions/dialog-cancel.png",
      "qxl.dialog.icon.ok": "qx/icon/Tango/22/actions/dialog-ok.png",
      "qxl.dialog.icon.info": "qx/icon/Tango/48/status/dialog-information.png",
      "qxl.dialog.icon.error": "qx/icon/Tango/48/status/dialog-error.png",
      "qxl.dialog.icon.warning": "qx/icon/Tango/48/status/dialog-warning.png"
    }
  });
  qxl.dialog.theme.icon.Tango.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Tango.js.map?dt=1590417446629