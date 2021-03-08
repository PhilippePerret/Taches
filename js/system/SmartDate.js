'use strict'

class SmartDate {
/** ---------------------------------------------------------------------
*
*   CLASSE SmartDate
*
*** --------------------------------------------------------------------- */
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
