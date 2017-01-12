FROM openjdk:8-jre-alpine

ENV SLEEP 0

# add directly the war
ADD *.jar /app.jar

RUN sh -c 'touch /app.jar'
VOLUME /tmp
EXPOSE 8080
CMD echo "The application will start in ${SLEEP}s..." && \
    sleep ${SLEEP} && \
    java -jar /app.jar
