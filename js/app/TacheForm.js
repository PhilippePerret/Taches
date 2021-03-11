'use strict'
class TacheForm {

static reset(){
  this.id = null
  this.labelsIds = []
  this.filesPaths = []
}

static init(){
  this.observe()
}

// Méthode appelée pour éditer la tache +tache+
static edit(tache){
  // console.log("éditer la tâche : ", tache)
  this.reset()
  this.open()
  this.setValues(tache.data)
  this.setSaveButton('Modifier')
  // message("Vous pouvez éditer la tâche #"+tache.id+".")
}

static toggle(){
  if ( this.obj.classList.contains('opened')){this.close()
  } else { this.open() }
}
static open(){
  this.obj.classList.add('opened')
  this.obj.style.bottom = '0px'
}
static close(){
  this.obj.classList.remove('opened')
  this.obj.style.bottom = `-${this.obj.offsetHeight-20}px`
}

static observe(){
  DGet('#form-btn-save-tache').addEventListener('click',this.onSaveTache.bind(this))
  DGet('#form-btn-init-tache').addEventListener('click',this.onInitForm.bind(this))
  DGet('#form-btn-add-label').addEventListener('click',this.onButtonAddLabel.bind(this))
  DGet('#form-btn-add-file').addEventListener('click',this.onButtonAddFile.bind(this))
  DGet('#handler', this.obj).addEventListener('click',this.toggle.bind(this))
  DGet('#btn-new-tache',this.obj).addEventListener('click',this.onWantCreateNewTache.bind(this))
}

/**

[1] Pour ne pas interférer avec le click sur le #handler
***/
static onWantCreateNewTache(ev){
  this.open()
  this.onInitForm(null)
  message("Vous pouvez créer la nouvelle tâche")
  return stopEvent(ev) // requis, ici [1]
}

static onButtonAddLabel(ev){
  Label.choose()
  return stopEvent(ev)
}

// Appelée quand on veut ajouter un fichier
static onButtonAddFile(ev){
  var path = prompt("Chemin d’accès complet au nouveau fichier :\n(il est possible de le glisser/déposer depuis le Finder)", "")
  if ( !path ) return
  this.addFile(path)
  return stopEvent(ev)
}

static onSaveTache(ev){
  const data = this.getValues()
  if (data){
    // console.log("Enregistrement de la tâche :", data)
    Ajax.send('tache-save.rb', {tache_data: data})
    .then(ret => {
      message(ret.message)
      Tache.addTacheWithData(data)
      const tache = Tache.get(data.id)
      tache.dispatchData(data)
      tache.display()
      this.close()
    })
  }
  return stopEvent(ev)
}

/**
* Méthode appelée pour ajouter un label
***/
static addLabel(ilabel){
  if ( undefined == this.labelsIds ) this.labelsIds = []
  if ( this.labelsIds.includes(ilabel.id) ) {
    message("Ce label est déjà dans la liste")
    return
  }
  const spanlabel = ilabel.output
  DGet('span.label-btn-sup', spanlabel).addEventListener('click', this.removeLabel.bind(this, ilabel))
  this.spanLabels.append(spanlabel)
  this.labelsIds.push(ilabel.id)
}
static removeLabel(ilabel){
  const labspan = DGet(`.label[data-id="${ilabel.id}"]`,this.obj)
  labspan.remove()
  this.labelsIds.splice(this.labelsIds.indexOf(ilabel.id),1)
  // console.log("this.labelsIds = ", this.labelsIds)
}

static addFile(path){
  if ( undefined == this.filesPaths ) this.filesPaths = []
  if ( this.filesPaths.includes(path) ) {
    message("Ce fichier est déjà dans la liste")
    return
  }
  const spanfile = this.buildSpanForFile(path)
  DGet('span.mini-btn-sup', spanfile).addEventListener('click', this.removeFile.bind(this, path))
  this.spanFiles.append(spanfile)
  this.filesPaths.push(path)
}
static removeFile(path, ev){
  const miniSpan = DGet(`span.file[data-id="${path}"]`,this.spanFiles)
  miniSpan.remove()
  this.filesPaths.splice(this.filesPaths.indexOf(path),1)
  ev && stopEvent(ev)
  return false
}
static buildSpanForFile(path){
  return DCreate('span',{class:'file mini-container', 'data-id':path, inner:[
      DCreate('span', {class:'mini-name', text:path.split('/').reverse()[0]})
    , DCreate('span', {class:'mini-btn-sup', text:'⨯'})
  ]})
}

static onInitForm(ev){
  this.reset()
  delete this.id
  this.setValues({})
  ev && stopEvent(ev)
  this.setSaveButton('Créer')
  return false
}

static setSaveButton(btnName){
  DGet('#form-btn-save-tache',this.obj).innerHTML = btnName
}

static getValues(){
  let data = {
      id: this.id || Tache.newId()
    , content:  this.contentField.value
    , labels:   this.labelsIds
    , start:    this.getStartInForm()
    , echeance: this.getEcheanceInForm()
    , duree:    this.dureeField.value
    , priority: this.priorityField.value
    , files:    this.filesPaths
  }
  data = this.checkValues(data)
  if ( data.errors ){
    erreur("La tâche contient des erreurs : " + data.errors)
    return
  } else {
    return data
  }
}

static getEcheanceInForm(){
  var val = this.echeanceField.value
  if ( val == '' ) return null
  else return SmartDate.parse(val).day
}
static getStartInForm(){
  var val = this.startField.value
  if (!val) return null
  else return SmartDate.parse(val).day
}

static setValues(data){
  this.id = data.id
  this.contentField.value   = data.content || ''
  // Les fichiers
  // ------------
  this.spanFiles.innerHTML = ''
  ;(data.files||[]).forEach(path => this.addFile(path))
  // Les labels
  // ----------
  // Attention : dans le span des labels se trouve peut-être la
  // smartlist
  this.spanLabels.querySelectorAll('span.label').forEach(span => span.remove())
  ;(data.labels||[]).forEach(label_id => this.addLabel(Label.get(label_id)))

  var valueEche, valueStart ;
  if ( data.echeance ) {
    valueEche = new SmartDate(data.echeance).formate('%d %m %Y')
  }
  if ( data.start ) {
    valueStart = new SmartDate(data.start).formate('%d %m %Y')
  }
  this.echeanceField.value  = valueEche || ''
  this.dureeField.value     = data.duree || ''
  this.startField.value     = valueStart  || ''
  this.priorityField.value  = data.priority || '3'
}

/**
* Pour vérifier les données et les remplacer par leurs vraies valeurs
* Retourne les données corrigées en cas de succès et un objet définissant
* :errors en cas de problème.
***/
static checkValues(data){
  var errors = []

  data.id || errors.push("- La tâche doit avoir un identifiant")
  data.id = Number(data.id)
  // Le contentu, c'est-à-dire la tâche elle-même
  data.content = data.content.trim()
  data.content.length > 0 || errors.push("- il faut définir la tâche")

  // L'échéance
  // Rien à faire dessus

  // = La durée =
  // Elle peut être définie
  //  - par un nombre seul => nombre d'heures
  //  - par un nombre et une unité ('4 jours', '2 semaines', '1 mois')
  data.duree = data.duree.trim()


  if ( errors.length ){
    return {errors: errors.join(', ')}
  } else {
    return data
  }
}



static get contentField(){
  return this._contentfield || (this._contentfield = DGet('#tache-content', this.obj))
}
static get spanLabels(){
  return this._spanlabels || (this._spanlabels = DGet('#tache-labels', this.obj))
}
static get spanFiles(){
  return this._spanfiles || (this._spanfiles = DGet('#tache-files', this.obj))
}
static get echeanceField(){
  return this._echeancefld || (this._echeancefld = DGet('#tache-echeance',this.obj))
}
static get startField(){
  return this._startfld || (this._startfld = DGet('#tache-start',this.obj))
}
static get dureeField(){
  return this._dureefld || (this._dureefld = DGet('#tache-duree',this.obj))
}
static get priorityField(){
  return this._priorityfld || (this._priorityfld = DGet('#tache-priority',this.obj))
}

static get obj(){
  return this._obj || (this._obj = DGet('form#tache-form'))
}
}
