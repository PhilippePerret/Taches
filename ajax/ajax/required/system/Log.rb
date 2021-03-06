# encoding: UTF-8
# frozen_string_literal: true
def log(msg)
  Log.add(msg)
end

class Log
class << self
  def add(msg)
    ref.puts("#{Time.now.strftime('--- %Y/%m/%d-%H:%M')} #{msg}")
  end

  def ref
    @ref ||= File.open(path,'a')
  end
  def path
    @path ||= File.expand_path(File.join('.','journal.log'))
  end
end # /<< self
end #/Log
