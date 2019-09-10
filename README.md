# Qooxdoo Dialog Widgets

[![Build Status](https://travis-ci.com/qooxdoo/qxl.dialog.svg?branch=master)](https://travis-ci.com/qooxdoo/qxl.dialog)

>Notes: The code of this package originates from the
[cboulanger/qx-contrib](https://github.com/cboulanger/qx-contrib-Dialog)
repository and has been moved to the new namespace `qxl.dialog`. It only works
with the new JavaScript compiler and qooxdoo version 6. See
[below](#migrating-from-cboulangerqx-contrib-dialog) for instructions how to
migrate your code.

A set of often used dialog widgets for the qooxdoo framework.

- Alert
- Confirm
- Login
- Prompt
- Select
- Progress

The package also provides support for user-defined forms and wizards. These more
complex widgets, however, are likely to be moved into a separate package
eventually.

Demo: https://qooxdoo.github.io/qxl.dialog

API Viewer: https://www.qooxdoo.org/qxl.dialog/apiviewer/index.html#qxl.dialog

See the code of the [Demo app](source/class/qxl/dialog/demo/Application.js) for
examples how to use the widgets.

## Installation

To install the package into an existing qooxdoo application, execute in its
root directory:

```
qx pkg install qooxdoo/qxl.dialog
```

### Install icon theme

From v1.3.0 on, the contrib allows you to use custom icons for the dialogs.
However, this means that the icons will not work out of the box. You must use or
extend [one of the shipped icon themes](source/class/qxl/dialog/theme/icon) in
your application's meta theme (see [this
example](source/class/qxl/dialog/theme/Theme.js)) or copy the alias definitions
from one of them into your own icon theme. 

You can also use your own choice of icons by writing an icon theme which defines
defining the aliases `dialog.icon.(ok|cancel|info|warning|error)` with the paths
to the icons. Those paths also need to be put into a `@asset` compiler hint.
See, for example, [this theme
class](source/class/qxl/dialog/theme/icon/IcoMoonFree.js).

## Testing

To run the tests, first start the built-in server with

```bash
qx serve --target=build
```

Once the message `Web server started` ... appears, open a new terminal and start
the tests with `npm test`. Once the tests have succeeded, you can kill the
server process in the first tab.

## Migrating from cboulanger/qx-contrib-Dialog

To migrate code that has used the cboulanger/qx-contrib-Dialog package, you need 
to do the following steps:

- `qx pkg remove cboulanger/qx-contrib-Dialog`
- `qx pkg install qooxdoo/qxl.dialog`
- search and replace `dialog.` with `qxl.dialog.` and `dialog/` with `qxl/dialog/` 
(check each search/replace manually to avoid false positives )

## Changelog
### v3.0.0
Moved package from cboulanger/qx-contrib-Dialog and changed namespace to `qxl.dialog`

### v2.0.0
- Dropped support for qx v5.0 and the python generator
- Rewrote tests to make use of the new `qx.core.Id` system
### v1.4.0
- Added TextCafe UI tests
### v1.3.3
- integrate demo application into library code, now you can simply do `qx serve` to run the demo.
### v1.3.1
- fix alias names
### v1.3.0
- Compatible with qooxdoo 5.x and 6.x: added support for new JS compiler
- Merged changes from https://github.com/jbruwes/qooxdialog
  - replaced base widget qx.ui.GroupBox with modal qx.ui.window.Window
- Added new black and white SVG icons from https://icomoon.io/#preview-free, added support for live icon theme switching
- Added promise() method returning a Promise as an alternative to callbacks
- Promisified all shorthand methods (dialog.alert, ...), resulting in massively better readability 
  [see Demo app](demo/default/source/class/dialog/demo/Application.js#L193)
- Added caption parameter to shorthand methods.
- Since a modal window has its own blocker, the  default coloured blocker has been removed. If you want the old behavior, 
  call `dialog.Dialog.useBlocker(true)`.
- Prettified with the default settings of https://github.com/prettier/prettier
- Added 'cancelOnEscape' property (default: true) which triggers the 'cancel' button action if the user presses the 
  Escape key and 'allowCancel' is true.
- Progress Widget enhancements:
  - added 'hideWhenCancelled' property (default: true) to allow "cleanup" or
    similar actions to be displayed after the cancel button has been pressed.  
### v1.2
- fixed a bug that prevented submitting the login dialog by pressing enter (patch by @novij)
- added "Forgot Password?" button to login widget
### v1.1
- compatible with qooxdoo v4.0
- Progress dialog widget added
### v1.0
- compatible with qooxdoo v3.5

## TODO
- Tab and focus handling is still buggy: Users can tab into non-modal widgets.
- Rewrite using child controls, to make dialogs truly themeable.
