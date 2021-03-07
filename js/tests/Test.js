'use strict'
/** ---------------------------------------------------------------------
  *   Classe Test, pour gérer un test
  *
*** --------------------------------------------------------------------- */
class Test {
  static init(ret){
    this.items = []; // pour mettre tous les tests (instances Test)
    this.success_count = 0
    this.failure_count = 0
    this.pending_count = 0
  }
  static start(){
    try {
      Ajax.send('tests/before-all.rb')
      .then(this.init.bind(this))
      // *** SYSTEM ***
      .then(loadJSModule.bind(window,'tests_SmartList.js', 'tests/system'))
      // *** APPLICATION ***
      // .then(loadJSModule.bind(window,'tests_tache.js','tests'))
      // .then(loadJSModule.bind(null,'tests_labels.js','tests'))
      .then(this.runNext.bind(this))
      .catch(err => {
        console.error(err)
        Ajax.send('tests/after-all.rb')
      })
    } catch (e) {
      console.error(e)
      Ajax.send('tests/after-all.rb')
    }
  }
  static runNext(){
    const nextTest = this.items.shift()
    if ( nextTest ) {
      nextTest.run.call(nextTest).then(this.runNext.bind(this))
    } else {
      this.report()
      return Ajax.send('tests/after-all.rb')
    }
  }
  static report(){
    var style = (() => {
      if (this.failure_count > 0) return 'color:red;font-weight:bold;'
      else if (this.pending_count > 0) return 'color:orange;'
      else return 'color:green;font-weight:bold;'
    })();
    console.log('%c-------------------------------------------------------------', style)
    console.log('%cSuccess: '+this.success_count+ '   Failures: '+this.failure_count+'   Pendings: '+this.pending_count, style)
  }

static add(test, human_name){
  if ( 'string' === typeof(test) ) test = new Test(test, {success: human_name})
  this.items.push(test)
}
static new(method_human_name, method){
  const method_name = method_human_name.replace(/ /g,'_').replace(/[^a-zA-Z0-9]]/g,'_')
  this[method_name] = method;
  this.add(method_name, method_human_name)
}
/** ---------------------------------------------------------------------
  *   INSTANCE
  *
*** --------------------------------------------------------------------- */
constructor(method_name, params){
  this.method_name = method_name;
  this.params = params || {}
}
run(){
  return new Promise((ok,ko) => {
    try {
      var resultat = this.constructor[this.method_name].call(this)
      // console.log("resultat = ", resultat, typeof(resultat))
      if ( 'boolean' == typeof(resultat) ) {
        this.evaluateResultat(resultat)
        ok()
      } else {
        // Une promesse (peut-être le test pourrait être plus fin)
        resultat.then(resultat => this.evaluateResultat(resultat)).then(ok)
      }
    } catch (e) {
      this._failure_message = e
      this.onFailure()
    }
  })
}

evaluateResultat(resultat){
  if (resultat){
    this.onSuccess()
  } else {
    this.onFailure()
  }
}
onSuccess(success_message){
  this.writeSuccess()
  ++ this.constructor.success_count
}
onFailure(){
  this.writeFailure()
  ++ this.constructor.failure_count
}
writeSuccess(){
  console.log('%c'+this.success_message, 'color:green;')
}
writeFailure(){
  console.log('%c'+this.failure_message, 'color:red;font-weight:bold;')
}

get success_message(){
  return this._success_message || this.params.success || this.params.success_message || this.message_from_method_name
}
set success_message(msg){this._success_message = msg}

get failure_message(){
  return this._failure_message || this.params.failure || this.params.failure_message || `FAIL: ${this.message_from_method_name}`
}
set failure_message(msg){this._failure_message = msg}

get message_from_method_name(){
  return this._msgfrommethname || (this._msgfrommethname = this.buildMessageFromMethod())
}
buildMessageFromMethod(){
  var msg = this.method_name.replace(/_/g, ' ')
  var firstLetter = msg.substring(0,1);
  var reste = msg.substring(1, msg.length)
  msg = firstLetter.toUpperCase() + reste.toLowerCase()
  return msg
}
}//CLASS Test
