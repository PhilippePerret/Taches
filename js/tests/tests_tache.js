'use strict'

class TacheFactory {

  static create(data){
    return new Promise((ok,ko)=>{
      data = data || {}
      data.content  || Object.assign(data, {content: `Une tâche à ${new Date()}`})
      data.id       || Object.assign(data, {id: this.newId()})
      data.time     || Object.assign(data, {time: new Date()})
      data.duree    || Object.assign(data, {duree: 24})
      const tache = new Tache(data)
      return tache.save()
      .then(()=>{
        tache.display()
        ok(tache)
      })
    })
  }

// *** Private methods ***
static newId(){
  if (undefined == this.lastId) this.lastId = 0
  return ++ this.lastId
}

}

Test.new('le_container_de_taches_existe', ()=>{
  return !!DGet('div#taches')
})

Test.new('le_formulaire_de_tache_existe', ()=>{
  return !!DGet('#tache-form')
})

Test.on_peut_instancier_une_tache = function(){
  var tache = new Tache({content:'Le texte de la tâche'})
  return typeof(tache) == 'object'
}
Test.add('on_peut_instancier_une_tache')

Test.on_peut_afficher_la_tache = function(){
  return TacheFactory.create()
  .then(() => {
    return !!DGet('div#tache-1')
  })
}
Test.add('on_peut_afficher_la_tache')

// Test.new('la_tache_contient_tous_les_elements', function test(){
//   const tache = TacheFactory.create()
//   const divid = `#tache-${tache.id}`
//   var errors = []
//   // Le checkbox
//   DGet(`${divid}-content`)  || errors.push('le contenu')
//   DGet(`${divid}-cb-done`)  || errors.push("la case à cocher pour marquer finie")
//   DGet(`${divid}-buttons`)  || errors.push("le bloc de boutons")
//   DGet(`${divid}-btn-edit`) || errors.push("le bouton pour éditer la tâche")
//   DGet(`${divid}-btn-supp`) || errors.push("le bouton pour supprimer la tâche")
//
//
//   if ( errors.length ){
//     this._failure_message = "La tache ne contient pas tous les éléments. Il manque : " + errors.join(', ')
//     return false
//   } else {
//     return true /* OK */
//   }
//
// })
//
// Test.new('on_peut_detruire_la_tache_avec_le_bouton', function(){
//   const tache = TacheFactory.create()
//   const tache2 = TacheFactory.create()
//   const button = DGet(`#${tache2.divId}-btn-supp`)
//   Test.confirmation = true
//   button.click()
//   return new Promise((ok,ko)=>{
//     setTimeout(() => {
//       ok(!DGet(`#${tache2.divId}`))
//     }, 2000)
//   })
// })
