'use strict'
/** ---------------------------------------------------------------------
*
*   Test des Labels
*
*** --------------------------------------------------------------------- */

Test.new('On peut instancier un label avec des data correctes', () => {
  const label = new Label({name: "Nom du label"})
  return label.constructor.name == 'Label'
})
