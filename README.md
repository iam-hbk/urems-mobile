
docker build --build-arg NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyAczaRb40MSbLJd2R6GCznRkBt_wp76EWI -t urems .
docker run -p 3000:3000 --env-file .env.docker urems
