
const canvas = document.getElementById('fase'); //Referenciando o id no html
const contexto = canvas.getContext('2d'); // tipo de objeto criado (nesse caso bidimensional)

const balas = new Image(); // variável para receber imagem da bala
balas.src = './images/balas.png';// caminho da imagem

const hero_img = new Image(); // variável para receber imagem do heroi
hero_img.src = './images/hero.png';

const asteroid_img = new Image(); // constante vai receber imagem do asteroid
asteroid_img.src = './images/asteroidBrown.png';

const mobReto_img = new Image(); //constante que vai receber imagem dos mobs que vão se movimentar de um lado ao outro 
mobReto_img.src = './images/mobReto.png';

const mobCruzado1_img = new Image(); // constante que vai receber a imagem dos mobs que vão se movimentar cruzando a tela
mobCruzado1_img.src = './images/mobCruzado1.png';

const parede_img = new Image(); // variável para receber imagem do fundo
parede_img.src = './images/fundo3.png';

const tiro_som = new Audio(); // variável para receber som de tiro
tiro_som.src = './efeitos/tiro.wav';

const explo_som = new Audio();
explo_som.src = './efeitos/explosão_2.mp3';

const explosao = new Image();
explosao.src = './images/explosao.png';

const game_over_img = new Image();
game_over_img.src = './images/game-over-3.png'

const pause_game = new Image();
pause_game.src ='./images/pause.png'

const abertura = new Image();
abertura.src = './images/abertura.png'

const musica_fundo = new Audio();
musica_fundo.src = './efeitos/fundo.mp3'

const ok = new Audio();
ok.src = './efeitos/pronto.wav'



var jogoON = inicio =  true; // variável para verifica se o heroi está vivo e o jogo pode contiuar .../ tela de inicio 
var movEsquerda = movDireita = movCima = movBaixo = tiro = pause = continua = false; // variáveis de verificação para o pressionamento das teclas/ lógica abstrata
var time = pontuacao = 0 ;
var list_ball = []; // variável para armazenar as balas
var list_mobs = []; // variável para armazenar os mobs
var list_aste = []; // variável para armazenar asteroids



const hero = {
    p_x_recorte: 0, // ponto inicial x no plano cartesiano da sprite
    p_y_recorte: 82, // ponto inicial y no plano cartesiano da sprite
    largura_recorte: 986, 
    altura_recorte: 785,
    p_atual_x: 180, // ponto atual no plano cartesiano x do game 
    p_atual_y: 400, // ponto atual no plano cartesiano y do game 
    largura_game: 44, // largura do desenho no game
    altura_game: 34, // altura do desenho no game
    center_x: 0,
    center_y: 0,
    colidido:false, //variável para verificar colisões...


    desenha: function(){
        contexto.drawImage(
            hero_img,
            hero.p_x_recorte, hero.p_y_recorte,
            hero.largura_recorte, hero.altura_recorte,
            hero.p_atual_x, hero.p_atual_y,
            hero.largura_game, hero.altura_game
        )
    },

    atualiza: function(){ // função que verifica as variáveis dos botões e faz o movimento
        if (movEsquerda && !movDireita) {
            if (hero.p_atual_x >= 0 ){ // condição q faz a colisão com o tamanho mínimo da tela canvas 
                //console.log('Andando para esquerda');
                hero.p_atual_x -= 3; // ponto atual do heroi
                hero.center_x = (hero.p_atual_x + 44/2)

            }
        }
        if (movDireita && !movEsquerda) {
            if (hero.p_atual_x <= (canvas.width - hero.largura_game)){ // condição q colide com a largura máxima canvas 
                //console.log('Andando para direita');
                hero.p_atual_x += 3;
                hero.center_x = (hero.p_atual_x + 44/2)
            }
        }
        if (movCima && !movBaixo) {
            if (hero.p_atual_y >= 0){
                //console.log('Subindo');
                hero.p_atual_y -= 3;
                hero.center_y = hero.p_atual_y + 34/2
            }
        }
        if (movBaixo && !movCima) {
            if (hero.p_atual_y <= (canvas.height - hero.altura_game)){
                //console.log('Descendo');
                hero.p_atual_y += 3;
                hero.center_y = hero.p_atual_y + 34/2
            }
        }
        for (let index = 0; index < list_ball.length; index++) { // faz a remoção da bala da lista quando ela chega no limite em y
            if (list_ball[index].p_atual_y <= 0){
                list_ball.shift()
            } 
        }
    },
    
    desenha_tiro: function() { // faz a reprodução do tiro...
        if (list_ball.length > 0){
            for (let index = 0; index < list_ball.length; index++) {
                contexto.drawImage(
                        balas,
                        522,59,
                        34,98,
                        list_ball[index].p_atual_x, list_ball[index].p_atual_y,
                        34/5, 98/10)

                        list_ball[index].p_atual_y -= 4;
            }
        }
        
    }
}


