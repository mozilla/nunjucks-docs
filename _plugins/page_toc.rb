require 'redcarpet';

module Jekyll
  class PageTocTag < Liquid::Tag
    def initialize(tag_name, args, tokens)
    end
    def render(context)
      content = File.open(context.environments.first["page"]["path"]).read
      content = content.gsub(/^---.*\n---/m, '')
      Redcarpet::Markdown.new(Redcarpet::Render::HTML_TOC).render(content)
    end
  end

end

Liquid::Template.register_tag('page_toc', Jekyll::PageTocTag)
