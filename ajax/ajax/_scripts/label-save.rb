# encoding: UTF-8
# frozen_string_literal: true
=begin
  Script pour sauver un label
=end

label_data = Ajax.param(:label_data).to_sym

Tache.labels = Tache.labels.merge!(label_data[:id] => label_data)
Tache.save
