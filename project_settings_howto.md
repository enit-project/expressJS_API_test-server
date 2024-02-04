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
    - localhost:3000 는 swagger UI API doc 페이지이다. API의 작동을 검증해볼 수 있다.
    - localhost:5555 는 prisma studio 페이지이다. DB 테이블을 직접 보고 수정할 수 있다.

# DB 마이그레이션
  1. /prisma/schema.prisma 를 열고, 모델 스키마를 수정한다.
  2. 수정사항이 /prisma 에 적용되게 하려면, 다음 명령어를 입력한다.
    `npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script`
    해당 명령어는 현재 DB 서버가 구동되지 않아도 prisma 만 자체적으로 마이그레이션을 해볼 수 있는 명령어다.
    이 명령어를 입력하지 않으면 vscode에서 모델 스키마를 snippet나 hinting에 반영하지 않는다.
  3. 다른 작업을 전부 완료한 후, 
    `docker compose build`
    입력하여 현재 작업상태로 리빌드한다.
  4. 이제 postgreDB 이미지에도 마이그레이션을 적용한다.
    `docker compose run nest-api npx prisma migrate dev`
  5. 그럼 정상적으로 마이그레이션이 적용되고, 평범하게  `docker compose up` 으로 적용시킨다.

# 클라우드 서버 업로드 및 배포
  1. 작업 후 `docker images` 로 이미지를 검색해보면, `nest-api:latest` 이미지가 존재할 것이다. 그 이미지를 업로드할 것이다.
  2. 태그 변경이 필요하다.
    `docker push ghcr.io/enit-project/nest-api:latest
