(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qxl.dialog.DialogEmbed": {
        "require": true
      },
      "qxl.dialog.MForm": {
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo dialog library
     https://github.com/qooxdoo/qxl.dialog
  
     Copyright:
       2007-2018 Christian Boulanger and others
  
     License:
       LGPL: http://www.gnu.org/licenses/lgpl.html
       EPL: http://www.eclipse.org/org/documents/epl-v10.php
       See the LICENSE file in the project's top-level directory for details.
  
  ************************************************************************ */

  /**
   * A dialog with a form that is constructed on-the-fly
   */
  qx.Class.define("qxl.dialog.FormEmbed", {
    extend: qxl.dialog.DialogEmbed,
    include: [qxl.dialog.MForm],
    members: {
      /**
       * Create OK Button
       * unlike our superclass, we do not add an appear listener to focus OK
       * @override
       * @return {qx.ui.form.Button}
       */
      _createOkButton: function _createOkButton() {
        return qxl.dialog.FormEmbed.prototype._createOkButton.base.call(this, true);
      }
    }
  });
  qxl.dialog.FormEmbed.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=FormEmbed.js.map?dt=1607441432745