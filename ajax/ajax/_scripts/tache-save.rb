# encoding: UTF-8
# frozen_string_literal: true

new_data = Ajax.param(:tache_data).to_sym
if Tache.get(new_data[:id])
  # Sauvegarde d'une tâche existante
  log("-> sauvegarde de #{new_data.inspect}")
  Tache.get(new_data[:id]).data = new_data
  if Tache.save
    Ajax << {message:"Tâche sauvée avec succès."}
  else
    Ajax << {error:"Impossible de sauver la tâche : #{Tache.error}"}
  end
else
  # Création d'une nouvelle tâche
  log("-> création d'une nouvelle donnée : #{new_data.inspect}")
  if Tache.create(new_data)
    Ajax << {message:"Tâche créée avec succès."}
  else
    Ajax << {error:"Impossible de créer la tâche : #{Tache.error}"}
  end
end
