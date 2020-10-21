echo What is the version?
read VERSION
docker build -t distortedlogic/backend:v${VERSION} . -f Dockerfile.prod
docker push distortedlogic/backend:v${VERSION}
ssh -i \Users\jerme\.ssh\aws.pem ubuntu@ec2-3-236-121-24.compute-1.amazonaws.com "docker pull distortedlogic/backend:v${VERSION} && docker tag distortedlogic/backend:v${VERSION} dokku/backend:v${VERSION} && dokku deploy backend ${VERSION}"