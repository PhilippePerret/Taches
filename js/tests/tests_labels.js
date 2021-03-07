'use strict'
/** ---------------------------------------------------------------------
*
*   Test des Labels
*
*** --------------------------------------------------------------------- */
class LabelFactory {
static create(data){
  data = data || {}
  data.id     || Object.assign(data, {id: Label.newId()})
  data.name   || Object.assign(data, {name: `Label #${data.id}`})
  data.colors || Object.assign(data, {colors: 'black:#CCF'})
  const label = new Label(data)
  return label.save()
}// LabelFactory.create

} // class LabelFactory

Test.new('On peut instancier un label avec des data correctes', () => {
  const label = new Label({name: "Nom du label"})
  return label.constructor.name == 'Label'
})

Test.new('Label répond à la méthode :formate', function(){
  return 'function' == typeof(Label.formate)
})

Test.new('Label.formate retourne un code correct', function(){
  return LabelFactory.create({name:"Premier label", colors: "white:red"})
  .then(LabelFactory.create.bind(LabelFactory, {name:"Deuxième label"}))
  .then(LabelFactory.create.bind(LabelFactory, {name:"Troisième label"}))
  .then(() => {
    var errors = []
    const label1 = Object.values(Label.items)[0]
    const label3 = Object.values(Label.items)[2]
    var res = Label.formate([label1.id,label3.id])
    // console.log("res = ", res)
    const expected = '<span class="label" data-id="1" style="color:white;background-color:red;">Premier label</span>'
    res.indexOf(expected) >= 0 || errors.push(`devrait contenir ${expected}`)

    if ( errors.length ) {
      this.failure_message = `Label.formate ne retourne pas le bon code : ${errors.join(', ')}.`
      return false
    } else {
      return true
    }
  })
})
