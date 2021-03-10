# Manuel InsideTests

## Introduction

**InsideTests** est un système de tests d'une grande simplicité, 100 % javascript, pour tester une application de l'intérieur. Il est d'une grande simplicité mais permet de gérer l'asynchronicité des application javascript modernes.

Définir un test est aussi simple que faire :

```javascript

Test.new("2 + 2 est égal à 4, en javascription", function(){
  return 2 + 2 == 4
})

```

Le résultat est affiché en couleur dans la console du navigateur

## Utilisation

### Mise en place

La première chose à faire est de placer le dossier `InsideTests` de ce fichier dans l'application, normalement dans le dossier `./js` (dossier contenant tous les javascripts de l'application).

Ce dossier doit contenir un dossier `system` qui contient les tests du système. Pour les sites élaborés à l'aide du framework `WebAppScaffold`, ce dossier contient les tests des librairies du système.

Il doit contenir aussi un dossier `app` où seront placés les tests de l'application elle-même. Au départ, il doit être vide.

<a name="fichier_principal"></a>

### Fichier principal

Ci-dessous, nous appellerons *fichier principal* le fichier `InsideTests.js` qui se trouve à la racine du dossier des *InsideTests* (le dossier contenant ce fichier).

Ce fichier permet de définir si les tests doivent être joués ou non, et leur liste.

### Préparation dans l'application

Dans le fichier de base `HTML` il faut charger le fichier principal à l'aide de :

```html

<script type="text/javascript" src="js/InsideTests/InsideTests.js"></script>

```

Dans le fichier principal (`main.js` pour le *WebAppScaffold*), on ajoute un code qui va empêcher l'initialisation normale de l'application, qui va empêcher par exemple de charger les données et la configuration courante de l'application. Par exemple :

```javascript
$(document).ready(function(){
  if ( false === INSIDE_TESTS_ON ) { // <============== HERE
    App.init()
    .then(Tache.load.bind(Tache))
    .catch(err => {console.error(err);erreur(err)})
  }
})
```

> Noter que l'initialisation de base de l'application doit se faire impérativement dans `App.init` qui doit retourner impérativement une `Promise`.

☞ S'assurer que la méthode `App.init` existe bien et retourne une promesse (`Promise`).

Ce code consiste à utiliser la constante `INSIDE_TESTS_ON` qui sera mise à true, dans le fichier `InsideTests.js` de ce dossier, lorsqu'il faudra lancer les tests.

> Note : on peut aussi la définir dans un fichier de configuration (par exemple `_config.js` dans les *WebAppScaffold*).

### Implémentation des tests

Pour créer un test, on crée un fichier `javascript` au nom quelconque dans le dossier `./js/InsideTests/app` de l'application.

On verra dans la partie [Définition des tests](#definition_tests) comment l'ajouter aux tests.

### Création d'un test synchrone

Dans le fichier de test créé, on utilise ce code pour créer le test :

```javascript
Test.new('Ce que fait le test', function(){
  const resultat = mon_operation_a_tester()
  return resultat == true
})
```

Ci-dessus, c'est un test de base qui s'assure que la méthode `mon_operation_a_tester` retourne bien la valeur `true`.

Si c'est un succès, la console du navigateur affichera "Ce que fait le test" en vert et comptera un succès. Si c'est un échec, la console du navigateur affichera "FAIL: Ce que fait le test" en rouge et comptera une failure.

Un test doit toujours retourner :

* SOIT un booléen (`true` en cas de succès, `false` en cas d'échec)
* SOIT une promesse (`Promise`) pour un [test asynchrone](#test_asynchrone)

Dans un site *WebAppScaffold*, on peut interrompre un test avec un message d'erreur avec la méthode `raise` :

```javascript
Test.new('Mon nouveau test avec raise', function(){
  var resultat = additionne(1)
  resultat != null || raise("Le résultat ne devrait pas être nul…")
  resultat = additionne(4, 5)
  resultat == 9 || raise("L'opération devrait faire ")
  resultat = additionne()
  return resultat == 4
})
```

#### Rédéfinition du message d'erreur

Le message d'erreur peut être redéfini en définissant explicitement la propriété `this.failure_message` dans le test.

[1] **Attention**. Dans ce cas, il faut impérativement définir la méthode par `function()` et non pas par la tournure abrégée `()=>` pour que le `this` soit bien le test lui-même.

```javascript
Test.new('Je change le message d’erreur', function(){ // <====== !!! [1]
  var resultat = mon_operation()
  if ( resultat === undefined ) {
    this.failure_message = "Le résultat ne devrait pas être indéfini !"
    return false
  }
  return resultat == 10
})
```

<a name="test_asynchrone"></a>

### Création d'un test asynchrone

Un test asynchrone doit simplement retourner une promesse pour pouvoir être exécuté.

Par exemple :

```javascript
Test.new("Il peut charger le fichier", function(){
  return Promise((ok,ko)=>{
    Ajax.send('mon-script-a-tester.rb', mes_data)
    .then(retour_ajax => {
      if (retour_ajax.resultat === true){ok(true)}
      else {ko(retour_ajax.error)}
    })
  })
})
```

On peut bien sûr utiliser directement une méthode asynchrone de l'application :

```javascript
Test.new('On test un script ruby', function(){
  return Ajax.send('le-script-tested.rb')
    .then(retour_ajax => {
      retour_ajax.ok || raise("Le script testé n'a pas réussi")
      return true
    })
})
```

<a name="definition_tests"></a>

### Définition des tests

Une fois implémenté, le test doit être ajouté à la liste `INSIDE_TESTS_APP_FILES` dans le fichier principal `js/InsideTests/InsideTests.js`.

```javascript
const INSIDE_TESTS_APP_FILES = [
    ['nom_fichier_test.js', 'folder/du/fichier']
  , ['nom_fichier_test.js', 'folder/du/fichier']
  , 'fichier_tests_a_la_racine' // <=== sans dossier, sans extension = OK
  // ...
]
```

> Les tests ne sont pas ajoutés automatiquement tout simplement pour pouvoir choisir facilement les uniques tests à jouer.

### Choix des tests à jouer

Les tests à jouer peuvent être activés ou désactivés simplement en les ex-commentant :

```javascript
const INSIDE_TESTS_APP_FILES = [
    ['nom_fichier_test.js', 'folder/du/fichier']
  // , ['nom_fichier_test2.js', 'folder/du/fichier'] // <===== PAS JOUÉ
  // , ['nom_fichier_test3.js', 'folder/du/fichier'] // <===== PAS JOUÉ
  , ['nom_fichier_test4.js', 'folder/du/fichier']
  // ...
]
```

Pour jouer tous les tests du système (très long), on doit mettre la variable suivante à `true` dans le [fichier principal][].

### Mise en route

Pour faire jouer les tests, il suffit de mettre la constante `INSIDE_TESTS_ON` définie dans le fichier `InsideTests.js` de ce dossier — ou un fichier de configuration — à `true`.


[fichier principal]: #fichier_principal
