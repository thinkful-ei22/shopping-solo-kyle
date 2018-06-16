'use strict';

// **********************************************
// ********** DATA STORE WITH DEFAULTS **********
// **********************************************
const STORE = {
  items: [
    {name: 'apples', checked: false, updating: false},
    {name: 'oranges', checked: false, updating: false},
    {name: 'milk', checked: true, updating: false},
    {name: 'bread', checked: false, updating: false}
  ],
  hideChecked: false,
  searchTerm: '',
};


// ************************************
// ********** VIEW TEMPLATES **********
// ************************************


// ********** VIEW HELPER(S) **********
function isHidden(item) {
  if ((STORE.hideChecked && item.checked) || ((STORE.searchTerm !== '') && !item.name.toLowerCase().includes(STORE.searchTerm))) {
    return 'hidden';
  }
  return '';
}

// ********** NAME DISPLAY HTML PARTIAL **********
function displayNameOrEditForm(item) {
  if (item.updating) {
    return `
      <div class="shopping-item js-item-update-form">
        <form id="js-shopping-list-entry-update">
          <label for="shopping-list-entry-update"></label>
          <input type="text" name="shopping-list-entry-update" title="update item name" class="js-shopping-list-entry-update" value="${item.name}">
          <button class="shopping-item-update js-item-update">
            <span class="button-label">update</span>
          </button>
          <button type="button" class="shopping-item-cancel js-item-cancel">
            <span class="button-label">cancel</span>
          </button>
        </form>
      </div>
      `;
  }
  return `<a href="#"><div class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</div></a>`;
}

// ********* ITEM HTML **********
function generateItemElement(item, itemIndex) {
  return `
    <li class="js-item-index-element ${isHidden(item)}" data-item-index="${itemIndex}">
      ${displayNameOrEditForm(item)}
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>
    `;
}


// ****************************
// ********** RENDER **********
// ****************************


// ********** RENDER HELPER(S) **********
function generateShoppingItemsString(shoppingList) {
  // console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join('');
}

// ********** RENDER LIST **********
function renderShoppingList() {
  // console.log('`renderShoppingList` ran');

  const shoppingListItemsString = generateShoppingItemsString(STORE.items);
  $('.js-shopping-list').html(shoppingListItemsString);
}


// **************************************
// ********** SHARED HELPER(S) **********
// **************************************


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}


// *******************************
// ********** NEW ITEMS **********
// *******************************


// ********** NEW ITEM HELPER **********
function addItemToShoppingList(itemName) {
  // console.log(`Adding "${itemName}" to shopping list`);

  STORE.items.unshift({name: itemName, checked: false});
}

// ********** ADD NEW ITEMS **********
function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    // console.log('`handleNewItemSubmit` ran');

    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');

    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

// ****************************
// ********** SEARCH **********
// ****************************


// ********** SEARCH HELPER **********
function updateSearchTerm(newSearchTerm) {
  // console.log('Updating searchTerm to be ' + newSearchTerm);

  STORE.searchTerm = newSearchTerm;
}

// ********** SEARCH **********
function handleSearchInput() {
  $('#js-shopping-list-form').on('keyup', '.js-shopping-list-entry', function(event) {
    // console.log('`handleSearchInput` ran');

    const newSearchTerm = $('.js-shopping-list-entry').val().toLowerCase();

    updateSearchTerm(newSearchTerm);
    renderShoppingList();
  });
}


// **********************************
// ********** HIDE CHECKED **********
// **********************************


// ********** HIDE ITEMS HELPER **********
function toggleHideChecked() {
  // console.log('Toggling hideChecked property on STORE');

  STORE.hideChecked = !STORE.hideChecked;
}

// ********** HIDE CHECKED ITEMS **********
function handleHideCheckedClicked() {
  $('.js-hide-checked-toggle').on('change', event => {
    // console.log('`handleHideChecked` ran');

    toggleHideChecked();
    renderShoppingList();
  });
}


// *******************************************
// ********** UPDATE ITEM HELPER(S) **********
// *******************************************


