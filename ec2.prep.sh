sudo docker run -d --name watchtower -v /var/run/docker.sock:/var/run/docker.soc v2tec/watchtower
sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
dokku domains:clear-global
dokku domains:add-global ${DOMAIN}
dokku domains:clear ${APP_NAME}
dokku letsencrypt ${APP_NAME}