# Metaldown

A simple warehouse tracking desktop application for a metal factory. 

![Screenshot](http://i.imgur.com/CKrutOo.png)

Built using:
* Golang
  - Fasthttp
* Javascript
  - Electron
  - Electron-builder
  - Datatables
  - Bootstrap
  - Uglify, Browserify
  
Build for a OS of your choice with:

You need to have [Electron Builder](https://github.com/electron-userland/electron-builder) installed globally in order to do a `build --platform of choice`
```bash
npm install
cd src && npm install
npm run build # this will generate an app folder in the root project directory
cd .. && build --linux # this will generate a dist/linux-unpacked folder in the root project directory
```

and run with:

```bash
cd dist/linux-unpacked # or the generated folded depending on your os (ls -l)
./Αποθήκη - Δάφνη Ο.Ε
```
The client is happy with the current state of the app but If you want to use this I can work on it to don't make any asumtions about the business so you could use it for anything.

If you want to use this in any way be aware that the frontend side is bad.
