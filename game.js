
const canvas = document.getElementById('fase'); //Referenciando o id no html
const contexto = canvas.getContext('2d'); // tipo de objeto criado (nesse caso bidimensional)

const hero_img = new Image(); // variável para receber imagem do heroi
hero_img.src = './images/hero.png'; 
const parede_img = new Image(); // variável para receber imagem do fundo
parede_img.src = './images/fundo3.png'; 

const parede = {
    p_x_recorte: 0, // ponto inicial x no plano cartesiano da sprite
    p_y_recorte: 0, // ponto inicial y no plano cartesiano da sprite
    largura_recorte: 1280, 
    altura_recorte: 720,
    p_atual_x: 0, // ponto dentro do jogo
    p_atual_y: 0, 
    largura_game: canvas.width*8, // largura dentro do jogo
    altura_game: canvas.height*3, // altura dentro do jogo   

    desenha: function(){ // função que desenha a parede
        contexto.drawImage(
            parede_img, 
            parede.p_x_recorte, parede.p_y_recorte,
            parede.largura_recorte, parede.altura_recorte,
            parede.p_atual_x, parede.p_atual_y,
            parede.largura_game, parede.altura_game
        )

    }

}
const hero = {
    p_x_recorte: 0, // ponto inicial x no plano cartesiano da sprite
    p_y_recorte: 97, // ponto inicial y no plano cartesiano da sprite
    largura_recorte: 999, 
    altura_recorte: 803,
    p_atual_x: 180, // ponto atual no plano cartesiano x do game 
    p_atual_y: 400, // ponto atual no plano cartesiano y do game 
    largura_game: 44, // largura do desenho no game
    altura_game: 34, // altura do desenho no game

    desenha: function(){
        contexto.drawImage(
            hero_img,
            hero.p_x_recorte, hero.p_y_recorte,
            hero.largura_recorte, hero.altura_recorte,
            hero.p_atual_x, hero.p_atual_y,
            hero.largura_game, hero.altura_game
        )
    }
}


function loop() { //loop que desenha os sprites infinitamente
    parede.desenha(); //desenha o fundo a cada frame
    hero.desenha();  // desenha o heroi
    
    

    return requestAnimationFrame(loop) // renderiza as funções e chama o loop mais uma vez
    };


loop()





