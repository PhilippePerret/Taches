# encoding: UTF-8


# Pour requérir un module dans le dossier module
def require_module modname
  if File.directory?(File.expand_path("#{__dir__}/../../module/#{modname}"))
    Dir["#{__dir__}/../../module/#{modname}/**/*.rb"].each{|m| require m}
  else
    require_relative "../../module/#{modname}"
  end
end
