### React-Redux-Typescript client-server boilerplate

### How to

Start development: `yarn start`  
Start electron client: `yarn run client`
Start application in debug mode `yarn debug` ( listening on `*:9229` ).

### Frontend code structure

Grouped by feature. For example, the menu folder contains all the elements associated to the menu component: reducers, actions, builders, sub-components, utils, state, action types and selectors.  
The index is produced in order to enable indexing all the elements of the folder in one exported object.

### Development Steps

**Frontend**
- [x] DevTools Extension
- [x] Logger
- [x] Sagas
- [x] SCSS Loader
- [x] HMR
- [x] Router
- [x] Redux-powered menu

**Backend**
- [x] Authentication
- [ ] Authorization ( roles, guards )
- [x] Encryption ( bcrypt )
- [x] ORM
- [x] MVC
- [x] Inversion of Control
- [x] Workers setup
- [x] Web Server
- [ ] DDD
- [x] Object to object mapper