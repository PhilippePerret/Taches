'use strict';
/** ---------------------------------------------------------------------
*
*   UI.js             librairie officielle WebAppScaffold
*   version 1.0.1

# 1.0.1
  Amélioration de la méthode insert (correction du bug quand pas de container)

*** --------------------------------------------------------------------- */
class UI {

/**
* Préparation de l'interface, appelée juste après avoir chargé les briques
* principales
***/
static prepare(){
  TacheForm.close()
  ModeAffichage.init()
}

/**
* Insertion des éléments HTML (briques)
***/
static insertHTMLElements(){
  __in("UI::insertHTMLElements")
  return UI.insert('panneau-home','div#panneau-home')
  .then(UI.insert.bind(UI, 'form_data_analyse', 'div#form_data_analyse'))
  .then(UI.insert.bind(UI, 'form_infos_score_analyse', 'div#form_infos_score_analyse'))
  // Insérer d'autres éléments ici
  .then(ASync_out("UI::insertHTMLElements"))
}

/**
* Méthode qui règle l'interface en fonction des données connues
* Par exemple, les onglets ne seront pas accessibles si aucun dossier
* d'analyse n'est choisi.
***/
static async setInterface(){
  __in("UI::setInterface")

  __out("UI::setInterface")
}

static observe(){
  __in("UI::observe")
  return new Promise((ok,ko)=>{
    __out("UI::observe")
    ok()
  })
}

/** ---------------------------------------------------------------------
    MÉTHODES PUBLIQUES

    !!! NE RIEN TOUCHER CI-DESSOUS !!!
--------------------------------------------------------------------- **/

/**
* Quand on doit ajouter/retirer la class CSS +css+ de l'objet +obj+
* suivant que +condition+ est vrai ou fausse
***/
static addClassIf(obj, condition, css){
  $(obj)[condition?'addClass':'removeClass'](css)
}

/**
* Affiche ou masque l'objet +obj+ suivant la condition +condition+
***/
static showIf(obj, condition){
  return this.addClassIf(obj, !condition, 'hidden')
}

// Observer le clic sur l'élément DOM +button+ en actionnant la méthode
// +method+
static listenClick(button, method){
  this.listen(button,'click',method)
}
// Inverse de la précédente
static unlistenClick(button, method){
  this.unlisten(button,'click',method)
}

static listen(button, evType, method){
  button.addEventListener(evType,method)
}
static unlisten(button, evType, method){
  button.removeEventListener(evType,method)
}


/**
  Méthode qui insert la brique html de chemin relatif +fname+ (dans ./html)
  dans le container +container+.
**/
static insert(fname, container){
  return new Promise((ok,ko)=>{
    Ajax.send('system/get-brique.rb', {rpath: fname})
    .then(ret => {
      container = container || document.body
      if ( 'string' == typeof container ) { container = document.querySelector(container) }
      container.insertAdjacentHTML('beforeend', ret.brique)
      ok(ret)
    })
  })
}
}
