'use strict'

const REG_MARK_AS_OFFSET = /^([+-])([0-9]+)([a-z]*)$/
const REG_MARK_AS_DATE = /^([0-9]{1,2})(?:[ /]([0-9]{1,2})(?:[ /]([0-9]{2,4}))?)?$/
class SmartDate {
/** ---------------------------------------------------------------------
*
*   CLASSE SmartDate
*
*** --------------------------------------------------------------------- */

/**
Parser la date de façon intelligente
------------------------------------
+foo+ La date fournie, en format string.
      Elle peut avoir la forme :
***/

static parse(foo){
  const dal = ((val) => {
    switch(foo){
      case'today':case'aujourd\'hui':case'auj':case'now':case'maintenant': return TODAY
      case'demain':case'tomorrow':case'dem':case'+1': return this.demain
      case 'hier': case 'yesterday':case'-1': return this.hier
      case 'avant-hier':case '-2': return this.avantHier
      default:
        const fooInit = `${foo}`
        foo = foo.replace(/ /g,'')
        // regOffset = foo.match(REG_MARK_AS_OFFSET)
        var regOffset = REG_MARK_AS_OFFSET.exec(foo)
        var regDate   = REG_MARK_AS_DATE.exec(fooInit)
        if ( regOffset ) {
          // console.log("regOffset = ", regOffset)
          var [tout, sign, nombre, unite] = regOffset
          nombre = parseInt(nombre, 10)
          if (unite == '') unite = 'jour'
          else if ( unite.startsWith('sem') ) nombre = nombre * 7
          else if ( unite.startsWith('mois')) nombre = nombre * 30
          sign = sign == '+' ? 1 : -1 ;
          return TODAY.offset(sign * nombre * 24 * 3600)
        } else if ( regDate ) {
          // console.log("regDate : ", regDate)
          var [tout, jour, mois, annee] = regDate
          if (!mois || mois == '') mois = TODAY.date.getMonth() + 1
          if (!annee || annee == '') annee = TODAY.date.getFullYear()
          else if ( annee.length == 2 ) annee = "20"+annee
          return new SmartDate(`${annee}/${mois}/${jour}`)
        }
    }
  })(foo)
  if ( dal ) {
    return new SmartDate(dal.date)
  } else {
    raise(`Impossible de trouver la date avec “${foo}”…`)
  }
}

static get demain(){return this._demain||(this._demain = TODAY.plus(1))}
static get tomorrow(){return this.demain}
static get yesterday(){return this._hier || (this._hier = TODAY.moins(1))}
static get hier(){return this.yesterday}
static get avantHier(){return this._avanthier || (this._avanthier = TODAY.moins(2))}


/** ---------------------------------------------------------------------
*
*   INSTANCE SmartDate
*
*** --------------------------------------------------------------------- */
constructor(dateInit) {
  dateInit = dateInit || new Date()
  this.dateInit = dateInit
}
get day(){
  return this._day || (this._day = this.formate('%Y-%m-%d'))
}

get date(){
  return this._date || (this._date = this.getDate())
}

formate(format){
  return formate_date(this.date, format)
}

// Retourne la SmartDate de cette date moins le nombre de jours
moins(nombreJours){
  return this.offset(-1*nombreJours*24*3600)
}
// Retourne la SmartDate de cette date + le nombre de jours
plus(nombreJours){
  return this.offset(nombreJours*24*3600)
}
offset(secondes){
  const newDate = new Date()
  newDate.setTime(this.date.getTime() + 1000 * secondes)
  // console.log("newDate = ", newDate)
  return new SmartDate(newDate)
}

get isToday(){return this._istoday || (this._istoday = this.day == TODAY.day)}
get isPast(){return this._ispast || (this._ispast = this.day < TODAY.day)}
get isFuture(){return this._isfuture || (this._isfuture = this.day > TODAY.day)}

// *** Private methods ***

getDate(){
  let d = this.dateInit
  if ( this.dateInit.constructor.name != 'Date' ) d = Date.parse(d)
  return new Date(d)
}

}//Class SmartDate

const TODAY = new SmartDate()
