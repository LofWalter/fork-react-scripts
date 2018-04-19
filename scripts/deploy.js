const evJson = JSON.parse(process.env.npm_config_argv)
const param = evJson.original[2].slice(2)
console.log(`env--${param}`);
var configJson = require('../../../configPath.json');

var realobj = configJson[param]
var fs = require('fs')

const html = (modules) => '<!doctype html>'+
'<html lang="en">'+
  '<head>'+
    '<meta charset="UTF-8">'+
    '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">'+
    '<meta http-equiv="X-UA-Compatible" content="IE=8">'+
    '<meta name="viewport" content="width=device-width, initial-scale=1.0,'+ 'maximum-scale=1.0, user-scalable=no"/>'+
    '<meta http-equiv="Expires" content="0">'+
    '<meta http-equiv="Pragma" content="no-cache">'+
    '<meta http-equiv="Cache-control" content="no-cache">'+
    '<meta http-equiv="Cache" content="no-cache">'+
    '<title>youli</title>'+
    modules+
  '</head>'+
  '<body>'+
    '<div class="app" id="root"></div>'+
    '<!--'+
    '-->'+
  '</body>'+
'</html>'

// 插入css
fs.readdir(`${process.cwd()}/public/css`,(err,files) => {
    const cssLinks = files.map(v =>
      `<link rel="stylesheet" href="/css/${v}">`
    ).join('')
    const wholeHtml = html(cssLinks)
    fs.writeFile(`${process.cwd()}/public/index.html`, wholeHtml, 'utf8',  (err) => {
       if (err) return console.log(err);
    });

    console.log('css -- inserted');
  })
// 替换pathNam
fs.readFile(`${process.cwd()}/src/constants/OriginName.js`,
'utf8', (err,data) => {
  if (err) {
    return console.log(err);
  }

  var regx = /ORIGIN_NAME = .*/

  var data = data.replace(regx,
    `ORIGIN_NAME = '${realobj.serverPath.originName}'`)

  fs.writeFile(`${process.cwd()}/src/constants/OriginName.js`, data, 'utf8',  (err) => {

     if (err) return console.log(err);

  });

  console.log('pathname -- changed');

})

// 替换webpack打包path
fs.readFile(`${process.cwd()}/node_modules/react-scripts/config/paths.js`,
'utf8', (err,data) => {
  if (err) {
    return console.log(err);
  }
  var regx = /envPublicUrl = .*/
  var data = data.replace(regx,
    `envPublicUrl = '${realobj.accessPath}'`)

  fs.writeFile(`${process.cwd()}/node_modules/react-scripts/config/paths.js`,   data, 'utf8',  (err) => {

     if (err) return console.log(err);

  });
  console.log('config-path -- changed');
})
