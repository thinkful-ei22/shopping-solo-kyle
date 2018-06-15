'use strict';

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  hideChecked: false,
  searchTerm: '',
};

function isHiddenDecider(item) {
  if ((STORE.hideChecked && item.checked) || ((STORE.searchTerm !== '') && !item.name.includes(STORE.searchTerm))) {
    return 'hidden';
  }
  return '';
}

function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element ${isHiddenDecider(item)}" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
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
  console.log('Generating shopping list element');

  const items = shoppingList.items.map((item, index) => generateItemElement(item, index));
  return items.join('');
}


function renderShoppingList() {
  console.log('`renderShoppingList` ran');

  const shoppingListItemsString = generateShoppingItemsString(STORE);
  $('.js-shopping-list').html(shoppingListItemsString);
}

function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);

  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');

    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');

    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}




function updateSearchTerm(newSearchTerm) {
  console.log('Updating searchTerm to be ' + newSearchTerm);
  STORE.searchTerm = newSearchTerm;
}

function handleSearchInput() {
  $('#js-shopping-list-form').on('keyup', '.js-shopping-list-entry', function(event) {
    console.log('`handleSearchInput` ran');

    const newSearchTerm = $('.js-shopping-list-entry').val();

    updateSearchTerm(newSearchTerm);
    renderShoppingList();
  });
}




function toggleHideChecked() {
  console.log('Toggling hideChecked property on STORE');

  STORE.hideChecked = !STORE.hideChecked;
}

function handleHideCheckedClicked() {
  $('.js-hide-checked-toggle').on('change', event => {
    console.log('`handleHideChecked` ran');

    toggleHideChecked();
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);

  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');

    const itemIndex = getItemIndexFromElement(event.currentTarget);

    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteListItem(itemIndex) {
  STORE.items.splice(itemIndex,1);
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('`handleDeleteItemClicked` ran');

    const itemIndex = getItemIndexFromElement(event.currentTarget);

    deleteListItem(itemIndex);
    renderShoppingList();
  });
}

function handleShoppingList() {
  renderShoppingList();
  handleSearchInput();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleHideCheckedClicked();
}

$(handleShoppingList);