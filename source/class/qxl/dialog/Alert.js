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
 * A dialog that alerts the user to something.
 *
 */
qx.Class.define("qxl.dialog.Alert", {
  extend: qxl.dialog.Dialog,
  members: {
    /**
     * Create the main content of the widget
     */
    _createWidgetContent() {
      let container = this._createDialogContainer();
      this.add(container);
      let hbox = new qx.ui.container.Composite(new qx.ui.layout.HBox(10));
      container.add(hbox);
      this._image = new qx.ui.basic.Image(
        this.getImage() || "qxl.dialog.icon.info"
      ).set({
        scale: true,
        height: 32,
        width: 32,
      });

      hbox.add(this._image);
      this._message = new qx.ui.basic.Label();
      this._message.setRich(true);
      this._message.setWidth(200);
      this._message.setAllowStretchX(true);
      hbox.add(this._message, {
        flex: 1,
      });

      let buttonPane = this._createButtonPane();
      let okButton = this._createOkButton();
      buttonPane.add(okButton);
      container.add(buttonPane);
    },

    /**
     * @override
     */
    _handleEscape(e) {
      if (e.getKeyCode() === 27) {
        this._handleOk();
      }
    },
  },
});
