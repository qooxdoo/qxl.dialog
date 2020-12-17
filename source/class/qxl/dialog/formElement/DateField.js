/* ************************************************************************

   qooxdoo dialog library
   https://github.com/qooxdoo/qxl.dialog

   Copyright:
     2020 Christian Boulanger, rDerrell Lipman

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

************************************************************************ */

/**
 * @asset(qx/icon/*)
*/
qx.Class.define("qxl.dialog.formElement.DateField",
{
  statics :
  {
    register : function() {
      qxl.dialog.Dialog.registerFormElementHandlers(
        "datefield", this._registration);
    },

    _registration : {
      initElement : function(fieldType, fieldData, key) {
        let formElement = new qx.ui.form.DateField();
        if (fieldData.dateFormat) {
          formElement.setDateFormat(fieldData.dateFormat);
        }
        return formElement;
      },

      addToFormController : function(fieldType, fieldData, key, formElement) {
        this._formController.addTarget(formElement, "value", key, true, null, {
          converter: function (value) {
            this._form.getValidationManager().validate();
            return value;
          }.bind(this)
        });
      }
    }
  }
});
