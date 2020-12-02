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
 * Mixin that provides base functionality for Window and embedded dialog
 * @ignore(qxl.dialog.alert)
 * @ignore(qxl.dialog.error)
 * @ignore(qxl.dialog.warning)
 * @ignore(qxl.dialog.confirm)
 * @ignore(qxl.dialog.prompt)
 * @ignore(qxl.dialog.form)
 * @ignore(qxl.dialog.select)
 * @ignore(Promise)
 *
 */
qx.Mixin.define("qxl.dialog.MDialog", {
  statics: {
    /**
     * Returns a dialog instance by type
     * @param type {String} The dialog type to get
     * @return {qxl.dialog.Dialog}
     */
    getInstanceByType: function(type) {
      try {
        return new (qxl.dialog[qx.lang.String.firstUp(type)])();
      } catch (e) {
        throw new Error(type + " is not a valid dialog type");
      }
    }
  },

  properties: {
    /**
     * Callback function that will be called when the user
     * has interacted with the widget. See sample callback
     * method supplied in the source code of each dialog
     * widget.
     */
    callback: {
      check: "Function",
      nullable: true
    },

    /**
     * The context for the callback function
     */
    context: {
      check: "Object",
      nullable: true
    },

    /**
     * A banner image/logo that is displayed on the widget,
     * if applicable
     */
    image: {
      check: "String",
      nullable: true,
      apply: "_applyImage"
    },

    /**
     * The message that is displayed
     */
    message: {
      check: "String",
      nullable: true,
      apply: "_applyMessage"
    },

    /**
     * Whether to allow cancelling the dialog
     */
    allowCancel: {
      check: "Boolean",
      init: true,
      event: "changeAllowCancel"
    },

    /**
     * Whether to triger the cancel button on pressing the "escape" key
     * (default: true). Depends on the 'allowCancel' property.
     */
    cancelOnEscape: {
      check: "Boolean",
      init: true
    }
  },

  events: {
    /**
     * Dispatched when user clicks on the "OK" Button
     * @type {String}
     */
    ok: "qx.event.type.Event",

    /**
     * Dispatched when user clicks on the "Cancel" Button
     * @type {String}
     */
    cancel: "qx.event.type.Event"
  },

  members: {
    /**
     * The container widget
     * @var {qx.ui.container.Composite}
     */
    _container: null,

    /**
     * The button pane
     * @var {qx.ui.basic.Label}
     */
    _buttons: null,

    /**
     * The dialog image
     * @var {qx.ui.basic.Image}
     */
    _image: null,

    /**
     * The dialog message
     * @var {qx.ui.basic.Label}
     */
    _message: null,

    /**
     * The OK Button
     * @var {qx.ui.form.Button}
     */
    _okButton: null,

    /**
     * The cancel button
     * @var {qx.ui.form.Button}
     */
    _cancelButton: null,

    /**
     * Create the content of the qxl.dialog.
     * Extending classes must implement this method.
     */
    _createWidgetContent: function(properties) {
      this.error("_createWidgetContent not implemented!");
    },

    /**
     * Creates the default container (VBox)
     * @return {qx.ui.container.Composite}
     */
    _createDialogContainer: function() {
      this._container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
      return this._container;
    },

    /**
     * Creates the button pane (HBox)
     * @return {qx.ui.container.Composite}
     */
    _createButtonPane: function() {
      let buttons = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
      buttons.getLayout().setAlignX("center");
      if (qx.core.Environment.get("module.objectid") === true) {
        buttons.setQxObjectId("buttons");
        this.addOwnedQxObject(buttons);
      }
      return buttons;
    },

    /**
     * Create an OK button
     * @return {qx.ui.form.Button}
     */
    _createOkButton: function(noFocus=false) {
      let okButton = (this._okButton = new qx.ui.form.Button(this.tr("OK")));
      okButton.setIcon("qxl.dialog.icon.ok");
      okButton.getChildControl("icon").set({
        width: 16,
        height: 16,
        scale: true
      });
      okButton.setAllowStretchX(false);
      okButton.addListener("execute", this._handleOk, this);
      if (!noFocus) {
        this.addListener("appear", () => okButton.focus());
      }
      if (qx.core.Environment.get("module.objectid") === true) {
        okButton.setQxObjectId("ok");
        this.getQxObject("buttons").addOwnedQxObject(okButton);
      }
      return okButton;
    },

    /**
     * Create a cancel button, which is hidden by default and will be shown
     * if allowCancel property is set to true.
     * @return {qx.ui.form.Button}
     */
    _createCancelButton: function() {
      let cancelButton = (this._cancelButton = new qx.ui.form.Button(
        this.tr("Cancel")
      ));
      cancelButton.setAllowStretchX(false);
      cancelButton.setIcon("qxl.dialog.icon.cancel");
      cancelButton.getChildControl("icon").set({
        width: 16,
        height: 16,
        scale: true
      });
      cancelButton.addListener("execute", this._handleCancel, this);
      this.bind("allowCancel", cancelButton, "visibility", {
        converter: function(value) {
          return value ? "visible" : "excluded";
        }
      });
      if (qx.core.Environment.get("module.objectid") === true) {
        cancelButton.setQxObjectId("cancel");
        this.getQxObject("buttons").addOwnedQxObject(cancelButton);
      }
      return cancelButton;
    },

    /**
     * Called when the 'image' property is set
     * @param value {String} The current value
     * @param old {String|null} old The previous value
     * @return {void}
     */
    _applyImage: function(value, old) {
      this._image.setSource(value);
      this._image.setVisibility(value ? "visible" : "excluded");
    },

    /**
     * Called when the 'message' property is set
     * @param value {String} The current value
     * @param old {String|null} old The previous value
     * @return {void}
     */
    _applyMessage: function(value, old) {
      this._message.setValue(value);
      this._message.setVisibility(value ? "visible" : "excluded");
    },

    /**
     * Returns the widgets that is the container of the dialog
     * @return {qx.ui.core.LayoutItem}
     */
    getDialogContainer: function() {
      if (!this._container) {
        return this._createDialogContainer();
      }
      return this._container;
    },

    /**
     * Promise interface method, avoids callbacks
     * @return {Promise} A promise that resolves with the result of the dialog
     * action
     */
    promise: function() {
      return new Promise(function(resolve, reject) {
        this.setCallback(function(value) {
          this.resetCallback();
          resolve(value);
        }.bind(this));
      }.bind(this));
    },

    /**
     * Handle click on ok button. Calls callback with a "true" argument
     */
    _handleOk: function() {
      this.hide();
      this.fireEvent("ok");
      if (this.getCallback()) {
        this.getCallback().call(this.getContext(), true);
      }
      this.resetCallback();
    },

    /**
     * Handle click on cancel button. Calls callback with
     * an "undefined" argument
     */
    _handleCancel: function() {
      this.hide();
      this.fireEvent("cancel");
      if (this.isAllowCancel() && this.getCallback()) {
        this.getCallback().call(this.getContext());
      }
      this.resetCallback();
    },

    /**
     * Handles the press on the 'Escape' key
     * @param  e {qx.event.type.KeyInput}
     */
    _handleEscape: function(e) {
      if (this.isCancelOnEscape() && e.getKeyCode() === 27 && this.getContentElement() && this.isSeeable()) {
        this._handleCancel();
      }
    }
  }
});
