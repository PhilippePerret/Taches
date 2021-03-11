'use strict'
/**
=== GESTION DU MODE D'AFFICHAGE ===

Ce module permet de :
  - choisir un mode d'affichage
  - afficher les tâches suivant ce module.
***/
class ModeAffichage {
/**
Appelée quand on change de mode d'affichage
***/
static onChangeModeAffichage(ev){
  if ( this.currentModeAffichage ) this.unprepareModeAffichage(this.currentModeAffichage)
  const methodName = `display_ModeAffichage_${this.menuMode.value}`
  if ('function' == typeof this[methodName]){
    this.display = this[methodName].bind(this)
    this[`prepare_ModeAffichage_${this.menuMode.value}`].call(this)
    ev && Tache.updateDisplay()
    this.currentModeAffichage = String(this.menuMode.value)
  }
  ev && stopEvent(ev)
}

static unprepareModeAffichage(mode){
  DGet(`#mode-affichage-${mode}`, Tache.container).classList.add('hidden')
}

static resetListing(params = {}){
  this.listing.classList.remove('hidden')
  params.titre && (DGet('div.titre',this.listing).innerHTML = params.titre);
  this.listingTaches = DGet('div.taches',this.listing)
  this.listingTaches && (this.listingTaches.innerHTML = '');
}

/** ---------------------------------------------------------------------
*
*   LES DIFFÉRENTS MODES D'AFFICHAGE
*

Changer de mode d'affichage consiste à :
  - définir la méthode :display des tâches
  - réafficher toutes les tâches

  Comme la méthode :display de la tâche sera modifiée, les tâches
  s'afficheront ensuite de la même manière
*** --------------------------------------------------------------------- */
static prepare_ModeAffichage_listing(){
  this.listing = DGet(`#mode-affichage-listing`, Tache.container)
  this.resetListing()
}

// La méthode par laquelle passent toutes les tâches pour les afficher dans
// le mode "listing" (mode par défaut)
static display_ModeAffichage_listing(tache){
  const mere = tache.constructor
  // Dans un premier temps, si la tâche a déjà été construite, on doit
  // détruire son affichage
  // Noter un point important : ça n'est plus la même instance, lorsqu'on
  // modifie une donnée
  const oldDiv = DGet(`#tache-${tache.id}`, mere.container)
  oldDiv && oldDiv.remove()

  if ( tache.isDone ) { tache.insertIn(mere.containerDone) }
  else if ( tache.isOutOfDate || tache.isUrgente ) {
    tache.insertIn(mere.containerOutOfDate)
    mere.containerOutOfDate.classList.remove('hidden')
  } else if ( tache.isPrioritaire ) { tache.insertIn(mere.containerTodayPrior) }
  else if ( tache.isNonPrioritaire) { tache.insertIn(mere.containerNotPrior) }
  else if ( tache.isTodays ) { tache.insertIn(mere.containerTodayReal) }
  else { // Tâche future
    // Si le jour n'est pas encore affiché, on l'ajoute
    const markJour = mere.setOrGetMarkJourFor(tache)
    tache.insertIn(mere.containerFutures, markJour.nextSibling)
  }
}

static prepare_ModeAffichage_focus(){
  this.prepare_ModeAffichage_listing() // c'est le même
}
// static display_ModeAffichage_focus(){
// }
//
// static display_ModeAffichage_gantt(){
// }
//

static prepare_ModeAffichage_labels(){
  this.listing = DGet('section#mode-affichage-simple-listing',Tache.container)
  this.resetListing({titre: 'classement par labels'})
}
// La méthode par laquelle passent toutes les tâches pour les afficher dans
// le mode "labels"
static display_ModeAffichage_labels(tache){
  const firstLabelId  = tache.labels[0] || 'none'
  const markLabelId   = `mark-label-${firstLabelId}`
  let markLabel = DGet(`div.mark-label#${markLabelId}`)
  if ( not(markLabel) ){
    // <= Pas de marque pour ce label, encore, dans l'affichage
    // => Il faut ajouter cette marque, au bout de la liste
    const label = tache.labels[0] ? Label.get(firstLabelId) : 'Sans label'
    markLabel = label
                  ? label.buildAsMark()
                  : DCreate('div',{id:markLabelId, class:'mark-label',text:"Sans label"})
    this.listingTaches.appendChild(markLabel)
  }
  tache.insertIn(this.listingTaches, markLabel.nextSibling)
}
//
// static display_ModeAffichage_priority(tache){
// }
//
// static display_ModeAffichage_duree_desc(tache){
// }
//
// static display_ModeAffichage_duree_asc(tache){
// }
/** ---------------------------------------------------------------------
*
*   LES MÉTHODES FONCTIONNELLES
*
*** --------------------------------------------------------------------- */
static init(){
  this.menuMode.addEventListener('change', this.onChangeModeAffichage.bind(this))
  // Le mode d'affichage par défaut
  this.menuMode.value = 'listing'
  this.onChangeModeAffichage(null/* pour ne pas afficher les tâches [1]*/)
  // [1] Elles ne sont pas encore chargées
}
static get menuMode(){
  return this._menumode||(this._menumode=DGet('select#mode-affichage'))
}

} // class ModeAffichage
