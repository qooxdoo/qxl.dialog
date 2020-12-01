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
qx.Class.define("qxl.dialog.DialogEmbed", {
  extend: qx.ui.container.Composite,
  include: [ qxl.dialog.MDialog ],
  
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
  construct: function(properties) {
    this.base(arguments);
    this.setLayout(new qx.ui.layout.Grow());
    this._createWidgetContent();

    // set properties from constructor param
    if (typeof properties == "object") {
      this.set(properties);
    } else if (typeof properties == "string") {
      this.setMessage(properties);
    }
    // escape key
    qx.core.Init.getApplication().getRoot().addListener("keyup", this._handleEscape, this);
  },

  statics :
  {
    /**
     * Shortcut for form dialog. Cannot be reused.
     * @param message {String} The message to display
     * @param formData {Map} Map of form data. See {@link qxl.dialog.Form.formData}
     * @param callback {Function?} The callback function
     * @param context {Object?} The context to use with the callback function
     * @param caption {String?} The caption of the dialog window
     * @return {qxl.dialog.Form} The widget instance
     */
    form: function(message, formData, callback=null, context=null, caption="") {
      qx.core.Assert.assertMap(formData);
      return new qxl.dialog.FormEmbed({message, formData, allowCancel: true, callback, context});
    }
  }
});
