(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Theme": {
        "usage": "dynamic",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /**
   * Icons from the IcoMoon Free Pack
   *
   * https://icomoon.io/#preview-free
   * https://github.com/Keyamoon/IcoMoon-Free
   *
   * Dual-licences under CC BY 4.0 or GPL.
   * see https://github.com/Keyamoon/IcoMoon-Free/blob/master/License.txt
   * http://creativecommons.org/licenses/by/4.0/
   * http://www.gnu.org/licenses/gpl.html
   *
   * @asset(qxl/dialog/icon/IcoMoonFree/272-cross.svg)
   * @asset(qxl/dialog/icon/IcoMoonFree/273-checkmark.svg)
   * @asset(qxl/dialog/icon/IcoMoonFree/264-warning.svg)
   * @asset(qxl/dialog/icon/IcoMoonFree/269-info.svg)
   * @asset(qxl/dialog/icon/IcoMoonFree/270-cancel-circle.svg)
   */
  qx.Theme.define("qxl.dialog.theme.icon.IcoMoonFree", {
    title: "IcoMoonFree",
    aliases: {
      "icon": "qx/icon/Oxygen",
      "qxl.dialog.icon.cancel": "qxl/dialog/icon/IcoMoonFree/272-cross.svg",
      "qxl.dialog.icon.ok": "qxl/dialog/icon/IcoMoonFree/273-checkmark.svg",
      "qxl.dialog.icon.info": "qxl/dialog/icon/IcoMoonFree/269-info.svg",
      "qxl.dialog.icon.error": "qxl/dialog/icon/IcoMoonFree/270-cancel-circle.svg",
      "qxl.dialog.icon.warning": "qxl/dialog/icon/IcoMoonFree/264-warning.svg"
    }
  });
  qxl.dialog.theme.icon.IcoMoonFree.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=IcoMoonFree.js.map?dt=1609239804859