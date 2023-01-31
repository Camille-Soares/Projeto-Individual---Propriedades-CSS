import chalk from 'chalk'
import inquirer from 'inquirer'
import prompt from 'prompt-sync'
import fs from 'fs'

operation()

//Menu com as opções para o usuário
function operation() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
          'Exibir listagem CSS',
          'Adicionar propriedade CSS',
          'Remover propriedade',
          'Sair',
        ],
      },
    ])
    .then((answer) => {
      const action = answer['action']

      if (action === 'Adicionar propriedade CSS') {
        criarpropried()
      } else if (action ===  'Exibir listagem CSS') {
        ExibirLista()
      } else if (action === 'Remover propriedade') {
        Removerpropriedade()
      } else if (action === 'Sair') {
        console.log(chalk.bgBlue.black('Obrigado!')) 
        process.exit()
      }
    })
}

const command = prompt()

//Criar as propriedades e coloca-las na array
const criarpropried = (entrada) => {
  let Listagem = []
  while (entrada != "sair") {
    entrada = command("Insira uma propriedade CSS:")
    if(Listagem.indexOf(`"${entrada}"`) == -1 && entrada != 'sair'){
      Listagem.push(`"${entrada}"`);
    } else if(entrada == 'sair'){
      console.log(chalk.bgGreen.black('Lista finalizada')) 
    } else if(Listagem.indexOf(`"${entrada}"`) != -1){
      console.log(chalk.red("Esta propriedade já foi adicionada, escolha outra!")) 
    }
  }
  let resultado = Listagem.sort().join("\n") 
  console.log(resultado)
  Listagemcriar(Listagem)
}

//Criar uma pastar e amarzena no arquivo proedcss.json
function Listagemcriar(Listagem) {  
  console.log(Listagem)
  inquirer.prompt([ 
    {
      name: 'arquivo',
      message: 'Deseja criar um arquivo com a lista?:',
    },
  ])
  .then((answer) => {
    if(answer.arquivo == 'sim'){
      console.info(answer['arquivo'])

      const lista = 'proedcss'
  
      if (!fs.existsSync('Listagem')) {
        fs.mkdirSync('Listagem')
      }
  
      if (fs.existsSync(`Listagem/${lista}.json}`)) {
        console.log(chalk.bgBlue.black('Lista atualizada!'),)
      }

      fs.writeFileSync(`Listagem/${lista}.json`, `{"List": [${Listagem}]}`,
      function (err){
        console.log(err)
      },)

      console.log(chalk.green('Arquivo criado!'))
      operation()

    } else {
      console.log(chalk.bgBlue.black('Obrigado!'))
      operation()
    }
  })
}

//Para exibir a lista com as regras
function ExibirLista() {
  var jsonData = fs.readFileSync("Listagem/proedcss.json", "utf8");
  var lista = JSON.parse(jsonData);
  var newList = lista.List
  console.log(newList.sort().join("\n"))
  operation() //volta para o menu
}

//Função para remover uma regra
function Removerpropriedade(){
  inquirer
    .prompt([
      {
        name: 'Excluir',
        message: 'Nome da propriedade a ser excluida: ',
      },
    ])
    .then((answer) => {
      let pres = answer['Excluir']

      var jsonData = fs.readFileSync("Listagem/proedcss.json", "utf8");

      var Lista = JSON.parse(jsonData);
      var newList = Lista.List;
    
      if (newList.includes(pres)) {
        let busca = pres
        let index = newList.indexOf(busca);
        while(index >= 0){
          newList.splice(index, 1);
          index = newList.indexOf(busca);}

        console.log(chalk.bgCyanBright.black('Propriedade CSS removida!'))
        console.log(newList.sort().join("\n"))
        fs.writeFileSync(`Listagem/proedcss.json`, `{"List": ["${newList}"]}`)
        operation() 
      }
      else {
        console.log(chalk.bgRed.black('Esta propriedade já foi removida!'))
        console.log(newList.sort().join("\n"))
        Removerpropriedade()
      }
    })
 }