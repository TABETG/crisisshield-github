# --- Etape 1 : construction ---
FROM maven:3.9.15-eclipse-temurin-26 AS builder
WORKDIR /app
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8 MAVEN_OPTS="-Dfile.encoding=UTF-8"
COPY pom.xml .
RUN mvn -B -q -DskipTests \
    -Dmaven.wagon.http.retryHandler.count=5 \
    dependency:resolve dependency:resolve-plugins
COPY src ./src
RUN mvn -B -q -DskipTests clean package

# --- Etape 2 : execution, sans utilisateur racine ---
FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S crisisshield && adduser -S crisisshield -G crisisshield
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
USER crisisshield
EXPOSE 8080
ENTRYPOINT ["java", "-Dfile.encoding=UTF-8", "-XX:MaxRAMPercentage=75", "-jar", "/app/app.jar"]
