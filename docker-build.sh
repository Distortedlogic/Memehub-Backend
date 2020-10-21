docker build --build-arg CORS_ORIGIN=${CORS_ORIGIN} \
  --build-arg CORS_ORIGIN=${CORS_ORIGIN} \
  --build-arg CORS_ORIGIN=${HIVE_ACCOUNT} \
  --build-arg CORS_ORIGIN=${ACTIVE_WIF} \
  --build-arg CORS_ORIGIN=${RC_THRESHOLD} \
  --build-arg CORS_ORIGIN=${AWS_ID} \
  --build-arg CORS_ORIGIN=${AWS_KEY} \
  --build-arg CORS_ORIGIN=${SECRET} \
  -f Dockerfile.prod -t dokku/backend:latest .