'use strict'
/** ---------------------------------------------------------------------
  *   Classe Test, pour gérer un test
  *
*** --------------------------------------------------------------------- */

// Mettre à true pour court-circuiter le chargement de l'application
// et lancer les tests
const INSIDE_TESTS_ON = true ;
// const INSIDE_TESTS_ON = false ;

const RUN_SYSTEM_INSIDETESTS  = false ; // true => joue les tests systèmes
const RUN_APP_INSIDETESTS     = true ; // true => joue les tests de l'application

// *** APPLICATION ***
const INSIDE_TESTS_APP_FILES = [
  // ['simple_test.js']
    'tests_tache.js'
  , ['edition', 'taches']
  // , ['tests_labels.js', '']
]

// *** SYSTEM ***
const INSIDE_TESTS_SYSTEM_FILES = [
  ['tests_SmartList.js',        '']
, ['tests_SmartDate.js',        '']
, ['tests_SmartDate_parse.js',  '']
]


/** ---------------------------------------------------------------------
* =========================================================================
* =========================================================================
*
* ==================   NE RIEN TOUCHER CI-DESSOUS   ===================
*
* =========================================================================
* =========================================================================
*** --------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function(){
  if (INSIDE_TESTS_ON){
    App.init()
    .then(() => {Test.start.call(Test)})
    .catch(err => {console.error(err);erreur(err)})
  }
})



class Test {
  static init(ret){
    this.items = []; // pour mettre tous les tests (instances Test)
    this.success_count = 0
    this.failure_count = 0
    this.pending_count = 0
  }

  static loadAllTestFiles(){
    this.promisesList = []
    RUN_SYSTEM_INSIDETESTS && INSIDE_TESTS_SYSTEM_FILES.forEach(this.addTest.bind(this, 'system'))
    RUN_APP_INSIDETESTS && INSIDE_TESTS_APP_FILES.forEach(this.addTest.bind(this, 'app'))
    return Promise.all(this.promisesList)
  }
  static addTest(mainfolder, paire){
    var [file, folder] = (arg => {
      if ( 'string' == typeof(arg) ) return [arg, null]
      else return arg
    })(paire)
    var folderpath = `InsideTests/${mainfolder}`
    if ( folder ) folderpath += `/${folder}`
    // console.log("Ajout du path de test inside js '%s/%s'", folderpath, file)
    this.promisesList.push(loadJSModule(file, folderpath))
  }
  static start(){
    try {
      Ajax.send('tests/before-all.rb')
      .then(this.init.bind(this))
      .then(this.loadAllTestFiles.bind(this))
      .then(this.runNext.bind(this))
      .catch(err => {
        console.error(err)
        Ajax.send('tests/after-all.rb')
      })
    } catch (e) {
      console.error(this.currentTest.method_name)
      console.error(e)
      Ajax.send('tests/after-all.rb')
    }
  }
  static runNext(){
    const nextTest = this.items.shift()
    if ( nextTest ) {
      this.currentTest = nextTest
      nextTest.run.call(nextTest).then(this.runNext.bind(this))
    } else {
      this.currentTest = null
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
