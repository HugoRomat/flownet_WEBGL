// import {MainClass} from './MainClass'
import {Mapping} from './Mapping'

export function force(div, width, height, color, alpha, visualisation?){
 
    var mapping = new Mapping(div, width, height, color, alpha, visualisation);
    return mapping;
}
