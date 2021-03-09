'use strict';

class Tache {
/** ---------------------------------------------------------------------
*
*   CLASSE
*
*** --------------------------------------------------------------------- */

/**
* Méthode principale permettant de charger et d'afficher les tâches courantes
***/
static load(){
  this.lastId = 0
  return Ajax.send('taches-load.rb')
  .then(this.dispatchData.bind(this))
  .then(this.displayTaches.bind(this))
  .then(this.observeUI.bind(this))
}

static get(tache_id){
  return this.items[tache_id]
}

static newId(){
  if ( undefined == this.lastId ) this.lastId = 0
  return ++ this.lastId
}

// ON dispatche toutes les données
static dispatchData(ret){
  // console.log("-> Tache.dispatchData", ret)
  Label.dispatchData.call(Label, ret.labels)
  this.dispatchTaches(ret.taches)
}
// Crée les instances
static dispatchTaches(dtaches){
  dtaches.forEach(dtache => this.addTacheWithData(dtache))
}

// Affiche toutes les tâches
static displayTaches(){
  for(var tid in this.items){
    const tache = this.items[tid]
    tache.display()
  }
}

// Observer l'interface
static observeUI(){
  TacheForm.init()
  // message("Je suis prêt.")
}

// Ajoute une tâche par ses données en l'ajoutant à la liste des items
// Noter que cette méthode est appelée chaque fois qu'on enregistre une
// tâche ou qu'on la crée. Elle ne doit donc pas servir, par exemple, à
// comptabiliser le nombre de tâches.
static addTacheWithData(dtache){
  if (undefined === this.items) this.items = {}
  if ( this.lastId < dtache.id ) this.lastId = Number(dtache.id)
  Object.assign(this.items, {[dtache.id]: new Tache(dtache)})
}

/**
* Ajoute une marque pour le jour de la tâche +tache+ si nécessaire.
Dans tous les cas, retourne la marque du jour (pour permettre de mettre la
tâche après)
***/
static setOrGetMarkJourFor(tache){
  var markJour = DGet(`div.jour[data-day="${tache.date.day}"]`, this.containerFutures)
  if ( ! markJour ) {
    // <= La marque du jour de la tâche future n'est pas encore affichée
    // => On doit l'ajouter
    var placed = false
    this.containerFutures.querySelectorAll('.jour').forEach(divjour => {
      if ( placed ) return
      const dayjour = divjour.getAttribute('data-day')
      if (dayjour == tache.date.day) {
        // <= C'est la marque du jour pour la tâche
        // => On la prend comme marque du jour
        markJour = divjour
        placed = true
      } else if ( dayjour > tache.date.day ) {
        // <= La marque du jour courant est supérieure à la date de la tâche
        // => Il faut mettre la tâche avant
        markJour = DCreate('div', {'data-day':tache.date.day, class:'jour', text:tache.date.formate()})
        this.containerFutures.insertBefore(markJour, divjour)
        placed = true
      }
    })
    if ( !placed ) {
      // <= La marque du jour n'a pas pu être prise ou insérée
      // => On la marque là
      markJour = DCreate('div', {'data-day':tache.date.day, class:'jour', text:tache.date.formate()})
      this.containerFutures.appendChild(markJour)
    }
  }
  return markJour
}


static get containerOutOfDate(){
  return this._outofdates || (this._outofdates = DGet('#taches-out-of-date'))
}
static get containerFutures(){
  return this._futures || (this._futures = DGet('#taches-futures'))
}
static get containerToday(){
  return this._todays || (this._todays = DGet('#taches-of-the-day'))
}
static get containerTodayPrior(){
  return this._todaysprior || (this._todaysprior = DGet('#taches-prioritaires', this.container))
}
static get containerTodayReal(){
  return this._todaysreal || (this._todaysreal = DGet('#taches-today',this.container))
}
static get containerNotPrior(){
  return this._todaysnonprior || (this._todaysnonprior = DGet('#taches-non-prioritaires',this.container))
}
static get containerDone(){
  return this.donecont || (this.donecont = DGet('#taches-done',this.container))
}

static get container(){return this._container || (this._container = DGet('#taches'))}




/** ---------------------------------------------------------------------
*
*   INSTANCE
*
*** --------------------------------------------------------------------- */




constructor(data) {
  this.dispatchData(data)
}

dispatchData(data){
  for(var k in data){ if ( data[k] == '') data[k] = null }
  if ('string' == typeof(data.priority)) data.priority = parseInt(data.priority,10)
  this.data = data
  this.id = data.id
  this.content = data.content
  this.priority = data.priority
  this.echeance = this.calculateEcheance(data)
  this.duree    = data.duree
  this.start    = data.start
  this.labels   = data.labels
  this.files    = data.files
}

// Sauvegarde de la tache
save(){
  return Ajax.send('tache-save.rb', {tache_data: this.data})
}

/**
Calcul de l'échéance
--------------------
Elle peut être définie de deux façons : par valeur explicite (dans ce cas,
data.echeance est défini) ou par valeur implicite (si data.start et data.duree
sont définis).
La valeur implicite est toujours prioritaire
***/
calculateEcheance(data){
  if (data.start && data.duree) {
    const sd = new SmartDate(data.start)
    return sd.plus(data.duree).day
  } else { return data.echeance }
}


/**
  AFFICHAGE/PLACEMENT DE LA TÂCHE
  ===============================

Synopsis
--------
  SI la tâche définit une date de début, on parcourt la liste des tâches
  ET
    SI le jour du début existe, on ajoute la tâche à cet endroit
    SI le jour du début n'existe pas (qu'on arrive à un jour suivant),
      on crée ce jour et on l'ajoute à la liste
  SINON
    SI la tâche a une forte priorité => on la met tout au-dessus
    SI la tâche à une priorité faible => on la met en dessous
***/
display(){
  const mere = this.constructor
  // Dans un premier temps, si la tâche a déjà été construite, on doit
  // détruire son affichage
  // Noter un point important : ça n'est plus la même instance, lorsqu'on
  // modifie une donnée
  const oldDiv = DGet(`#tache-${this.id}`,mere.container)
  oldDiv && oldDiv.remove()

  if ( this.isDone ) { this.insertIn(mere.containerDone) }
  else if ( this.isPrioritaire ) { this.insertIn(mere.containerTodayPrior) }
  else if ( this.isNonPrioritaire) { this.insertIn(mere.containerNotPrior) }
  else if ( this.isTodays ) { this.insertIn(mere.containerTodayReal) }
  else if ( this.isOutOfDate ) {
    this.insertIn(mere.containerOutOfDate)
    mere.containerOutOfDate.classList.remove('hidden')
  }
  else { // Tâche future
    // Si le jour n'est pas encore affiché, on l'ajoute
    const markJour = mere.setOrGetMarkJourFor(this)
    this.insertIn(mere.containerFutures, markJour.nextSibling)
  }

  this.displayed = true

  // On l'observe toujours
  this.observe()
}

/**
* Pour insérer la tâche
***/
insertIn(container, before){
  if (undefined == before) {
    container.appendChild(this.div)
  } else {
    container.insertBefore(this.div, before)
  }
}

removeLabel(label_id){
  // console.log("Labels au début :", [...this.labels])
  if ( label_id.constructor.name == 'Label') label_id = label_id.id
  if ( ! this.labels ) return
  var offset = this.labels.indexOf(label_id)
  this.labels.splice(offset, 1)
  // console.log("Labels après l'opération :", [...this.labels])
  return this.labels // pour l'opération de sauvegarde
}

get isPrioritaire(){
  return this._isprior || (this._isprior = (!this.start) && this.priority >= 3)
}
get isNonPrioritaire(){
  return this._nonpriori || (this._nonpriori = (!this.start) && this.priority < 3)
}
get isOutOfDate(){
  return this._isoutofdate || (this._isoutofdate = this.echeance && this.date.isPast)
}
/**
  Retourne TRUE si c'est une tâche du jour
  Ça peut être une tâche du jour pour les raisons suivantes :
    - son démarrage est aujourd'hui
    - son démarrage est un jour précédent, mais son échéance n'est pas encore
      arrivée
***/
get isTodays(){
  return this._istodays || ( this._istodays = this.calculateIfTodays())
}
calculateIfTodays(){
  if (!this.start) return false
  if (this.date.day == TODAY.day) return true
  else {
    if ( TODAY.isBefore(this.start) ) return false
    else if ( this.echeance && TODAY.isAfter(this.echeance) ) {
      return false
    } else {
      return true
    }
  }
}
get date(){
  return this._date || ( this._date = new SmartDate(this.start) )
}
get dateEcheance(){
  return this._dateecheance || ( this._dateecheance = new SmartDate(this.echeance) )
}

// Si la tâche possède une échéance, cette méthode retourne le div pour
// le jour à marquer
divJour(){
  var titre ;
  if (this.start) {
    titre = this.formated_start
  } else if ( Number(this.priority) > 3 ) {
    titre = "Urgent sans échéance"
  } else {
    titre = "Autres tâches"
  }
  return DCreate('div', {class:'jour', text:titre})
}
get formated_start(){
  return capitalize(formate_date(this.date_start))
}
get date_start(){
  return this._datestart || (this._datestart = new Date(Date.parse(this.start)) )
}

onEdit(){
  TacheForm.edit(this)
}
onDestroy(){
  let confirmation = TEST_ON ? !!Test.confirmation : confirm('Êtes-vous certain de vouloir détruire la tâche “'+this.content+'”')
  if(confirmation){
    Ajax.send('tache-destroy.rb', {tache_id:this.id})
    .then(this.div.remove.bind(this.div))
  }
}

onMarkDone(ev){
  this.isDone = this.cbDone.checked
  if ( this.isDone ) {
    Ajax.send('tache-archive.rb', {tache_id: this.id})
    .then(ret => message("Tâche marquée faite et archivée."))
  } else {
    message("Tâche remise dans le courant (mais reste dans les archives pour le moment).")
  }
  this.display()
  return true
}

get div(){
  return this._div || (this._div = this.build())}
get divId(){return this._divid || (this._divid = `tache-${this.id}`)}

build(){
  const inners = []
  const divid = this.divId
  // Boutons
  // -------
  inners.push(DCreate('span', {id:`${divid}-buttons`, class:'buttons', inner: [
      DCreate('button', {id:`${divid}-btn-edit`, text:'🛠'})
    , DCreate('button', {id:`${divid}-btn-supp`, text:'🗑'})
  ]}))
  // Labels (flottant à droite)
  // ------
  inners.push(DCreate('span', {id:`${divid}-labels`, class:'tache-labels', inner:this.formated_labels}))
  // Bande couleur de priorité
  inners.push(DCreate('span', {id:`${divid}-band-prior`, class:'prior-band', 'data-value':this.priority}))
  // CB pour marquer la tâche exécutée
  this.cbDone = DCreate('input', {id:`${divid}-cb-done`, class:'cb-done', type:'checkbox'})
  inners.push(this.cbDone)
  // Le contenu, donc la tâche elle-même
  inners.push(DCreate('span', {id:`${divid}-content`, class:'tache-content', text:this.content}))
  // Échéance (if any — flottant à droite)
  if ( this.echeance ) {
    inners.push(DCreate('span', {id:`${divid}-echeance`, class:'tache-echeance', text:this.formated_echeance}))
  }
  inners.push(DCreate('span', {id:`${divid}-files`, class:'tache-files', inner:this.formated_files}))
  const div = DCreate('div',{id:divid, 'data-id':this.id, class:'tache', inner: inners})
  this.built = true
  return div;
}

observe(){
  DGet(`#${this.divId}-btn-edit`).addEventListener('click', this.onEdit.bind(this))
  DGet(`#${this.divId}-btn-supp`).addEventListener('click', this.onDestroy.bind(this))
  this.cbDone.addEventListener('click', this.onMarkDone.bind(this))
}
unobserve(){
  DGet(`#${this.divId}-btn-edit`).removeEventListener('click', this.onEdit.bind(this))
  DGet(`#${this.divId}-btn-supp`).removeEventListener('click', this.onDestroy.bind(this))
}

// *** Private methods ***

/**
  Retourne l'échéance formatée (if any) sous la forme "dans 3 jours"
***/
get formated_echeance(){
  if ( ! this.echeance ) return ''
  const nbj = TODAY.dayCountBefore(this.dateEcheance)
  var [mark, css] = (nbj=>{
    if ( nbj < 0 ) return ['<span class="red">DÉPASSÉE</span>', 'warning']
    else if ( nbj == 0) return ['ce soir', 'warning']
    else {
      var mrk = `${nbj} jour${nbj > 1 ? 's' : ''}`
      var style = 'ok' ;
      if ( nbj < 7 ) style = 'caution'
      return [mrk, style]
    }
  })(nbj)
  // Sinon, on la met en forme
  return `<span class="${css}">(avant ${mark})</span>`
}
/**
* Retourne les labels formatés
***/
get formated_labels(){
  var spans = []
  ;(this.labels||[]).forEach(lid => spans.push(Label.get(lid).output))
  return spans
}

get formated_files(){
  if (!this.files) return []
  var spans = []
  this.files.forEach(path => {
    const fname = path.split('/').reverse()[0]
    const fspan = DCreate('span', {class:'ofile mini-container', text:`${fname} ✐`})
    fspan.addEventListener('click', IO.openInFinder.bind(IO,path,null))
    spans.push(fspan)
  })
  return spans
}

}// class Tache
