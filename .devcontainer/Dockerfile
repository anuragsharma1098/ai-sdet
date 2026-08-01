FROM mcr.microsoft.com/playwright:v1.61.0-noble

USER root

COPY .devcontainer/install-system-deps.sh /tmp/install-system-deps.sh
RUN bash /tmp/install-system-deps.sh \
    && rm /tmp/install-system-deps.sh

RUN npm install -g appium@latest \
    && appium driver install uiautomator2

WORKDIR /workspaces/ai-sdet

USER pwuser
