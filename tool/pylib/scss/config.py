################################################################################
# Configuration:
<<<<<<< HEAD

import os
PROJECT_ROOT = os.path.normpath(os.path.dirname(os.path.abspath(__file__)))
# Sass @import load_paths:
LOAD_PATHS = os.path.join(PROJECT_ROOT, 'sass/frameworks')
# Assets path, where new sprite files are created:
STATIC_ROOT = os.path.join(PROJECT_ROOT, 'static')
=======
DEBUG = False
VERBOSITY = 1

import os
PROJECT_ROOT = os.path.normpath(os.path.dirname(os.path.abspath(__file__)))

# Sass @import load_paths:
LOAD_PATHS = os.path.join(PROJECT_ROOT, 'sass/frameworks')

>>>>>>> resolution
# Assets path, where new sprite files are created (defaults to STATIC_ROOT + '/assets'):
ASSETS_ROOT = None
# Cache files path, where cache files are saved (defaults to ASSETS_ROOT):
CACHE_ROOT = None
<<<<<<< HEAD
# Urls for the static and assets:
STATIC_URL = 'static/'
ASSETS_URL = 'static/assets/'
VERBOSITY = 1
DEBUG = 0
=======
# Assets path, where new sprite files are created:
STATIC_ROOT = os.path.join(PROJECT_ROOT, 'static')
FONTS_ROOT = None  # default: STATIC_ROOT
IMAGES_ROOT = None  # default: STATIC_ROOT

# Urls for the static and assets:
ASSETS_URL = 'static/assets/'
STATIC_URL = 'static/'
FONTS_URL = None  # default: STATIC_URL
IMAGES_URL = None  # default: STATIC_URL

# Rendering style. Available values are 'nested', 'expanded', 'compact', 'compressed' and 'legacy' (defaults to 'nested'):
STYLE = 'nested'

# Use a different scope inside control structures create a scope (defaults to create new scopes for control structures, same as Sass):
CONTROL_SCOPING = True

# Throw fatal errors when finding undefined variables:
FATAL_UNDEFINED = True
>>>>>>> resolution

SPRTE_MAP_DIRECTION = 'vertical'
