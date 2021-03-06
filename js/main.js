'use strict';

window.TEST_ON = false ;

$(document).ready(function(){
  UI.insert("listing_taches", "div#div-inserted")
  .then(UI.insert.bind(UI,'formulaire_taches', 'div#div-inserted'))
  .then(loadJSModule.bind(null, 'Test.js', 'tests'))
  .then(() => {
    window.TEST_ON = true
    Test.start()
  })

})
