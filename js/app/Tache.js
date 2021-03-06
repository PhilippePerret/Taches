'use strict';

class Tache {
/** ---------------------------------------------------------------------
*
*   CLASSE
*
*** --------------------------------------------------------------------- */
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
  message("Je dois éditer la tâche #" + this.id)
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
