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
 * A single row renderer for {@link qx.ui.form.Form}, adapted
 * for the {@link qxl.dialog.Form} widget. Main difference is that
 * the form allows text-only labels without a corresponding form
 * element which can serve, for example, for explanatory text.
 */
qx.Class.define("qxl.dialog.FormRenderer", {
  extend: qx.ui.form.renderer.Single,
  implement: qx.ui.form.renderer.IFormRenderer,

  properties: {
    /**
     * The text that is displayed after the label
     */
    labelSuffix: {
      refine: true,
      init: ":",
    },

    /**
     * The text that is displayed after the label and the label suffix
     * if a field is mandatory
     */
    requiredSuffix: {
      refine: true,
      init: "<span style='color:#e5004b'>*</span>",
    },
  },

  members: {
    _row: 0,
    _buttonRow: null,

    /**
     * Add a group of form items with the corresponding names. The names are
     * displayed as label.
     * The title is optional and is used as grouping for the given form
     * items. Additionally, this renderer supports label-only fields.
     * @param items {qx.ui.core.Widget[]} An array of form items to render.
     * @param names {String[]} An array of names for the form items.
     * @param title {String?} A title of the group you are adding.
     */
    addItems(items, names, title) {
      if (title !== null) {
        this._add(this._createHeader(title), {
          row: this._row,
          column: 0,
          colSpan: 2,
        });

        this._row++;
      }
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let widget;
        let label;
        if (item instanceof qx.ui.form.RadioGroup) {
          if (item.getUserData("orientation") === "horizontal") {
            widget = this._createHBoxForRadioGroup(item);
          } else {
            widget = this._createWidgetForRadioGroup(item);
          }
        } else {
          widget = item;
        }
        if (names[i] && item.getUserData("excluded")) {
          label = new qx.ui.basic.Label(names[i]);
          label.setRich(true);
          this._add(label, {
            row: this._row,
            column: 0,
            colSpan: 2,
          });
        } else if (item instanceof qx.ui.form.CheckBox) {
          this._add(widget, {
            row: this._row,
            column: 0,
            colSpan: 2,
          });

          this._getLayout().getCellWidget(this._row, 0).setAlignX("left");
        } else if (!names[i]) {
          this._add(widget, {
            row: this._row,
            column: 0,
            colSpan: 2,
          });
        } else {
          label = this._createLabel(names[i], item);
          label.setRich(true);
          this._add(label, {
            row: this._row,
            column: 0,
          });

          this._add(widget, {
            row: this._row,
            column: 1,
          });
        }
        this._row++;
      }
    },

    /**
     * Takes the items of the given RadioGroup and adds the to a Composite.
     * @param group {qx.ui.form.RadioGroup} The RadioGroup which needs to be
     *   added.
     * @return {qx.ui.container.Composite} A composite containing the items of
     *   the RadioGroup.
     */
    _createWidgetForRadioGroup(group) {
      let widget = new qx.ui.container.Composite(new qx.ui.layout.VBox(5));
      let items = group.getItems();
      for (let i = 0; i < items.length; i++) {
        widget.add(items[i]);
      }
      return widget;
    },

    /**
     * Takes the items of the given RadioGroup and adds the to a Composite.
     * The composite has a HBox layout so the RadioButtons will be alligned
     * horizontally. This is only useful for a small number of RadioButtons
     * such as 2 or 3 buttons with labels.
     * @param group {qx.ui.form.RadioGroup} The RadioGroup which needs to be
     *   added.
     * @return {qx.ui.container.Composite} A composite containing the items of
     *   the RadioGroup.
     */
    _createHBoxForRadioGroup(group) {
      let widget = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
      let items = group.getItems();
      for (let i = 0; i < items.length; i++) {
        widget.add(items[i]);
      }
      return widget;
    },
  },
});
