/* ************************************************************************

   qooxdoo dialog library

   http://qooxdoo.org/contrib/catalog/#Dialog

   Copyright:
     2018 Derrell Lipman

   License:
     MIT: https://opensource.org/licenses/MIT

   Authors:
   *  Derrell Lipman

************************************************************************ */

qx.Class.define("qxl.dialog.FormTag", {
  extend: qx.ui.container.Composite,

  construct(layout) {
    this.base(arguments, layout || new qx.ui.layout.VBox());
  },

  members: {
    // overridden
    // Instead of creating a <div> for the content element, use <form>
    _createContentElement() {
      return new qx.html.Element("form");
    },
  },
});
