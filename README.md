This project is a backend for [Rosplata](https://github.com/johnSamilin/rosplata)

## Docs
https://github.com/johnSamilin/rosplata/wiki

## Start
To start up, run these commands:
- `git clone https://github.com/johnSamilin/rosplata-back --recurse-submodules`
- `npm i`
- Generate SSL certificates
- Edit config file
- Setup DB
- Run migrations
- `npm run start:dev` (or `npm run build` and `npm run start:prod` for production)

### Generate certificates
#### Development
Generate certificates for development purposes ([see this article](https://web.dev/how-to-use-local-https/)), name them accordingly (`test.crt`, `test.pem`) and place them to the root of the project.

#### Production
Generate certificates for production purposes ([with certbot](https://certbot.eff.org/)), name them accordingly (`privkey.pem`, `fullchain.pem`) and place them to the root of the project.

### Edit config file
Edit `./src/config.ts` if needed.
|Field   |Value   |Description   |
|---|---|---|
|IS_DEV   |true / false   |Flag that indicates whether this is dev env   |
|LE_TOKEN   |''   |Letsencrypt token. Being used in domain verification process   |
|HOST   |'https://localhost' / 'https://your-cool-domain'   |Current domain. `HttpMiddleware` will block any incoming request which `hostname` header doesn't match this value   |
|FIREBASE   |   |Firebase authentication settings (you'll obtain them when setting up Firebase)   |
|DEMO_UID   |rosplataapp   |id of the demo account   |

### Setup DB
Currently this project uses MySQL as database engine, but you can use DB of your choice. See `./db/config/config.json` and Sequelize ORM docs.

### Run migrations
Before first run and after each new migration you have to migrate DB. Run `npm run migrate` to update DB schema.
