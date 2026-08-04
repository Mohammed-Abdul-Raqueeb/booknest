FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

RUN ls -la target

EXPOSE 8080

CMD sh -c "java -jar target/*.jar"