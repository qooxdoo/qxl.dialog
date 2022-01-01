/* ************************************************************************

   qooxdoo dialog library
   https://github.com/qooxdoo/qxl.dialog

   Copyright:
    2021 Derrell Lipman

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     *  Derrell Lipman (derrell)

************************************************************************ */

/**
 * Tabbed, multi-column form renderer.
 */
qx.Class.define("qxl.dialog.TabbedMultiColumnFormRenderer", {
  extend: qxl.dialog.MultiColumnFormRenderer,

  construct(form, tabInfo) {
    let render;

    // Save the render function, but prevent it from being called (by
    // the superclass constructor) before we'refinished initializing.
    render = this._render;
    this._render = () => {};

    this.base(arguments, form);

    // Replace the grid layout that the superclass instantiated, with
    // a VBox layout
    this._setLayout(new qx.ui.layout.VBox());

    // Keep track of each of our tab pages
    this._pages = [];

    // Create the tabview for this renderer
    this._tabView = new qx.ui.tabview.TabView();
    this._add(this._tabView, { flex: 1 });

    // Add each of the requested pages to it
    tabInfo.forEach((info) => {
      let page = new qx.ui.tabview.Page(info.name, info.icon);

      page.setLayout(info.layout || new qx.ui.layout.VBox());
      this._tabView.add(page);
      this._pages.push(page);
    });

    // Notify our listeners when a user selects a new tab. (We do
    // *not* notify our listeners when the tab changes during form
    // rendering.)
    this._tabView.addListener("changeSelection", (e) => {
      if (!this.__bInternalChange) {
        this.fireDataEvent("changeTab", e.getData()[0]);
      }
    });

    // Now that we're initialized, restore the render function and call it.
    this._render = render;
    this._render();

    // Make the tabview available via the form
    form.getTabViewInfo = () => {
      return {
        tabView: this._tabView,
        pages: this._pages,
      };
    };
  },

  events: {
    changeTab: "qx.event.type.Data",
  },

  statics: {
    /**
     * Renderer columns each consume multiple layout (grid) columns. This is a
     * convenience function allowing the application to more easily specify
     * the column numbers when establishing the layout, in terms of the column
     * numbers that the application uses.
     * @param col
     */
    column(col) {
      return col * 2;
    },
  },

  members: {
    /** The tabview object for this renderer */
    _tabView: null,

    /** Array of tabview Page objects */
    _pages: null,

    /** Currently selected page index */
    _pageIndex: 0,

    /** Prevent changeTab event while adding items */
    __bInternalChange: false,

    // overridden
    addItems(items, names, title) {
      let i;
      let item;
      let page;
      let pageIndex;
      let row;
      let col;
      let rowspan;
      let widget;
      let label;

      // Prevent changeTab event while we're in here
      this.__bInternalChange = true;

      /*
       * add the header
       */
      if (title !== null) {
        this._pages.forEach((page) => {
          // Switch to this page
          this._tabView.setValue(page);

          // Add the header to this page
          page.add(this._createHeader(title), {
            row: this._row++,
            column: 0,
            colSpan: 2,
          });
        });

        // Switch back to the first page
        this._tabView.setValue(this._pages[0]);
      }

      /*
       * add the items
       */
      for (i = 0; i < items.length; i++) {
        /*
         * current item
         */

        // Get the current item
        item = items[i];

        // If there is user data containing the page/row/column info, use it
        pageIndex = item.getUserData("page");
        if (typeof pageIndex != "number") {
          // Retrieve the page index
          pageIndex = this._pageIndex;
        }
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
        this._pageIndex = pageIndex;
        this._row = row;
        this._col = col;

        // Switch to the specified page
        page = this._pages[pageIndex];
        this._tabView.setValue(page);

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
        } else {
          /*
           * other form widgets
           */
          widget = item;
        }

        /*
         * Excluded form elements, used for full-width
         * labels. this should be implemented differently,
         * though
         */
        if (names[i] && item.getUserData("excluded")) {
          label = new qx.ui.basic.Label(names[i]);
          label.setRich(true);
          page.add(label, {
            row: row,
            column: col,
            rowSpan: rowspan,
            colSpan: 2,
          });
        } else if (item instanceof qx.ui.form.CheckBox) {
          /**
           * If CheckBox, assign the whole width to the widget.
           */
          page.add(widget, {
            row: row,
            column: col,
            rowSpan: rowspan,
            colSpan: 2,
          });

          page._getLayout().getCellWidget(row, col).setAlignX("left");
        } else if (item.getUserData("combineWithLabelColumn") && !names[i]) {
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
          page.add(widget, {
            row: row,
            column: col,
            rowSpan: rowspan,
            colSpan: 2,
          });
        } else if (!names[i]) {
          /*
           * Instead, just elide the label
           */
          page.add(widget, {
            row: row,
            column: col + 1,
            rowSpan: rowspan,
          });
        } else {
          /*
           * normal case: label in column col, form element in column col+1
           */
          label = this._createLabel(names[i], item);
          label.setRich(true);
          page.add(label, {
            row: row,
            column: col,
            rowSpan: rowspan,
          });

          page.add(widget, {
            row: row,
            column: col + 1,
            rowSpan: rowspan,
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

      // Always switch back to page 0 after form is rendered
      page = this._pages[0];
      this._tabView.setValue(page);

      // Re-enable changeTab events for when user selects a tab
      this.__bInternalChange = false;
    },
  },
});
