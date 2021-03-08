# encoding: UTF-8
# frozen_string_literal: true
=begin
  Renvoie toutes les données, tâches, labels, etc.
=end

Tache.backup_if_required

Ajax << Tache.data
