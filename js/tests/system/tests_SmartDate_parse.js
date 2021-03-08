'use strict'


Test.new('SmartDate répond à la méthode parse qui parse de façon intelligente', function(){
  return 'function' == typeof(SmartDate.parse)
})

Test.new('SmartDate.parse retourne une SmartDate', function(){
  return SmartDate.parse('today').constructor.name == 'SmartDate'
})

Test.new('SmartDate::parse retourne la valeur correcte pour tous les alias d’aujourd’hui', function(){
  ;[
    'today', 'aujourd\'hui', 'auj', 'now', 'maintenant'
  ].forEach(mark => {
    // console.log("SmartDate.parse(mark) = ", SmartDate.parse(mark))
    SmartDate.parse(mark).day == TODAY.day || raise(`La marque “${mark}” devrait retourner le jour “${TODAY.formate()}”`)
  })
  return true
})

Test.new('SmartDate::parse retourne la valeur correcte pour tous les alias de demain', function(){
  const demain = TODAY.plus(1)
  ;['demain','tomorrow','dem','+1']
  .forEach(mark => {
    SmartDate.parse(mark).day == demain.day || raise(`La marque “${mark}” (pour demain) devrait retourner le jour “${demain.formate()}”…`)
  })
  return true
})
Test.new('SmartDate::parse retourne la bonne valeur pour tous les alias d’hier', function(){
  const hier = SmartDate.hier
  ;['hier','yesterday','-1'].forEach(mark=>{
    SmartDate.parse(mark).day == hier.day || raise(`La marque “${mark}” (pour hier) devrait retourner le jour “${demain.formate()}”…`)
  })
  return true
})

Test.new('SmartDate::parse retourne la bonne valeur pour tous les alias d’avant-hier', function(){
  const avhierday = SmartDate.avantHier.day
  ;['avant-hier','-2'].forEach(mark => {
    SmartDate.parse(mark).day == avhierday || raise(`La marque “${mark}” (pour avant-hier) devrait retourner le jour “${demain.formate()}”…`)
  })
  return true
})

Test.new('SmartDate::parse retourne la bonne valeur avec une valeur commençant par “+”', function(){
  var liste = [
      ['+3', TODAY.plus(3).day]
    , ['+3j', TODAY.plus(3).day]
    , ['+3 j', TODAY.plus(3).day]
    , ['+3jours', TODAY.plus(3).day]
    , ['+ 3 jours', TODAY.plus(3).day]
    , ['+3semaines', TODAY.plus(3*7).day]
    , ['+3 semaines', TODAY.plus(3*7).day]
    , ['+ 3 semaines', TODAY.plus(3*7).day]
    , ['+3sem', TODAY.plus(3*7).day]
    , ['+ 3sem', TODAY.plus(3*7).day]
    , ['+3mois', TODAY.plus(3*30).day]
    , ['+ 3mois', TODAY.plus(3*30).day]
    , ['+ 3 mois', TODAY.plus(3*30).day]
  ]
  liste.forEach(paire => {
    const [mark, valeur] = paire
    SmartDate.parse(mark).day == valeur || raise(`La mark “${mark}” devrait retourner le day “${valeur}”`)
  })
  return true
})

Test.new('SmartDate::parse retourne la bonne valeur avec une valeur commençant par “-”', function(){
  var liste = [
      [' -3', TODAY.moins(3).day]
    , ['-3j', TODAY.moins(3).day]
    , ['-3 j', TODAY.moins(3).day]
    , ['-3jours', TODAY.moins(3).day]
    , [' - 3 jours', TODAY.moins(3).day]
    , ['-3semaines', TODAY.moins(3*7).day]
    , ['-3 semaines', TODAY.moins(3*7).day]
    , ['- 3 semaines', TODAY.moins(3*7).day]
    , ['-3sem', TODAY.moins(3*7).day]
    , ['- 3sem', TODAY.moins(3*7).day]
    , [' -3mois', TODAY.moins(3*30).day]
    , ['- 3mois', TODAY.moins(3*30).day]
    , ['- 3 mois', TODAY.moins(3*30).day]
  ]
  liste.forEach(paire => {
    const [mark, valeur] = paire
    SmartDate.parse(mark).day == valeur || raise(`La mark “${mark}” devrait retourner le day “${valeur}”`)
  })
  return true
})

Test.new('SmartDate::parse retourne la bonne valeur avec une date passée par “JJ/MM/AA” ou “JJ MM AA”', function(){
  const liste = [
      ['23/12/1992', new Date(1992,11,23)]
    , ['21 12 1992', new Date(1992,11,21)]
    , ['4 12 1992', new Date(1992,11,4)]
  ]
  liste.forEach(paire => {
    const [mark, valuedate] = paire
    var actual = String(SmartDate.parse(mark).date)
    actual == String(valuedate) || raise(`La mark “${mark}” devrait donner la date ${valuedate}. Or elle donne ${actual}`)
  })
  return true
})

Test.new('SmartDate::parse retourne la bonne valeur avec une date passée par “JJ/MM” ou “JJ MM” (sans année, donc)', function(){
  const annee = new Date().getFullYear()
  const liste = [
      ['23/12', new Date(annee,11,23)]
    , ['21 12', new Date(annee,11,21)]
    , ['4 12', new Date(annee,11,4)]
  ]
  liste.forEach(paire => {
    const [mark, valuedate] = paire
    var actual = String(SmartDate.parse(mark).date)
    actual == String(valuedate) || raise(`La mark “${mark}” devrait donner la date ${valuedate}. Or elle donne ${actual}`)
  })
  return true
})

Test.new('SmartDate::parse retourne la bonne valeur avec une date passée par “JJ” (sans année ni mois, donc)', function(){
  const annee = new Date().getFullYear()
  const mois  = new Date().getMonth()
  const liste = [
      ['23', new Date(annee,mois,23)]
    , ['13', new Date(annee,mois,13)]
    , ['4', new Date(annee,mois,4)]
  ]
  liste.forEach(paire => {
    const [mark, valuedate] = paire
    var actual = String(SmartDate.parse(mark).date)
    actual == String(valuedate) || raise(`La mark “${mark}” devrait donner la date ${valuedate}. Or elle donne ${actual}`)
  })
  return true
})
