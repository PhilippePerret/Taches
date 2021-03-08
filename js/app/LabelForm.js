'use strict'
class LabelForm {
static init(){
  this.observe()
  this.close()
}
static open(){this.obj.classList.remove('hidden')}
static close(){this.obj.classList.add('hidden')}
static onClose(){this.close()}

// Méthode appelée pour éditer le label +label+
static edit(label){
  this.open()
}

static observe(){
  DGet('.btn-close',this.obj).addEventListener('click', this.onClose.bind(this))
}

static get obj(){return this._obj||(this._obj = DGet('#label-form'))}
}
