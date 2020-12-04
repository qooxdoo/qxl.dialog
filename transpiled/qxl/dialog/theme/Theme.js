(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qxl.dialog.theme.icon.IcoMoonFree": {
        "require": true
      },
      "qxl.dialog.theme.icon.Oxygen": {
        "require": true
      },
      "qxl.dialog.theme.icon.Tango": {
        "require": true
      },
      "qx.Theme": {
        "usage": "dynamic",
        "require": true
      },
      "qx.theme.modern.Color": {
        "require": true
      },
      "qx.theme.modern.Decoration": {
        "require": true
      },
      "qx.theme.modern.Font": {
        "require": true
      },
      "qx.theme.modern.Appearance": {
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /**
   * The theme(s) of the demo application
   *
   * @require(qxl.dialog.theme.icon.IcoMoonFree)
   * @require(qxl.dialog.theme.icon.Oxygen)
   * @require(qxl.dialog.theme.icon.Tango)
   *
   */
  qx.Theme.define("qxl.dialog.theme.Theme", {
    meta: {
      color: qx.theme.modern.Color,
      decoration: qx.theme.modern.Decoration,
      font: qx.theme.modern.Font,
      icon: qxl.dialog.theme.icon.IcoMoonFree,
      appearance: qx.theme.modern.Appearance
    }
  });
  qxl.dialog.theme.Theme.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Theme.js.map?dt=1607097341288