'use strict';
/* global cuid*/

const store = (function() {
  const items = [
    { id: cuid(), name: 'apples', checked: false },
    { id: cuid(), name: 'oranges', checked: false },
    { id: cuid(), name: 'milk', checked: true },
    { id: cuid(), name: 'bread', checked: false }
  ];
  const findById = function(id) {
    return items.find(el => el.id === id);
  };
  const addItem = function(name) {
    try {
      Item.validateName(name);
      const newItem = Item.create(name);
      this.items.push(newItem);
    } catch(e) {
        console.log(`Cannot find item: ${name}`);
  };
  const findAndToggleChecked = function(id) {
    const item = this.findById(id);
    item.checked = !item.checked;
  };
  const findAndUpdateName = function(id, newName) {
    try {
      Item.validateName(newName);
      const item = this.findById(id);
      item.name = newName;
    } catch(e) {
      console.log(`Cannot update name: ${e.message}`);
    }
  };
  const hideCheckedItems = false;
  const searchTerm = '';
  return {
    items, hideCheckedItems, searchTerm, findById
  };
}());



