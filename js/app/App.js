'use strict'

class App {
static init(){
  return UI.insert("listing_taches", "div#div-inserted")
    .then(UI.insert.bind(UI,'formulaire_taches', 'div#div-inserted'))
    .then(UI.insert.bind(UI,'formulaire_labels', 'div#div-inserted'))
    .then(UI.prepare.bind(UI))
}
}// class App
