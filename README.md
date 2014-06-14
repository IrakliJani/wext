# WEXT

Serverless THREE.JS game using WEBRTC made for local hackathon in just 2 days


###nginx configuration for static html file serving

```nginx
server {
  listen            80;
  server_name       localhost;
  root              '/Users/jani/Work/wext';
  location / {                                                          
    default_type "text/html";
    try_files    $uri $uri.html $uri/index.html index.html;

    autoindex                  on;
    autoindex_exact_size       off;
    autoindex_localtime        on;
  }
}
```
