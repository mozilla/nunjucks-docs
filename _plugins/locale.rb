# -*- coding: utf-8 -*-

module Jekyll
  module LocaleFilter
    
    def locale_buttons(url)
      if url.start_with?('/cn/')
        en_url = url.sub(/^\/cn\//, '/')
        '<a href="' + en_url + '" class="btn btn-default">English</a>' +
          '<a href="' + url + '" class="btn btn-success">中国的</a>'
      else
        cn_url = url.sub(/^\//, '/cn/')
        '<a href="' + url + '" class="btn btn-success">English</a>' +
          '<a href="' + cn_url + '" class="btn btn-default">中国的</a>'
      end
    end

  end
end

Liquid::Template::register_filter(Jekyll::LocaleFilter)
