# encoding: UTF-8
# frozen_string_literal: true
=begin
  Code pour l'application à exécuter après tous les tests (pour retrouver
  par exemple l'état de l'application normale)
=end
require 'fileutils'

# Pour l'application Tâches, on doit remettre les fichiers d'après leur backup
#   - la liste des tâches taches.yaml
#   - le fichier d'archives taches_archives.txt
#   - le fichier de configuration config.yaml
[
  [Tache.data_path, Tache.data_backup_path],
  [Tache.archives_path, Tache.archives_backup_path],
  [Tache.config_path, Tache.config_backup_path]
].each do |original, backup|
  File.delete(original) if File.exists?(original)
  FileUtils.copy(backup, original) if File.exists?(backup)
end
