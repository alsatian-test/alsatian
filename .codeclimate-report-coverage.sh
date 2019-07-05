# create json reports from lcov
./cc-test-reporter format-coverage -t lcov -o coverage/alsatian.json packages/alsatian/coverage/lcov.info
./cc-test-reporter format-coverage -t lcov -o coverage/tap-bark.json packages/alsatian/coverage/lcov.info

# sum coverage together
./cc-test-reporter sum-coverage coverage/*.json -p 2

# upload to codeclimate
./cc-test-reporter upload-coverage --id $CODECLIMATE_REPO_TOKEN
