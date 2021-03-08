'use strict'
class LabelForm {
static init(){
  this.observe()
  this.close()
}
static open(){this.obj.classList.remove('hidden')}
static close(){this.obj.classList.add('hidden')}
static onClose(){this.close()}

// Méthode appelée pour éditer le label +label+
static edit(label){
  this.label = label
  this.open()
  this.setValues(label.data)
}

// Pour détruire le label édité
static destroy(){
  if(!confirm("Êtes-vous certain de vouloir détruire le label “"+this.label.name+"” ?")) return
  const label_id = this.label.id
  // On fait la liste des opérations à exécuter
  var operations = []
  operations.push({operation:'destroy-label', id:label_id})
  // Le détruire dans chaque tâche qui l'utilise
  Object.values(Tache.items).forEach(tache => {
    if (!tache.labels) return
    if (tache.labels.includes(label_id)){
      operations.push({operation:'update-labels-tache', id:tache.id, labels:tache.removeLabel(label_id)})
    }
  })

  // Le détruire dans les données
  Ajax.send('exec-operations.rb',{operations: operations})
  .then(ret => {
    message(ret.message)
    // Détruire partout dans l'affichage
    document.querySelectorAll(`.label[data-id="${label_id}"]`).forEach(span => span.remove())
    this.close()
  })
}

// On sauve les données
static save(){
  var newData = this.checkedValues(this.getValues())
  if ( this.dataHasChanged(newData) ){
    this.label.dispatchData(newData)
    this.label.save().then(this.label.updateAll.bind(this.label))
    message("Données du label actualisées.")
  } else {
    message("Label inchangé.")
  }
  this.close()
}

static observe(){
  DGet('.btn-close',this.obj).addEventListener('click', this.onClose.bind(this))
  // Pour sauvre
  DGet('#form-btn-save-label',this.obj).addEventListener('click',this.save.bind(this))
  // Pour détruire le label
  DGet('#form-btn-destroy-label',this.obj).addEventListener('click',this.destroy.bind(this))
  // Lorsque l'on sort des champs de couleur, on doit actualiser l'aperçu
  this.obj.querySelectorAll('.color').forEach(field => field.addEventListener('blur',this.updateTemoin.bind(this)))
}

static updateTemoin(ev, data){
  data = data || this.checkedValues(this.getValues())
  var [fgColor, bgColor] = data.colors.split(':')
  this.spanTemoin.style = `background-color:${bgColor};color:${fgColor};`
  this.spanTemoin.innerHTML = data.name
  ev && stopEvent(ev)
}

static setValues(data){
  this.nameField.value = data.name
  var [fgColor, bgColor] = data.colors.split(':')
  this.foregroundColorField.value = fgColor.trim()
  this.backgroundColorField.value = bgColor.trim()
  this.updateTemoin(null, data)
}

// Retourne les valeurs
static getValues(){
  return {
      id: this.label.id
    , name:   this.nameField.value.trim()
    , colors: `${this.foregroundColorField.value.trim()}:${this.backgroundColorField.value.trim()}`
  }
}
static checkedValues(data){
  data.name != '' || Object.assign(data, this.label.name)
  var [fg,bg] = data.colors.split(':')
  fg != '' || (fg = this.label.foregroundColor)
  bg != '' || (bg = this.label.backgroundColor)
  data.colors = `${fg}:${bg}`
  return data
}

// Retourne true si les données du label édité ont changé
static dataHasChanged(newData){
  const data = this.label.data
  if ( newData.name != data.name ) return true
  if ( newData.colors != data.colors ) return true
  return false
}

static get nameField(){
  return this._namefield||(this._nameField=DGet('#label-name',this.obj))
}
static get foregroundColorField(){
  return this._fgcolorfield||(this._fgcolorfield=DGet('#label-foreground',this.obj))
}
static get backgroundColorField(){
  return this._bgcolorfield||(this._bgcolorfield=DGet('#label-background',this.obj))
}
static get spanTemoin(){
  return this._spantem||(this._spantem = DGet('#label-form-temoin',this.obj))
}


static get obj(){return this._obj||(this._obj = DGet('#label-form'))}
}
