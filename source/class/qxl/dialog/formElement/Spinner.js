/* ************************************************************************

   qooxdoo dialog library
   https://github.com/qooxdoo/qxl.dialog

   Copyright:
     2020 Christian Boulanger, Derrell Lipman

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

************************************************************************ */

qx.Class.define("qxl.dialog.formElement.Spinner",
{
  statics :
  {
    register : function() {
      qxl.dialog.Dialog.registerFormElementHandlers(
        "spinner", this._registration);
    },

    _registration : {
      initElement : function(fieldType, fieldData, key) {
        let formElement = new qx.ui.form.Spinner();
        if (fieldData.min) {
          formElement.setMinimum(fieldData.min);
        }
        if (fieldData.max) {
          formElement.setMaximum(fieldData.max);
        }
        if (fieldData.step) {
          formElement.setSingleStep(fieldData.step);
        }
        if (fieldData.fractionsDigits) {
          let fd = fieldData.fractionsDigits;
          let nf = new qx.util.format.NumberFormat();
          if (fd.min) {
            nf.setMinimumFractionDigits(fd.min);
          }
          if (fd.max) {
            nf.setMaximumFractionDigits(fd.max);
          }
          formElement.setNumberFormat(nf);
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
