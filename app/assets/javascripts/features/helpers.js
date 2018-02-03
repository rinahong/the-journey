
function qs(...args) {
  return document.querySelector(...args);
}
// Shortcut functions `.querySelectorAll()`
function qsa(query, node) {
  return (node || document).querySelectorAll(query);
}

export { qs, qsa };  
