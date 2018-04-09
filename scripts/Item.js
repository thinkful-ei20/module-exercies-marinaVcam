'use strict';
/* global cuid*/

const Item = (function() {
  function create(name) {
    return {
      id: cuid(),
      name: name,
      checked: false
    }
  }
  function validateName(name) {
    // console.log(name === 'apples');
    if (name.length === 0) {
      throw new Error('name does not exist');
    }
  }

  return {
    create, validateName
  };
}());