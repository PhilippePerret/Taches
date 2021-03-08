# encoding: UTF-8
# frozen_string_literal: true
=begin

  Script pour pouvoir exécuter plusieurs opérations sur le fichier des
  données plutôt que d'appeler en rafale plusieurs scripts différents qui
  poseraient des problèmes à l'unique fichier qui contient les données
=end

operations = Ajax.param(:operations)
msg = []
errors = []
operations.each do |operation|
  case operation['operation']
  when 'destroy-label'
    Tache.labels.delete(operation['id'])
    msg << "Destruction du label opérée."
  when 'update-labels-tache'
    tache = Tache.get(operation['id'])
    data = tache.data
    data[:labels] = operation['labels']
    log("Je mets data[:labels] de tache ##{tache.id} à #{data[:labels].inspect}")
    tache.data = data
    msg << "Actualisation des labels de la tâche ##{tache.id} opérée."
  else
    errors << "<span class='red'>Opération inconnue : #{operation['operation']}</span>"
  end
end
# On peut sauver les données
Tache.save
# Message de fin
# Ajax << {message: "Exécution des opérations suivantes : #{msg.join("\n")}\n#{errors.join("\n")}"}
