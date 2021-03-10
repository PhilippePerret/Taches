'use strict'


Test.new('extract_number retourne le nombre extrait', function(){
  [
      ['12', 12]
    , ['12px', 12]
    , ['-12px', -12]
  ].forEach( ([value, expected]) => {
    var actual = extract_number(value)
    actual == expected || raise(`extract_number("${value}") devrait renvoyer ${expected}, elle renvoie ${actual}`)
  })
  return true
})
