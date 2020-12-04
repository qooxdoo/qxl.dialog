/* ************************************************************************

   qooxdoo dialog library
   https://github.com/qooxdoo/qxl.dialog

   Copyright:
     2020 Derrell Lipman

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

************************************************************************ */

qx.Class.define("qxl.dialog.formElement.CheckBox",
{
  statics :
  {
    register : function() {
      qxl.dialog.Dialog.registerFormElementHandlers(
        "checkbox", this._registration);
    },

    _registration : {
      initElement : function(fieldType, fieldData, key) {
        let formElement = new qx.ui.form.CheckBox(fieldData.label);
        return formElement;
      },

      addToFormController : function(fieldType, fieldData, key, formElement) {
        this._formController.addTarget(formElement, "value", key, true, null);
      }
    }
  }
});
