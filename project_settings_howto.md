# 첫 번째 세팅
  1. ./ 최상단에서,
    `npm install`
    `npm run build`
  2. 이후 작업을 끝낼 때 마다,
    `docker compose build`
    `docker compose up`
    과 같이 docker-cmopose 를 이용, docker image로 직접 작업할 수 있다.
  3. 물론 단순히 작업을 끝낼 때 마다,
    `npm run build`
    `npm run start`
    를 이용해 서버를 동작시킬 수 있지만, docker-compose 를 바로 사용하는 것을 권장한다.

# 테스트 결과 로컬 실행환경 사용하기
  1. docker desktop을 연다. (리눅스면 데몬 실행)
  2. 최상위 경로에서, 
    `docker compose build`
    `docker compose up`
  3. 다른 프롬프트를 열고, 다시 `npx dotenv-cli -e .env.studio -- npx prisma studio`
  4. 자동으로 인터넷 페이지가 열리겠지만,
    - localhost:3000/swag 는 swagger UI API doc 페이지이다. API의 작동을 검증해볼 수 있다.
    - localhost:5555 는 prisma studio 페이지이다. DB 테이블을 직접 보고 수정할 수 있다.

# DB 마이그레이션
  1. /prisma/schema.prisma 를 열고, 모델 스키마를 수정한다.
  2. 수정사항이 /prisma 에 적용되게 하려면, 다음 명령어를 입력한다.
    `npx prisma generate`
    해당 명령어는 현재 DB 서버가 구동되지 않아도 prisma 만 자체적으로 마이그레이션을 해볼 수 있는 명령어다.
    이 명령어를 입력하지 않으면 vscode에서 모델 스키마를 snippet나 hinting에 반영하지 않는다.
  3. 다른 작업을 전부 완료한 후, 
    `docker compose build`
    입력하여 현재 작업상태로 리빌드한다.
  4. 이제 postgreDB 이미지에도 마이그레이션을 적용한다.
    `docker compose run nest-api npx prisma migrate dev` (DB 보존이 필요 없을때)
    혹은 
    `prisma migrate deploy` (DB를 보존해야 할 때)
  5. 그럼 정상적으로 마이그레이션이 적용되고, 평범하게  `docker compose up` 으로 적용시킨다.

# 클라우드 서버 업로드 및 배포
  1. 작업 후 `docker images` 로 이미지를 검색해보면, `nest-api:latest` 이미지가 존재할 것이다. 그 이미지를 업로드할 것이다.
  2. 태그 변경이 필요하다.
    `docker image tag nest-api:latest ghcr.io/enit-project/nest-api:latest`
    `docker image tag prisma-studio:latest ghcr.io/enit-project/prisma-studio:latest`
  3. ghcr.io 에 로그인한 뒤, push 한다. 단, 로그인 아이디는 git organization의 아이디어야 한다. 패스워드는 토큰으로 하면 된다.
    `docker login https://ghcr.io`
    `docker push ghcr.io/enit-project/nest-api:latest` 
    `docker push ghcr.io/enit-project/prisma-studio:latest` 
    작성 시점에서는 이미지(package) 들간의 버전 관리는 되고 있지 않다. latest 태그로 통합되어 있다.
  4. 이제 서버에 SSH로 접근한다.
  5. 마찬가지로 서버에도 ghcr.io에 로그인해야 한다. 그 뒤,
    `docker pull ghcr.io/enit-project/nest-api:latest`
    `docker pull ghcr.io/enit-project/prisma-studio:latest` 
    로 이미지를 다운받는다.
  6. 이미지의 구동에는 프로젝트의 파일이 필요하지 않으며, 오직 docker-compose.yml 만이 필요하다. 따라서, 온라인으로 직접 github에 접속하여 only_launchfile 브랜치 의 docker-compose.yml 파일을 master의 것과 비교하며 수정한다. 
    - 이때 해당 .yml에서는 build 태그가 의미가 없으며, db 자동 마이그레이션이 필요한 등 차이점이 있다. 왠만하면 그대로 진행해도 될 것이다.
    - 그 뒤 다음 명령어로 서버사이드에서 docker-compose.yml을 다운받는다.
      `git clone --branch only_launchfile --single-branch https://github.com/enit-project/expressJS_API_test-server.git`
    - clone 이후에 변경사항이 있을 시, 다음 명령어로 only_launchfile 브랜치만 받아올 수 있다.
      `git pull https://github.com/enit-project/expressJS_API_test-server.git only_launchfile`
  7. 받은 이미지는 현재 이름이 ghcr.io/enit-project/nest-api:latest 인 상태이다. 원래의 이름으로 돌려야 한다.
    `docker image tag ghcr.io/enit-project/nest-api:latest nest-api:latest`
    `docker image tag ghcr.io/enit-project/prisma-studio:latest prisma-studio:latest`
  8. 이제 `docker compose up` 로 받은 이미지를 실행시키면 된다. postgreSQL 이미지가 없다면 자동으로 생성된다.
    - 아직 서버의 postgreSQL DB 이미지는 마이그레이션 되지 않은 상태이므로, 필요시 마이그레이션을 먼저 돌리고 실행한다.
      `docker compose run nest-api npx prisma migrate dev`

  npx prisma generate
  docker compose build
  docker image tag nest-api:latest ghcr.io/enit-project/nest-api:latest
  docker image tag prisma-studio:latest ghcr.io/enit-project/prisma-studio:latest
  docker push ghcr.io/enit-project/nest-api:latest
  docker push ghcr.io/enit-project/prisma-studio:latest

  cd expressJS_API_test-server
  sudo docker pull ghcr.io/enit-project/nest-api:latest
  sudo docker pull ghcr.io/enit-project/prisma-studio:latest
  sudo docker image tag ghcr.io/enit-project/nest-api:latest nest-api:latest
  sudo docker image tag ghcr.io/enit-project/prisma-studio:latest prisma-studio:latest
  sudo docker compose run nest-api npx prisma migrate deploy
  sudo docker compose up