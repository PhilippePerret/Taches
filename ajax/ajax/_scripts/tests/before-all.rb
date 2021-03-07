# encoding: UTF-8
# frozen_string_literal: true
=begin
  À exécuter avant tous les tests
=end
require 'fileutils'

# Pour l'application Tâches, on doit faire un backup de
#   - la liste des tâches taches.yaml
#   - le fichier d'archives taches_archives.txt
#   - le fichier de configuration config.yaml
[
  [Tache.data_path, Tache.data_backup_path],
  [Tache.archives_path, Tache.archives_backup_path],
  [Tache.config_path, Tache.config_backup_path]
].each do |original, backup|
  File.delete(backup) if File.exists?(backup)
  FileUtils.copy(original, backup) if File.exists?(original)
end
