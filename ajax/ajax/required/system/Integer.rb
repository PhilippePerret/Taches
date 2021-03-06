# encoding: UTF-8
# frozen_string_literal: true
class Integer
  def days
    self * 24 * 3600
  end #/ days
  alias :day :days

  # Retourne l'horloge correspondant au nombre de secondes
  def s2h(with_frames = false, options = nil)
    negatif = ''
    s = self
    if s < 0
      s = -s
      negatif = '-'
    end
    h = s / 3600
    s = s % 3600
    m = s / 60
    s = s % 60
    str = []
    str << h.to_s if h > 0
    str << "#{'0' if m < 10 && h > 0}#{m}"
    str << "#{'0' if s < 10}#{s}"
    # Retour
    negatif + if options && options.key?(:units)
      str = str.reverse
      dur = ""
      dur = "#{str[0]}#{options[:units][:seconds]}"       if str[0].to_i > 0
      dur = "#{str[1]}#{options[:units][:minutes]}#{dur}" if str[1].to_i > 0
      dur = "#{str[2]}#{options[:units][:hours]}#{dur}"   if str[2].to_i > 0
      dur
    else
      str.join(':')
    end
  end #/ s2h
  alias :to_horloge :s2h

  def as_duree
    self.to_horloge(false, units:{hours:'h', minutes:'\'', seconds:'"'})
  end #/ as_duree

end #/Integer
