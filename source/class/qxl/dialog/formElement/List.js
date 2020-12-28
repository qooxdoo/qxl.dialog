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

qx.Class.define("qxl.dialog.formElement.List",
{
  statics :
  {
    register : function() {
      qxl.dialog.Dialog.registerFormElementHandlers(
        "list", this._registration);
    },

    _registration : {
      initElement : function(fieldType, fieldData, key) {
        let formElement = new qx.ui.form.List();
        if (fieldData.selectionMode)
        {
          formElement.setSelectionMode(fieldData.selectionMode);
        }
        if (fieldData.dragSelection)
        {
          var mode = formElement.getSelectionMode();
          if (mode == "single" || mode == "one")
          {
            this.debug("Drag selection not available in " + mode);
          }
          else
          {
            formElement.setDragSelection(fieldData.dragSelection);
          }
        }
        let model = qx.data.marshal.Json.createModel( fieldData.options );
        new qx.data.controller.List( model, formElement, "label");
        return formElement;
      },

      addToFormController : function(fieldType, fieldData, key, formElement) {
      this._formController.addTarget(
        formElement, "selection", key, true, {
          "converter" : function( value ) {
            var selected=[];
            var selectables = formElement.getSelectables();
            selectables.forEach( function( selectable ) {
              if ((value instanceof Array ||
                   value instanceof qx.data.Array) &&
                  value.includes(selectable.getModel().getValue())) {
                selected.push(selectable);
              }
            });

            return selected;
          }.bind(this)
        },{
          "converter" : function(selection) {
            var value = [];
            selection.forEach( function ( selected ) {
              value.push(selected.getModel().getValue());
            });
            return value;
          }.bind(this)
        });
      }
    }
  }
});
