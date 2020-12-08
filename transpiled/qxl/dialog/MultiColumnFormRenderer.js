(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qxl.dialog.FormRenderer": {
        "require": true
      },
      "qx.ui.form.RadioGroup": {},
      "qx.ui.basic.Label": {},
      "qx.ui.form.CheckBox": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

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
   * Multi-column form renderer. This extends, and is is based on
   * qxl.dialog.FormRenderer by Christian Boulanger.
   */
  qx.Class.define("qxl.dialog.MultiColumnFormRenderer", {
    extend: qxl.dialog.FormRenderer,
    members: {
      _row: 0,
      _col: 0,

      /**
       * Renderer columns each consume multiple layout (grid) columns. This is a
       * convenience function allowing the application to more easily specify
       * the column numbers when establishing the layout, in terms of the column
       * numbers that the application uses.
       */
      column: function column(col) {
        return col * 2;
      },
      // overridden
      addItems: function addItems(items, names, title) {
        var i;
        var row;
        var col;
        var rowspan;
        var widget;
        /*
         * add the header
         */

        if (title != null) {
          this._add(this._createHeader(title), {
            row: this._row++,
            column: 0,
            colSpan: 2
          });
        }
        /*
         * add the items
         */


        for (i = 0; i < items.length; i++) {
          /*
           * current item
           */
          // Get the current item
          var item = items[i]; // If there is user data containing the row/column info, use it

          row = item.getUserData("row");

          if (typeof row != "number") {
            row = this._row;
          }

          col = item.getUserData("column");

          if (typeof col != "number") {
            col = this._col;
          } else {
            col *= 2; // user columns don't deal with label:widget
          }

          rowspan = item.getUserData("rowspan") || 1;
          this._row = row;
          this._col = col;
          /*
           * radio group
           */

          if (item instanceof qx.ui.form.RadioGroup) {
            /*
             * create horizontal radio group for a small
             * number of radio buttons 
             */
            if (item.getUserData("orientation") == "horizontal") {
              widget = this._createHBoxForRadioGroup(item);
            } else {
              widget = this._createWidgetForRadioGroup(item);
            }
          }
          /*
           * other form widgets
           */
          else {
              widget = item;
            }
          /*
           * Excluded form elements, used for full-width
           * labels. this should be implemented differently,
           * though
           */


          if (names[i] && item.getUserData("excluded")) {
            var label = new qx.ui.basic.Label(names[i]);
            label.setRich(true);

            this._add(label, {
              row: row,
              column: col,
              rowSpan: rowspan,
              colSpan: 2
            });
          }
          /**
           * If CheckBox, assign the whole width to the widget.
           */
          else if (item instanceof qx.ui.form.CheckBox) {
              this._add(widget, {
                row: row,
                column: col,
                rowSpan: rowspan,
                colSpan: 2
              });

              this._getLayout().getCellWidget(row, col).setAlignX("left");
            }
            /*
             * If the label is null, use the full width for the widget.
             *
             * This doesn't work because the first of the two columns (the
             * label column) has a maxWidth value, and (it seems) the grid
             * layout isn't able to handle a colspan with a maxWidth in
             * the first of the two columns and additional space available
             * in the subsequent column; it still limits the width to the
             * first column's maxWidth
             *
             * Instead, allow a means of using this that is backwards compatible,
             * should it ever be made to work
             */
            else if (item.getUserData("combineWithLabelColumn") && !names[i]) {
                this._add(widget, {
                  row: row,
                  column: col,
                  rowSpan: rowspan,
                  colSpan: 2
                });
              }
              /*
               * Instead, just elide the label
               */
              else if (!names[i]) {
                  this._add(widget, {
                    row: row,
                    column: col + 1,
                    rowSpan: rowspan
                  });
                }
                /*
                 * normal case: label in column col, form element in column col+1
                 */
                else {
                    label = this._createLabel(names[i], item);
                    label.setRich(true);

                    this._add(label, {
                      row: row,
                      column: col,
                      rowSpan: rowspan
                    });

                    this._add(widget, {
                      row: row,
                      column: col + 1,
                      rowSpan: rowspan
                    });
                  }
          /*
           * increment row
           */


          this._row += rowspan;
          /*
           * focus the first item
           */

          if (i == 0) {
            widget.addListener("appear", widget.focus, widget);
          }
        }
      }
    }
  });
  qxl.dialog.MultiColumnFormRenderer.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=MultiColumnFormRenderer.js.map?dt=1607450683358