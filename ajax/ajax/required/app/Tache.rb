# encoding: UTF-8
# frozen_string_literal: true
require 'yaml'

class Tache
class << self
  attr_reader :error # pour passer l'erreur au script

  def get(tache_id)
    log("-> Tache::get(#{tache_id.inspect}::#{tache_id.class})")
    items[tache_id]
  end

  # Méthode pour créer une tâche
  def create(tache_data)
    log("Taches avant ajout : #{items.inspect}")
    items.merge!(tache_data[:id] => new(tache_data))
    log("Taches après ajout : #{items.inspect}")
    return save
  rescue Exception => e
    @error = e.message
    return false
  end

  def save
    log("Data avant sauvegarde : #{data.inspect}")
    taches = items.values.sort_by{|tache|tache.echeance_time}.collect{|tache|tache.data}
    new_data = {
      taches: taches,
      labels: labels,
      create_at:  data[:created_at] || Time.now.strftime('%Y/%m/%d-%H:%M'),
      updated_at: Time.now.strftime('%Y/%m/%d-%H:%M')
    }
    log("Data après classement : #{new_data.inspect}")
    File.delete(data_path) if File.exists?(data_path)
    File.open(data_path,'wb'){|f|f.write(YAML.dump(new_data))}
    return true
  rescue Exception => e
    Ajax.error(e)
    @error = e.message
    return false
  end #/ save

  def items
    @items ||= begin
      h = {}
      data[:taches].each do |dtache|
        h.merge!(dtache[:id] => new(dtache))
      end
      h
    end
  end #/ items

  def labels
    @labels ||= data[:labels] || {}
  end
  def labels=(value)
    @labels = value
  end

  def data
    @data ||= begin
      if File.exists?(data_path)
        YAML.load_file(data_path)
      else
        {taches:[]}
      end
    end
  end #/ data

  def data_path
    @data_path ||= File.join(DATA_FOLDER,'taches.yaml')
  end
  def data_backup_path
    @data_backup_path ||= File.join(DATA_FOLDER,'taches_backup.yaml')
  end

  def archives_path
    @archives_path ||= File.join(DATA_FOLDER,'archives.txt')
  end
  def archives_backup_path
    @archives_backup_path ||= File.join(DATA_FOLDER,'archives_backup.txt')
  end

  def config_path
    @config_path ||= File.join(DATA_FOLDER,'config.yaml')
  end
  def config_backup_path
    @config_backup_path ||= File.join(DATA_FOLDER,'config_backup.yaml')
  end

end # /<< self
# ---------------------------------------------------------------------
#
#   INSTANCE
#
# ---------------------------------------------------------------------
attr_accessor :data
attr_reader :error # pour les erreurs à renvoyer
def initialize(data)
  @data = data
end
def id        ; data[:id]       end
def content   ; data[:content]  end
def duree     ; data[:duree]    end
def echeance  ; data[:echeance].nil_if_empty end

def echeance_time
  @echeance_time ||= begin
    if echeance
      Time.new(echeance)
    else
      0 # pour être toujours en premier
    end
  end
end #/ echeance_time

# Pour détruire la tâche
def destroy
  self.class.items.delete(id)
  self.class.save
  return true
rescue Exception => e
  @error = e.message
  Ajax.error(e)
  return false # pour le moment
end
end #/Tache
