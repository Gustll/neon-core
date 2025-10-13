# NEON CORE

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) 

### Browser Support
Chrome ✅
Firefox ✅
Edge ✅
Safari ❌ (not supported, please use another browser -> for now)

### Prerequisites
Before running the project locally (without docker), ensure you have:
- Node.js 22+
- Angular CLI 19+


### Git pre-push hook (symlink) -> we can also do this with hooks Path
To always have pre-push up to date link it to .git/hooks/pre-push so it runs on every push
1. Make the hook executable 
```
chmod +x scripts/pre-push
```

2. Create a symlink
```
ln -sf "$(pwd)/scripts/pre-push" .git/hooks/pre-push
```

### Test
```
npm test               # runs the Angular/Karma tests
```

### Lint & Format
```
cd neon-core
npm run lint           # eslint ./src/
npm run format         # prettier --write ./src
npm run format-check   # prettier --check ./src
```

### Install & Run
```
npm install
npm start              # alias for: ng serve
```

### Build 
```
npm run build
```

### Runnin with docker
Navigate to the project

```
cd neon-core
```

Run the compose (Default running on 4200:80)
```
docker-compose up
```



