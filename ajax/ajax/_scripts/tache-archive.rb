# encoding: UTF-8
# frozen_string_literal: true
=begin
  Permet d'archiver la tâche fourni en argument
=end

Tache.get(Ajax.param(:tache_id)).archive
