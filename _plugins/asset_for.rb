require 'json'

module Jekyll
  module AssetFor
    private def format_file_name(file_name, absolute)
      "#{absolute ? '/' : ''}#{file_name}"
    end

    def asset_for(file_name)
      absolute = file_name.start_with?('/')
      file_name = file_name[1..-1] if absolute

      path = Pathname(file_name)
      # walk up the path and look for manifest.json
      path.dirname.ascend do |prefix|
        manifest_path = prefix / 'manifest.json'
        next unless manifest_path.exist?

        manifest = JSON.load_file(manifest_path)
        relative_path_from_manifest = path.relative_path_from(prefix).to_s
        asset_path = prefix / (manifest[relative_path_from_manifest] || relative_path_from_manifest)
        return format_file_name(asset_path, absolute)
      end

      # if we get here we didn't find a manifest, so assume files aren't hashed
      format_file_name(file_name, absolute)
    end
  end
end

Liquid::Template.register_filter(Jekyll::AssetFor)
