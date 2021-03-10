'use strict'

class App {
static init(){
  return UI.insert("listing_taches", "div#div-inserted")
    .then(UI.insert.bind(UI,'formulaire_taches', 'div#div-inserted'))
    .then(UI.insert.bind(UI,'formulaire_labels', 'div#div-inserted'))
    .then(UI.prepare.bind(UI))
}

/**
Surtout pour les tests, permet de tout réinitialiser
***/
static resetAll(){
  Tache.reset()
  TacheForm.init()
  Label.reset()
}
}// class App
