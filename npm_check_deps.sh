#!/bin/bash

REPORT_DIR="dependency-report/insight/$(date +%Y-%m-%d-%H-%M-%S)"
OUTDATED_FILE="outdated.json"
SAFE_FILE="minor-patch-updates.json"
MAJOR_FILE="major-updates.json"


# Create report directory if it doesn't exist
mkdir -p $REPORT_DIR

# Move all output files to the report directory
OUTDATED_FILE="$REPORT_DIR/$OUTDATED_FILE"
SAFE_FILE="$REPORT_DIR/$SAFE_FILE"
MAJOR_FILE="$REPORT_DIR/$MAJOR_FILE"

echo "Checking outdated dependencies..."

# Run, check and save the output to a file (ignore errors if no outdated packages)
npm outdated --json > $OUTDATED_FILE || true

if [ ! -s "$OUTDATED_FILE" ]; then
    echo "No outdated dependencies found"
    exit 0
fi

echo "Processing dependency list..."

# File 1: Same major version (minor/patch update)
jq '
to_entries
| map(select(
    (.value.current | split(".")[0]) ==
    (.value.latest | split(".")[0])
))
| from_entries
' $OUTDATED_FILE > $SAFE_FILE


# File 2: khác major version
jq '
to_entries
| map(select(
    (.value.current | split(".")[0]) !=
    (.value.latest | split(".")[0])
))
| from_entries
' $OUTDATED_FILE > $MAJOR_FILE

echo "----------------------------------"
echo "Safe updates saved to: $SAFE_FILE"
echo "Major updates saved to: $MAJOR_FILE"
echo "----------------------------------"


