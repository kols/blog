FROM kane/ruby:2.1.3

WORKDIR /tmp

USER root
RUN apt-get install -y nodejs

USER kane

ADD Gemfile* /tmp/
RUN bash -l -c 'bundle install'

WORKDIR /home/kane/Documents/blog
ENTRYPOINT ["/bin/bash", "-l", "-c"]
EXPOSE 4000
