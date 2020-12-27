# Qooxdoo Dialog Widgets

![Build and Deploy](https://github.com/qooxdoo/qxl.dialog/workflows/Build%20and%20Deploy/badge.svg)

A set of often used dialog widgets for the qooxdoo framework.

- Alert
- Confirm
- Login
- Prompt
- Select
- Progress

The package also provides support for user-defined forms and wizards.

> If you are migrating from
[cboulanger/qx-contrib](https://github.com/cboulanger/qx-contrib-Dialog), see
[below](#migrating-from-cboulangerqx-contrib-dialog).

Demo: https://qooxdoo.github.io/qxl.dialog

API Viewer: https://www.qooxdoo.org/qxl.dialog/apiviewer/index.html#qxl.dialog

See the code of the [Demo app](source/class/qxl/dialog/demo/Application.js) for
examples how to use the widgets.

## Install from package

To install the package into an existing qooxdoo application, execute in its
root directory:

```
qx pkg install qooxdoo/qxl.dialog
```

## Install icon theme

The package allows you to use custom icons for the dialogs. However,
this means that **the icons used in the dialogs will not work
out of the box**. You must extend your own icon theme from [one
of the shipped icon themes](source/class/qxl/dialog/theme/icon).
or copy over the `@asset()` declarations and alias definitions
from one of these themes into your own icon theme.

You can also use your own choice of icons by writing an icon theme which
defines defining the aliases `dialog.icon.(ok|cancel|info|warning|error)`
with the paths to the icons. Those paths also need to be put
into a `@asset` compiler hint. See, for example, [this theme
class](source/class/qxl/dialog/theme/icon/IcoMoonFree.js).

## Install for development / use development version

Fork on GitHub and clone your fork, or if you are interested
in current master only, clone it directly using `git clone
https://github.com/qooxdoo/qxl.dialog.git`. 

Then, in your application, uninstall the package version
if you had installed it, and install the repo version:

```shell
npx qx remove qooxdoo/qxl.dialog # only necessary if installed
npx qx install --from-path=./path/to/qxl.dialog
```

## Testing / Demo

To install the dependencies and run the tests, simply do

```shell
./test
```

Afterwards, you can run the demo locally with `npx qx serve`.

## Migrating from cboulanger/qx-contrib-Dialog

To migrate code that has used the cboulanger/qx-contrib-Dialog package, you need 
to do the following steps:

```shell
npx qx pkg remove cboulanger/qx-contrib-Dialog
npx qx pkg install qooxdoo/qxl.dialog
```

Then search and replace `dialog.` with `qxl.dialog.` and `dialog/` with `qxl/dialog/` 
(check each search/replace manually to avoid false positives )

## Changelog

### v3.1.0
- Refactored `qxl.dialog.Dialog` and `qxl.dialog.Form`
  - The mass of functionality for Dialog and Form now resides in
    mixins, MDialog and MForm. The MDialog mixin is included by two
    classes, Dialog and DialogEmbed; and the MForm mixin is included
    by two classes, Form and FormEmbed. The Dialog and Form classes
    work as they always have, creating a pop-up window in which to
    render. The new DialogEmbed and FormEmbed classes allow forms to
    be placed in any arbitrary container of the programmer's choice,
    so that these classes can be used for the main functionality on a
    page rather than only as pop-ups.
  - It is now easy to extend the Form functionality (both windowed and
    embedded) with form elements that are not provided as part of this
    package. All form elements, including those provided with this
    package, are now registered in a standard way. This means that
    user applications can register form elements not provided by this
    package, and include them in forms created using this package.
- Added a generic multi-column form renderer, and the ability for an
  application to easily provide its own form renderer.
- Arbitrary propery settings can be provided to any form element.
- Arbitrary events can be handled from any form element.
- Arbitrary userdata can be specified for any form element. This is
  used, within this package, to specify row and column numbers for the
  multi-column form renderer, but it can be used for any other
  application needs as well.
- A `finalizeFunction` can be provided, which will be called when a
  form is completely generated. This finalize function may be used at
  the application's discretion, but in particular, it allows the
  application to add validation to the complete form, that requires
  that all of the form elements have been added to the form.
- Access is provided via the `_formElements` map, to all of the form
  elements. The map is keyed by the same keys provided in the
  `formData` map.
- `beforeFormFunction`, `afterButtonsFunction`, and
  `afterFormFunction` allow widgets to be added above and below the
  form, e.g., headings, or buttons that act on the form.
- Fixed the non-functioning `labelColumnWidth`

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
