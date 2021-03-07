'use strict'

class TacheFactory {

  static create(data){
    return new Promise((ok,ko)=>{
      data = data || {}
      data.content  || Object.assign(data, {content: `Une tâche à ${new Date()}`})
      data.id       || Object.assign(data, {id: Tache.newId()})
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
}

Test.new('Le container de taches existe', ()=>{
  return !!DGet('div#taches')
})

Test.new('Un formulaire de tache conforme existe', ()=>{
  return !!DGet('#tache-form')
})

Test.new('On peut instancier une tache', function(){
  var tache = new Tache({content:'Le texte de la tâche'})
  return tache.constructor.name == 'Tache'
})

Test.new('On peut afficher la tache', function(){
  return TacheFactory.create()
  .then(tache => {
    // console.log("Tache créée dans 'On peut afficher la tache'", tache)
    return !!DGet(`div#tache-${tache.id}`)
  })
})

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
