###nginx configuration

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
