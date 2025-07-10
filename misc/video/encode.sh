#!/bin/bash

# default CRF to 24 (smaller is higher quality)
crf=${CRF-24}

# video bitrate in bits (M=megabits/s)
# 5M is good for screencasts at 1080p
bv=${BV-5M}

ffmpeg -i $1 \
  -c:v libx264 \
  -crf $crf \
  -c:a aac \
  -movflags faststart \
  -preset medium \
  -strict -2 \
  $2

# ignoring bitrate since CRF takes care of this
#  -b:v $bv \
