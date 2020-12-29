export const humanize = (array) =>{
    return array.lenght > 1  ? 
        `${array.slice(0, array.length-1).join(', ')} and ${array[array.length-1]}` : 
        array[0]
}