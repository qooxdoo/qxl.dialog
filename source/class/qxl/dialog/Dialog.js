/* ************************************************************************

   qooxdoo dialog library
   https://github.com/qooxdoo/qxl.dialog

   Copyright:
     2007-2020 Christian Boulanger and others

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     *  Christian Boulanger (cboulanger)
     *  Derrell Lipman (derrell)

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
  include: [qxl.dialog.MDialog],

  statics: {
    /**
     * for backwards-compability
     * @type {Boolean}
     */
    __useBlocker: false,

    /**
     * Enforce the use of a coloured blocker.
     * Added for backwards-compability with pre-1.2 versions
     * @param  value {Boolean}
     * @return {void}
     */
    useBlocker(value) {
      qxl.dialog.Dialog.__useBlocker = value;
    },

    /**
     * Returns a dialog instance by type
     * @param type {String} The dialog type to get
     * @return {qxl.dialog.Dialog}
     */
    getInstanceByType: qxl.dialog.MDialog.getInstanceByType,

    /**
     * Shortcut for alert dialog
     * @param message {String} The message to display
     * @param callback {Function?} The callback function
     * @param context {Object?} The context to use with the callback function
     * @param caption {String?} The caption of the dialog window
     * @return {qxl.dialog.Alert} The widget instance
     */
    alert(message = "", callback = null, context = null, caption = "") {
      return new qxl.dialog.Alert({
        message,
        callback,
        context,
        caption,
        image: "qxl.dialog.icon.info",
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
    error(message = "", callback = null, context = null, caption = "") {
      return new qxl.dialog.Alert({
        message,
        callback,
        context,
        caption,
        image: "qxl.dialog.icon.error",
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
    warning(message = "", callback = null, context = null, caption = "") {
      return new qxl.dialog.Alert({
        message,
        callback,
        context,
        caption,
        image: "qxl.dialog.icon.warning",
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
    confirm(message = "", callback = null, context = null, caption = "") {
      return new qxl.dialog.Confirm({
        message,
        callback,
        context,
        caption,
      }).show();
    },

    /**
     * Shortcut for prompt dialog
     * @param message {String} The message to display
     * @param callback {Function} The callback function
     * @param context {Object} The context to use with the callback function
     * @param value {String} The default value of the prompt textfield
     * @param caption {String?} The caption of the dialog window
     * @return {qxl.dialog.Prompt} The widget instance
     *
     */
    prompt(
      message = "",
      callback = null,
      context = null,
      value = "",
      caption = ""
    ) {
      return new qxl.dialog.Prompt({
        message,
        callback,
        context,
        value,
        caption,
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
    select(
      message = "",
      options = null,
      callback = null,
      context = null,
      allowCancel = true,
      caption = ""
    ) {
      let defaultOptions = [
        { label: qx.core.Init.getApplication().tr("Yes"), value: true },
        { label: qx.core.Init.getApplication().tr("No"), value: false },
      ];

      return new qxl.dialog.Select({
        message,
        allowCancel,
        options: options || defaultOptions,
        callback,
        context,
        caption,
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
    form(message, formData, callback = null, context = null, caption = "") {
      qx.core.Assert.assertMap(formData);
      return new qxl.dialog.Form({
        message,
        formData,
        allowCancel: true,
        callback,
        context,
        caption,
      }).show();
    },

    // ease use for form element writers
    registerFormElementHandlers: qxl.dialog.MForm.registerFormElementHandlers,
  },

  /**
   * Constructor
   * @param properties {Map|String|undefined} If you supply a map, all the
   * corresponding properties will be set. If a string is given, use it
   * as to set the 'message' property.
   */
  construct(properties) {
    this.base(arguments);
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
      showStatusbar: false,
    });

    this.setLayout(new qx.ui.layout.Grow());
    let root = qx.core.Init.getApplication().getRoot();
    root.add(this);
    // use blocker (for backwards-compability)
    this.__blocker = new qx.ui.core.Blocker(root);
    this.__blocker.setOpacity(this.getBlockerOpacity());
    this.__blocker.setColor(this.getBlockerColor());
    // handle focus
    qx.ui.core.FocusHandler.getInstance().addRoot(this);
    // resize the window when viewport size changes
    this.addListener("resize", this.center, this);
    root.addListener("resize", this.center, this);
    this._createWidgetContent(properties);
    // set properties from constructor param
    if (typeof properties == "object") {
      this.set(properties);
    } else if (typeof properties == "string") {
      this.setMessage(properties);
    }
    // escape key
    root.addListener("keyup", this._handleEscape, this);
  },

  properties: {
    /**
     * Whether the dialog is shown. If true, call the show() method. If false,
     * call the hide() method.
     */
    show: {
      check: "Boolean",
      nullable: true,
      event: "changeShow",
      apply: "_applyShow",
    },

    /**
     * Whether to block the ui while the widget is displayed
     */
    useBlocker: {
      check: "Boolean",
      init: false,
    },

    /**
     * The blocker's color
     */
    blockerColor: {
      check: "String",
      init: "black",
    },

    /**
     * The blocker's opacity
     */
    blockerOpacity: {
      check: "Number",
      init: 0.5,
    },
  },

  members: {
    /**
     * A reference to the widget that previously had the focus
     */
    __previousFocus: null,

    /**
     * Show the widget. Overriding methods must call this parent method.
     * Returns the widget instance for chaining.
     * @return {this} The widget instance
     */
    show() {
      if (this.isUseBlocker() || qxl.dialog.Dialog.__useBlocker) {
        // make sure the dialog is above any opened window
        let root = qx.core.Init.getApplication().getRoot();
        let maxWindowZIndex = root.getZIndex();
        let windows = root.getWindows();
        for (let i = 0; i < windows.length; i++) {
          let zIndex = windows[i].getZIndex();
          maxWindowZIndex = Math.max(maxWindowZIndex, zIndex);
        }
        this.setZIndex(maxWindowZIndex + 1);
        this.__blocker.blockContent(maxWindowZIndex);
      }
      this.setVisibility("visible");
      this.__previousFocus =
        qx.ui.core.FocusHandler.getInstance().getActiveWidget();
      if (this.__previousFocus) {
        try {
          this.__previousFocus.blur();
        } catch (e) {}
        //this.__previousFocus.setFocusable(false);
      }
      return this;
    },

    /**
     * Hide the widget. Overriding methods must call this parent method.
     * Returns the widget instance for chaining.
     * @return {qxl.dialog.Dialog} The widget instance
     */
    hide() {
      if (this.isUseBlocker() || qxl.dialog.Dialog.__useBlocker) {
        this.__blocker.unblock();
      }
      if (this.__previousFocus) {
        try {
          //this.__previousFocus.setFocusable(true);
          this.__previousFocus.focus();
        } catch (e) {}
      }
      this.setVisibility("hidden");
      return this;
    },
  },

  /*
  ***********************************************
    DESTRUCTOR
  ***********************************************
  */
  destruct() {
    let root = qx.core.Init.getApplication().getRoot();
    root.removeListener("resize", this.center, this);
    root.removeListener("keyup", this._handleEscape, this);
  },
});
