FROM mcr.microsoft.com/playwright:v1.61.0-noble

USER root

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
      default-jdk \
      android-tools-adb \
      zip \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g appium@latest \
    && appium driver install uiautomator2

WORKDIR /workspaces/ai-sdet

USER pwuser