const mobCruzado1 = {
    p_x_recorte : 13, //ponto inicial do x no plano cartesiano da sprite
    p_y_recorte : 10, //ponto inicial do y no plano cartesiano da sprite
    largura_recorte : 162,
    altura_recorte : 216,
    p_atual_x : Math.floor(Math.random ()* canvas.width) + 1, //ponto atual no plano cartesiano x do game
    p_atual_y : -100, //ponto atual no plano cartesiano y do game
    largura_game : 25,//largura da imagem no game
    altura_game : 30,//altura da imagem no game

    desenha : function (){
        if (list_mobs.length > 0){
            for (var i = 0; i < list_mobs.length; i++)
                contexto.drawImage(
                    mobCruzado1_img,
                    mobCruzado1.p_x_recorte, mobCruzado1.p_y_recorte,
                    mobCruzado1.largura_recorte, mobCruzado1.altura_recorte,
                    list_mobs[i].p_atual_x, list_mobs[i].p_atual_y,
                    mobCruzado1.largura_game, mobCruzado1.altura_game    
                )    

        
            }
    }, 

    atualiza : function(){
        if (list_mobs.length > 0){ //se tiver mob na lista ele vai fazer sua movimentação descendo...
            for (var i = 0; i < list_mobs.length; i++){
                list_mobs[i].p_atual_y= list_mobs[i].p_atual_y + list_mobs[i].velocidade_y;
                if(list_mobs[i].p_atual_x > 1 && list_mobs[i].direcao){
                    list_mobs[i].p_atual_x= list_mobs[i].p_atual_x - list_mobs[i].velocidade_x ;// list_mobs[i].p_atual_x - Math.floor(Math.random()) + 2;
                }
                else if(list_mobs[i].p_atual_x < canvas.width - mobCruzado1.largura_game){
                    list_mobs[i].direcao=false;
                    list_mobs[i].p_atual_x= list_mobs[i].p_atual_x + list_mobs[i].velocidade_x ;

                }
                else {
                    list_mobs[i].direcao=true;

                }
                if (list_mobs[i].p_atual_y > canvas.height){
                    list_mobs[i].colidido = true;
        
                }
            }
        }
    }
}

