#!/bin/bash

# Render DOT format to SVG with custom styling
dot -T svg \
  -Gbgcolor='#ffffff' \
  -Nshape=box \
  -Nstyle='rounded,filled' \
  -Nfontname=Arial \
  -Nfontsize=10 \
  -Ecolor='#00000055' \
  -Epenwidth=1.5 \
  -Earrowsize=0.8 \
  > docs/architecture-layers.svg

echo '✔ Architectural layers visualization: docs/architecture-layers.svg'
