# https://www.AaronWht.com - This project powers my website.  
This website uses React/Redux, Semantic UI, Node and MongoDB.  I built it for me - you're free to use it as you'd like.    

The client-side JavaScript uses React/Redux and can be deployed to AWS S3 or another static hosting environment.  
The server-side uses Node and MongoDB and is intended to be deplooyed to an AWS EC2 instance.  

Configuration Files and Variables:  

Create a /client/.env file with the following:  
REACT_APP_API=https://your-api-end-point.com/  
REACT_APP_WEBSITE=https://www.your-website-address.com/  
REACT_APP_WEBSITE_OWNER=Your Name  
REACT_APP_TWITTER=twitter-handle  
REACT_APP_LINKED_IN=linkedin-handle  
REACT_APP_IMAGE_URL=https://static-image-server-address.com/images/  
REACT_APP_GA_API=Google_Analytics_Api_Key    

Create a /.env file with the following:  
MONGODB_URI=mongodb://mongo-user-name:your-password@localhost:27017/database-name  
MONGODB_NAME=database-name  
S3_ACCESS_KEY_ID=Your-Access-Key  
S3_SECRET_ACCESS_KEY=Your-Secrete-Access-Key  
S3_BUCKET=Your-S3-Bucket-Name  
EMAIL=email@youraddress.com  
SEND_FROM_EMAIL=webserver-email@youraddress.com  
SEND_FROM_EMAIL_PASSWORD=webserver-email-password  
IMAGE_URL=https://static-image-server-address.com/images  
IMAGE_BUCKET=static-image-server.com  
IMAGE_BUCKET_FOLDER=image-folder  
DOMAIN=https://www.your-website-address.com/  
SITE_OWNER=Your Name
