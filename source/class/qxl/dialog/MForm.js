/* ************************************************************************

   qooxdoo dialog library
   https://github.com/qooxdoo/qxl.dialog

   Copyright:
     2007-2018 Christian Boulanger and others

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

************************************************************************ */

/**
 * Mixin that provides the functionality for a dialog with a form that
 * is constructed on-the-fly. Used by the Window-based dialog form,
 * and by an embedded dialog form
 *
 * @require(qxl.dialog.FormRenderer)
 * @require(qx.util.Serializer)
 * @require(qx.util.Validate)
 */
qx.Mixin.define("qxl.dialog.MForm", {
  construct : function(properties) {
    this._init();
  },

  properties: {
    /**
     * Allow disabling autocomplete on all text and password fields
     */
    allowBrowserAutocomplete :
    {
      check : "Boolean",
      init  : true
    },

    /**
     * Data to create a form with multiple fields.
     * So far implemented:
     *   TextField / TextArea
     *   ComboBox
     *   SelectBox
     *   RadioGroup
     *   CheckBox
     *   Spinner
     *   List
     *
     * <pre>
     * {
     *  "username" : {
     *     'type'  : "TextField",
     *     'label' : "User Name",
     *     'value' : ""
     *   },
     *   "address" : {
     *     'type'  : "TextArea",
     *     'label' : "Address",
     *     'lines' : 3
     *   },
     *   "domain" : {
     *     'type'  : "SelectBox",
     *     'label' : "Domain",
     *     'value' : 1,
     *     'options' : [
     *       { 'label' : "Company", 'value' : 0 },
     *       { 'label' : "Home",    'value' : 1 }
     *     ]
     *   },
     *   "commands" : {
     *    'type'  : "ComboBox",
     *     'label' : "Shell command to execute",
     *     'options' : [
     *       { 'label' : "ln -s *" },
     *       { 'label' : "rm -Rf /" }
     *     ]
     *   },
     *   "quantity" : {
     *    'type' : "Spinner",
     *    'label' : "How many?",
     *    'properties' : {
     *      'minimum' : 1,
     *      'maximum' : 20,
     *      'maxWidth' : 100
     *    }
     *   }
     * }
     * </pre>
     */
    formData: {
      check: "Map",
      nullable: true,
      event: "changeFormData",
      apply: "_applyFormData"
    },

    /**
     * The model of the result data
     */
    model: {
      check: "qx.core.Object",
      nullable: true,
      event: "changeModel"
    },

    /**
     * The default width of the column with the field labels
     */
    labelColumnWidth: {
      check: "Integer",
      nullable: false,
      init: 100,
      apply: "_applyLabelColumnWidth"
    },

    /**
     * Function to call to create and configure a form renderer. If null, a
     * single-column form renderer is automatically instantiated and
     * configured. The function is passed a single argument, the form object.
     */
    setupFormRendererFunction :
    {
      check : "Function",
      nullable : true,
      init : null
    },

    /**
     * Function to call just before creating the form's input fields. This
     * allows additional, non-form widgets to be added. The function is called
     * one two arguments: the container in which the form fields should be
     * placed, and the form object itself (this).
     */
    beforeFormFunction :
    {
      check : "Function",
      nullable : true,
      init : null
    },

    /*
     * Function to call with the internal form, allowing the user to do things
     * such as set up a form validator (vs. field validators) on the form. The
     * function is called with two arguments: the internal qx.ui.form.Form
     * object, and the current dialog.Form object. An attempt is made to call
     * the function in the context specified in the form data, but that may
     * not work properly if the context property is not yet set at the time at
     * the form is created.
     */
    formReadyFunction :
    {
      check : "Function",
      nullable : true,
      init : null,
      event : "formReadyFunctionChanged"
    },

    /**
     * Function to call just after creating the form's input fields. This
     * allows additional, non-form widgets to be added. The function is called
     * one two arguments: the container in which the form fields should be
     * placed, and the form object itself (this).
     */
    afterFormFunction :
    {
      check : "Function",
      nullable : true,
      init : null
    },

    /**
     * Function to call just after creating the form's buttons. This allows
     * additional, additional widgets to be added. The function is called with
     * two arguments: the container in which the buttons were placed, and the
     * form object itself (this).
     */
    afterButtonsFunction :
    {
      check : "Function",
      nullable : true,
      init : null
    }
  },

  members: {
    _formContainer: null,
    _form: null,
    _formValidator: null,
    _formController: null,
    _formElements : null,

    _init : function() {
      // Initialize form instances to an empty map which will be updated as
      // formItems are added.  After the formData has been applied, this
      // property will contain a map containing the form item instances, with
      // the key being the name used in formData, and the value being the item
      // element. In particular, the afterFormFunction, which receives the form
      // as its second parameter, may reference this member to gain access to
      // the form elements created for the form.
      this._formElements = {};
    },

    /**
     * Return the form
     * @return {qx.ui.form.Form}
     */
    getForm: function () {
      return this._form;
    },

    /**
     * Create the main content of the widget
     */
    _createWidgetContent: function (properties) {
      /*
       * Handle properties that must be set before _applyFormData
       */
      if (properties.setupFormRendererFunction) {
        this.setSetupFormRendererFunction(properties.setupFormRendererFunction);
      }

      let container = new qx.ui.container.Composite();
      container.setLayout(new qx.ui.layout.VBox(10));

      let hbox = new qx.ui.container.Composite();
      hbox.setLayout(new qx.ui.layout.HBox(10));
      container.add(hbox);
      this._message = new qx.ui.basic.Label();
      this._message.setRich(true);
      this._message.setMinWidth(200);
      this._message.setAllowStretchX(true);
      hbox.add(this._message, {
        flex: 1
      });

      /*
       * If requested, call the before-form function to add some fields
       */
      if (typeof properties.beforeFormFunction == "function") {
        properties.beforeFormFunction.bind(properties.context)(container, this);
      }

      // wrap fields in form tag to avoid Chrome warnings, see https://github.com/qooxdoo/qxl.dialog/issues/19
      let formTag = new qxl.dialog.FormTag();
      this._formContainer = new qx.ui.container.Composite();
      this._formContainer.setLayout(new qx.ui.layout.Grow());
      formTag.add(this._formContainer, {flex: 1});
      container.add(formTag, { flex: 1 });

      /*
       * If requested, call the after-form function to add some fields
       */
      if (typeof properties.afterFormFunction == "function") {
        properties.afterFormFunction.bind(properties.context)(container, this);
      }

      // buttons
      let buttonPane = this._createButtonPane();
      container.add(buttonPane);
      let okButton = this._createOkButton();
      buttonPane.add(okButton);
      let cancelButton = this._createCancelButton();
      buttonPane.add(cancelButton);

      /*
       * If requested, call the after-buttons function
       */
      if (typeof properties.afterButtonsFunction == "function") {
        properties.afterButtonsFunction.bind(properties.context)(buttonPane, this);
      }
      this.add(container);
    },

    /**
     * Constructs the form on-the-fly
     * @param formData {Map} The form data map
     * @param old {Map|null} The old value
     * @lint ignoreDeprecated(alert,eval)
     */
    _applyFormData: function (formData, old) {
      if (this._formController) {
        try {
          this.getModel().removeAllBindings();
          this._formController.dispose();
        } catch (e) {
        }
      }
      if (this._form) {
        try {
          this._form.getValidationManager().removeAllBindings();
          this._form.dispose();
        } catch (e) {
        }
      }
      this._formContainer.removeAll();
      if (!formData) {
        return;
      }
      if (this.getModel()) {
        this.getModel().removeAllBindings();
        this.getModel().dispose();
      }
      let modelData = {};
      for (let key of Object.getOwnPropertyNames(formData)) {
        modelData[key] = formData[key].value !== undefined ?
        formData[key].value :
        null;
      }
      let model = qx.data.marshal.Json.createModel(modelData);
      this.setModel(model);
      // form
      this._form = new qx.ui.form.Form();
      if (qx.core.Environment.get("module.objectid") === true) {
        if (this.getQxObject("form")) {
          this.removeOwnedQxObject("form");
        }
        this.addOwnedQxObject(this._form, "form");
      }
      this._formController = new qx.data.controller.Object(this.getModel());
      this._onFormReady(this._form);

      /*
       * hooks for subclasses or users to do something with the new form
       */
      this._onFormReady( this._form );
      let f = this.getFormReadyFunction();
      if (f) {
        f.call(this.getContext(), this._form, this);
      } else {
        this.addListenerOnce(
          "formReadyFunctionChanged",
          function() {
            f = this.getFormReadyFunction();
            if (f) {
              f.call(this.getContext(), this._form, this);
            }
          },
          this.getContext());
      }

      for (let key of Object.getOwnPropertyNames(formData)) {
        let fieldData = formData[key];
        let formElement = null;
        switch (fieldData.type.toLowerCase()) {
          case "groupheader":
            this._form.addGroupHeader(fieldData.value);
            break;
          case "textarea":
            formElement = new qx.ui.form.TextArea();
            formElement.setHeight(fieldData.lines * 16);
            formElement.setLiveUpdate(true);
            break;
          case "textfield":
            formElement = new qx.ui.form.TextField();
            if (fieldData.maxLength) {
             formElement.setMaxLength(fieldData.maxLength);
            }
            formElement.setLiveUpdate(true);
            break;
          case "datefield":
          case "date":
            formElement = new qx.ui.form.DateField();
            if (fieldData.dateFormat) {
              formElement.setDateFormat(fieldData.dateFormat);
            }
            break;
          case "passwordfield":
          case "password":
            formElement = new qx.ui.form.PasswordField();
            formElement.getContentElement().setAttribute("autocomplete", "password");
            formElement.setLiveUpdate(true);
            break;
          case "combobox":
            formElement = new qx.ui.form.ComboBox();
            fieldData.options.forEach(function (item) {
              let listItem = new qx.ui.form.ListItem(item.label, item.icon);
              formElement.add(listItem);
            });
            break;
          case "selectbox":
            formElement = new qx.ui.form.SelectBox();
            model = qx.data.marshal.Json.createModel(fieldData.options);
            new qx.data.controller.List(model, formElement, "label");
            break;
          case "radiogroup":
            formElement = new qx.ui.form.RadioGroup();
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
            break;
          case "label":
            formElement = new qx.ui.form.TextField(); // dummy
            formElement.setUserData("excluded", true);
            break;
          case "checkbox":
            formElement = new qx.ui.form.CheckBox(fieldData.label);
            break;
          case "spinner":
            formElement = new qx.ui.form.Spinner();
            if (fieldData.min) {
              formElement.setMinimum(fieldData.min);
            }
            if (fieldData.max) {
              formElement.setMaximum(fieldData.max);
            }
            if (fieldData.step) {
              formElement.setSingleStep(fieldData.step);
            }
            if (fieldData.fractionsDigits) {
              let fd = fieldData.fractionsDigits;
              let nf = new qx.util.format.NumberFormat();
              if (fd.min) {
                nf.setMinimumFractionDigits(fd.min);
              }
              if (fd.max) {
                nf.setMaximumFractionDigits(fd.max);
              }
              formElement.setNumberFormat(nf);
            }
            break;
          case "list":
            formElement = new qx.ui.form.List();
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
            model = qx.data.marshal.Json.createModel( fieldData.options );
            new qx.data.controller.List( model, formElement, "label");
            break;
          default:
            this.error("Invalid form field type:" + fieldData.type);
        }
        formElement.setUserData("key", key);
        let _this = this;
        if (typeof fieldData.type == "string") {
          switch (fieldData.type.toLowerCase()) {
            case "textarea":
            case "textfield":
            case "passwordfield":
            case "combobox":
            case "datefield":
            case "spinner":
              this._formController.addTarget(formElement, "value", key, true, null, {
                converter: function (value) {
                  _this._form.getValidationManager().validate();
                  return value;
                }
              });
              break;
            case "checkbox":
              this._formController.addTarget(formElement, "value", key, true, null);
              break;
            case "selectbox":
              this._formController.addTarget(formElement, "selection", key, true, {
                converter: qx.lang.Function.bind(function (value) {
                  let selected = null;
                  let selectables = this.getSelectables();
                  selectables.forEach(function (selectable) {
                    if (selectable.getModel().getValue() === value) {
                      selected = selectable;
                    }
                  }, this);
                  if (!selected) {
                    return [selectables[0]];
                  }
                  return [selected];
                }, formElement)
              }, {
                converter: qx.lang.Function.bind(function (selection) {
                  let value = selection[0].getModel().getValue();
                  return value;
                }, formElement)
              });
              break;
            case "radiogroup":
              this._formController.addTarget(formElement, "selection", key, true, {
                converter: qx.lang.Function.bind(function (value) {
                  let selectables = this.getSelectables();
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
                }, formElement)
              }, {
                converter: function (selection) {
                  let value = selection[0].getUserData("value");
                  return value;
                }
              });
              break;

          case "list":
            this._formController.addTarget(
              formElement, "selection", key, true, {
                "converter" : qx.lang.Function.bind( function( value ) {
                  var selected=[];
                  var selectables = this.getSelectables();
                  selectables.forEach( function( selectable ) {
                    if ((value instanceof Array ||
                         value instanceof qx.data.Array) &&
                        value.includes(selectable.getModel().getValue())) {
                      selected.push(selectable);
                    }
                  }, this );

                  return selected;
                }, formElement)
              },{
                "converter" : qx.lang.Function.bind( function( selection ) {
                  var value = [];
                  selection.forEach( function ( selected ) {
                    value.push(selected.getModel().getValue());
                  });
                  return value;
                }, formElement)
              }
            );
            break;
          }
        }

        /**
         * Validation
         */
        let validator = null;
        if (formElement && fieldData.validation) {
          // required field
          if (fieldData.validation.required) {
            formElement.setRequired(true);
          }
          // sync validation
          if (fieldData.validation.validator) {
            validator = fieldData.validation.validator;
            if (typeof validator == "string") {
              if (qx.util.Validate[validator]) {
                validator = qx.util.Validate[validator]();
              } else if (validator.charAt(0) === "/") {
                validator = qx.util.Validate.regExp(
                new RegExp(validator.substr(1, validator.length - 2)),
                fieldData.validation.errorMessage
                );
              } else {
                this.error("Invalid string validator.");
              }
            } else if (!(validator instanceof qx.ui.form.validation.AsyncValidator) && typeof validator !== "function") {
              this.error("Invalid validator.");
            }
          }
          // async validation
          if (qx.lang.Type.isString(fieldData.validation.proxy) &&
          qx.lang.Type.isString(fieldData.validation.method)
          ) {
            /**
             * fieldData.validation.proxy
             * the name of a global variable (or path) to a function that acts as the proxy of
             * the 'send' or 'execute' function of a preconfigured JsonRpc client. The function
             * receives the following parameters: service method (string), parameters (array)
             * and callback (function). It proxies the parameters to the given JsonRpc method and
             * calls the callback with the result (true if valid, false if not) received from the
             * server. The JsonRpc service name is preconfigured by the server and cannot be
             * changed by the client.
             */
            // clean
            let proxy = fieldData.validation.proxy.replace(/;\n/g, "");
            try {
              eval("proxy = " + proxy + ";");
            } catch (e) {
              this.warn("Invalid proxy name");
            }
            if (typeof proxy == "function") {
              let method = fieldData.validation.method;
              let message = fieldData.validation.invalidMessage;
              let validationFunc = function (validatorObj, value) {
                if (!validatorObj.__asyncInProgress) {
                  validatorObj.__asyncInProgress = true;
                  proxy(method, [value], function (valid) {
                    validatorObj.setValid(valid, message || this.tr("Value is invalid"));
                    validatorObj.__asyncInProgress = false;
                  });
                }
              };
              validator = new qx.ui.form.validation.AsyncValidator(validationFunc);
            }
          }
        }

        /**
         * other widget properties @todo: allow to set all properties
         */

        // width
        if (fieldData.width !== undefined) {
          formElement.setWidth(fieldData.width);
        }

        // placeholder
        if ( fieldData.placeholder !== undefined ) {
          formElement.setPlaceholder( fieldData.placeholder );
        }

        // tooltip
        if ( fieldData.toolTipText !== undefined ) {
          formElement.setToolTipText( fieldData.toolTipText );
        }

        // enabled
        if (fieldData.enabled !== undefined) {
          formElement.setEnabled(fieldData.enabled);
        }

        // generic property setter
        if ( typeof fieldData.properties == "object") {
          formElement.set( fieldData.properties );
        }

        /*
         * This allows changing the default autocomplete behavior to disable
         * autocomplete on all text and password fields unless allowed at
         * either the form level or at the field level using the
         * allowBrowserAutocomplete key.
         */
        if ([
              "textfield",
              "passwordfield"
            ].includes( fieldData.type.toLowerCase()) ) {

          if ( typeof fieldData.allowBrowserAutocomplete == "boolean" ) {
            if ( ! fieldData.allowBrowserAutocomplete ) {
              //turn off autocomplete
              formElement.getContentElement().setAttribute(
              "autocomplete", "new-password");
            } else {
              // leave autocomplete alone.
              // Note: Password field above sets attribute
            }
          } else if ( ! this.getAllowBrowserAutocomplete() ) {
            //turn off autocomplete
            formElement.getContentElement().setAttribute(
              "autocomplete", "new-password");
          }
        }

         // generic userdata settings
        if ( typeof fieldData.userdata == "object" ) {
          Object.keys( fieldData.userdata ).forEach(
            function(key) {
              formElement.setUserData(key, fieldData.userdata[key]);
            });
        }

        /**
         * Events
         */
        if (qx.lang.Type.isObject(fieldData.events)) {
          for (let type in fieldData.events) {
            try {
              // WHY IS eval NECESSARY???
              //let func = eval("(" + fieldData.events[type] + ")"); // eval is evil, I know.
              let func = fieldData.events[type];
              if (!qx.lang.Type.isFunction(func)) {
                throw new Error();
              }
              formElement.addListener(type, func, formElement);
            } catch (e) {
              this.warn("Invalid '" + type + "' event handler for form element '" + key + "'.");
            }
          }
        }

        // Putting it all together
        let label = fieldData.label;
        label && this._form.add(formElement, label, validator);
        // Add the form elements as objects owned by the form widget
        if (qx.core.Environment.get("module.objectid") === true) {
          formElement.setQxObjectId(key);
          this._form.addOwnedQxObject(formElement);
        }

        /*
         * add the form element to the map so the user has access to it later
         */
        if (! this._formElements) {
          // KLUDGE for issue #10068: The constructor of this mixin
          // isn't being called earlier enough.
          this._init();
        }
        this._formElements[key] = formElement;
      }


      /*
       * render the form
       */
      var setupFormRenderer;

      setupFormRenderer = this.getSetupFormRendererFunction();
      if (! setupFormRenderer)
      {
        setupFormRenderer = function(form)
        {
          var view;

          view = new qxl.dialog.FormRenderer(this._form);
          view.getLayout().setColumnFlex(0, 0);
          view.getLayout().setColumnMaxWidth(0, this.getLabelColumnWidth());
          view.getLayout().setColumnWidth(0, this.getLabelColumnWidth());
          view.getLayout().setColumnFlex(1, 1);
          view.setAllowGrowX(true);

          return view;
        };
      }

      this._formContainer.add( setupFormRenderer.bind(this)(this._form) );
      this._form.getValidationManager().validate();
    },

    /**
     * Constructs the form on-the-fly
     * @param formData {Map} The form data map
     * @param old {Map|null} The old value
     */
    _applyLabelColumnWidth : function(width, old)
    {
      var view;

      // If the form renderer is the default one and has already been applied...
      if (! this.getSetupFormRendererFunction() &&
          this._formContainer &&
          this._formContainer.getChildren().length > 0)
      {
        view = this._formContainer.getChildren()[0];
        view.getLayout().setColumnWidth(0, width);
        view.getLayout().setColumnMaxWidth(0, width);
      }
    },

    /**
     * Hook for subclasses to do something with the form, for example
     * in order to attach bindings to the validation manager.
     * Default behavior: bind the enabled state of the "OK" button to the
     * validity of the current form.
     * @param form {qx.ui.form.Form} The form to bind
     */
    _onFormReady: function (form) {
      form.getValidationManager().bind("valid", this._okButton, "enabled", {
        converter: function (value) {
          return value || false;
        }
      });
    },

    /**
     * Handle click on ok button. Calls callback with the result map
     * @override
     */
    _handleOk: function () {
      this.hide();
      if (this.getCallback()) {
        this.getCallback().call(
        this.getContext(),
        qx.util.Serializer.toNativeObject(this.getModel())
        );
      }
      this.resetCallback();
    }
  }
});
