function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.container.Composite": {
        "construct": true,
        "require": true
      },
      "qxl.dialog.MDialog": {
        "require": true
      },
      "qx.ui.layout.Grow": {
        "construct": true
      },
      "qx.core.Init": {
        "construct": true
      },
      "qx.core.Assert": {},
      "qxl.dialog.FormEmbed": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo dialog library
     https://github.com/qooxdoo/qxl.dialog
  
     Copyright:
       2007-2019 Christian Boulanger and others
  
     License:
       LGPL: http://www.gnu.org/licenses/lgpl.html
       EPL: http://www.eclipse.org/org/documents/epl-v10.php
       See the LICENSE file in the project's top-level directory for details.
  
  ************************************************************************ */

  /**
   * Base class for dialog widgets
   * @ignore(qxl.dialog.alert)
   * @ignore(qxl.dialog.error)
   * @ignore(qxl.dialog.warning)
   * @ignore(qxl.dialog.confirm)
   * @ignore(qxl.dialog.prompt)
   * @ignore(qxl.dialog.form)
   * @ignore(qxl.dialog.select)
   * @ignore(Promise)
   *
   */
  qx.Class.define("qxl.dialog.DialogEmbed", _defineProperty({
    extend: qx.ui.container.Composite,
    include: [qxl.dialog.MDialog],
    statics: {
      /**
       * Returns a dialog instance by type
       * @param type {String} The dialog type to get
       * @return {qxl.dialog.Dialog}
       */
      getInstanceByType: qxl.dialog.MDialog.getInstanceByType
    },

    /**
     * Constructor
     * @param properties {Map|String|undefined} If you supply a map, all the
     * corresponding properties will be set. If a string is given, use it
     * as to set the 'message' property.
     */
    construct: function construct(properties) {
      qx.ui.container.Composite.constructor.call(this);
      this.setLayout(new qx.ui.layout.Grow());

      this._createWidgetContent(properties); // set properties from constructor param


      if (_typeof(properties) == "object") {
        this.set(properties);
      } else if (typeof properties == "string") {
        this.setMessage(properties);
      } // escape key


      qx.core.Init.getApplication().getRoot().addListener("keyup", this._handleEscape, this);
    }
  }, "statics", {
    /**
     * Shortcut for form dialog. Cannot be reused.
     * @param message {String} The message to display
     * @param formData {Map} Map of form data. See {@link qxl.dialog.Form.formData}
     * @param callback {Function?} The callback function
     * @param context {Object?} The context to use with the callback function
     * @param caption {String?} The caption of the dialog window
     * @return {qxl.dialog.Form} The widget instance
     */
    form: function form(message, formData) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var caption = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
      qx.core.Assert.assertMap(formData);
      return new qxl.dialog.FormEmbed({
        message: message,
        formData: formData,
        allowCancel: true,
        callback: callback,
        context: context
      });
    }
  }));
  qxl.dialog.DialogEmbed.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=DialogEmbed.js.map?dt=1608478942459