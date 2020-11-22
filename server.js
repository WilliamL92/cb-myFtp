const http = require('http');
const fs = require('fs');
const readline = require('readline');

let username;
let _username;
let password;
let _password;
let findUser = false;
let _findUser = false;
let directory = __dirname;

let user = {
    connected: false,
    username: undefined,
    password: undefined,
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    switch(input.split(' ')[0]){
        case 'USER':
            _username = input.split(' ')[1];
            if(typeof(_username) != "undefined"){
                fs.readFileSync('data.json', 'utf-8').split(/\r?\n/).forEach(function(line){
                    if(findUser){
                        password = line.split(':')[1].split(',')[0].replace('"', "").replace('"', "").split(' ')[1];
                        findUser = false;
                    }
                    if(line.trim().startsWith("\"username\"")){
                        username = line.split(':')[1].split(',')[0].replace('"', "").replace('"', "").split(' ')[1];
                        if(_username == username){
                            console.log("Utilisateur trouvé, entrez votre mot de passe avec la commande 'PASS'");
                            findUser = true;
                            _findUser = true;
                        }
                    }
                });
            }
        break;
        case 'PASS':
            _password = input.split(' ')[1];
            if(_findUser && _password == password){
                console.log(`L'utilisateur ${_username} à été correctement authentifié`);
                user = {
                    connected: true,
                    username: _username,
                    password: _password,
                }
            }
            else {
                console.log(`L'utilisateur ${_username} a entrer un mauvais mot de passe, veuillez réessayer.`)
            }
        break;
        case 'LIST':
            fs.readdir(directory, (err, files) => {
                console.log(files.join(' '));
              });
        break;
        case 'CWD':
            fs.readdir(directory, (err, files) => {
                for(let i = 0; i < files.length; i++){
                    if(fs.statSync(files[i]).isDirectory()){
                        if(input.split(' ')[1] == files[i].split('.')[0]){
                            directory = __dirname + "\\" + input.split(' ')[1];
                            console.log(`Vous vous trouvez actuellement dans le repertoire ${directory}`);
                        }
                    }
                }
            });
        break;
    }
  });

const host = process.argv[2];
const port = process.argv[3];
let app = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'video/mp4'});

    let vidstream = fs.createReadStream('assets/Yngwie_Malmsteen_interview.mp4');

    vidstream.pipe(res);
});

app.listen(port, host);
console.log(`Server running on port ${port} and the host is ${host}`);