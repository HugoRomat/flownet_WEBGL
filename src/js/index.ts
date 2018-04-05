// import {MainClass} from './MainClass'
import {Mapping} from './Mapping'

export function graph(div, width, height, color, alpha, visualisation?){
 
    var mapping = new Mapping(div, width, height, color, alpha, visualisation);
    return mapping;
}
