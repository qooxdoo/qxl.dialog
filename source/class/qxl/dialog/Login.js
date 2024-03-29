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
 * A dialog for authentication and login.
 *
 * The "callback" property containing a function is used as an (optional) final
 * callback after authentication has take place. This final callback will be
 * called with an truthy value as first argument (the error message/object) if
 * authentication has FAILED or with a falsy value (null/undefined) as first
 * argument, plus with a second optional argument (that can contain user
 * information) if it was SUCCESSFUL. The authenticating function must now be
 * stored in the checkCredentials property.
 */
qx.Class.define("qxl.dialog.Login", {
  extend: qxl.dialog.Dialog,
  properties: {
    /**
     * A html text that is displayed below the image (if present) and above the
     * login
     */
    text: {
      check: "String",
      nullable: true,
      apply: "_applyText",
    },

    /**
     * The name of the font in the theme that should be applied to
     * the text
     */
    textFont: {
      check: "String",
      nullable: true,
      init: "bold",
      apply: "_applyTextFont",
    },

    /**
     * An asyncronous function to check the given credentials.
     * The function signature is (username, password, callback). In case the
     * login fails, the callback must be called with a string that can be
     * alerted to the user or the error object if the problem is not due to
     * authentication itself. If the login succeeds, the argument must be
     * undefined or null. You can pass a second argument containing user
     * information.
     */
    checkCredentials: {
      check: "Function",
      nullable: false,
    },

    /**
     * Whether to show a button with "Forgot Password?"
     */
    showForgotPassword: {
      check: "Boolean",
      nullable: false,
      init: false,
      event: "changeShowForgotPassword",
    },

    /**
     * The function that is called when the user clicks on the "Forgot Password?"
     * button
     */
    forgotPasswordHandler: {
      check: "Function",
    },
  },

  events: {
    /**
     * Event dispatched when login was successful
     */
    loginSuccess: "qx.event.type.Data",

    /**
     * Data event dispatched when login failed, event data
     * contains a reponse message
     */
    loginFailure: "qx.event.type.Data",
  },

  members: {
    _text: null,
    _username: null,
    _password: null,

    /**
     * Apply function used by proterty {@link #text}
     * @param value {String} New value
     * @param old {String} Old value
     */
    _applyText(value, old) {
      this._text.setValue(value);
      this._text.setVisibility(value ? "visible" : "excluded");
    },

    /**
     * Apply function used by proterty {@link #textFont}
     * @param value {String} New value
     */
    _applyTextFont(value) {
      this._text.setFont(value);
    },

    /**
     * Create the main content of the widget
     */
    _createWidgetContent() {
      // wrap fields in form tag to avoid Chrome warnings, see https://github.com/qooxdoo/qxl.dialog/issues/19
      let formTag = new qxl.dialog.FormTag();
      let container = this._createDialogContainer();
      container.getLayout().setAlignX("center");
      formTag.add(container, { flex: 1 });
      this.add(formTag);
      this._image = new qx.ui.basic.Image();
      this._image.setVisibility("excluded");
      container.add(this._image);
      this._text = new qx.ui.basic.Label();
      this._text.setAllowStretchX(true);
      this._text.setVisibility("excluded");
      this.setTextFont("bold");
      container.add(this._text);
      let form = new qx.ui.container.Composite();
      let gridLayout = new qx.ui.layout.Grid(9, 5);
      gridLayout.setColumnAlign(0, "right", "top");
      gridLayout.setColumnAlign(2, "right", "top");
      gridLayout.setColumnMinWidth(0, 50);
      gridLayout.setColumnFlex(1, 2);
      form.setLayout(gridLayout);
      form.setAlignX("center");
      form.setMinWidth(200);
      form.setMaxWidth(400);
      container.add(form);
      let labels = [this.tr("Name"), this.tr("Password")];
      for (let i = 0; i < labels.length; i++) {
        form.add(
          new qx.ui.basic.Label(labels[i]).set({
            allowShrinkX: false,
            paddingTop: 3,
          }),

          {
            row: i,
            column: 0,
          }
        );
      }
      this._username = new qx.ui.form.TextField();

      this._username.addListener(
        "appear",
        function () {
          this._username.focus();
        },
        this
      );

      this._password = new qx.ui.form.PasswordField();
      this._password
        .getContentElement()
        .setAttribute("autocomplete", "password");
      this._password.addListener(
        "keypress",
        function (e) {
          if (e.getKeyIdentifier() === "Enter") {
            this._callCheckCredentials();
          }
        },
        this
      );

      form.add(
        this._username.set({
          allowShrinkX: false,
          paddingTop: 3,
        }),

        {
          row: 0,
          column: 1,
        }
      );

      form.add(
        this._password.set({
          allowShrinkX: false,
          paddingTop: 3,
        }),

        {
          row: 1,
          column: 1,
        }
      );

      this._message = new qx.ui.basic.Label();
      this._message.setRich(true);
      this._message.setAllowStretchX(true);
      this._message.setVisibility("excluded");
      container.add(this._message);

      // buttons
      let buttonPane = this._createButtonPane();

      // login
      let loginButton = (this._loginButton = new qx.ui.form.Button(
        this.tr("Login")
      ));

      loginButton.setAllowStretchX(false);
      loginButton.addListener("execute", this._callCheckCredentials, this);

      // cancel
      let cancelButton = this._createCancelButton();

      // forgot password
      let forgotPasswordButton = new qx.ui.form.Button(
        this.tr("Forgot Password?")
      );

      forgotPasswordButton.addListener(
        "click",
        function () {
          this.getForgotPasswordHandler()();
        },
        this
      );

      this.bind("showForgotPassword", forgotPasswordButton, "visibility", {
        converter(v) {
          return v ? "visible" : "excluded";
        },
      });

      buttonPane.add(loginButton);
      buttonPane.add(cancelButton);
      buttonPane.add(forgotPasswordButton);
      form.add(buttonPane, {
        row: 3,
        column: 1,
      });

      // object ids
      if (qx.core.Environment.get("module.objectid") === true) {
        form.setQxObjectId("form");
        this.addOwnedQxObject(form);
        this._username.setQxObjectId("username");
        form.addOwnedQxObject(this._username);
        this._password.setQxObjectId("password");
        form.addOwnedQxObject(this._password);
        loginButton.setQxObjectId("login");
        buttonPane.addOwnedQxObject(loginButton);
        forgotPasswordButton.setQxObjectId("forgot-password");
        buttonPane.addOwnedQxObject(forgotPasswordButton);
        this.addOwnedQxObject(forgotPasswordButton);
      }
    },

    /**
     * Calls the checkCredentials callback function with username, password and
     * the final callback, bound to the context object.
     */
    _callCheckCredentials() {
      this.getCheckCredentials()(
        this._username.getValue(),
        this._password.getValue(),
        typeof Function.prototype.bind === "function"
          ? this._handleCheckCredentials.bind(this)
          : qx.lang.Function.bind(this._handleCheckCredentials, this)
      );
    },

    /**
     * Handle click on cancel button
     */
    _handleCancel() {
      this.hide();
    },

    /**
     * Handler function called from the function that checks the credentials
     * with the result of the authentication process.
     * @param err {String|Error|null} If null, the authentication was successful
     * and the "loginSuccess" event is dispatched. If String or Error, the
     * "loginFailure" event is dispatched with the error message/object.
     * Finally, the callback function in the callback property is called with
     * null (success) or the error value.
     * @param data {unknown|undefined} Optional second argument wich can contain
     * user information
     */
    _handleCheckCredentials(err, data) {
      //this._password.setValue("");
      this.setMessage(null);
      if (err) {
        this.fireDataEvent("loginFailure", err);
        this._username.addListenerOnce(
          "focus",
          function () {
            qx.event.Timer.once(
              function () {
                this._username.selectAllText();
              },
              this,
              100
            );
          },
          this
        );

        this._password.addListenerOnce(
          "focus",
          function () {
            qx.event.Timer.once(
              function () {
                this._password.selectAllText();
              },
              this,
              100
            );
          },
          this
        );
      } else {
        this.fireDataEvent("loginSuccess", data);
        this.hide();
      }
      if (this.getCallback()) {
        this.getCallback()(err, data);
      }
    },

    /**
     * @override
     */
    hide() {
      this._password.setValue("");
      this.setMessage(null);
      super.hide();
    },
  },
});
