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
 * Dialog that offers the user a choice of alternative buttons to select from.
 */
qx.Class.define("qxl.dialog.Select", {
  extend: qxl.dialog.Dialog,
  properties: {
    /**
     * An array of maps [ { label: "Foo", icon : "icon/22/...", value : "foo" },...]
     */
    options: {
      check: "Array",
      nullable: false,
      event: "changeOptions",
    },
  },

  members: {
    /**
     * Create the main content of the widget
     */
    _createWidgetContent() {
      let container = this._createDialogContainer();
      this.add(container);
      let hbox = new qx.ui.container.Composite(new qx.ui.layout.HBox(10));
      container.add(hbox);
      this._message = new qx.ui.basic.Label();
      this._message.setRich(true);
      this._message.setWidth(200);
      this._message.setAllowStretchX(true);
      hbox.add(this._message, {
        flex: 1,
      });

      let buttonPane = this._createButtonPane();
      this.addListener(
        "changeOptions",
        function (event) {
          if (qx.core.Environment.get("module.objectid") === true) {
            buttonPane
              .getOwnedQxObjects()
              .map((obj) => buttonPane.removeOwnedQxObject(obj));
          }
          buttonPane.removeAll();
          let options = event.getData();
          options.forEach(function (option) {
            let button = new qx.ui.form.Button(option.label, option.icon);
            button.setAllowStretchX(true);
            let value = String(option.value);
            button.addListener(
              "execute",
              function () {
                this._handleSelection(value);
              },
              this
            );

            buttonPane.add(button);
            if (qx.core.Environment.get("module.objectid") === true) {
              button.setQxObjectId(value);
              buttonPane.addOwnedQxObject(button, value);
            }
          }, this);
          let cancelButton = this._createCancelButton();
          buttonPane.add(cancelButton);
        },
        this
      );

      container.add(buttonPane);
    },

    /**
     * Handle click on a button. Calls callback with
     * the value set in the options map.
     * @param value {var} The passed value
     */
    _handleSelection(value) {
      this.hide();
      if (this.getCallback()) {
        this.getCallback().call(this.getContext(), value);
      }
    },
  },
});
