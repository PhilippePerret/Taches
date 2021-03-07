'use strict'
class TacheForm {

static init(){
  this.observe()
}

// Méthode appelée pour éditer la tache +tache+
static edit(tache){
  // console.log("éditer la tâche : ", tache)
  this.open()
  this.setValues(tache.data)
  // message("Vous pouvez éditer la tâche #"+tache.id+".")
}

static toggle(){
  if ( this.obj.classList.contains('opened')){this.close()
  } else { this.open() }
}
static open(){this.obj.classList.add('opened')}
static close(){this.obj.classList.remove('opened')}

static observe(){
  DGet('#form-btn-save-tache').addEventListener('click',this.onSaveTache.bind(this))
  DGet('#form-btn-init-tache').addEventListener('click',this.onInitForm.bind(this))
  DGet('#form-btn-add-label').addEventListener('click',this.onButtonAddLabel.bind(this))
  DGet('#handler', this.obj).addEventListener('click',this.toggle.bind(this))
}

static onButtonAddLabel(ev){
  Label.choose()
  return stopEvent(ev)
}

static onSaveTache(ev){
  const data = this.getValues()
  if (data){
    console.log("Enregistrement de la tâche :", data)
    Ajax.send('tache-save.rb', {tache_data: data})
    .then(ret => {
      message(ret.message)
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
  this.labelsField.append(spanlabel)
  this.labelsIds.push(ilabel.id)
}
static removeLabel(ilabel){
  const labspan = DGet(`.label[data-id="${ilabel.id}"]`,this.obj)
  labspan.remove()
  this.labelsIds.splice(this.labelsIds.indexOf(ilabel.id),1)
  // console.log("this.labelsIds = ", this.labelsIds)
}

static onInitForm(ev){
  this.id = null
  delete this.id
  this.setValues({})
  return stopEvent(ev)
}


static getValues(){
  let data = {
      id: this.id || Tache.newId()
    , content:  this.contentField.value
    , labels:   this.labelsIds
    , echeance: this.echeanceField.value
    , duree:    this.dureeField.value
    , priority: this.priorityField.value
  }
  data = this.checkValues(data)
  if ( data.errors ){
    erreur("La tâche contient des erreurs : " + data.errors)
    return
  } else {
    return data
  }
}
static setValues(data){
  this.id = data.id
  this.contentField.value   = data.content || ''
  this.labelsField.value    = data.labels || ''
  this.echeanceField.value  = data.echeance || ''
  this.dureeField.value     = data.duree || ''
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
  // Elle peut être définie :
  //  - par un jour seul => mettre mois et année
  //  - par un jour et une année => mettre année
  //  - par une date complète => vérifier qu'elle ne soit pas dans le passé
  //  - par un terme comme "demain", "après-demain", "dans 3 jours",
  //    "dans 1 semaine", etc.
  data.echeance = data.echeance.trim()

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
static get labelsField(){
  return this._labelsfld || (this._labelsfld = DGet('#tache-labels',this.obj))
}
static get echeanceField(){
  return this._echeancefld || (this._echeancefld = DGet('#tache-echeance',this.obj))
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
