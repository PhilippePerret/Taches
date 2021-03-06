# encoding: UTF-8
require 'fileutils'

# Le dossier de l'application
# ---------------------------
# Contient quelque chose comme '/Users/moi/Sites/MonApplication'
#
APP_FOLDER = File.dirname(File.dirname(File.dirname(__FILE__)))
log("APP_FOLDER = #{APP_FOLDER.inspect}")
require_relative 'ajax_class'

log("Chargement des modules")
Dir["#{APP_FOLDER}/ajax/ajax/required/**/*.rb"].each do |m|
  log("Chargement module '#{m}'")
  require m
end

# On profite de chaque appel Ajax pour détruire les fichier .DS_STORE qui
# peuvent exister.
if true
  stores = Dir["#{APP_FOLDER}/**/.DS_Store"]
  stores.each{|f|File.delete(f)}
  log("Nombre de fichiers .DS_Store détruits : #{stores.count}")
end
