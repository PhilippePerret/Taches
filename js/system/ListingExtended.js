'use strict'
/** ---------------------------------------------------------------------
*   Classe abstraite ExtendedListing
*
*** --------------------------------------------------------------------- */
class ListingExtended {
/** ---------------------------------------------------------------------
*   CLASSE
*
*** --------------------------------------------------------------------- */
static init(){
  this.table = {}
  this.lastId = 0 // le premier doit être 1
}

static get(itemId){return this.table[itemId]}

static newId(){return ++this.lastId}

/**
* Liste des events classés (par la méthode this.sortMethod )
***/
static get orderedList(){
  if ( !this._orderedList ){
    this._orderedList = Object.values(this.table).sort(this.sortMethod.bind(this))
    // On renseigne la donnée 'index' de chaque évènement
    for(var i = 0, len = this._orderedList.length; i < len ; ++i){
      this._orderedList[i].index = Number(i)
    }
    this.count = this._orderedList.length
    this.lastIndex = this.count - 1
  }
  return this._orderedList
}

/**
* Retourne TRUE si l'item +item+ est le dernier de la liste
***/
static isLastItem(item){
  return this.isOrdered && (item.index === this.lastIndex)
}

/**
* Actualiser la liste ordonnée (après une création, un suppression,
un déplacement)
***/
static resetOrderedList(){
  delete this._orderedList
  this.orderedList // pour actualiser et notamment remettre à jour les index
  // console.log("_orderedList = ", this._orderedList)
}

static get firstChildVisible(){
  var litem = this.listing.liste.firstChild;
  while(litem.style.display == 'none'){litem = litem.nextSibling}
  return litem
}
static get lastChildVisible(){
  var litem = this.listing.liste.lastChild;
  while(litem.style.display == 'none'){litem = litem.previousSibling}
  return litem
}

// Pour sélectionner le premier item (if any)
static selectFirst(){
  if ( Object.keys(this.table).length ) {
    var litem = this.firstChildVisible
    var item = this.get(parseInt(litem.id.split('-')[1]))
    this.listing.select(item)
  } else {
    error("Impossible de sélectionner le premier élément. Il n'y en a pas.", {keep:false})
  }
}
// Pour sélectionner le dernier item (if any)
static selectLast(){
  if ( Object.keys(this.table).length ) {
    var litem = this.lastChildVisible
    var item = this.get(parseInt(litem.id.split('-')[1]))
    this.listing.select(item.listingItem)
  } else {
    error("Impossible de sélectionner le dernier élément. Il n'y en a pas.", {keep:false})
  }
}
// Pour sélectionner l'item suivant (if any)
static selectNext(){
  var item = this.listing.getSelection()[0]
  if ( item ) {
    var litem = item.listingItem.obj.nextSibling
    while(litem && litem.style.display == 'none'){litem = litem.nextSibling}
    if (litem) {
      const item  = this.get(Number(litem.id.split('-')[1]))
      this.listing.select(item)
    } else {
      this.selectFirst()
    }
  } else {
    this.selectFirst()
    // error("Aucun item trouvé… Impossible de passer au suivant.", {keep:false})
  }
}
// Pour sélectionner l'item précédent (if any)
static selectPrevious(){
  var item = this.listing.getSelection()[0]
  if ( item ) {
    var litem = item.listingItem.obj.previousSibling
    while(litem && litem.style.display == 'none'){litem = litem.previousSibling}
    if (litem) {
      const item  = this.get(Number(litem.id.split('-')[1]))
      this.listing.select(item)
    } else {
      this.selectLast()
    }
  } else {
    this.selectLast()
    // error("Aucun item trouvé… Impossible de passer au précédent.", {keep:false})
  }
}

/**
* Méthode qui charge les items (locators ou events) et les instancie
***/
static load(){
  __in("%s::load", this.name)
  this.init()
  return Ajax.send(this.loadScript)
  .then(this.dispatchItems.bind(this))
  .then(this.addItemsToListing.bind(this))
  __out("%s::load", this.name)
}
static dispatchItems(ret){
  __in("%s::dispatchItems", this.name)
  // ret.items.forEach(loc => this.addFromData(loc))
  ret.items.forEach(this.addFromData.bind(this))
  __out("%s::dispatchItems", this.name)
}
/**
Pour afficher les items dans le listing
Si une méthode 'sortMethod' existe, c'est une liste classée qu'on doit
afficher
*/
static addItemsToListing(){
  __in("%s::addItemsToListing", this.name)
  const list = this.isOrdered ? this.orderedList : Object.values(this.table)
  list.forEach(item => this.listing.add(item) )
  __out("%s::addItemsToListing", this.name)
}
static addFromData(data){
  const item = new this(data)
  if(item.id > this.lastId) this.lastId = Number(item.id)
  Object.assign(this.table, {[item.id]: item})
}

/**
* Appelée à la création d'un nouvel item avec les données +data+
***/
static create(data){
  Object.assign(data, {id: this.newId()})
  const item = new this(data)
  Object.assign(this.table, {[item.id]: item})
  item.save()
  return item // pour l'ajouter à la liste
}

/**
* Méthode système appelée après l'ajout de l'item dans la liste, quand
c'est une création.
***/
static __afterCreate(item){
  if (this.isOrdered) {
    this.resetOrderedList()
    item.repositionne()
    item.select()
  }
}

/**
* Actualisation des données
***/
static update(data){
  var item = this.get(data.id)
  item.isSelectedItem = this.listing.selection.lastItem && item.id == this.listing.selection.lastItem.id
  if (item) {
    item.update(data)
  } else {
    console.error("Impossible de trouver l'item %s dans ", String(data.id), this.table)
  }
}

/**
Appelé par le listing quand on détruit un item
Note : si c'est une liste ordonnée, elle est actualisée
*/
static onDestroy(item){
  const isSelectedItem = this.listing.selection.lastItem && item.id == this.listing.selection.lastItem.id
  if ( isSelectedItem ) {
    // Quand c'est l'item sélectionné qui doit être détruit, il faut voir
    // quel item on va sélectionner en remplacement. Pour ça, et pour que ça
    // fonctionne pour toutes les configurations, on regarde dans le DOM
    item.isSelectedItem = isSelectedItem
    item.sibling = item.listingItem.obj.nextSibling || item.listingItem.obj.previousSibling
  }
  Ajax.send(this.destroyItemScript, {id: item.id})
  .then(() => {
    delete this.table[item.id]
    this.isOrdered && this.resetOrderedList()
  })
}

static afterDestroy(item){
  console.log("item détruit : ", item)
  if ( item.isSelectedItem && item.sibling ) {
    const other = this.get(Number(item.sibling.id.split('-')[1]))
    console.log("Autre : ", other)
    other.select()
  }
}


static get isOrdered(){
  return this._isorderedlist || (this._isorderedlist = 'sortMethod' in this)
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
  this.data = data
  this.id = data.id
}
save(){
  return Ajax.send(this.constructor.saveItemScript, {data: this.data})
  // .then(ret => console.log(ret))
}

/**
* Actualisation de l'item
    - enregistre ses nouvelles données
    - actualise son affichage
    - le replace si c'est une liste ordonnée et que son index a changé
***/
update(data){
  // console.log("-> update %s avec ", this.ref, data)
  this.updating = true
  const oldIndex = this.index // undefined si pas liste ordonnée
  this.dispatchData(data)
  this.save()
  this.afterUpdate && this.afterUpdate()
  this.listingItem.replaceInList()
  if ( this.constructor.isOrdered ) {
    this.constructor.resetOrderedList()
    this.index == oldIndex || this.repositionne()
  }
  this.isSelectedItem && this.select()
  this.updating = false
}

destroy(lefaire = false){
  lefaire = lefaire || confirm("Es-tu certain de vouloir détruire cet éléments ?")
  lefaire && this.constructor.listing.onMoinsButton({}, true)
}

/**
* Méthode qui repositionne l'item au bon endroit dans la liste
en fonction de son index
Rappel : l'index n'est calculé que lorsque c'est une liste classée
Rappel : le listing ne fonctionne par liste classée (orderedList) que
         lorsque la méthode this.sortMethod est définie.
***/
repositionne(){
  // console.log(`Repositionnement de ${this.ref}`)
  const li = this.listingItem.obj
      , listing = li.parentNode
  if ( this.constructor.isLastItem(this) ) {
    listing.appendChild(li)
  } else {
    listing.removeChild(li)
    listing.insertBefore(li, listing.children[this.index])
  }
}

}
