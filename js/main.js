'use strict';

$(document).ready(function(){
  UI.insert("listing_taches", "div#div-inserted")
  .then(loadJSModule.bind(null, 'Test.js', 'tests'))
  .then(() => Test.start())

})