const asteroide = {
        desenha : function (denhaAsteroid){ // função que desenha o asteroide
            if(list_aste.length > 0){
                for (var i = 0; i < list_aste.length; i++){
                    contexto.drawImage(
                        asteroid_img,
                        5, 20,
                        150, 125,
                        list_aste[i].p_atual_x, list_aste[i].p_atual_y,
                        list_aste[i].largura_game, list_aste[i].altura_game
                    )
                }
            }
        },


    atualiza : function (){
        if(list_aste.length > 0){
            for(var i = 0; i< list_aste.length; i++){
                list_aste[i].p_atual_y += list_aste[i].velocidade_y

                if(list_aste[i].p_atual_y > canvas.height){ // verifica se passou da tela...
                    list_aste.splice(i,1);
                }
            }
        }
    }  
}
const parede = {
    p_x_recorte: 0, // ponto inicial x no plano cartesiano da sprite
    p_y_recorte: 0, // ponto inicial y no plano cartesiano da sprite
    largura_recorte: 1280, 
    altura_recorte: 720,
    p_atual_x: 0, // ponto dentro do jogo
    p_atual_y: 0, 
    largura_game: canvas.width*8, // largura dentro do jogo
    altura_game: canvas.height*4, // altura dentro do jogo
    segundo_chao: -500,   

    desenha: function(){ // função que desenha a parede
        contexto.drawImage(
            parede_img, 
            parede.p_x_recorte, parede.p_y_recorte,
            parede.largura_recorte, parede.altura_recorte,
            parede.p_atual_x, parede.p_atual_y,
            parede.largura_game, parede.altura_game
        )
        contexto.drawImage(
            parede_img, 
            parede.p_x_recorte, parede.p_y_recorte,
            parede.largura_recorte, parede.altura_recorte,
            parede.p_atual_x, parede.segundo_chao,
            parede.largura_game, parede.altura_game
        )
    },
    
    atualiza: function() { // função q anima o fundo da tela;
        parede.p_atual_y += 1;
        parede.segundo_chao +=1;
        if (parede.p_atual_y >= canvas.height){
            parede.p_atual_y = -800;
        }
        if(parede.segundo_chao >= canvas.height){
            parede.segundo_chao = -800
        }
    },

    desenha_game_over: function(){
        contexto.drawImage(
            game_over_img,
            0,0, 
            1024,1024,
            canvas.width/5, canvas.height/5, 
            canvas.width,canvas.height
        )
    },
    desenha_pause: function(){
        contexto.drawImage(
            pause_game,
            0,0, 
            1024,1024,
            canvas.width/2 - (canvas.width/1.2)/1.9, 0, 
            canvas.width/1.2,canvas.height/1.2
        )
    },
    desenha_inicio: function(){
        contexto.drawImage(
            abertura,
            0,0,
            1080,1080,
            0,0,
            canvas.width, canvas.height
        )
    }

}

function Obj_bala(p_atual_x, p_atual_y, ctx){ // funcão q cria um objeto  
    this.p_atual_x = p_atual_x;
    this.p_atual_y = p_atual_y;
    this.largura_game = 34/5;
    this.altura_game = 98/10;
    this.center_x = this.p_atual_x + (this.largura_game/2);
    this.center_y = this.p_atual_y + (this.altura_game/2);
    this.ctx = ctx;
    this.colidido = false;
}



function Obj_Mob(ctx){
    this.p_atual_x = Math.ceil(Math.random() * canvas.width)
    this.p_atual_y = -150
    this.ctx = ctx
    this.largura_game = 25
    this.altura_game = 30
    this.center_x = this.p_atual_x + 25/2;
    this.center_y = this.p_atual_y + 30/2;
    this.direcao = true; 
    this.colidido = false;
    this.velocidade_x = Math.floor(Math.random() * 7) + 1
    this.velocidade_y = Math.floor(Math.random() * 7) + 1
    
    this.explodir = function(){
            this.ctx.drawImage(
                explosao,
                576,0,
                193,190,
                this.p_atual_x, this.p_atual_y,
                50,60
            )        
    }
}

function obj_asteroide(ctx){
    this.p_atual_x = Math.ceil(Math.random() * canvas.width + 1)
    this.p_atual_y = -150
    this.ctx = ctx
    this.velocidade_y = Math.floor(Math.random() * (3-5) + 3) + 1
    this.largura_game = 20
    this.altura_game = 20
    this.colidido = false
}


function random_mobs(){
    if(document.hasFocus() && !pause && continua){
        mob = new Obj_Mob(contexto);
        list_mobs.push(mob);
    }
}

function random_aste(){
    if(document.hasFocus() && !pause && continua){
        asteroid = new obj_asteroide(contexto)
        list_aste.push(asteroid)
    }
}

