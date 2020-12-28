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

qx.Class.define("qxl.dialog.formElement.RadioGroup",
{
  statics :
  {
    register : function() {
      qxl.dialog.Dialog.registerFormElementHandlers(
        "radiogroup", this._registration);
    },

    _registration : {
      initElement : function(fieldType, fieldData, key) {
        let formElement = new qx.ui.form.RadioGroup();
        if (fieldData.orientation) {
          formElement.setUserData("orientation", fieldData.orientation);
        }
        fieldData.options.forEach(function (item) {
          let radioButton = new qx.ui.form.RadioButton(item.label);
          radioButton.setUserData(
          "value",
          item.value !== undefined ? item.value : item.label
          );
          formElement.add(radioButton);
        }, this);
        return formElement;
      },

      addToFormController : function(fieldType, fieldData, key, formElement) {
        this._formController.addTarget(formElement, "selection", key, true, {
          converter: function (value) {
            let selectables = formElement.getSelectables();
            let selection = [];
            if (value) {
              selectables.forEach(function (selectable) {
                let sValue = selectable.getUserData("value");
                if (sValue === value) {
                  selection = [selectable];
                }
              }, this);
            }
            return selection;
          }.bind(this)
        }, {
          converter: function (selection) {
            let value = selection[0].getUserData("value");
            return value;
          }.bind(this)
        });
      }
    }
  }
});
