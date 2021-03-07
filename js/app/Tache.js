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

static get containerPrior(){
  return this._contprior || (this._contprior = DGet('#taches-prioritaires-sans-echeance'))
}
static get containerEche(){
  return this._conteche || (this._conteche = DGet('#taches-avec-echeance'))
}
static get containerNonPrior(){
  return this._contnonprior || (this._contnonprior = DGet('#taches-non-prioritaires-sans-echeance'))
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
Synopsis
--------
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
  const container = (()=>{
    if ( this.isPrioritaire) return this.constructor.containerPrior
    else if (this.isNonPrioritaire) return this.constructor.containerNonPrior
    else return this.constructor.containerEche
  })()

  // console.log({
  //   id: this.id,
  //   priority: this.priority,
  //   prioritaire: this.isPrioritaire,
  //   non_prioritaire: this.isNonPrioritaire,
  //   echeance: this.echeance,
  //   container: container
  //   })

  // Si on affiche par échéance
  // => On doit chercher le jour de la tâche
  //    S'il n'existe pas, on le crée avant le premier jour après
  var placed = false
  if ( this.echeance ) {
    container.querySelectorAll('.jour').forEach(divjour => {
      const jour = divjour.getAttribute('data-jour')
      if ( jour > this.echeance ){
        container.insertBefore(this.divJour(), divjour)
      }
    })
  } else {
    container.insertBefore(this.div, divtache)
  }

  container.querySelectorAll('.tache').forEach( divtache => {
    if ( placed ) return // pour accélérer
    const curtache = this.constructor.get(Number(divtache.getAttribute('data-id')))
    placed = true
  })

  // On l'observe toujours
  this.observe()
}

get isPrioritaire(){
  return this._isprior || (this._isprior = (!this.echeance) && this.priority >= 3)
}
get isNonPrioritaire(){
  return this._nonpriori || (this._nonpriori = (!this.echeance) && this.priority < 3)
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
