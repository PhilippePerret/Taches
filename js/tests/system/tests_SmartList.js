'use strict'

Test.new('On peut créer une instance SmartList', function(){
  var sl = new SmartList({'pour':1, 'voir':2}, {title:'Pour voir', oncreate:null})
  return sl.constructor.name == 'SmartList'
})

Test.new('On peut afficher l’instance SmartList', function(){
  var sl = new SmartList({'pour':1, 'voir':2}, {id:'test1', title:'Pour voir', oncreate:null})
  sl.open()
  const existe = !!DGet('#smartlist-test1')
  sl.close()
  return existe
})

Test.new('SmartList.filter retourne la liste des strings filtrés', function(){
  var sl = new SmartList({'pour':1, 'pourboire':2, 'pourvoir':3, 'pire':4}, {id:'testfilter'})
  var res = sl.filter('p')
  res.length == 4 || raise("Le filtre 'p' devrait retourner 4 éléments")
  res = sl.filter('po')
  res.length == 3 || raise("Le filtre 'po' devrait retourner 3 éléments")
  res = sl.filter('pi')
  res.length == 1 || raise("Le filtre 'pi' devrait retourner 1 élément")
  res = sl.filter('pou')
  res.length == 3 || raise("Le filtre 'po' devrait retourner 3 éléments")
  res = sl.filter('pour')
  res.length == 3 || raise("Le filtre 'po' devrait retourner 3 éléments")
  res = sl.filter('pourb')
  res.length == 1 || raise("Le filtre 'po' devrait retourner 1 élément")
  return true
})


Test.new('SmartList.filterAndShow permet d’afficher les items filtrés', function(){
  var sl = new SmartList({'pourvu':1, 'pourboire':2, 'pourvoir':3, 'pire':4}, {id:'testfilter'})
  sl.filterAndShow('pourv')
  var tous = sl.foundsField.querySelectorAll('.smartlist-found')
  // console.log("tous:", tous)
  tous.length == 2 || raise("'pourv' devrait afficher 2 éléments")
  tous[0].innerHTML == 'pourvu' || raise("Le premier élément avec 'pourv' devrait être 'pourvu', hors c'est “"+tous[0].innerHTML+"”")
  tous[1].innerHTML == 'pourvoir' || raise("Le premier élément avec 'pourv' devrait être 'pourvoir', hors c'est “"+tous[1].innerHTML+"”")
  return true
})

Test.new('SmartList permet de choisir un item avec les flèches', function(){
  var sl = new SmartList({'pourvu':1, 'pourboire':2, 'pourvoir':3, 'pire':4}, {id:'testfilter'})
  sl.open()
  sl.filterAndShow('pourv')
  var tous = sl.foundsField.querySelectorAll('.smartlist-found')
  tous.length == 2 || raise("Deux éléments choisis devraient être affichés")
  // On simule la flèche bas
  sl.selectNextFound()
  tous[0].classList.contains('selected') || raise("Le premier item devrait être sélectionné")
  sl.selectNextFound()
  tous[0].classList.contains('selected') == false || raise("Le premier item ne devrait plus être sélectionné")
  tous[1].classList.contains('selected') || raise("Le premier item devrait être sélectionné")
  sl.close()
  return true
})

Test.new('SmartList permet de choisir un item avec la souris', function(){
  var sl = new SmartList({'pourvu':1, 'pourboire':2, 'pourvoir':3, 'pire':4}, {id:'testfilter'})
  sl.open()
  sl.selected == null || raise("Il ne devrait pas y avoir de sélection")
  sl.filterAndShow('pourv')
  var tous = sl.foundsField.querySelectorAll('.smartlist-found')
  tous[0].click()
  sl.selected.content == 'pourvu' || raise("La sélection devrait être 'pourvu', hors c'est "+JSON.stringify(sl.selected))
  return true
})

Test.new('SmartList retourne la valeur choisie à la méthode transmise avec onselect', function(){
  window.onSelectInListWithOnSelectInSmartList = function(selected){
    this.onSelectInListWithOnSelectInSmartList.selected = selected
  }
  var sl = new SmartList({'pourvu':1, 'pourboire':2, 'pourvoir':3, 'pire':4}, {id:'testfilter', onselect: window.onSelectInListWithOnSelectInSmartList.bind(window)})
  sl.open()
  sl.selected == null || raise("Il ne devrait pas y avoir de sélection")
  sl.filterAndShow('pourv')
  var tous = sl.foundsField.querySelectorAll('.smartlist-found')
  tous[1].click()
  const thesel = window.onSelectInListWithOnSelectInSmartList.selected
  thesel.content == 'pourvoir' || raise("Le trouvé retourné devrait être “pourvoir”. C'est “"+thesel.content+"”…")
  thesel.id = 3 || raise("Le trouvé retourné devrait avec l'identifiant 3. Or c'est "+thesel.id+".")
  return true
})

Test.new('SmartList : une nouvelle valeur crée un nouvel élément', function(){
  window.onCreateNewElementWithSmartList = function(string){
    window.onCreateNewElementWithSmartList.element = `New ${string}`
  }
  var sl = new SmartList({'pourvu':1, 'pourboire':2, 'pourvoir':3, 'pire':4},
    {id:'testcreate', oncreate: window.onCreateNewElementWithSmartList.bind(window)})
  sl.open()
  sl.selected == null || raise("Il ne devrait pas y avoir de sélection")
  sl.inputField.value = "atelier icare"
  sl.filterAndShow('atelier icare')
  var tous = sl.foundsField.querySelectorAll('.smartlist-found')
  tous.length == 0 || raise("Il ne devrait y avoir aucun trouvé…")
  // On simule la touche entrée (ou le click sur le found)
  sl.onClickFound(sl.foundSelected)
  const newel = window.onCreateNewElementWithSmartList.element
  newel == 'New atelier icare' || raise("Le nouvel élément devrait être 'New atelier icare'. Or c'est “"+newel+"”")
  return true
})
