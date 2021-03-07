'use strict';

class Label {
/** ---------------------------------------------------------------------
*
*   CLASSE
*
*** --------------------------------------------------------------------- */

static get(lid){return this.items[lid]}

/**
* Méthode appelée pour choisir ou créer un label
***/
static choose(){
  if (undefined == this.smartlist){
    this.smartlist = new SmartList(this.dataSmartList, {
        title: 'Labels'
      , onselect: this.onSelectLabel.bind(this)
      , oncreate: this.createLabel.bind(this)
      , container: DGet('#tache-labels')
    })
  }
  this.smartlist.open()
}
static endChoose(){
  // On ne fait rien pour le moment
}

static onSelectLabel(selected){
  // console.log("Label::onSelectLabel(", selected)
  TacheForm.addLabel(this.get(selected.id))
}

/**
Méthode appelée quand on a entré un nouveau label dans la boite smartlist
pour créer un nouveau label
***/
static createLabel(label){
  const data = {
      id:     this.newId()
    , name:   label
    , colors: this.newColors()
  }
  const newLabel = new Label(data)
  TacheForm.addLabel(newLabel)
  newLabel.save()
}

static get dataSmartList(){
  var h = {}
  for(var id in this.items){
    Object.assign(h, { [this.items[id].name]: this.items[id].id })
  }
  return h
}

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
// Retourne un couple "<couleur foreground>:<couleur fond>"
static newColors(){
  if (undefined === this.paletteCouleurs || this.paletteCouleurs.length == 0) this.paletteCouleurs = this.initPaletteCouleurs()
  return this.paletteCouleurs.pop()
}
static initPaletteCouleurs(){
  return [
      '#FFFCCC:#CCC'
    , '#FFF:#555'
    , '#FFF:#FF5555'
    , '#FFF:#55FF55'
    , '#000:#CCFFCC'
  ]
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
  const btnsup  = DCreate('span', {class:'label-btn-sup', text:'⨯'})
  const label   = DCreate('span', {class:'label-name', text:this.name})
  const span = DCreate('span', {class:'label', 'data-id': this.id, style:this.style, inner:[label, btnsup]})
  return span
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
