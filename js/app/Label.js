'use strict';

class Label {
/** ---------------------------------------------------------------------
*
*   CLASSE
*
*** --------------------------------------------------------------------- */

static get(lid){return this.items[lid]}

static getByName(label){
  for(var lid in this.items){
    if ( this.items[lid].name == label ) return this.items[lid]
  }
}
/**
* Méthode appelée pour choisir ou créer un label
***/
static choose(){
  console.log("-> Label::choose")
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
  // On n'a rien à faire pour le moment
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
  const newLabel = this.create(label)
  TacheForm.addLabel(newLabel)
}

static create(label){
  const data = {
      id:     this.newId()
    , name:   label
    , colors: this.newColors()
  }
  Object.assign(this.items, {[data.id]: newLabel})
  newLabel.save()
  return new Label(data)
}

static get dataSmartList(){
  var h = {}
  for(var id in this.items){
    Object.assign(h, { [this.items[id].name]: this.items[id].id })
  }
  return h
}

static init(){
  this.reset()
}

static reset(){
  this.items  = {}
  this.lastId = 0
  LabelForm.init()
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

// Retourne un nouvel identifiant
static newId(){
  if (undefined === this.lastId) this.lastId = 0
  return ++ this.lastId
}
// Retourne un couple "<couleur police>:<couleur fond>"
static newColors(){
  if (undefined === this.paletteCouleurs || this.paletteCouleurs.length == 0) this.paletteCouleurs = this.initPaletteCouleurs()
  return this.paletteCouleurs.pop()
}
static initPaletteCouleurs(){
  return [
      '#FFFCCC:#CCC'
    , '#FFF:#555'
    , 'black:#CCF'
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
  this.dispatchData(data)
}

dispatchData(data){
  this.data   = data
  this.id     = data.id
  this.name   = data.name
  this.colors = data.colors
}

get output(){ return this.build() }
build(){
  const btnsup  = DCreate('span', {class:'label-btn-sup mini-btn-sup', text:'⨯'})
  const label   = DCreate('span', {class:'label-name mini-name', text:this.name})
  const span = DCreate('span', {class:'label', 'data-id': this.id, style:this.style, inner:[label, btnsup], title:`Label #${this.id}`})
  label.addEventListener('click', this.edit.bind(this))
  return span
}

buildAsMark(){
  const label = DCreate('span', {class:'label-name', text:this.name})
  const div = DCreate('div', {id:`mark-label-${this.id}`, class:'mark-label label', 'data-id': this.id, inner:label, style:this.style})
  div.addEventListener('click', this.edit.bind(this))
  return div
}

// Pour actualiser tous les labels créés
// (ce qui consiste à 1) actualiser le nom et 2) actualiser la couleur
updateAll(){
  document.querySelectorAll(`.label[data-id="${this.id}"]`).forEach(span => {
    span.style = this.style
    DGet('.label-name',span).innerHTML = this.name
  })
}

edit(){
  LabelForm.edit.call(LabelForm,this)
}

get style(){
  return `color:${this.foregroundColor};background-color:${this.backgroundColor};`
}

get foregroundColor(){return this.colors.split(':')[0] || 'black'}
get backgroundColor(){return this.colors.split(':')[1] || '#CCCCCC'}

/**
* Sauvegarde du label (@asyn)
* @async
***/
save(){
  return Ajax.send('label-save.rb', {label_data: this.data})
}

}// class Label
