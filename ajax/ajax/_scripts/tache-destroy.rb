# encoding: UTF-8
# frozen_string_literal: true
=begin
  Script de destruction de la tache

  Note : il s'agit bien ici, de détruire définitivement la tâche, pas de la
  mettre en archives.
=end

tache = Tache.get(Ajax.param(:tache_id))
if tache.destroy
  Ajax << {message: "La tache ##{tache.id} a été détruite."}
else
  Ajax << {error: "Impossible de détruire la tâche ##{tache.id} : #{tache.error}"}
end
