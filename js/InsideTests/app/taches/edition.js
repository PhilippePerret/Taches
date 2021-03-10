'use strict'

/** ---------------------------------------------------------------------
*
*   Méthodes de tests utiles
*
*** --------------------------------------------------------------------- */

/**
  Vérifie aussi bien dans le listing (HTML) que dans les données (Tache.items)
  qu'il y a le nombre de tâches attendu
***/
function nombreTachesIs(nombre){
  var actual = Object.keys(Tache.items).length
  actual == nombre || raise(`Tache.items devrait contenir ${nombre} tâche(s), il en contient ${actual}.`)
  actual = Tache.container.querySelectorAll('.tache').length
  actual == nombre || raise(`Le listing de tâches devrait contenir ${nombre} tâche(s), il en contient ${actual}.`)
  return true
}

function fillTacheFormWith(data){
  DGet('#tache-content', TF.obj).value = data.content || ''
  DGet('#tache-priority',TF.obj).value = data.priority || 3
  DGet('#tache-start',TF.obj).value = data.start || ''
  DGet('#tache-echeance',TF.obj).value = data.echeance || ''
  DGet('#tache-duree',TF.obj).value = data.duree || ''
  if ( data.labels ) {
    data.labels.forEach(name => {
      var label = Label.getByName(name)
      TF.addLabel(label || Label.createLabel(name))
    })
  }
  // Les fichiers
  data.files && data.files.forEach(path => TF.addFile(path))
}

/** ---------------------------------------------------------------------
*
*   DONNÉES PRATIQUES
*
*** --------------------------------------------------------------------- */

/**
  Pour se simplifier la vie des tests
***/
const TF = TacheForm
TF.buttonPlus = DGet('#btn-new-tache',TF.obj)
TF.buttonSave = DGet('#form-btn-save-tache',TF.obj)

/** ---------------------------------------------------------------------
*
*   LES TESTS PROPREMENT DIT
*
*** --------------------------------------------------------------------- */

Test.new('TacheForm répond à la méthode :edit', function(){
  return 'function' == typeof(TacheForm.edit)
})

Test.new('On peut créer entièrement une tâche et l’afficher correctement', async function(){
  App.resetAll() // supprime tout et repart à zéro
  Object.keys(Tache.items).length == 0 || raise("Il ne devrait plus y avoir de tâches.")

  await wait(1)

  // *** Vérifications préliminaires ***
  extract_number(TF.obj.style.bottom) < -50 || raise("La fenêtre du formulaire de tâche devrait être fermée…"+` (extract_number(TF.obj.style.bottom) vaut ${extract_number(TF.obj.style.bottom)})`)

  // On clique sur le bouton '+' du formulaire
  TF.buttonPlus.click()
  await wait(1)
  extract_number(TF.obj.style.bottom) == 0 || raise("La fenêtre du formulaire de tâche devrait être ouverte.")

  fillTacheFormWith({content: `La tâche à ${new Date}`})
  TF.buttonSave.click()
  await wait(1)

  // *** Vérification ***
  // Il doit exister une tâche dans la liste
  nombreTachesIs(1) || raise("Il devrait y avoir une et une seule tâche dans le listing")



  return true
})
