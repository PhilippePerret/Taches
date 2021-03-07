'use strict'
/** ---------------------------------------------------------------------
  *   Module Formatage

Des méthodes pour faciliter le code

*** --------------------------------------------------------------------- */

function code(str){
  return `<code>${str}</code>`
}

function capitalize(str){
  return str.substring(0,1).toUpperCase() + str.substring(1)
}

const JOURS = {
    0: {long: 'dimanche', short:'dim'}
  , 1: {long: 'lundi', short:'lun'}
  , 2: {long: 'mardi', short:'mar'}
  , 3: {long: 'mercredi', short:'mer'}
  , 4: {long: 'jeudi', short:'jeu'}
  , 5: {long: 'vendredi', short:'ven'}
  , 6: {long: 'samedi', short:'sam'}
}
const MOIS = {
    0: {long:'janvier', short:'jan'}
  , 1: {long:'février', short:'fév'}
  , 2: {long:'mars', short:'mars'}
  , 3: {long:'avril', short:'avr'}
  , 4: {long:'mai', short:'mai'}
  , 5: {long:'juin', short:'juin'}
  , 6: {long:'juillet', short:'juil'}
  , 7: {long:'aout', short:'aout'}
  , 8: {long:'septembre', short:'sept'}
  , 9: {long:'octobre', short:'oct'}
  , 10: {long:'novement', short:'nov'}
  , 11: {long:'décembre', short:'déc'}
}
function formate_date(date, format){
  format = format || '%J %d %M %Y'

  format = format.replace(/%j/g, JOURS[date.getDay()].short)
  format = format.replace(/%J/g, JOURS[date.getDay()].long)
  format = format.replace(/%d/g, date.getDate())
  format = format.replace(/%Y/g, date.getFullYear())
  format = format.replace(/%m/g, date.getMonth() + 1)
  format = format.replace(/%M/g, MOIS[date.getMonth()].long)
  format = format.replace(/%mm/g, MOIS[date.getMonth()].short)

  return format
}
