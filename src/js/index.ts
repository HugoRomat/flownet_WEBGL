// import {MainClass} from './MainClass'
import {Mapping} from './Mapping'

export function force(div, width, height, color, alpha){
    var mapping = new Mapping(div, width, height, color, alpha);
    return mapping;
}
