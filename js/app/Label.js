'use strict';

class Label {
/** ---------------------------------------------------------------------
*
*   CLASSE
*
*** --------------------------------------------------------------------- */

static get(lid){return this.items[lid]}

static init(){
  this.items  = {}
  this.lastId = 0
}
/**
* Méthode appelée au chargement pour dispatcher les données des labels
***/
static dispatchData(data){
  // console.log("-> Label.dispatchData")
  this.init()
  data = data || {}
  for(var lid in data){this.addLabelWithData(data[lid])}
}

static addLabelWithData(dlabel){
  if ( this.lastId < dlabel.id ) this.lastId = Number(dlabel.id)
  Object.assign(this.items, {[dlabel.id]: new Label(dlabel)})
}


/**
* Méthode qui met en forme les labels transmis
***/
static formate(labels_ids){
  if (!labels_ids || labels_ids == '') return ''
  var str = []
  labels_ids.forEach(label_id => str.push(this.get(label_id).output))
  return str.join('')
}

// Retourne un nouvel identifiant
static newId(){
  if (undefined === this.lastId) this.lastId = 0
  return ++ this.lastId
}
/** ---------------------------------------------------------------------
*
*   INSTANCE
*
*** --------------------------------------------------------------------- */
constructor(data) {
  this.data = data
  this.id     = data.id
  this.name   = data.name
  this.colors = data.colors
}

get output(){
  return this._output || (this._output = this.build())
}
build(){
  const span = DCreate('span', {class:'label', 'data-id': this.id, style:this.style, text:this.name})
  return span.outerHTML
}

get style(){
  var [fg, bg] = this.colors.split(':')
  return `color:${fg||'black'};background-color:${bg||'#CCCCCC'};`
}
/**
* Sauvegarde du label (@asyn)
* @async
***/
save(){
  return Ajax.send('label-save.rb', {label_data: this.data})
}

}// class Label
