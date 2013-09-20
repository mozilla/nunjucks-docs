
module Jekyll
  module Converters
    class Markdown
      def convert(content) 
        setup
        content = @parser.convert(content)
        names = {}

        content.gsub(/toc_\d*">([^<]*)/) {
          name = $1
          slug = name.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')

          if names.has_key?(slug)
            i = 1
            while !names.has_key?(slug)
              i = i + 1
            end
            slug = slug + i.to_s
          end

          names[slug] = true
          slug + '">' + name
        }
      end
    end
  end
end
