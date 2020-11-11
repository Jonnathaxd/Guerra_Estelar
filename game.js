
const canvas = document.getElementById('fase'); //Referenciando o id no html
const contexto = canvas.getContext('2d'); // tipo de objeto criado (nesse caso bidimensional)

const balas = new Image(); // variável para receber imagem da bala
balas.src = './images/balas.png';// caminho da imagem
const hero_img = new Image(); // variável para receber imagem do heroi
hero_img.src = './images/hero.png'; 
const parede_img = new Image(); // variável para receber imagem do fundo
parede_img.src = './images/fundo3.png';
const tiro_som = new Audio(); // variável para receber som de tiro
tiro_som.src = './efeitos/tiro.wav';

var movEsquerda = movDireita = movCima = movBaixo = tiro = false; // variáveis de verificação para o pressionamento das teclas
var list_ball = []; // variável para armazenas as balas

const hero = {
    p_x_recorte: 0, // ponto inicial x no plano cartesiano da sprite
    p_y_recorte: 97, // ponto inicial y no plano cartesiano da sprite
    largura_recorte: 999, 
    altura_recorte: 803,
    p_atual_x: 180, // ponto atual no plano cartesiano x do game 
    p_atual_y: 400, // ponto atual no plano cartesiano y do game 
    largura_game: 44, // largura do desenho no game
    altura_game: 34, // altura do desenho no game
    p_atual_x_tiro: 0,
    p_atual_y_tiro: 0,

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
            }
        }
        if (movDireita && !movEsquerda) {
            if (hero.p_atual_x <= (canvas.width - hero.largura_game)){ // condição q colide com a largura máxima canvas 
                //console.log('Andando para direita');
                hero.p_atual_x += 3;
            }
        }
        if (movCima && !movBaixo) {
            if (hero.p_atual_y >= 0){
                //console.log('Subindo');
                hero.p_atual_y -= 3;
            }
        }
        if (movBaixo && !movCima) {
            if (hero.p_atual_y <= (canvas.height - hero.altura_game)){
                //console.log('Descendo');
                hero.p_atual_y += 3;
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
    }
}

function Obj_bala(p_atual_x, p_atual_y, ctx){ // funcão q cria um objeto  
    this.p_atual_x = p_atual_x
    this.p_atual_y = p_atual_y
    this.ctx = ctx
}

const botoes = {
    botoesOn: function(e){//função que atualiza os pontos do heroi;
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
            let x_bala = hero.p_atual_x + ( (44 - 7) / 2 ); // pega o valor atual de x da nave 
            let y_bala = hero.p_atual_y - 4; // pega o valor central da nave no ponto y
            tiro = true; // altera a variável de verificação
            tiro_som.currentTime=0.0; // tempo de resposta do audio é resetado
            tiro_som.play(); // inicia som
            var ball = new Obj_bala(x_bala, y_bala, contexto) // cria um objeto            
            list_ball.push(ball) // adiciona o objeto em uma lista
            //console.log(list_ball) // mostra a quantidade de itens da lista
        }
    },
    botoesOff: function(e){
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
        if (evento == 32) { // 32 == espaço
            //console.log('espaço ficou false');
            if (list_ball == 0) 
            tiro = false;
        }
    }
}


        

window.addEventListener('keydown', botoes.botoesOn); // quando ocorre o evento de precionar algum botão ele dispara a função e checa qual foi o botão
window.addEventListener('keyup', botoes.botoesOff); // ocorre o contrario ... quando se solta o botão ele faz a checagem disparando a função

function loop() { //loop que desenha os sprites infinitamente
    parede.desenha(); //desenha o fundo a cada frame
    parede.atualiza(); // faz a movimentação do fundo
    hero.desenha();  // desenha o heroi
    hero.atualiza(); // atualiza o movimento do herói
    hero.desenha_tiro(); // desenha tiro quando precionado
    

    
    return requestAnimationFrame(loop) // renderiza as funções e chama o loop mais uma vez
    };


loop() // ativa a função loop :D