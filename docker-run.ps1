# === BUILD ===
# reuse deps layer for cache, then build
docker build -t javaguide-frontend .

# === RUN (map container 8080 -> host 80) ===
# container serves on 8080 (unprivileged nginx), host port you want = 80
docker run -d --name javaguide -p 80:8080 javaguide-frontend

# open http://localhost:80

# optional: hot-rebuild & swap quickly
# docker stop javaguide && docker rm javaguide && docker run -d --name javaguide -p 80:8080 javaguide-frontend