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

qx.Class.define("qxl.dialog.formElement.RadioGroup", {
  statics: {
    register() {
      qxl.dialog.Dialog.registerFormElementHandlers(
        "radiogroup",
        this._registration
      );
    },

    _registration: {
      initElement(fieldType, fieldData, key) {
        let layout; // default uses VBox
        if (fieldData.orientation == "horizontal") {
          layout = new qx.ui.layout.HBox(4);
        } else if (fieldData.layout) {
          layout = fieldData.layout;
        }
        let formElement = new qx.ui.form.RadioButtonGroup(layout);
        if (fieldData.orientation) {
          formElement.setUserData("orientation", fieldData.orientation);
        }
        fieldData.options.forEach(function (item, index) {
          let radioButton = new qx.ui.form.RadioButton(item.label);
          radioButton.setUserData(
            "value",
            item.value !== undefined ? item.value : item.label
          );

          if (index === 0 && "tabIndex" in item) {
            radioButton.setTabIndex(item.tabIndex);
          }
          formElement.add(radioButton);
        }, this);
        return formElement;
      },

      addToFormController(fieldType, fieldData, key, formElement) {
        this._formController.addTarget(
          formElement,
          "selection",
          key,
          true,
          {
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
            }.bind(this),
          },

          {
            converter(selection) {
              let value = selection[0].getUserData("value");
              return value;
            },
          }
        );
      },
    },
  },
});