const botoes = {
    botoesOn: function(e){//função que atualiza os pontos do heroi;
        if (jogoON && continua && !pause){
            let evento = e.keyCode;
            if (evento == 38){ //38 == cima;
                //console.log('cima ficou ok')
                movCima = true;
            }
            if(evento == 40){ // 40 == baixo;
                //console.log('baixo ficou ok')
                movBaixo = true;
            }   
            if (evento == 37){ // 37 == esquerda;
                //console.log('esquerdo ficou ok')
                movEsquerda = true;
            }
            if (evento == 39){// 39 == direita;
                //console.log('direito ficou ok')
                movDireita = true;
            }
            if (evento == 32) { // 32 == espaço
                tiro=true;
            }
        }
    },
    botoesOff: function(e){
        if (jogoON && continua && !pause){
            let evento = e.keyCode;
            if (evento == 38){ //38 == cima;
                //console.log('cima ficou false')
                movCima = false;
            }
            if(evento == 40){ // 40 == baixo;
                //console.log('baixo ficou false')
                movBaixo = false;
            }   
            if (evento == 37){ // 37 == esquerda;
                //console.log('esquerda ficou false')
                movEsquerda = false;
            }
            if (evento == 39){// 39 == direita;
                //console.log('direita ficou false')
                movDireita = false;
            }
            if (evento == 13){ // enter
                if(!pause){
                    pause = true;
                }
                else{
                    pause = false;
                }
            }
            if (evento == 32) { // 32 == espaço
                //console.log('espaço ficou false');
                if(tiro){
                        let x_bala = hero.p_atual_x + ( (44 - 7) / 2 ); // pega o valor atual de x da nave 
                        let y_bala = hero.p_atual_y - 4; // pega o valor central da nave no ponto y
                        tiro = false; // altera a variável de verificação
                        tiro_som.currentTime=0.0; // tempo de resposta do audio é resetado
                        tiro_som.play(); // inicia som
                        var ball = new Obj_bala(x_bala, y_bala, contexto) // cria um objeto            
                        list_ball.push(ball) // adiciona o objeto em uma lista
                        //console.log(list_ball) // mostra a quantidade de itens da lista
                    }
                }   
        }

    }
}

const colisoes = {
    balas_mob: function(lista_a,lista_b,funcao){
        for(var i=0; i < lista_a.length; i++){
            if (lista_b.length > 0){
                for(var indice=0;indice<lista_b.length;indice++){
                    funcao(lista_a[i],lista_b[indice])

                }
            }
        }
        for(var i=0; i < lista_a.length; i++){
            if(lista_a[i].colidido){
                lista_a.splice(i,1)
                pontuacao += 5
                document.getElementById('score').innerHTML = pontuacao
            }      
        }
        for(var i=0; i < lista_b.length; i++){
            if(lista_b[i].colidido){
                lista_b[i].explodir()
                lista_b.splice(i,1)
            }
        }
    },

    mob_asteroid: function(list_aste, list_mobs, funcao){
        if(list_mobs.length > 0 && list_aste.length > 0){
            for(var i = 0; i < list_mobs.length; i++){
                for(let index = 0; index < list_aste.length; index++){
                    funcao(list_aste[index], list_mobs[i])
                }
            }
            for(var i=0; i < list_mobs.length; i++){
                if(list_mobs[i].colidido){
                    list_mobs[i].explodir()
                    list_mobs.splice(i,1)
                    
                }
            }
        }


    },

    hero_mob: function(hero, lista_mob, funcao) {
        if (lista_mob.length > 0){
            for(let i = 0; i < lista_mob.length; i++){
                funcao(hero,lista_mob[i])
            }
        }
        if(hero.colidido){
            jogoON=false;
            document.getElementById('record_final').innerHTML = `Pontuação: ${pontuacao}`
            document.getElementById('tempo_final').innerHTML = `Tempo: ${time}s`
        }
    },

    hero_asteroid: function(hero, list_aste, funcao){
        if(list_aste.length > 0){
            for (var i = 0; i < list_aste.length; i++){
                funcao(hero, list_aste[i]);
            }
            if(hero.colidido){
                jogoON = false;
                document.getElementById('record_final').innerHTML = `Pontuação: ${pontuacao}`
                document.getElementById('tempo_final').innerHTML = `Tempo: ${time}s`
            }
        }
    }
}

