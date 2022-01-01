import { Selector, ClientFunction } from 'testcafe';

/**
 * Given an absolute object id, return its DOM element
 * @param {String} id
 * @return {Element}
 */
export const IdSelector = Selector(id => qx.core.Id.getQxObject(id).getContentElement().getDomElement());

/**
 * Given a TestCafé Selector object, return an enhanced selector with some qooxdoo-specific methods
 * @param {Selector} selector
 * @return {Selector}
 * @constructor
 */
export const QxSelector = (selector) => {
  // browser-side methods
  selector = selector.addCustomMethods({

    /**
     * Returns the absolute id of the owned object with that id
     * @param domNode
     * @param id
     * @returns {String}
     */
    absoluteIdOf(domNode, id){
      return qx.core.Id.getAbsoluteIdOf(qx.ui.core.Widget.getWidgetByElement(domNode).getObject(id));
    },
    /**
     * Returns the value of the property of the widget that is connected with the DOM node
     * @param domNode
     * @param key
     * @returns {*|var}
     */
    getQxProperty(domNode, key){
      return qx.ui.core.Widget.getWidgetByElement(domNode).get(key);
    }
  });
  // NodeJS-side methods
  Object.assign(selector,{
    findButtonLabelWithText: function(text){
      return this
        .find("div[qxclass='qx.ui.form.Button']")
        .find("div[qxclass='qx.ui.basic.Label']")
        .withText(text);
    }
  });
  return selector;
};
