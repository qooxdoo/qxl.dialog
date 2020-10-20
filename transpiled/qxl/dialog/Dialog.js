function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.window.Window": {
        "construct": true,
        "require": true
      },
      "qx.lang.String": {},
      "qxl.dialog.Alert": {},
      "qxl.dialog.Confirm": {},
      "qxl.dialog.Prompt": {},
      "qx.core.Init": {
        "construct": true
      },
      "qxl.dialog.Select": {},
      "qx.core.Assert": {},
      "qxl.dialog.Form": {},
      "qx.ui.layout.Grow": {
        "construct": true
      },
      "qx.ui.core.Blocker": {
        "construct": true
      },
      "qx.ui.core.FocusHandler": {
        "construct": true
      },
      "qx.bom.Document": {
        "construct": true
      },
      "qx.ui.container.Composite": {},
      "qx.ui.layout.VBox": {},
      "qx.ui.layout.HBox": {},
      "qx.ui.form.Button": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

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
   * Base class for dialog widgets
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
  qx.Class.define("qxl.dialog.Dialog", {
    extend: qx.ui.window.Window,
    statics: {
      /**
       * for backwards-compability
       * @type {Boolean}
       */
      __P_427_0: false,

      /**
       * Enforce the use of a coloured blocker.
       * Added for backwards-compability with pre-1.2 versions
       * @param  value {Boolean}
       * @return {void}
       */
      useBlocker: function useBlocker(value) {
        qxl.dialog.Dialog.__P_427_0 = value;
      },

      /**
       * Returns a dialog instance by type
       * @param type {String} The dialog type to get
       * @return {qxl.dialog.Dialog}
       */
      getInstanceByType: function getInstanceByType(type) {
        try {
          return new qxl.dialog[qx.lang.String.firstUp(type)]();
        } catch (e) {
          throw new Error(type + " is not a valid dialog type");
        }
      },

      /**
       * Shortcut for alert dialog
       * @param message {String} The message to display
       * @param callback {Function?} The callback function
       * @param context {Object?} The context to use with the callback function
       * @param caption {String?} The caption of the dialog window
       * @return {qxl.dialog.Alert} The widget instance
       */
      alert: function alert() {
        var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var caption = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
        return new qxl.dialog.Alert({
          message: message,
          callback: callback,
          context: context,
          caption: caption,
          image: "qxl.dialog.icon.info"
        }).show();
      },

      /**
       * Shortcut for error dialog
       * @param message {String} The message to display
       * @param callback {Function?} The callback function
       * @param context {Object?} The context to use with the callback function
       * @param caption {String?} The caption of the dialog window
       * @return {qxl.dialog.Alert} The widget instance
       */
      error: function error() {
        var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var caption = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
        return new qxl.dialog.Alert({
          message: message,
          callback: callback,
          context: context,
          caption: caption,
          image: "qxl.dialog.icon.error"
        }).show();
      },

      /**
       * Shortcut for warning dialog
       * @param message {String} The message to display
       * @param callback {Function?} The callback function
       * @param context {Object?} The context to use with the callback function
       * @param caption {String?} The caption of the dialog window
       * @return {qxl.dialog.Alert} The widget instance
       */
      warning: function warning() {
        var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var caption = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
        return new qxl.dialog.Alert({
          message: message,
          callback: callback,
          context: context,
          caption: caption,
          image: "qxl.dialog.icon.warning"
        }).show();
      },

      /**
       * Shortcut for confirm dialog
       * @param message {String} The message to display
       * @param callback {Function?} The callback function
       * @param context {Object?} The context to use with the callback function
       * @param caption {String?} The caption of the dialog window
       * @return {qxl.dialog.Confirm} The widget instance
       */
      confirm: function confirm() {
        var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var caption = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
        return new qxl.dialog.Confirm({
          message: message,
          callback: callback,
          context: context,
          caption: caption
        }).show();
      },

      /**
       * Shortcut for prompt dialog
       * @param caption {String} The caption of the dialog window
       * @param message {String} The message to display
       * @param callback {Function} The callback function
       * @param context {Object} The context to use with the callback function
       * @param value {String} The default value of the prompt textfield
       * @param caption {String?} The caption of the dialog window
       * @return {qxl.dialog.Prompt} The widget instance
       *
       */
      prompt: function prompt() {
        var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var value = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
        var caption = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
        return new qxl.dialog.Prompt({
          message: message,
          callback: callback,
          context: context,
          value: value,
          caption: caption
        }).show();
      },

      /**
       * Shortcut for select dialog
       * @param message {String} The message to display
       * @param options {Array?} Options to select from. If omitted, "Yes" (true) or "No" (false) will be used.
       * @param callback {Function?} The callback function
       * @param context {Object?} The context to use with the callback function
       * @param allowCancel {Boolean?} Default: true. If the cancel button is pressed, the result value will be undefined.
       * @param caption {String?} The caption of the dialog window
       * @return {qxl.dialog.Select} The widget instance
       */
      select: function select() {
        var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var allowCancel = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
        var caption = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";
        var defaultOptions = [{
          label: qx.core.Init.getApplication().tr("Yes"),
          value: true
        }, {
          label: qx.core.Init.getApplication().tr("No"),
          value: false
        }];
        return new qxl.dialog.Select({
          message: message,
          allowCancel: allowCancel,
          options: options || defaultOptions,
          callback: callback,
          context: context,
          caption: caption
        }).show();
      },

      /**
       * Shortcut for form dialog. Cannot be reused.
       * @param message {String} The message to display
       * @param formData {Map} Map of form data. See {@link qxl.dialog.Form.formData}
       * @param callback {Function?} The callback function
       * @param context {Object?} The context to use with the callback function
       * @param caption {String?} The caption of the dialog window
       * @return {qxl.dialog.Form} The widget instance
       */
      form: function form(message, formData) {
        var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var caption = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
        qx.core.Assert.assertMap(formData);
        return new qxl.dialog.Form({
          message: message,
          formData: formData,
          allowCancel: true,
          callback: callback,
          context: context,
          caption: caption
        }).show();
      }
    },

    /**
     * Constructor
     * @param properties {Map|String|undefined} If you supply a map, all the
     * corresponding properties will be set. If a string is given, use it
     * as to set the 'message' property.
     */
    construct: function construct(properties) {
      var _this = this;

      qx.ui.window.Window.constructor.call(this);
      this.set({
        visibility: "hidden",
        allowClose: false,
        allowMaximize: false,
        allowMinimize: false,
        alwaysOnTop: true,
        modal: true,
        movable: false,
        resizable: false,
        showClose: false,
        showMaximize: false,
        showMinimize: false,
        showStatusbar: false
      });
      this.setLayout(new qx.ui.layout.Grow());
      var root = qx.core.Init.getApplication().getRoot();
      root.add(this); // use blocker (for backwards-compability)

      this.__P_427_1 = new qx.ui.core.Blocker(root);

      this.__P_427_1.setOpacity(this.getBlockerOpacity());

      this.__P_427_1.setColor(this.getBlockerColor()); // handle focus


      qx.ui.core.FocusHandler.getInstance().addRoot(this); // resize the window when viewport size changes

      root.addListener("resize", function () {
        var bounds = _this.getBounds();

        _this.set({
          marginTop: Math.round((qx.bom.Document.getHeight() - bounds.height) / 2),
          marginLeft: Math.round((qx.bom.Document.getWidth() - bounds.width) / 2)
        });
      });
      this.addListener("appear", function () {
        var bounds = _this.getBounds();

        _this.set({
          marginTop: Math.round((qx.bom.Document.getHeight() - bounds.height) / 2),
          marginLeft: Math.round((qx.bom.Document.getWidth() - bounds.width) / 2)
        });
      });

      this._createWidgetContent(); // set properties from constructor param


      if (_typeof(properties) == "object") {
        this.set(properties);
      } else if (typeof properties == "string") {
        this.setMessage(properties);
      } // escape key


      qx.core.Init.getApplication().getRoot().addListener("keyup", this._handleEscape, this);
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
      },

      /**
       * Whether the dialog is shown. If true, call the show() method. If false,
       * call the hide() method.
       */
      show: {
        check: "Boolean",
        nullable: true,
        event: "changeShow",
        apply: "_applyShow"
      },

      /**
      * Whether to block the ui while the widget is displayed
      */
      useBlocker: {
        check: "Boolean",
        init: false
      },

      /**
      * The blocker's color
      */
      blockerColor: {
        check: "String",
        init: "black"
      },

      /**
      * The blocker's opacity
      */
      blockerOpacity: {
        check: "Number",
        init: 0.5
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
       * A reference to the widget that previously had the focus
       */
      __P_427_2: null,

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
      _createWidgetContent: function _createWidgetContent() {
        this.error("_createWidgetContent not implemented!");
      },

      /**
       * Creates the default container (VBox)
       * @return {qx.ui.container.Composite}
       */
      _createDialogContainer: function _createDialogContainer() {
        this._container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
        return this._container;
      },

      /**
       * Creates the button pane (HBox)
       * @return {qx.ui.container.Composite}
       */
      _createButtonPane: function _createButtonPane() {
        var buttons = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
        buttons.getLayout().setAlignX("center");
        {
          buttons.setQxObjectId("buttons");
          this.addOwnedQxObject(buttons);
        }
        return buttons;
      },

      /**
       * Create an OK button
       * @return {qx.ui.form.Button}
       */
      _createOkButton: function _createOkButton() {
        var noFocus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var okButton = this._okButton = new qx.ui.form.Button(this.tr("OK"));
        okButton.setIcon("qxl.dialog.icon.ok");
        okButton.getChildControl("icon").set({
          width: 16,
          height: 16,
          scale: true
        });
        okButton.setAllowStretchX(false);
        okButton.addListener("execute", this._handleOk, this);

        if (!noFocus) {
          this.addListener("appear", function () {
            return okButton.focus();
          });
        }

        {
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
      _createCancelButton: function _createCancelButton() {
        var cancelButton = this._cancelButton = new qx.ui.form.Button(this.tr("Cancel"));
        cancelButton.setAllowStretchX(false);
        cancelButton.setIcon("qxl.dialog.icon.cancel");
        cancelButton.getChildControl("icon").set({
          width: 16,
          height: 16,
          scale: true
        });
        cancelButton.addListener("execute", this._handleCancel, this);
        this.bind("allowCancel", cancelButton, "visibility", {
          converter: function converter(value) {
            return value ? "visible" : "excluded";
          }
        });
        {
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
      _applyImage: function _applyImage(value, old) {
        this._image.setSource(value);

        this._image.setVisibility(value ? "visible" : "excluded");
      },

      /**
       * Called when the 'message' property is set
       * @param value {String} The current value
       * @param old {String|null} old The previous value
       * @return {void}
       */
      _applyMessage: function _applyMessage(value, old) {
        this._message.setValue(value);

        this._message.setVisibility(value ? "visible" : "excluded");
      },

      /**
       * Returns the widgets that is the container of the dialog
       * @return {qx.ui.core.LayoutItem}
       */
      getDialogContainer: function getDialogContainer() {
        if (!this._container) {
          return this._createDialogContainer();
        }

        return this._container;
      },

      /**
       * Show the widget. Overriding methods must call this parent method.
       * Returns the widget instance for chaining.
       * @return {this} The widget instance
       */
      show: function show() {
        if (this.isUseBlocker() || qxl.dialog.Dialog.__P_427_0) {
          // make sure the dialog is above any opened window
          var root = qx.core.Init.getApplication().getRoot();
          var maxWindowZIndex = root.getZIndex();
          var windows = root.getWindows();

          for (var i = 0; i < windows.length; i++) {
            var zIndex = windows[i].getZIndex();
            maxWindowZIndex = Math.max(maxWindowZIndex, zIndex);
          }

          this.setZIndex(maxWindowZIndex + 1);

          this.__P_427_1.blockContent(maxWindowZIndex);
        }

        this.setVisibility("visible");
        this.__P_427_2 = qx.ui.core.FocusHandler.getInstance().getActiveWidget();

        if (this.__P_427_2) {
          try {
            this.__P_427_2.blur();
          } catch (e) {} //this.__previousFocus.setFocusable(false);

        }

        return this;
      },

      /**
       * Hide the widget. Overriding methods must call this parent method.
       * Returns the widget instance for chaining.
       * @return {qxl.dialog.Dialog} The widget instance
       */
      hide: function hide() {
        if (this.isUseBlocker() || qxl.dialog.Dialog.__P_427_0) {
          this.__P_427_1.unblock();
        }

        if (this.__P_427_2) {
          try {
            //this.__previousFocus.setFocusable(true);
            this.__P_427_2.focus();
          } catch (e) {}
        }

        this.setVisibility("hidden");
        return this;
      },

      /**
       * Promise interface method, avoids callbacks
       * @return {Promise} A promise that resolves with the result of the dialog
       * action
       */
      promise: function promise() {
        return new Promise(function (resolve, reject) {
          this.setCallback(function (value) {
            this.resetCallback();
            resolve(value);
          }.bind(this));
        }.bind(this));
      },

      /**
       * Handle click on ok button. Calls callback with a "true" argument
       */
      _handleOk: function _handleOk() {
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
      _handleCancel: function _handleCancel() {
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
      _handleEscape: function _handleEscape(e) {
        if (this.isCancelOnEscape() && e.getKeyCode() === 27 && this.getContentElement() && this.isSeeable()) {
          this._handleCancel();
        }
      }
    }
  });
  qxl.dialog.Dialog.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Dialog.js.map?dt=1603197629971