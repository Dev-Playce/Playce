FROM grafana/k6

WORKDIR /test

# local / docker
ENV BASE_URL=http://localhost:3000
# ENV BASE_URL=http://host.docker.internal:3000

# 현재 폴더(./k6) 내 모든 파일 -> 컨테이너 /test로 복사
COPY . .

# 기본 실행 명령어 : k6 run
ENTRYPOINT ["k6", "run"]

# 기본 테스트 파일 지정
CMD ["scripts/apiDocsTest.js"]