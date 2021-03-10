'use strict'

function getRandom(min, max){
  if ( undefined == max ) { [min, max] = [0, min] }
  return min + Math.floor(Math.random() * Math.floor(max))
}

/**
Extrait le nombre se trouvant dans +str+
On s'en sert en général pour les nombres à unité
WARNING : Ne fonctionne pas pour les flottants, puisque ça va supprimer le point
Il n'y a que le '-' qui est gardé, s'il est placé au tout début
***/
function extract_number(str){
  str = String(str)
  const isNegative = str.substring(0,1) == '-'
  if ( isNegative ) str = str.substring(1)
  var nombre = Number(str.replace(/[^0-9]/g,''))
  if ( isNegative ) nombre *= -1
  return nombre
}
