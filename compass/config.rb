# Require any additional compass plugins here.
require 'compass_twitter_bootstrap'

site_root = File.dirname(File.dirname(File.absolute_path(__FILE__)))
assets_dir = File.join(site_root, 'assets')
# Set this to the root of your project when deployed:
http_path = "/assets"
css_dir = "stylesheets"
css_path = File.join(assets_dir, "stylesheets")
sass_dir = "sass"
images_dir = "images"
images_path = File.join(assets_dir, "images")
javascripts_dir = "javascripts"
javascripts_path = File.join(assets_dir, "javascripts")

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass
