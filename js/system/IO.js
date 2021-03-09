'use strict';
/**
  Utilitaires d'entrée sortie
**/
class IO {
  /**
    +path+    Le path complet ou relatif (si +folder+ est fourni)
    +folder+  Le dossier si +path+ est fourni en chemin relatif
    +ev+      Est fourni lorsque la méthode est appelée par un gestionnaire
              d'évènement
  **/
  static openInFinder(path, folder, ev){
    Ajax.send('system/open-in-finder.rb', {path:path, folder:folder})
    .then(onAjaxSuccess).catch(onError)
    ev && stopEvent(ev)
  }
}
