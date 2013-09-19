
module Jekyll
  module Converters
    class Markdown
      def convert(content) 
        setup
        content = @parser.convert(content)
        content.gsub(/toc_\d*">([^<]*)/) {
          name = $1
          slug = name.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')
          slug + '">' + name
        }
      end
    end
  end
end
