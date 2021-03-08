'use strict';

// Mettre false ou true suivant qu'on veut lancer les tests ou non
const TEST_ON = false ;
// const TEST_ON = true ;

$(document).ready(function(){

  if ( false === TEST_ON ) {
    UI.insert("listing_taches", "div#div-inserted")
    .then(UI.insert.bind(UI,'formulaire_taches', 'div#div-inserted'))
    .then(UI.insert.bind(UI,'formulaire_labels', 'div#div-inserted'))
    .then(Tache.load.bind(Tache))
    .catch(err => {console.error(err);erreur(err)})
  } else {
    // Quand on joue les tests
    UI.insert("listing_taches", "div#div-inserted")
    .then(UI.insert.bind(UI,'formulaire_taches', 'div#div-inserted'))
    // .then(Tache.load.bind(Tache))
    .then(loadJSModule.bind(null, 'Test.js', 'tests'))
    .then(() => {Test.start.call(Test)})
    .catch(err => {console.error(err);erreur(err)})
  }

})
