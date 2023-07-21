container = document.getElementById('container');
i=0;
function addNote(i){
    //Esta función agrega espacio para dejar las notas, el i representa la cantidad de notas
    //estas posteriormente se usaran para eliminarlas
    //creamos el div:
    let div = document.createElement('DIV');
    div.classList.add('tarea');
    div.setAttribute('id',i);
    //creamos el input:
    let input = document.createElement('INPUT');
    input.setAttribute('type','checkbox');
    //creamos el p:
    let p = document.createElement('P');
    p.setAttribute('contenteditable','true');
    p.innerHTML = 'ingrese la tarea'
    //creamos el remover:
    let remover = document.createElement('I');
    let msg = 'remove('+i+')';
    remover.setAttribute('onclick',msg),
    remover.classList.add('remove');
    remover.classList.add('fi');
    remover.classList.add('fi-br-cross');
    //agregamos las cosas al div inicial
    div.appendChild(input);
    div.appendChild(p);
    div.appendChild(remover);
    container.appendChild(div);
}
function remove (i){
    document.getElementById(i).remove();
}
