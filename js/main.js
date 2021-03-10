'use strict';

$(document).ready(function(){
  if ( false === INSIDE_TESTS_ON ) {
    App.init()
    .then(Tache.load.bind(Tache))
    .catch(err => {console.error(err);erreur(err)})
  }
})
