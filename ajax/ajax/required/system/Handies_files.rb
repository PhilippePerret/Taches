# encoding: UTF-8
# frozen_string_literal: true

def mkdir(path)
  `mkdir -p "#{path}"` unless File.exists?(path)
  return path
end #/ mkdir


class File

# Retourne true si le fichier/dossier +path+ existe vraiment, avec cette
# casse exacte. 'Essai.md' et 'essai.md' seront considérés comme deux
# fichiers distincts.
def self.exists_with_case? path
  not %x( find "#{File.dirname(path)}" -name "#{File.basename(path)}" ).empty?
end

end #/File
