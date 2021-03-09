'use strict';
/**
* Test de la classe SmartDate
***/

Test.new('SmartDate#dayCountBefore(date) retourne le nombre de jours entre deux date', function(){
  var sd = new SmartDate()
  var actual = sd.dayCountBefore()
  actual == 0 || raise(`SmartDate#dayCountBefore(date) devrait retourner 0 (jours), il retourne ${actual}`)
  sd = TODAY.moins(4)
  actual = sd.dayCountBefore()
  actual == 4 || raise(`SmartDate#dayCountBefore(date) devrait retourner 4 (jours), il retourne ${actual}`)
  sd = TODAY.moins(6)
  var sd2 = TODAY.plus(4)
  actual = sd.dayCountBefore(sd2)
  actual == 10 || raise(`SmartDate#dayCountBefore(date) devrait retourner 10 (jours), il retourne ${actual}`)
  return true
})

Test.new('On peut instancier une SmartDate pour aujourd’hui', function(){
  var sd = new SmartDate()
  var expected = formate_date(new Date(), '%Y-%m-%d')
  sd.day == expected || raise(`La SmartDate d'aujourd'hui devrait avoir comme day '${expected}', il vaut '${sd.day}'`)
  return sd.constructor.name == 'SmartDate'
})

Test.new('TODAY est défini et est une SmartDate correcte', function(){
  if ( 'undefined' == typeof(TODAY) ) raise("TODAY n'est pas défini…")
  TODAY.constructor.name == 'SmartDate' || raise("TODAY devrait être une SmartDate")
  return true
})

Test.new('On peut instancier une SmartDate avec une date', function(){
  var sd = new SmartDate(new Date())
  sd.constructor.name == 'SmartDate' || raise("On devrait pouvoir instancier une SmartDate avec une date")
  return true
})

Test.new('Une instance SmartDate doit répondre aux méthodes utiles et retourner les bonnes propriétés', function(){
  var sd = new SmartDate(new Date())
  'undefined' != typeof(sd.day) || raise("Une SmartDate devrait définir la propriété :day")
  'undefined' != typeof(sd.date) || raise("Une SmartDate devrait définir la propriété :date")
  'function' == typeof(sd.formate) || raise("Une SmartDate devrait répondre à la méthode :formate")
  // Booléen
  'boolean' == typeof(sd.isToday) || raise("SmartDate.isToday devrait retourner un booléan")
  'boolean' == typeof(sd.isPast)  || raise('SmartDate.isPast devrait retourner un booléen')
  'boolean' == typeof(sd.isFuture) || raise('SmartDate.isFuture devrait retourner un booléen.')
  return true
})

Test.new('SmartDate.day doit retourner la bonne valeur', function(){
  const today = new Date()
  const sd = new SmartDate(today)
  var expected = formate_date(today, '%Y-%m-%d')
  sd.day == expected || raise(`SmartDate.day devrait valoir '${expected}', il vaut '${sd.day}'`)
  return true
})

Test.new('SmartDate.date doit retourner l’instance Date de la date', function(){
  const today = new Date()
  const sd = new SmartDate(today)
  sd.date.constructor.name == 'Date' || raise("SmartDate.date devrait être une instance Date")
  String(sd.date) == String(today) || raise(`SmartDate.date devrait renvoyer sa date (${today}), il renvoie ${sd.date}`)
  return true
})

Test.new('SmartDate.formate doit retourner la bonne valeur', function(){
  const today = new Date()
  const sd = new SmartDate(today)
  var expected = formate_date(today)
  var fmt = '%J %Y'
  var actual = sd.formate()
  actual == expected || raise(`SmartDate.formate() devrait être égal à ${expected}, il vaut ${d.formate()}`)
  expected = formate_date(today, fmt)
  actual = sd.formate(fmt)
  actual == expected || raise(`SmartDate.formate(${fmt}) devrait être égale à ${expected}, il vaut ${actual}…`)
  return true
})

Test.new('SmartDate#isToday, #isPast et #isFuture doivent retourner les bonnes valeurs en fonction de la date', function(){
  var sd = new SmartDate()
  sd.isToday == true || raise("SmartDate#isToday devrait retourner true avec aujourd'hui")
  sd.isPast == false || raise("SmartDate#isPast devrait retourner false avec aujourd'hui")
  sd.isFuture == false || raise("SmartDate#isFuture devrait retourner false avec aujourd'hui")
  var d = new Date()
  d.setFullYear(d.getFullYear() - 1)
  var sd = new SmartDate(d)
  sd.isToday == false || raise("SmartDate#isToday devrait retourner true avec une date dans le passé")
  sd.isPast == true || raise("SmartDate#isPast devrait retourner false avec une date dans le passé")
  sd.isFuture == false || raise("SmartDate#isFuture devrait retourner false avec une date dans le passé")
  d = new Date()
  d.setFullYear(d.getFullYear() + 1)
  var sd = new SmartDate(d)
  sd.isToday == false || raise("SmartDate#isToday devrait retourner true avec une date dans le futur.")
  sd.isPast == false || raise("SmartDate#isPast devrait retourner false avec une date dans le futur.")
  sd.isFuture == true || raise("SmartDate#isFuture devrait retourner false avec une date dans le futur.")
  return true
})
