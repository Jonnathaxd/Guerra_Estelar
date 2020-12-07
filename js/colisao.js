export function colisao (list_ball, list_mobs){
    for (var i = 0; i < list_mobs.length; i++){

        if(list_ball.length > 0){
            for (var indice = 0; indice < list_ball.length; indice++){
                if((list_ball[indice].p_atual_y == list_mobs[i].p_atual_y) && (list_ball[indice].p_atual_x == list_mobs[i].p_atual_x)){
                    console.log('bateu')
                }
            }
        }

    }
}