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
  .then(this.dispatchTaches.bind(this))
  .then(this.displayTaches.bind(this))
  .then(this.observeUI.bind(this))
}

static newId(){
  if ( undefined == this.lastId ) this.lastId = 0
  return ++ this.lastId
}

// Crée les instances
static dispatchTaches(ret){
  ret.taches.forEach(dtache => this.addTacheWithData(dtache))
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

static addTacheWithData(dtache){
  if (undefined === this.items) this.items = {}
  if ( this.lastId < dtache.id ) this.lastId = Number(dtache.id)
  Object.assign(this.items, {[dtache.id]: new Tache(dtache)})
}

static get container(){return this._container || (this._container = DGet('#taches'))}
/** ---------------------------------------------------------------------
*
*   INSTANCE
*
*** --------------------------------------------------------------------- */
constructor(data) {
  this.data = data

  this.id = data.id
  this.content = data.content
  this.priority = Number(data.priority)
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
***/
display(){
  this.constructor.container.appendChild(this.div)
  this.observe()
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
  inners.push(DCreate('input', {id:`${this.divId}-cb-done`, class:'cb-done', type:'checkbox'}))
  inners.push(DCreate('span', {id:`${this.divId}-content`, class:'tache-content', text:this.content}))
  const div = DCreate('div',{id:this.divId, class:'tache', inner: inners})
  return div;
}

observe(){
  DGet(`#${this.divId}-btn-edit`).addEventListener('click', this.onEdit.bind(this))
  DGet(`#${this.divId}-btn-supp`).addEventListener('click', this.onDestroy.bind(this))
}

}// class Tache
