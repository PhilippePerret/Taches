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
    taches = items.values.sort_by{|tache|tache.time}.collect{|tache|tache.data}
    new_data = {
      # TODO Plus tard, on pourra mettre d'autres données
      taches: taches,
      create_at:  data[:created_at] || Time.now.strftime('%Y/%m/%d-%H:%M'),
      updated_at: Time.now.strftime('%Y/%m/%d-%H:%M')
    }
    log("Data après classement : #{new_data.inspect}")
    File.delete(data_path) if File.exists?(data_path)
    File.open(data_path,'wb'){|f|f.write(YAML.dump(new_data))}
    return true
  rescue Exception => e
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
    @data_path ||= File.expand_path(File.join('.','taches.yaml'))
  end

end # /<< self
# ---------------------------------------------------------------------
#
#   INSTANCE
#
# ---------------------------------------------------------------------
attr_accessor :data
def initialize(data)
  @data = data
end
def id      ; data[:id]       end
def content ; data[:content]  end
def time    ; data[:time]     end

# Pour détruire la tâche
def destroy
  return false # pour le moment
end
end #/Tache
