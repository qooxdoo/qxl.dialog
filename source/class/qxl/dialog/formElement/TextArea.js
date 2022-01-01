/* ************************************************************************

   qooxdoo dialog library
   https://github.com/qooxdoo/qxl.dialog

   Copyright:
     2020 Christian Boulanger, Derrell Lipman

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     *  Christian Boulanger (cboulanger)
     *  Derrell Lipman (derrell)

************************************************************************ */

qx.Class.define("qxl.dialog.formElement.TextArea", {
  statics: {
    register() {
      qxl.dialog.Dialog.registerFormElementHandlers(
        "textarea",
        this._registration
      );
    },

    _registration: {
      initElement(fieldType, fieldData, key) {
        let formElement = new qx.ui.form.TextArea();
        formElement.setHeight(fieldData.lines * 16);
        formElement.setLiveUpdate(true);
        return formElement;
      },

      addToFormController(fieldType, fieldData, key, formElement) {
        this._formController.addTarget(formElement, "value", key, true, null, {
          converter: function (value) {
            this._form.getValidationManager().validate();
            return value;
          }.bind(this),
        });
      },
    },
  },
});
