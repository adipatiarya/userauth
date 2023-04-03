
## Auth Users api

- [@adipatiarya](https://www.github.com/adipatiarya)



## Menggunakan  docker compose



```bash
  git clone https://github.com/adipatiarya/userauth.git
```

```
 cp env.example .env
```

```bash
  cd userauth && docker-compose up -d
```

```bash
  akses ke web http://localhost/api/users
```

## Menggunakan  npm
membutuhkan link database



```bash
  git clone https://github.com/adipatiarya/userauth.git
```

```bash
  cd userauth && npm install
```
```bash
  npm run migrate up
  npm run test
```
```bash
  npm run start
```

```bash
  akses ke web http://localhost:5000/api/users
```
