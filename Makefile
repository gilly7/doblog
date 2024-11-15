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

start_fe:
	@docker run \
		--rm \
		--name dublog-fe -p 7071:3000 \
		-e ENV=dev \
		-e API_URL=dev \
		-e API_URL=https://stage-dublog-api.citizix.com \
		-e AUTH_URL=http://localhost:7070/api/auth \
		-e AUTH_SECRET=supertopsecret \
		ektowett/dublog-fe:latest

start_be:
	@docker run \
		--rm \
		--name dublog-be -p 7068:7069 \
		-e DATABASE_URL="postgresql://dublog:dublog@localhost:5432/dublog?schema=public" \
		-e JWT_SECRET=supertopsecret \
		ektowett/dublog-be:latest

exec_be:
	@docker run \
		--rm \
		-it \
		--name dublog-be -p 7068:7069 \
		-e DATABASE_URL="postgresql://dublog:dublog@localhost:5432/dublog?schema=public" \
		-e JWT_SECRET=supertopsecret \
		ektowett/dublog-be:latest sh
