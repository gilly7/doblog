up:
	docker compose up -d

ps:
	docker compose ps

stop:
	docker compose stop

rm: stop
	docker compose rm -f

logs:
	docker compose logs -f

build_fe:
	@cd frontend && \
		docker buildx build \
			--build-arg ENV=local \
			--build-arg API_URL=http://localhost:7069 \
			-t ektowett/dublog-fe:latest .

build_be:
	@cd backend && \
		docker buildx build \
			-t ektowett/dublog-be:latest .
