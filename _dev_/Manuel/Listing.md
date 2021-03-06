# (super) LISTING<br>Manuel utilisateur

## Introduction

La class `Listing` est une classe permettant de gérer de façon très profonde les listes de données. « Profonde » signifie qu'on peut :

* afficher la liste des éléments,
* afficher les données de chaque élément (dans un panneau latéral à côté de la liste),
* créer/supprimer/modifier les valeurs des éléments,
* filtrer des éléments (par valeur).

<a name="prerequis"></a>

## Pré-requis

Pour pouvoir fonctionner, la classe `Listing` a besoin :

* du module `Listing.js`,
* du module CSS `Listing.css` (ou `_Listing.sass`),
* d'un propriétaire conforme (cf. [conformité du propriétaire du listing](ownerconfirmite)),
* une méthode générale `error(msg)` qui traite les messages d'erreur,
* une méthode générale `message(msg)` qui traite les messages notice,

<a name="instanciation"></a>

## Instanciation du listing

```javascript

class MaClasse {

  static get listing(){
    return this._listing || ( this._listing = new Listing(this, {
        titre: 'Le titre du listing'
      , id: '<identifiant du listing>'
      // Optionnel
      , container: <DOMElement> // le container, sinon, le body
      													// Note : pas en String
      , form_width: <Number>		// Largeur du formulaire (nombre de pixels)
      , form_height: <Number>		// Hauteur du formulaire (en pixels)
      , list_width: <Number>		// Largeur du listing (nombre de pixels)
      , list_height: <Number>		// Hauteur du listing (en pixels)
      , height: <Number Hauteur> // hauteur de la fenêtre (bande centrale, en fait)
      , top:    <Number> // décalage vertical
      , left:   <Number> // Décalage horizontal
      , options: {
      		// Note : dans les options ci-dessous, la première valeur
      		// est la valeur par défaut.
      		form_under_listing: false/true 
      													// True pour mettre le formulaire sous
      													// la liste. Régler les largeurs et hauteurs
      													// en conséquence.
  	    	sortable: true/false  // Si true, la liste est "sortable"
					draggable: true/false // si false, le listing n'est pas déplaçable
      		title: true/false			// Si false, pas de bande de titre
      		no_id: false/true			// Si true, on n'affiche pas l'identifiant
      		destroy_without_confirm: false/true // Si true, on n'a pas besoin de 
      																				// confirmer les destructions 
      																				// d'items
	    }
			// Par défaut la procédure normale est 1) on clique sur "+", 2) on 
      // définit les valeurs et 3) on clique sur "Save". Si on veut adopter
      // plutôt la procédure 1) On définit les valeurs, 2) on clique sur "+"
      // pour créer l'item, alors on met la propriété 'createOnPlus' à true
      , createOnPlus: true/false // défaut : false
      // Si la méthode propriétaire qui doit être appelée après une sélection
      // n'est pas onSelect, on peut la définir ici : (elle reçoit en premier
      // argument l'item sélectionné)
      , onSelect: this.maFonctionOnSelect.bind(this)
      // Idem pour la fonction de désélection
      , onDeselect: this.maFonctionDeDeselection.bind(this)
      // Si la méthode propriétaire qui doit être appelée après une création
      // n'est pas onAdd, on peut la définir ici (elle reçoi en premier
      // argument l'item créé)
      , onAdd: this.maFonctionOnAdd.bind(this)
    	// Pour définir des boutons propres (cf. ci-dessous)
    	, buttons: [
  				{id:'...', on:'selected', picto:'0', onclick:this.method.bind(this), title:'...'}      
	      ]
    }) )
  }
}

```

> Note : bien noter que le premier paramètre de l’initialisation est le propriété (`this`).

### Insertion du listing dans la page

Dès qu'on instancie le listing — cf. ci-dessus —, la listing est affiché dans la page tel qu'il est défini par ses propriétés.

### Définir des boutons propres

On utilise la propriété `buttons` à l’instanciation du listing pour définir des boutons propres qui seront ajoutés dans la fenêtre.

~~~
id			Sera mis en class, en fait, avec `listing-` devant
on			Si la valeur est 'selected', le bouton n'apparait que s'il y a une sélection
				courante.
picto
text		Les deux permettent de définir le contenu du bouton. 'picto' est plus sémantique.
title		Pour définir le texte qui doit s'afficher lorsqu'on survole le bouton avec la
				souris.
onclick	La function/méthode qui doit être appelée quand on clique sur le bouton. C'est une
				fonction du owner, vraisemblablement.
~~~



<a name="ownerlisting"></a>

## Propriétaire du listing

On appelle « propriétaire du listing » la CLASSE quelconque du programme qui utilise la classe `Listing` pour afficher ses données. Ce sont les instances de cette classe qui seront utilisés comme items du listing.

