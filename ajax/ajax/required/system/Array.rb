# encoding: UTF-8
# frozen_string_literal: true
class Array

  def moyenne(property = nil)
    nombre = self.count
    somme  =  if property.nil?
                self.inject(0){ |sum,x| sum + x}
              else
                self.inject(0){ |sum,x| sum + x.send(property) }
              end
    somme.to_f / nombre
  end #/ moyenne

  def variance(property = nil)
    moyenne = self.moyenne(property)
    if property.nil?
      self.collect{ |x| (x - moyenne)**2}.moyenne
    else
      self.collect{ |x| (x.send(property) - moyenne)**2}.moyenne
    end
  end #/ variance

  def ecart_type(property = nil)
    (self.variance(property))**0.5
  end #/ ecart_type

end #/Array
