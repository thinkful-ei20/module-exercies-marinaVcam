'use strict';
/* global store, cuid, Item, $ */

// eslint-disable-next-line no-unused-vars
const shoppingList = (function(){

  function generateItemElement(item) {
    let itemTitle; // = `<span class="shopping-item">${item.name}</span>`;
    // item.checked is false AND item.editingMode is true, then show the form
    if (!item.checked && item.editingMode) {
      itemTitle = `
        <form class="js-edit-item">
          <input aria-label="shopping item" class="shopping-item" type="text" autofocus="autofocus" value="${item.name}" />
        </form>
      `;
    } else if (item.checked && !item.editingMode) {
      // item.checked = true AND item.editingMode = false, display a span
      itemTitle = `<span class="shopping-item shopping-item__checked">${item.name}</span>`;
    } else if (!item.checked && !item.editingMode) {
      // item.checked = false AND item.editingMode = false, display a span
      itemTitle = `<span class="shopping-item">${item.name}</span>`;
    } else {
      throw Error('Should not be checked and in editing mode!');
    }

  
    return `
      <li class="js-item-element" data-item-id="${item.id}">
        ${itemTitle}
        <div class="shopping-item-controls">
          <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
          </button>
          <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
          </button>
        </div>
      </li>`;
  }
  
  function generateShoppingItemsString(shoppingList) {
    const items = shoppingList.map((item) => generateItemElement(item));
    return items.join('');
  }
  
  function render() {
    // Filter item list if store prop is true by item.checked === false
    let items = store.items;
    if (store.hideCheckedItems) {
      items = store.items.filter(item => !item.checked);
    }
  
    // Filter item list if store prop `searchTerm` is not empty
    if (store.searchTerm) {
      items = store.items.filter(item => item.name.includes(store.searchTerm));
    }
  
    // render the shopping list in the DOM
    console.log('`render` ran');
    const shoppingListItemsString = generateShoppingItemsString(items);
  
    // insert that HTML into the DOM
    $('.js-shopping-list').html(shoppingListItemsString);
  }
  
  function addItemToShoppingList(itemName) {
    try {
      Item.validateName(itemName);
      const newItem = Item.create(itemName); // capture the new object so the value is the same as when it is pushed to the items array
      store.items.push(newItem);
      render();
    } catch(e) {
      console.log(`Cannot add item: ${e.message}`);
    }
  }
  
  function handleEditMode() {
    $('.js-shopping-list').on('click', '.shopping-item', event => {
      const itemId = $(event.currentTarget).closest('.js-item-element').data('item-id');
      const item = store.findById(itemId);
      item.editingMode = true;
      render();
    });
  }

  function handleNewItemSubmit() {
    $('#js-shopping-list-form').submit(function (event) {
      event.preventDefault();
      const newItemName = $('.js-shopping-list-entry').val();
      $('.js-shopping-list-entry').val('');
      addItemToShoppingList(newItemName);
      render();
    });
  }

  function handleItemCheckClicked() {
    $('.js-shopping-list').on('click', '.js-item-toggle', event => {
      console.log(event.target);
      // console.log(event.currentTarget.closest('').attr(''));
      const itemId = $(event.currentTarget).closest('.js-item-element').data('item-id');
      store.findAndToggleChecked(itemId);
      render();
    });
  }

  function handleDeleteItemClicked() {
    // like in `handleItemCheckClicked`, we use event delegation
    $('.js-shopping-list').on('click', '.js-item-delete', event => {
      // get the index of the item in store.items
      const itemId = $(event.currentTarget).closest('.js-item-element').data('item-id');
      // delete the item
      store.findAndDelete(itemId);
      // render the updated shopping list
      render();
    });
  }
  
  function handleEditShoppingItemSubmit() {
    $('.js-shopping-list').on('submit', '.js-edit-item', event => {
      event.preventDefault();
      const id = $(event.currentTarget).closest('.js-item-element').data('item-id');
      const itemName = $(event.currentTarget).find('.shopping-item').val();
      const item = store.findById(id);
      store.findAndUpdateName(id , itemName);
      item.editingMode = false;
      render();
    });
  }
  
  function handleToggleFilterClick() {
    $('.js-filter-checked').click(() => {
      store.toggleCheckedFilter();
      render();
    });
  }
  
  function handleShoppingListSearch() {
    $('.js-shopping-list-search-entry').on('keyup', event => {
      const val = $(event.currentTarget).val();
      store.setSearchTerm(val);
      render();
    });
  }
  
  function bindEventListeners() {
    handleNewItemSubmit();
    handleItemCheckClicked();
    handleDeleteItemClicked();
    handleEditShoppingItemSubmit();
    handleToggleFilterClick();
    handleShoppingListSearch();
    handleEditMode();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
}());
