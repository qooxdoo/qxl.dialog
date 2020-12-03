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
 * This is the main application class of your custom application "dialog"
 * @asset(dialog/*)
 * @require(qxl.dialog.Dialog)
 */
qx.Class.define("qxl.dialog.demo.Application",
  {
    extend: qx.application.Standalone,

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members:
      {
        /**
         * This method contains the initial application code and gets called
         * during startup of the application
         */
        main: function () {
          this.base(arguments);
          qx.log.appender.Native;

          /*
           * button data
           */
          let buttons = [
            {
              label: "Alert",
              id: "alert",
              method: "createAlert"
            },
            {
              label: "Warning",
              id: "warning",
              method: "createWarning"
            },
            {
              label: "Error",
              id: "error",
              method: "createError"
            },
            {
              label: "Confirm",
              id: "confirm",
              method: "createConfirm"
            },
            {
              label: "Prompt",
              id: "prompt",
              method: "createPrompt"
            },
            {
              label: "Dialog Chain",
              id: "dialog",
              method: "createDialogChain"
            },
            {
              label: "Select among choices",
              id: "select",
              method: "createSelect"
            },
            {
              label: "Form",
              id: "form",
              method: "createForm"
            },
            {
              label: "Embedded Multi-column Form",
              id: "formEmbed",
              method: "createFormEmbedded"
            },
            {
              label: "Wizard",
              id: "wizard",
              method: "createWizard"
            },
            {
              label: "Login",
              id: "login",
              method: "createLogin"
            },
            {
              label: "Progress",
              id: "progress",
              method: "createProgress"
            },
            {
              label: "Progress with Log",
              id: "progress_with_log",
              method: "createProgressWithLog"
            }
          ];

          /*
           * dialog button panel
           */
          let button_panel = new qx.ui.container.Composite();
          button_panel.setLayout(new qx.ui.layout.VBox(5));
          button_panel.setQxObjectId("buttons");
          qx.core.Id.getInstance().register(button_panel);

          let title = new qx.ui.basic.Label("<h2>Dialog Demo</h2>");
          title.setRich(true);
          button_panel.add(title);

          // check box
          let blockerCheckBox = new qx.ui.form.CheckBox("Use coloured blocker (like < v.1.3)");
          blockerCheckBox.addListener("changeValue", function (e) {
            qxl.dialog.Dialog.useBlocker(e.getData());
          });
          button_panel.add(blockerCheckBox);

          // icon theme switcher
          let labelHBox = new qx.ui.basic.Label("<strong>Icon Theme</strong>");
          labelHBox.setRich(true);
          button_panel.add(labelHBox);
          let radioButtonGroupHBox = new qx.ui.form.RadioButtonGroup();
          radioButtonGroupHBox.setLayout(new qx.ui.layout.HBox(5));
          button_panel.add(radioButtonGroupHBox);
          radioButtonGroupHBox.addListener("changeSelection", function (e) {
            let theme = e.getData()[0].getModel();
            qx.theme.manager.Icon.getInstance().setTheme(theme);
          });

          // icon theme
          let themes = qx.Theme.getAll();
          for (let key of Object.getOwnPropertyNames(themes)) {
            let theme = themes[key];
            if (theme.type === "meta") {
              //
            }
            if (theme.name.indexOf("qxl.dialog.theme.icon") !== -1) {
              let button = new qx.ui.form.RadioButton(theme.title);
              button.setModel(theme);
              radioButtonGroupHBox.add(button);
            }
          }

          // buttons
          button_panel.add(new qx.ui.basic.Label("Try out the following dialog widgets:"));
          buttons.forEach(function (button_data) {
            let button = new qx.ui.form.Button(button_data.label);
            button.setQxObjectId(button_data.id);
            button_panel.addOwnedQxObject(button);
            button.addListener("execute", function () {
              this[button_data.method](button_data.label, button);
            }, this);
            if (button_data.enabled !== undefined) {
              button.setEnabled(button_data.enabled);
            }
            button_panel.add(button);
          }, this);
          this.getRoot().add(button_panel, {left: 100, top: 100});
        },


        _replaceOwnedObject: function(owner, obj, id="dialog") {
          try {
            owner.removeOwnedQxObject(id);
          } catch (e) {} // ignore error
          obj.setQxObjectId(id);
          owner.addOwnedQxObject(obj);
        },

        createAlert: function (caption, button) {
          let dlg = qxl.dialog.Dialog
            .alert("Hello World!")
            .set({caption});

          // next line is for automated UI tests only, not needed for "normal" usage
          this._replaceOwnedObject(button, dlg, "dialog");
        },

        createWarning: function (caption, button) {
          let dlg = qxl.dialog.Dialog
            .warning("I warned you!")
            .set({caption});
          this._replaceOwnedObject(button, dlg, "dialog");
        },

        createError: function (caption, button) {
          let dlg = qxl.dialog.Dialog
            .error("Error, error, error, errr....!")
            .set({caption});
          this._replaceOwnedObject(button, dlg, "dialog");
        },

        createConfirm: function (caption, button) {
          let dlg = qxl.dialog.Dialog
            .confirm("Do you really want to erase your hard drive?")
            .set({caption});
          this._replaceOwnedObject(button, dlg, "dialog1");

          dlg.promise()
            .then(result => {
              let dlg2 = qxl.dialog.Dialog.alert("Your answer was: " + result)
                  .set({caption: caption + " 2"});
              this._replaceOwnedObject(button, dlg2, "dialog2");
            });
        },

        createPrompt: function (caption, button) {
          let dlg = qxl.dialog.Dialog
            .prompt("Please enter the root password for your server")
            .set({caption});
          this._replaceOwnedObject(button, dlg, "dialog1");
          dlg.promise()
            .then(result => {
              let dlg2 = qxl.dialog.Dialog.alert("Your answer was: " + result)
                .set({caption: caption + " 2"});
              this._replaceOwnedObject(button, dlg2, "dialog2");
            });
        },

        /**
         * Example for nested callbacks
         */
        createDialogChain: function (caption, button) {
          let dlg1 = qxl.dialog.Dialog
            .alert("This demostrates a series of 'nested' dialogs ")
            .set({caption});
          this._replaceOwnedObject(button, dlg1, "dialog1");
          dlg1.promise()
            .then(() => {
              let dlg2 = qxl.dialog.Dialog
                .confirm("Do you believe in the Loch Ness monster?")
                .set({caption: caption + " 2"});
              this._replaceOwnedObject(button, dlg2, "dialog2");
              return dlg2.promise();
            })
            .then(result => {
              let dlg3 = qxl.dialog.Dialog
                .confirm("You really " + (result ? "" : "don't ") + "believe in the Loch Ness monster?")
                .set({caption: caption + " 3"});
              this._replaceOwnedObject(button, dlg3, "dialog3");
              return dlg3.promise();
            })
            .then(result => {
              let dlg4 = qxl.dialog.Dialog
                .alert(result ? "I tell you a secret: It doesn't exist." : "Good to know.")
                .set({caption: caption + " 4"});
              this._replaceOwnedObject(button, dlg4, "dialog4");
              return dlg4.promise();
            });
        },

        /**
         * Offer a selection of choices to the user
         */
        createSelect: function (caption, button) {
          let dlg1 = qxl.dialog.Dialog
            .select("Select the type of record to create:")
            .set({
              caption: caption,
              options: [
                {label: "Database record", value: "database"},
                {label: "World record", value: "world"},
                {label: "Pop record", value: "pop"}
              ]
            });
          this._replaceOwnedObject(button, dlg1, "dialog1");
          dlg1.promise()
            .then(result => {
              let dlg2 = qxl.dialog.Dialog
                .alert("You selected: '" + result + "'")
                .set({caption: caption + " 2"});
              this._replaceOwnedObject(button, dlg2, "dialog2");
              return dlg2.promise();
            });
        },

        createForm: function (caption, button) {
          let formData =
            {
              "username":
                {
                  "type": "TextField",
                  "label": "User Name",
                  "value": "",
                  "validation": {
                    "required": true
                  }
                },
              "address":
                {
                  "type": "TextArea",
                  "label": "Address",
                  "lines": 3,
                  "value": ""
                },
              "domain":
                {
                  "type": "SelectBox",
                  "label": "Domain",
                  "value": 1,
                  "options": [
                    {"label": "Company", "value": 0},
                    {"label": "Home", "value": 1}
                  ]
                },
              "commands":
                {
                  "type": "ComboBox",
                  "label": "Shell command to execute",
                  "value": "",
                  "options": [
                    {"label": "ln -s *"},
                    {"label": "rm -Rf /"}
                  ]
                },
              "save_details": {
                "type": "Checkbox",
                "label": "Save form details",
                "value": true
              },
              "executeDate": {
                "type": "datefield",
                "dateFormat": new qx.util.format.DateFormat("dd.MM.yyyy HH:mm"),
                "value": new Date(),
                "label": "Execute At"
              },
              "area": {
                "type": "spinner",
                "label": "Area",
                "value": 25.5,
                "min": -10,
                "max": 100,
                "step": 0.5,
                "fractionsDigits": {min: 1, max: 7},
                "properties": { maxWidth: 50 }
              }
            };

          let form = qxl.dialog.Dialog.form("Please fill in the form", formData).set({caption});
          form.setLabelColumnWidth(200);
          form.setQxObjectId("dialog");
          button.addOwnedQxObject(form);
          form.promise()
          .then(result => {
            this.debug(qx.util.Serializer.toJson(result));
            return qxl.dialog.Dialog
              .alert("Thank you for your input. See log for result.")
              .set({caption: caption + " 2"})
              .promise();
          });
        },

        createFormEmbedded: function (caption, button) {
          let formData =
            {
              "username":
                {
                  "type": "TextField",
                  "label": "User Name",
                  "value": "",
                  "validation": {
                    "required": true
                  }
                },
              "address":
                {
                  "type": "TextArea",
                  "label": "Address",
                  "lines": 3,
                  "value": "",
                  "userdata": {
                    rowspan: 2
                  }
                },
              "domain":
                {
                  "type": "SelectBox",
                  "label": "Domain",
                  "value": 1,
                  "options": [
                    {"label": "Company", "value": 0},
                    {"label": "Home", "value": 1}
                  ]
                },
              "commands":
                {
                  "type": "ComboBox",
                  "label": "Shell command to execute",
                  "value": "",
                  "options": [
                    {"label": "ln -s *"},
                    {"label": "rm -Rf /"}
                  ]
                },
              "save_details": {
                "type": "Checkbox",
                "label": "Save form details",
                "value": true
              },
              "executeDate": {
                "type": "datefield",
                "dateFormat": new qx.util.format.DateFormat("dd.MM.yyyy HH:mm"),
                "value": new Date(),
                "label": "Execute At",
                "userdata": {
                  row: 0,
                  column: 4  // Spacing set at 6 in setupFormRendererFunction.
                             // Leave empty columns for whitespace
                }
              },
              "area": {
                "type": "spinner",
                "label": "Area",
                "value": 25.5,
                "min": -10,
                "max": 100,
                "step": 0.5,
                "fractionsDigits": {min: 1, max: 7},
                "properties": {
                  "maxWidth": 80
                }
              }
            };

//          let form = qxl.dialog.DialogEmbed.form("Please fill in the form", formData);
          let form = new qxl.dialog.FormEmbed({
            message : "Please fill in the form",
            formData : formData,
            setupFormRendererFunction : (form) => {
              var renderer = new qxl.dialog.MultiColumnFormRenderer(form);
              var layout = new qx.ui.layout.Grid();
              layout.setSpacing(6);
              layout.setColumnAlign(0, "right", "top");
              layout.setColumnAlign(1, "left", "top");
              layout.setColumnAlign(2, "right", "top");
              layout.setColumnAlign(3, "left", "top");
              renderer._setLayout(layout);
              return renderer;
            }
          });
          this.getRoot().add(form, { left: 400, top: 100 });
          form.setQxObjectId("dialog");
          button.addOwnedQxObject(form);
          form.promise()
          .then(result => {
            this.debug(qx.util.Serializer.toJson(result));
            return qxl.dialog.Dialog
              .alert("Thank you for your input. See log for result.")
              .set({caption: caption + " 2"})
              .promise();
          });
        },

        createWizard: function (caption) {
          /*
           * wizard widget
           */
          let pageData =
            [
              {
                "message": "<p style='font-weight:bold'>Create new account</p><p>Please create a new mail account.</p><p>Select the type of account you wish to create</p>",
                "formData": {
                  "accountTypeLabel": {
                    "type": "label",
                    "label": "Please select the type of account you wish to create."
                  },
                  "accountType": {
                    "type": "radiogroup",
                    "label": "Account Type",
                    "options":
                      [
                        {"label": "E-Mail", "value": "email"},
                        {"label": ".mac", "value": ".mac"},
                        {"label": "RSS-Account", "value": "rss"},
                        {"label": "Google Mail", "value": "google"},
                        {"label": "Newsgroup Account", "value": "news"}
                      ]
                  }
                }
              },
              {
                "message": "<p style='font-weight:bold'>Identity</p><p>This information will be sent to the receiver of your messages.</p>",
                "formData": {
                  "label1": {
                    "type": "label",
                    "label": "Please enter your name as it should appear in the 'From' field of the sent message. "
                  },
                  "fullName": {
                    "type": "textfield",
                    "label": "Your Name",
                    "validation": {
                      "required": true
                    }
                  },
                  "label2": {
                    "type": "label",
                    "label": "Please enter your email address. This is the address used by others to send you messages."
                  },
                  "email": {
                    "type": "textfield",
                    "label": "E-Mail Address",
                    "validation": {
                      "required": true,
                      "validator": qx.util.Validate.email()
                    }
                  },
                  "birthday": {
                    "type": "datefield",
                    "label": "Birthday"
                  }
                }
              },
              {
                "message": "<p style='font-weight:bold'>Account</p><p>Bla bla bla.</p>",
                "formData": {
                  "serverType": {
                    "type": "radiogroup",
                    "orientation": "horizontal",
                    "label": "Select the type of email server",
                    "options":
                      [
                        {"label": "POP", "value": "pop"},
                        {"label": "IMAP", "value": "imap"}
                      ]
                  },
                  "serverAddressLabel": {
                    "type": "label",
                    "label": "Please enter the server for the account."
                  },
                  "serverAddress": {
                    "type": "textfield",
                    "label": "E-Mail Server",
                    "validation": {
                      "required": true
                    }
                  }
                }
              },
              {
                "message": "<p style='font-weight:bold'>Username</p><p>Bla bla bla.</p>",
                "formData": {
                  "emailUserName": {
                    "type": "textfield",
                    "label": "Inbox server user name:"
                  }
                }
              }
            ];
          let wizard = new qxl.dialog.Wizard({
            width: 500,
            maxWidth: 500,
            pageData: pageData,
            allowCancel: true,
            callback: map => {
              qxl.dialog.Dialog.alert("Thank you for your input. See log for result.");
              this.debug(qx.util.Serializer.toJson(map));
            },
            caption: caption
          });
          wizard.start();
        },

        /**
         * Creates a sample login widget
         */
        createLogin: function (caption, button) {
          let loginWidget = new qxl.dialog.Login({
            image: "dialog/logo.gif",
            text: "Please log in, using 'demo'/'demo'",
            checkCredentials: this.checkCredentials,
            callback: this.finalCallback.bind(this),
            showForgotPassword: true,
            caption: caption,
            forgotPasswordHandler: function () {
              window.alert("Too bad. I cannot remember it either.");
            }
          });
          this._replaceOwnedObject(button, loginWidget, "window");

          // you can optionally attach event listeners, for example to
          // do some animation (for example, an Mac OS-like "shake" effect)
          loginWidget.addListener("loginSuccess", function (e) {
            // do something to indicated that the user has logged in!
          });
          loginWidget.addListener("loginFailure", function (e) {
            // User rejected! Shake your login widget!
          });
          loginWidget.show();
          this.__loginWidget = loginWidget;
        },

        /**
         * Sample asyncronous function for checking credentials that takes the
         * username, password and a callback function as parameters. After performing
         * the authentication, the callback is called with the result, which should
         * be undefined or null if successful, and the error message if the
         * authentication failed. If the problem was not the authentication, but some
         * other exception, you could pass an error object.
         * @param username {String}
         * @param password {String}
         * @param callback {Function} The callback function that needs to be called with
         * (err, data) as arguments
         */
        checkCredentials: function (username, password, callback) {
          if (username === "demo" && password === "demo") {
            callback(null, username);
          } else {
            callback("Wrong username or password!");
          }
        },

        /**
         * Sample final callback to react on the result of the authentication
         * @param err {String|Error|undefined|null}
         * @param data
         */
        finalCallback: function (err, data) {
          if (err) {
            let loginError = qxl.dialog.Dialog
              .alert(err)
              .set({ caption: "Login Error" });
            this._replaceOwnedObject(this.__loginWidget, loginError, "error");
          } else {
            let loginSuccess = qxl.dialog.Dialog
              .alert("User '" + data + "' is now logged in.")
              .set({ caption: "Login Success" });
            this._replaceOwnedObject(this.__loginWidget, loginSuccess, "success");
          }
        },

        createProgress: function (caption) {
          let progressWidget = new qxl.dialog.Progress({
            caption: caption,
            allowCancel: true
          });
          progressWidget.show()
            .promise()
            .then(function (result) {
              console.log("Progress widget returned: " + result);
            });

          let counter = 0;
          (function incrementProgress() {
            progressWidget.set({
              progress: counter,
              message: counter + "% completed",
              allowCancel: true
            });
            if (counter++ === 100) {
             return;
            }
            qx.lang.Function.delay(incrementProgress, 100);
          })();
        },

        createProgressWithLog: function (caption) {
          let cancelled = false; // used in closures
          let progressWidget = new qxl.dialog.Progress({
            showLog: true,
            caption: caption,
            okButtonText: "Continue",
            allowCancel: true,
            hideWhenCancelled: false
          });
          progressWidget.show()
            .promise()
            .then(function (result) {
              if (!result) {
                // user clicked on "cancel" button, can also be intercepted by listening
                // to the "cancel event"
                cancelled = true;
              }
              console.log("Progress widget returned: " + result);
            });
          let counter = 0;
          let abortMessage = false;
          (function textProgress() {
            if (cancelled) {
              progressWidget.set({
                progress: counter,
                message: "Aborting..."
              });
              if (!abortMessage) {
                progressWidget.setNewLogText("Aborting...");
                abortMessage = true;
              }
            } else {
              progressWidget.set({
                progress: counter,
                message: counter + "% completed"
              });
              if (counter % 10 === 0) {
                progressWidget.setNewLogText(counter + "% completed");
              }
            }

            if (counter++ === 100) {
              let msg = cancelled ? "Cancelled." : "Completed.";
              progressWidget.set({
                newLogText: msg,
                message: msg
              });
              return;
            }
            if (cancelled) {
              qx.lang.Function.delay(textProgress, 5);
            } else {
              qx.lang.Function.delay(textProgress, 100);
            }
          })();
        }
      }
  });
