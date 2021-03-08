'use strict';

class Tache {
/** ---------------------------------------------------------------------
*
*   CLASSE
*
*** --------------------------------------------------------------------- */

/**
* Méthode principale permettant de charger et d'afficher les tâches courantes
***/
static load(){
  this.lastId = 0
  return Ajax.send('taches-load.rb')
  .then(this.dispatchData.bind(this))
  .then(this.displayTaches.bind(this))
  .then(this.observeUI.bind(this))
}

static get(tache_id){
  return this.items[tache_id]
}

static newId(){
  if ( undefined == this.lastId ) this.lastId = 0
  return ++ this.lastId
}

// ON dispatche toutes les données
static dispatchData(ret){
  // console.log("-> Tache.dispatchData", ret)
  Label.dispatchData.call(Label, ret.labels)
  this.dispatchTaches(ret.taches)
}
// Crée les instances
static dispatchTaches(dtaches){
  dtaches.forEach(dtache => this.addTacheWithData(dtache))
}

// Affiche toutes les tâches
static displayTaches(){
  for(var tid in this.items){
    const tache = this.items[tid]
    tache.display()
  }
}

// Observer l'interface
static observeUI(){
  TacheForm.init()
  message("Je suis prêt.")
}

// Ajoute une tâche par ses données en l'ajoutant à la liste des items
// Noter que cette méthode est appelée chaque fois qu'on enregistre une
// tâche ou qu'on la crée. Elle ne doit donc pas servir, par exemple, à
// comptabiliser le nombre de tâches.
static addTacheWithData(dtache){
  if (undefined === this.items) this.items = {}
  if ( this.lastId < dtache.id ) this.lastId = Number(dtache.id)
  Object.assign(this.items, {[dtache.id]: new Tache(dtache)})
}

/**
* Ajoute une marque pour le jour de la tâche +tache+ si nécessaire.
Dans tous les cas, retourne la marque du jour (pour permettre de mettre la
tâche après)
***/
static setOrGetMarkJourFor(tache){
  var markJour = DGet(`div.jour[data-day="${tache.date.day}"]`, this.containerFutures)
  if ( ! markJour ) {
    // <= La marque du jour de la tâche future n'est pas encore affichée
    // => On doit l'ajouter
    var placed = false
    this.containerFutures.querySelectorAll('.jour').forEach(divjour => {
      if ( placed ) return
      const dayjour = divjour.getAttribute('data-day')
      if (dayjour == tache.date.day) {
        // <= C'est la marque du jour pour la tâche
        // => On la prend comme marque du jour
        markJour = divjour
        placed = true
      } else if ( dayjour > tache.date.day ) {
        // <= La marque du jour courant est supérieure à la date de la tâche
        // => Il faut mettre la tâche avant
        markJour = DCreate('div', {'data-day':tache.date.day, class:'jour', text:tache.date.formate()})
        this.containerFutures.insertBefore(markJour, divjour)
        placed = true
      }
    })
    if ( !placed ) {
      // <= La marque du jour n'a pas pu être prise ou insérée
      // => On la marque là
      markJour = DCreate('div', {'data-day':tache.date.day, class:'jour', text:tache.date.formate()})
      this.containerFutures.appendChild(markJour)
    }
  }
  return markJour
}


static get containerOutOfDate(){
  return this._outofdates || (this._outofdates = DGet('#taches-out-of-date'))
}
static get containerFutures(){
  return this._futures || (this._futures = DGet('#taches-futures'))
}
static get containerToday(){
  return this._todays || (this._todays = DGet('#taches-of-the-day'))
}
static get containerTodayPrior(){
  return this._todaysprior || (this._todaysprior = DGet('#taches-prioritaires', this.containerToday))
}
static get containerTodayReal(){
  return this._todaysreal || (this._todaysreal = DGet('#taches-today',this.containerToday))
}
static get containerTodayNotPrior(){
  return this._todaysnonprior || (this._todaysnonprior = DGet('#taches-non-prioritaires',this.containerToday))
}

static get container(){return this._container || (this._container = DGet('#taches'))}
/** ---------------------------------------------------------------------
*
*   INSTANCE
*
*** --------------------------------------------------------------------- */
constructor(data) {
  this.dispatchData(data)
}

dispatchData(data){
  for(var k in data){ if ( data[k] == '') data[k] = null }
  if ('string' == typeof(data.priority)) data.priority = parseInt(data.priority,10)
  this.data = data
  this.id = data.id
  this.content = data.content
  this.priority = data.priority
  this.echeance = data.echeance
  this.duree    = data.duree
  this.labels   = data.labels
}

// Sauvegarde de la tache
save(){
  return Ajax.send('tache-save.rb', {tache_data: this.data})
}
/**
* Affichage de la tâche
* ---------------------
Dans l'affichage on trouve :

  Les tâches qui auraient dû être terminées (if any)
  La date d'aujourd'hui
    Avec les tâches sans échéances urgente (priorité >= 3)
    Avec les tâches d'aujourd'hui
  Les tâches non urgentes sans échéance
  Les tâches avec échéance, par date

Synopsis
--------
  Si c'est une

  SI la tâche définit une échéance, on parcourt la liste des tâches
  ET
    SI le jour de l'échéance existe, on ajoute la tâche à cet endroit
    SI le jour de l'échéance n'existe pas (qu'on arrive à un jour suivant),
      on crée ce jour et on l'ajoute à la liste
  SINON
    SI la tâche a une forte priorité => on la met tout au-dessus
    SI la tâche à une priorité faible => on la met en dessous
***/
display(){
  // Dans un premier temps, si la tâche a déjà été construite, on doit
  // détruire son affichage
  if ( this.built ) {
    this.unobserve
    this.div.remove()
    this._div = null
    delete this._div
  }

  const mere = this.constructor
  if ( this.isPrioritaire ) { this.insertIn(mere.containerTodayPrior) }
  else if ( this.isNonPrioritaire) { this.insertIn(mere.containerTodayNotPrior) }
  else if ( this.isTodays ) { this.insertIn(mere.containerTodayReal) }
  else if ( this.isOutOfDate ) {
    this.insertIn(mere.containerOutOfDate)
    mere.containerOutOfDate.classList.remove('hidden')
  }
  else { // Tâche future
    // Si le jour n'est pas encore affiché, on l'ajoute
    const markJour = mere.setOrGetMarkJourFor(this)
    this.insertIn(mere.containerFutures, markJour.nextSibling)
  }

  // On l'observe toujours
  this.observe()
}

/**
* Pour insérer la tâche
***/
insertIn(container, before){
  if (undefined == before) {
    container.appendChild(this.div)
  } else {
    container.insertBefore(this.div, before)
  }
}

get isPrioritaire(){
  return this._isprior || (this._isprior = (!this.echeance) && this.priority >= 3)
}
get isNonPrioritaire(){
  return this._nonpriori || (this._nonpriori = (!this.echeance) && this.priority < 3)
}
get isOutOfDate(){
  return this._isoutofdate || (this._isoutofdate = this.echeance && this.date.isPast)
}
get isTodays(){
  return this._istodays || ( this._istodays = this.echeance && this.date.isToday)
}
get date(){
  return this._date || ( this._date = new SmartDate(this.echeance) )
}

// Si la tâche possède une échéance, cette méthode retourne le div pour
// le jour à marquer
divJour(){
  var titre ;
  if (this.echeance) {
    titre = this.formated_echeance
  } else if ( Number(this.priority) > 3 ) {
    titre = "Urgent sans échéance"
  } else {
    titre = "Autres tâches"
  }
  return DCreate('div', {class:'jour', text:titre})
}
get formated_echeance(){
  return capitalize(formate_date(this.date_echeance))
}
get date_echeance(){
  return this._dateeche || (this._dateeche = new Date(Date.parse(this.echeance)) )
}

onEdit(){
  TacheForm.edit(this)
}
onDestroy(){
  let confirmation = TEST_ON ? !!Test.confirmation : confirm('Êtes-vous certain de vouloir détruire la tâche “'+this.content+'”')
  if(confirmation){
    Ajax.send('tache-destroy.rb', {tache_id:this.id})
    .then(this.div.remove.bind(this.div))
  }
}

get div(){
  return this._div || (this._div = this.build())}
get divId(){return this._divid || (this._divid = `tache-${this.id}`)}

build(){
  const inners = []
  inners.push(DCreate('span', {id:`${this.divId}-buttons`, class:'buttons', inner: [
      DCreate('button', {id:`${this.divId}-btn-edit`, text:'🛠'})
    , DCreate('button', {id:`${this.divId}-btn-supp`, text:'🗑'})
  ]}))
  inners.push(DCreate('span', {id:`${this.divId}-labels`, class:'tache-labels', inner:this.formated_labels}))
  inners.push(DCreate('input', {id:`${this.divId}-cb-done`, class:'cb-done', type:'checkbox'}))
  inners.push(DCreate('span', {id:`${this.divId}-content`, class:'tache-content', text:this.content}))
  const div = DCreate('div',{id:this.divId, 'data-id':this.id, class:'tache', inner: inners})
  this.built = true
  return div;
}

observe(){
  DGet(`#${this.divId}-btn-edit`).addEventListener('click', this.onEdit.bind(this))
  DGet(`#${this.divId}-btn-supp`).addEventListener('click', this.onDestroy.bind(this))
}
unobserve(){
  DGet(`#${this.divId}-btn-edit`).removeEventListener('click', this.onEdit.bind(this))
  DGet(`#${this.divId}-btn-supp`).removeEventListener('click', this.onDestroy.bind(this))
}

// *** Private methods ***

/**
* Retourne les labels formatés
***/
get formated_labels(){
  var spans = []
  ;(this.labels||[]).forEach(lid => spans.push(Label.get(lid).output))
  return spans
}

}// class Tache
