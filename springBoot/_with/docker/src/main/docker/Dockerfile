FROM openjdk:8-jre-alpine

ENV SERVER_SLEEP 0

# add directly the war
ADD *.war /app.war

RUN sh -c 'touch /app.war'
VOLUME /tmp
EXPOSE 8080
CMD echo "The application will start in ${SERVER_SLEEP}s..." && \
    sleep ${SERVER_SLEEP} && \
    java -jar /app.war
