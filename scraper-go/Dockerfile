FROM golang:1.22-alpine AS build

WORKDIR /app

COPY go.mod ./
RUN go mod tidy

COPY . .
RUN go build -o scraper-go main.go

FROM alpine:3.19

WORKDIR /app

COPY --from=build /app/scraper-go ./scraper-go

EXPOSE 8080

CMD ["./scraper-go"]

