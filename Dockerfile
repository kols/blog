FROM kane/ruby:0.1r2.1.3

WORKDIR /tmp
USER root
RUN apt-get update \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

USER kane
ADD Gemfile* /tmp/
RUN bash -l -c 'bundle install'

WORKDIR /home/kane/Documents/blog
ENTRYPOINT ["/bin/bash", "-l", "-c"]
EXPOSE 4000
