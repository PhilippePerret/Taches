# encoding: UTF-8
# frozen_string_literal: true

new_data = Ajax.param(:tache_data)
if Tache.get(new_data[:id])
  # Sauvegarde d'une tâche existante
  Tache.get(new_data[:id]).data = new_data
  if Tache.save
    Ajax << {message:"Tâche sauvée avec succès."}
  else
    Ajax << {error:"Impossible de sauver la tâche : #{Tache.error}"}
  end
else
  # Création d'une nouvelle tâche
  if Tache.create(new_data)
    Ajax << {message:"Tâche créée avec succès."}
  else
    Ajax << {error:"Impossible de créer la tâche : #{Tache.error}"}
  end
end
