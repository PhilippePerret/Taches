'use strict'
/** ---------------------------------------------------------------------
  *   Test des Labels
  *
*** --------------------------------------------------------------------- */

Test.new('on_peut_instancier_un_label_avec_des_data_correctes', () => {
  const label = new Label({name: "Nom du label"})
  return typeof(label) == 'object'
})