<a name="ownerconfirmite"></a>

### Conformité du propriétaire de listing

**Pour être conforme**, ce propriétaire doit répondre aux exigences suivantes :

* définir les propriétés de ses éléments dans la propriété de classe `PROPERTIES` (cf. [ci-dessous](#defineproperties))
* définir une méthode de classe `get` qui reçoit en argument l'identifiant d'un item et retourne son instance,
* définir la méthode de classe `create` pour la création d'un nouvel item (la méthode doit recevoir les valeurs, dont `id` qui vaudra `null`),
* définir la méthode de classe `update` pour la modification de l'item (la méthode doit recevoir les valeurs, dont `id` qui possède la valeur de l'identifiant)
* définir la propriété de classe `tableName` qui doit retourner le nom de la table SI le listing travaille avec une base de données.

Les instances doivent :

* définir la PROPRIÉTÉ `li` (donc `get li()`) qui retournera la balise `LI` à afficher dans le listing,
* ce `LI` doit contenir la classe `listing-item` (dans le cas contraire le filtrage ne sera pas possible — l'erreur sera signalée),
* ce `LI` doit **impérativement** avoir un attribut `id` constitué par `<type élément>-<id>` et le `<type-element>` ne doit comporter aucun tiret (moins) (par exemple `projet-12`),
* définir la propriété `id` qui devra retourner l'identifiant de l'item


<a name="defineproperties"></a>

### Définir `PROPERTIES`

```javascript

class MaClasse {
  static get PROPERTIES(){
    if (undefined === this._properties){
      this._properties = [
        // Liste des propriétés
        {name: '<prop name>', hname: '<prop Human Name>', type: '<prop type' }
      ]
    }; return this._properties
  }
}

```

Chaque définition de propriété peut posséder les attributs :

```

name        Le nom "technique" de la propriété              prenom
hname       Le nom "humain" de la propriété, qui sera       Prénom
            affiché dans le formulaire.
            Si null, la propriété ne sera pas visible dans
            le formulaire. Son type est souvent 'hidden'.
type        Le type de la propriété. Par défaut, c’est le   textarea
            type 'text' (inutile de l’indiquer). Les types
            traités sont :
              'hidden'      Une valeur cachée, comme l’ID
              'textarea'    Une textarea
              'checkbox'    Une case à cocher

vtype       Type de la valeur. Par défaut, c'est string.      number
            Peut être :
                'number'    Transforme la valeur en nombre
                'string'    Par défaut, en string
                'bool'			Pour les checkbox

options			Permet de définir plus précisément le champ :
						inline:				Si true, est mis dans un span. Cela permet
													de regrouper sur une même ligne plusieurs
													champs courts.
						field_width		Le width exact, AVEC L'UNITÉ, du champ.
						
required    Si cet attribut est true, la donnée ne peut être
            vide (donc null).

max         Longueur maximale de la donnée (ou nombre max)    255
            Ne pas oublier de mettre le vtype à 'number'
            pour que la valeur soit étudiée comme un nombre

min         Longueur minimale de la donnée (ou nombre min)
            Ne pas oublier de mettre le vtype à 'number'
            pour que la valeur soit étudiée comme un nombre

default     Valeur par défaut de la propriété.                
            Pour un type=checkbox, c'est true/false

form        cf. ci-dessous "Utilisation de form"

setter      Pour définir les valeurs d'un champ complexe
            (p.e. le 'form' ci-dessus, mais pas seulement)
            Le setter reçoit la valeur de la propriété et doit
            se débrouiller avec en fonction de ce qu'elle est
            et de la construction des champs de formulaire. Par
            exemple, si on a affaire aux matières ci-dessus et
            que la valeur ressemble à "0011001" avec 1 utilisé
            lorsqu'une matière est choisie. Donc la méthode setter
            devra sélectionner les matières 3, 4 et 7.
            Peut être utilisé par exemple si la valeur se trouve 
            autre part dans l'interface.

getter      Pour récupérer les valeurs d'un champ complexe
            La méthode de getter reçoit le div contenant les
            élément de formulaire construits avec la méthode
            définie par 'form'.
            Elle doit retourner la valeur à donner à la pro-
            priété concernée.

```



##### Utilisation de `form`

Si la propriété ne se définit pas par un champ simple, on peut définir ici le NOM de la fonction qui doit servir à construire le champ. Par exemple, imaginons des sociétés qui traitent différente matière (bois, métal, papier, etc.). La propriété 'matieres' est définie par :

~~~javascript
{
		name:'matieres'
  , hname:null
  , type: 'hidden'
  , form:'buildCbMatieres'
  , setter:'setMatieresValue'
  , getter:'getMatieresValue'
 }

~~~

Listing produira alors une rangée avec un champ caché pour mettre la valeur finale de 'matieres' et la méthode de classe 'buildCbMatieres' du owner construira la liste des checkbox à cocher.

Cette méthode de classe 'buildCbMatieres' reçoit en premier argument le div.row contenant déjà le champ défini dans PROPERTIES. 

Les méthodes 'setter' et 'getter' permettent respectivement de définir et de récupérer les valeurs de la propriété 'matieres'.

**Requis absolument** :

* La méthode qui produit le champ (`buildCbMatieres` pour l’exemple) doit être placé dans un div de classe `row-<type>` (donc `row-matieres` pour l’exemple) et ce div doit contenir un champ pour l’erreur. S’il y a un label, on ajoute un DOMElement label :

  ~~~javascript
  DCreate('DIV', {class: "row-<property>", inner: [
    	 DCreate('LABEL', {text: "<nom humain>"})
     , DCreate(/* champ du formulaire */)
    , DCreate('DIV', {class:'error-message'})
  ]})
  ~~~

  

* Le champ de formulaire doit avoir un ID de `item-<propriété>` (`item-matieres` pour l’exemple).



---

## Extension de Listing



On peut étendre les classes qui utilisent le listing avec la classe `ListingExtended` qui ajoute les méthodes suivantes :

~~~javascript
class maClasseAvecListing extends ListingExtended {
  
  // --- À DÉFINIR ---
  static get loadScript(){ return 'mon_script_chargement_items.rb'}
  static get saveItemScript(){ return 'script_save_item.rb'}
  
  static sortMethod(a,b){ ... } // Méthode de classement des items
  							// NOTER que c'est la présence de cette méthode qui
  							// détermine par convention que la liste des items doit
  							// être classée
  
  // --- PROPRIÉTÉS AJOUTÉES ---
  
  orderedList		// Liste des items classés (selon la méthode 'sortMethod')
  							// Note : dans cette liste, chaque item possède une nouvelle
  							// propriété 'index' qui permet de connaitre sa position 
  							// dans la liste.
  
  // --- MÉTHODES AJOUTÉES ---
  
  load()		// charge tous les items. Le module this.loadScript doit retourner
  					// la propriété `items` avec la liste Array de tous les items

  newId() 		// Renvoie un nouvel id
  create()		// crée un nouvel item à partir des données du listing
  update()		// actualise l'item à partir des données du listing
  onDestroy()	// peut détruire l'item (la propriété destroyItemScript doit être
  						// définie). Sinon, il faut surclasser cette méthode pour qu'elle
  						// ne fasse rien.
  selectFirst()			// Sélectionne (et édite) le premier item
  selectNext()			// Sélectionne (et édite) l'item suivant
  selectPrevious()	// Sélectionne (et édite) l'item précédent s'il existe
  selectLast()			// Sélectionne (et édite) le dernier item
  
  
  constructor(data){
    super(data) // <============ ne pas oublier
  }
  
  // --- Méthodes d'instance ajoutées ---
  save()	// sauve l'item avec le script <class>.saveItemScript à qui
  				// on envoie {data: this.data}
  dispatchData(data)		// pour dispatcher les données
  update(data)	// pour actualiser les données, rafraichir l'affichage et 
  							// les sauver
}
~~~



---

## Méthodes optionnelles



**`static <owner>.onDestroy(item)`**

Méthode appelée (si elle existe) à la destruction d’un item. Si cette méthode n’existe pas, l’élément sera simplement détruit de la liste.



**`<owner>::afterCreate(item)`**

Méthode appelée après la création de l’item `item` si elle existe dans le propriétaire du listing.

Permet par exemple de placer le `LI` de l’item au bon endroit, en cas de classement autre que le classement naturel par ajout.



---



## Méthodes utiles



**`listing#deselectAll()`**

Pour retirer toutes les sélections du listing.



**`listing#displayedItems()`**

Retourne la liste des instances (du propriétaire) qui sont affichés. Sert particulièrement lorsqu'on filtre la liste.



**`Listing#selectedItems()` ou `Listing#getSelection()`**

Retourne la liste des instances (du propriétaire) qui sont sélectionnées.



**`Listing#setSelectionTo(...)`**

Met la sélection à la valeur envoyée ou aux valeurs envoyées en premier argument. Le second argument permet de définir des options.

```javascript

<Listing>#setSelectionTo([<...désignants items...>], {<options>})

```

La désignation des items peut avoir plusieurs formes :

* un identifiant d'[instance propriétaire],
* l'[instance propriétaire] elle-même,
* un array des identifiants des instances à sélectionner,
* un array des instances propriétaire à séletionner,
* un array d'arrays contenant [`<identifiant/instance>`, `<class CSS>`].

La dernière méthode permet de mettre des sélections dans un style personnalisé. À la déselection, tous ces styles seront supprimés.

Les options :

~~~

keep: true        Garde la sélection actuelle
                  Sinon, tous les éléments sélectionnés sont désélectionnés.

~~~





<a name="ownerinstance"></a>

## Instances propriétaires

Une « instance de propriétaire » désigne l'instance qui possède le listing.

Cette instance est soumise à certaines contraintes qu'on peut trouver dans la partie [Conformité du propriétaire du listing](#ownerconfirmite).

Dès qu'elles sont introduites dans le listing, on leur colle une nouvelle propriété `listingItem` qui contient leur instance `{ListingItem}` dans le listing. Cela permet d'effectuer des opérations directement sur ces items de liste.



## Nouvelle propriétés de classe

### Item sélectionné

**`<owner>.selectedOne`**

Retourne l’item sélectionné dans le listing, mais seulement s’il est unique.

## Nouvelles méthodes d'instances

Quand on lie un listing à un propriétaire, ce listing ajoute aussi de nouvelles méthodes (cf. la méthode d’instance `Listing#prepareOwner`)



### Sélection d’un item

**`<item owner>.select()`**

Permet de sélectionner l’instance du propriétaire `<item owner>` dans le listing.



### Désélection d’un item

**`<item owner>.deselect()`**

Désélectionne l’instance propriétaire dans le listing.



## Nouvelles propriétés d'instances



### Objet listing de l'item

**`<item owner>.listingItem`**

Retourne l’instance `Listing::ListingItem` de l’objet du listing associé à l’instance du propriétaire.



#### Ajout d’un classe au listing-item

**`<item owner>.listingItem.addClass('<class css>')`**

Concrètement, ça ajoute une classe css à l’élément `LI` de l’item dans la liste.

#### Retrait d’une class du listing-item

**`<item owner>.listingItem.removeClass('<class css>')`**

Concrètement, ça supprime la classe CSS de l’élément `LI` de l’item de la liste.



## Méthodes de classe optionnelles

> Note : la plupart de ces méthodes (toutes ?) sont appelées si elles existent, en tant que méthodes de classe, dans le propriétaire.



### Après la construction du listing

**`<Propriétaire>::afterBuild()`**

On peut s’en servir par exemple pour surveiller certains champs particuliers.

> Note : la méthode est appelée après que le listing a été placé dans le DOM.



### À l’activation du listing

C’est-à-dire quand on clique un de ses éléments (sans capturer définitivement l’évènement).

`<propriétaire>::onActivate()`



### À la sélection d'un élément dans le listing

Par défaut, cette méthode est `Propriétaire#onSelect(item)`.

Mais on peut définir une méthode propre dans l'[instanciation du listing][] avec la propriété `onSelect`.



### À la désélection d'un item

Par défaut, cette méthode est `Propriétaire#onDeselect(item)`.

Mais on peut définir une méthode propre dans l'[instanciation du listing][] avec la propriété `onDeselect`.



### Quand on désélectionne tout

~~~javascript
<owner>.onDeselectAll(){

}
~~~




### À l'ajout d'un élément dans le listing

Par défaut, cette méthode est `Propriétaire#onAdd(item)`.

Mais on peut définir une méthode propre au cours de l'[instanciation du listing][] avec la propriété `onAdd`.



---

## Annexe

### Historique des versions

#### Version 1.2.1

* Gestion du type « checkbox » 
* Options pour affiner le formulaire.

#### version 1.2.0

* Gestion des listes d’item ordonnées (`orderedList`)

##### version 1.1.0

* Option pour ne pas afficher la bande de titre
* Option pour ne pas rendre le listing draggable.
* Option pour ne pas confirmer la suppression

##### version 1.0.1

* Réglage de la valeur par défaut quand on reset le formulaire.
* Option `createOnPlus` qui permet de définir qu’il faut créer l’élément quand on clique sur le bouton « + ». Dans l’idée, c’est parce que souvent je fonctionne ainsi : je rentre les valeurs, puis je clique sur « + » pour créer l’élément alors que par défaut, le comportement est : 1) on clique sur « + » pour instancier un nouvel élément, 2) on définit ses valeurs, 3) on clique sur « Save » pour l’enregistrer.
* Développement du présent manuel (meilleure définition des champs de formulaire propres).
* Correction de la méthode de destruction qui ne fonctionnait qu’avec une base de données.












[propriétaire du listing]: #ownerlisting
[instance de propriétaire]: #ownerinstance
[instances de propriétaire]: #ownerinstance
[Instanciation du listing]: #instanciation
[instanciation du listing]: #instanciation