// ********** SET UPDATING STATUS **********
function toggleEditingForListItem(index) {
  // console.log(`Setting state of 'updating' for ${STORE.items[index].name} to '${!STORE.items[index].updating}'`);

  STORE.items[index].updating = !STORE.items[index].updating;
}

// ********** UNSET UPDATING ON ALL ITEMS **********
function resetEditingForListItems() {
  // console.log('Reseting the state of `updating` for all list items to `false`');

  STORE.items.forEach(item => item.updating = false);
}

// ********** PERSIST NEW NAME **********
function updateItemName(index, name) {
  // console.log(`Changing ${STORE.items[index].name} to ${name}`)

  STORE.items[index].name = name;
}


// **********************************
// ********** UPDATE ITEMS **********
// **********************************


// ********** ENABLE UPDATE FORM **********
function handleItemNameClicked() {
  $('.js-shopping-list').on('click', '.js-shopping-item', event => {
    console.log('`handleItemNameClicked` ran');
    
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    const item = STORE.items[itemIndex];

    if (!item.updating) {
      toggleEditingForListItem(itemIndex);
      renderShoppingList();
    }
  });
}

// ********** REMOVE FORM IF OUTSIDE CLICKS **********
function handleClickOutsideItemUpdate() {
  $('body').on('click', function(event) {
    console.log('`handleClickOutsideItemUpdate` ran');

    if (($('#js-shopping-list-entry-update').length) && (!event.target.closest('#js-shopping-list-entry-update') && !event.target.closest('.js-shopping-item')) ) {
      // console.log('I did it!');

      const itemIndex = $('#js-shopping-list-entry-update').closest('li').attr('data-item-index');
      // console.log(itemIndex);
      const item = STORE.items[itemIndex];
    
      if (item.updating) {
        // toggleEditingForListItem(itemIndex);
        resetEditingForListItems();
      }
      renderShoppingList();
    }
  });
}

// ********** UPDATE ITEM **********
function handleItemUpdateClick() {
  $('.js-shopping-list').on('click', '.js-item-update', event => {
    event.preventDefault();
    // console.log('`handleItemUpdateClick` ran');

    const itemIndex = getItemIndexFromElement(event.currentTarget);
    const newItemName = $('.js-shopping-list-entry-update').val();

    updateItemName(itemIndex, newItemName);
    toggleEditingForListItem(itemIndex);
    renderShoppingList();
  });
}

// ********** CANCEL UPDATE **********
function handleItemUpdateCancelClick() {
  $('.js-shopping-list').on('click', '.js-item-cancel', event => {
    event.preventDefault();
    // console.log('`handleItemUpdateCancelClick` ran');

    const itemIndex = getItemIndexFromElement(event.currentTarget);
    
    toggleEditingForListItem(itemIndex);
    renderShoppingList();
  });
}


// ************************************
// ********** CHECKING ITEMS **********
// ************************************


// ********** CHECK ITEM HELPER(S) **********
function toggleCheckedForListItem(itemIndex) {
  // console.log('Toggling checked property for item at index ' + itemIndex);

  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

// ********** CHECK ITEM **********
function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    // console.log('`handleItemCheckClicked` ran');

    const itemIndex = getItemIndexFromElement(event.currentTarget);

    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}


// **********************************
// ********** DELETE ITEMS **********
// **********************************


// ********** DELETE HELPER(S) **********
function deleteListItem(itemIndex) {
  STORE.items.splice(itemIndex,1);
}

// ********** DELETE ITEM **********
function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // console.log('`handleDeleteItemClicked` ran');

    const itemIndex = getItemIndexFromElement(event.currentTarget);

    deleteListItem(itemIndex);
    renderShoppingList();
  });
}


// **************************
// ********** MAIN **********
// **************************
function handleShoppingList() {
  renderShoppingList();
  handleSearchInput();
  handleNewItemSubmit();
  handleItemNameClicked();
  handleItemUpdateClick();
  handleClickOutsideItemUpdate();
  handleItemUpdateCancelClick();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleHideCheckedClicked();
}

$(handleShoppingList);