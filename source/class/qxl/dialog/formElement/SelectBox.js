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

qx.Class.define("qxl.dialog.formElement.SelectBox",
{
  statics :
  {
    register : function() {
      qxl.dialog.Dialog.registerFormElementHandlers(
        "selectbox", this._registration);
    },

    _registration : {
      initElement : function(fieldType, fieldData, key) {
        let formElement = new qx.ui.form.SelectBox();
        let model = qx.data.marshal.Json.createModel(fieldData.options);
        new qx.data.controller.List(model, formElement, "label");
        return formElement;
      },

      addToFormController : function(fieldType, fieldData, key, formElement) {
        this._formController.addTarget(formElement, "selection", key, true, {
          converter: function (value) {
            let selected = null;
            let selectables = formElement.getSelectables();
            selectables.forEach(function (selectable) {
              if (selectable.getModel().getValue() === value) {
                selected = selectable;
              }
            }, this);
            if (!selected) {
              return [selectables[0]];
            }
            return [selected];
          }.bind(this)
        }, {
          converter: function (selection) {
            let value = selection[0].getModel().getValue();
            return value;
          }.bind(this)
        });
      }
    }
  }
});
