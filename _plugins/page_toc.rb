require 'redcarpet';

module Jekyll
  class PageTocTag < Liquid::Tag
    def initialize(tag_name, args, tokens)
    end
    def render(context)
      content = File.open(context.environments.first["page"]["path"]).read
      content = content.gsub(/^---.*\n---/m, '')
      content = content.gsub(/^{% api %}\n([^\n]*)/m, '### \1')

      content = Redcarpet::Markdown.new(Redcarpet::Render::HTML_TOC).render(content)
      content.gsub(/toc_\d*">([^<]*)/) {
        name = $1
        slug = name.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')
        slug + '">' + name
      }
    end
  end

end

Liquid::Template.register_tag('page_toc', Jekyll::PageTocTag)