function verifica_colisao(a, b){
    let largura_v = (a.largura_game / 2) + (b.largura_game / 2);
    let altura_v = (a.altura_game / 2) + (b.altura_game / 2);
    let dx = a.p_atual_x - b.p_atual_x;
    let dy = a.p_atual_y - b.p_atual_y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ((a.largura_game / 2) + (b.largura_game / 2))){ //faz a verificação do centro dos dois objetos... colisão circular..
        explo_som.play();
        explo_som.currentTime = 0.0;
        a.colidido = true;
        b.colidido = true;
    }
}

function inicia(){
    jogoON = true; // faz o jogo voltar a funcionar
    hero.colidido = false; // faz o herois "reviver"
}

function ativa_menu(){
    inicio = false; // tira a tela de menu inicial
    continua = true; // faz voltar a adicionar monstros
    ok.play()
    document.getElementById('topo_sco').style.display = 'block'
    document.getElementById('menu').style.display = 'none'
}

function reset(){
    continua = true;
    jogoON = true;
    time = 0
    pontuacao = 0
    hero.colidido = false;
    ok.play()
    document.getElementById("tempo").innerHTML = time;
    document.getElementById('score').innerHTML = pontuacao;
    document.getElementById('topo_sco').style.display = 'block'
    document.getElementById('record').style.display = 'none'
}
function novo_jogo(){ // leve gambiarra para reiniciar valores
    for(let i=0; i < list_ball.length; i++){
        list_ball.pop(i)
    }
    for(let i=0; i < list_mobs.length; i++){
        list_mobs.pop(i)
    }
    for(let i=0; i < list_aste.length; i++){
        list_aste.pop(i)
    }
    hero.p_atual_x = 180
    hero.p_atual_y = 400
}


if (jogoON){
    setInterval(random_mobs, 500);// cria um inimigo e joga dentro de uma lista de objetos  
    setInterval(random_aste, 2500); // cria asteroides indestrutiveis...

    window.addEventListener('keydown', botoes.botoesOn); // quando ocorre o evento de precionar algum botão ele dispara a função e checa qual foi o botão
    window.addEventListener('keyup', botoes.botoesOff); // ocorre o contrario ... quando se solta o botão ele faz a checagem disparando a função
}
/*tempo decorrido sobrevivendo */

function cronometro() {
        setInterval(function() {
            if(document.hasFocus() && !pause && continua){
                time ++;
            }
            //console.log(time);
        document.getElementById("tempo").innerHTML = time;

                
        }, 1000)
    }

;

    /*loop que desenha os sprites infinitamente*/

function loop() { 
    if(inicio){
        parede.desenha(); 
        parede.atualiza();
        parede.desenha_inicio();
    }
    else {
        if(jogoON && !pause){
            parede.desenha(); //desenha o fundo a cada frame
            parede.atualiza(); // faz a movimentação do fundo

            hero.desenha();  // desenha o heroi
            hero.atualiza(); // atualiza o movimento do herói
            hero.desenha_tiro(); // desenha tiro quando pressionado
        
            //ameaças
            mobCruzado1.desenha();
            mobCruzado1.atualiza();

            asteroide.desenha();
            asteroide.atualiza();

            //colisão	
            colisoes.balas_mob(list_ball, list_mobs, verifica_colisao);
            colisoes.hero_mob(hero, list_mobs, verifica_colisao);
            colisoes.hero_asteroid(hero, list_aste, verifica_colisao);
            colisoes.mob_asteroid(list_aste, list_mobs, verifica_colisao);

        }
        else if(jogoON && pause){
            parede.desenha(); 
            parede.atualiza();
            parede.desenha_pause();
        }
        else{
            musica_fundo.currentTime = 0.0;
            parede.desenha(); 
            parede.atualiza();
            parede.desenha_game_over();
            
            continua = false;
            novo_jogo();
            document.getElementById('topo_sco').style.display = 'none';
            document.getElementById('restart').style.display = 'block';
            document.getElementById('record').style.display = 'block';
        }
    }
    if(document.hasFocus()){
        musica_fundo.play()
    }

    
    return requestAnimationFrame(loop); // renderiza as funções e chama o loop mais uma vez  
};

cronometro()
loop() // ativa a função loop :D
