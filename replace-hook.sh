#!/bin/bash 


packages='avatar-widget-v2 dataTest-v2 dry-run-v2 fitbit-activity-v2 fitbit-effort-v2 fitbit-heart-v2 fitbit-sleep-v2 holistic-health-v2 oura-activity-v2 oura-effort-v2 oura-heart-v2 oura-sleep-v2 garmin-activity-v2 garmin-effort-v2 garmin-heart-v2 garmin-sleep-v2'

for FOLDER in $packages
do
pushd packages/$FOLDER
sed -i '' 's/\"^0.0.3\",/\"^0.0.4\",/g' package.json >out.tro
popd 

done

#sed -i '' 's/=dev/=prod/g' env-tro

# find . -type f -name '*.txt' -exec sed -i '' s/this/that/g {} +

#"@prifina/hooks-v2": "^0.0.3",
#@prifina/hooks-v2@0.0.3

#find . -type f -name 'package.json' -exec sed -i '' s/0.0.2",/0.0.3",/g {} +