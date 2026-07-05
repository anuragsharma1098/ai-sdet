#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -y --no-install-recommends \
  default-jre-headless \
  android-tools-adb \
  zip
rm -rf /var/lib/apt/lists/*
