'use strict'

function getRandom(min, max){
  if ( undefined == max ) { [min, max] = [0, min] }
  return min + Math.floor(Math.random() * Math.floor(max))
}
