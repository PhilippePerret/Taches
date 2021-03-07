'use strict'
/** ---------------------------------------------------------------------
*   Class SmartList
*
Les "SmartList" permettent de choisir un élément dans une liste en tapant
le début de son nom, ou de le créer s'il n'existe pas.

@usage

  Pour instancier la small-liste :
    const slist = new SmartList({data:data, oncreate:oncreate, title:titre})

    où :
      <data> est une table avec en VALEUR les ID et en CLÉ les strings
      <onCreate> est la méthode à appeler pour créer l'élément
*** --------------------------------------------------------------------- */
class SmartList {
static newId(){
  if(undefined == this.lastId) this.lastId = 0
  return ++ this.lastId
}

constructor(data, params) {
  this.data     = data
  this.params   = params
  this.strings  = Object.keys(this.data)
  this.title    = params.titre || params.title
  this.id       = params.id || this.constructor.newId()
  // Utile
  this.foundSelectedIndex = null
}

open(){
  this.built || this.build()
  this.div.classList.remove('hidden')
  this.inputField.focus()
}
close(){
  // console.log("this.div in close = ", this.div)
  this.div.classList.add('hidden')
}

onClickFound(found, ev){
  // console.log("found = ", found, this)
  if ( found ) {
    this.selected = found
    // Si une méthode après la sélection est définie, on l'appelle en lui
    // transmettant l'item choisi, c'est-à-dire une table définissant
    // :content et :id
    this.params.onselect && this.params.onselect.call(null, found)
  } else {
    // S'il ne reste aucun trouvés, il faut créer l'élément
    this.params.oncreate && this.params.oncreate.call(null, this.inputField.value)
  }
  this.close()
  if ( ev ) return stopEvent(ev)
}

/**
* Méthode appelée quand on tape un texte
  SI c'est une flèche bas/haut => on choisit dans la liste
  SI c'est la touche entrée => on choisit ou on crée si vide
  SINON, on filtre la liste avec la valeur fournie
***/

onKeyUp(ev){
  // console.log("ev.key", ev.key)
  switch(ev.key){
    case 'Enter':
      this.onClickFound(this.foundSelected)
      break
    case 'ArrowUp':
      this.selectPrevFound()
      break
    case 'ArrowDown':
      this.selectNextFound()
      break
    case 'Escape':
      this.close()
      break
    default:
      this.filterAndShow(this.inputField.value)
      return true
  }
  return stopEvent(ev)
}

// Méthode appelée pour sélectionner le sélectionné précédent
selectPrevFound(){
  if (!this.foundSelectedIndex) this.foundSelectedIndex = this.founds.length
  -- this.foundSelectedIndex
  this.selectFound()
}
// Méthode appelée pour sélectionne le trouvé suivant
selectNextFound(){
  if (null === this.foundSelectedIndex) this.foundSelectedIndex = -1
  ++ this.foundSelectedIndex
  if ( this.foundSelectedIndex >= this.founds.length ) {
    this.foundSelectedIndex = 0
  }
  this.selectFound()
}
selectFound(){
  if ( this.foundSelected ) this.foundSelected.classList.remove('selected')
  const osel = this.foundsField.querySelectorAll('.smartlist-found')[this.foundSelectedIndex]
  osel.classList.add('selected')
  this.foundSelected = osel
}

/**
* Méthode qui filtre les strings à l'aide du string +filter+ et les affiches
* dans la liste de choix
***/
filterAndShow(str){
  const my = this
  this.foundsField.innerHTML = ''
  this.filter(str).forEach(found => {
    const obj = DCreate('div',{text:found.content, class:'smartlist-found', 'data-id': found.id})
    this.foundsField.appendChild(obj)
    obj.addEventListener('click', my.onClickFound.bind(my, found))
  })
  this.foundSelectedIndex = null
  this.foundSelected = null
}

filter(str){
  var founds = []
  var lenstr = str.length
  this.strings.forEach(string => {
    if(string.substring(0,lenstr) == str){
      founds.push({id:this.data[string], content:string})
    }
  })
  this.founds = founds
  return founds
}


build(){

  this.divid = `smartlist-${this.id}`

  const inners = []
  inners.push(DCreate('div', {class:'smartlist-title', text:this.title}))
  inners.push(DCreate('input', {type:'text', class:'smartlist-input'}))
  inners.push(DCreate('div',{class:'smartlist-founds'}))
  this.div = DCreate('div', {id:this.divid,class:'smartlist hidden', inner:inners})
  document.body.appendChild(this.div)
  this.observe()
  this.built = true
}
observe(){
  $(this.div).draggable()
  this.inputField.addEventListener('keyup', this.onKeyUp.bind(this))
}
get inputField(){return this._inputfield || (this._inputfield = DGet('.smartlist-input', this.div))}
get foundsField(){return this._foundsfield || (this._foundsfield = DGet('.smartlist-founds', this.div))}
}// class SmartList
