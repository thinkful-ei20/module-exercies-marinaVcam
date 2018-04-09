'use strict';
/* global cuid*/

const Item = (function() {
  function create(name) {
    return {
      id: cuid(),
      name: name,
      checked: false
    };
  }
  function validateName(name) {
    if (name.length === 0) {
      throw new Error('name does not exist');
    }
  }

  return {
    create, validateName
  };
}());