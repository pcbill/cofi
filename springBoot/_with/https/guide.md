# Guide

1. keytool -genkey 產生 Jetty 願意吃的 keystore。
```bash
$ keytool -keystore keystore.jks -genkey -alias client
```
2. config application.yml 

## references
* [Enabling SSL with Spring Boot](http://nemerosa.ghost.io/2015/07/06/enabling-ssl-with-spring-boot/)
* [Enabling SSL with Spring Boot in real life](http://nemerosa.ghost.io/2015/07/25/enabling-ssl-with-spring-boot-going-real/)