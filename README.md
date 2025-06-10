
docker build --build-arg NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyAczaRb40MSbLJd2R6GCznRkBt_wp76EWI -t urems .
docker run -p 3000:3000 --env-file .env.docker urems


login
reset password
using your middleware to manage user auth state
using cookies to store user auth token only
see information on the login
change some types
tes user : because have to add user from the web-app - dashboard

email: user@gmail.com
pwd: Querty!23