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
/**
* Affichage de la tâche
***/
display(){
  this.constructor.container.appendChild(this.div)
  this.observe()
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

}

}// class Tache
