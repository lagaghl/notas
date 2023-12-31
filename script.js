"use strict";
const plusButton = document.getElementById('agregar_nota');
const main = document.querySelector('.main');
const note = document.querySelector('.editor-notas');
const cancel = document.querySelector('.header__cancel');
const confirm = document.querySelector('.header__confirm');
const IDBRequest = indexedDB.open('Notas', 1);
const tituloNode = document.querySelector('.header__titulo');
const msgNode = document.querySelector('.escribir-nota__p');
const confirmButton = document.querySelector('.header__confirm');
const cancelButton = document.querySelector('.header__cancel');
let db;

//Funciones:
const resetNoteMode = ()=>{
    tituloNode.textContent = 'Título';
    tituloNode.removeAttribute('key');
    msgNode.textContent = 'Comenzar a escribir';
}
const closeMain = ()=>{
    main.style.animation = 'desaparecer 0.3s forwards';
    main.style.display = 'none'
}
const goToNoteMode = ()=>{
    note.style.animation = 'aparecer 0.2s forwards';
    note.style.display = 'grid'
}
const closeNoteMode = ()=>{
    note.style.animation = 'desaparecer 0.3s forwards';
    note.style.display = 'none'
}
const goToMain = ()=>{
    obtenerNotas();
    main.style.animation = 'aparecer 0.2s forwards';
    main.style.display = 'grid'
}
const transaction = (type)=>{
    const transaction = db.transaction(['notas'], type);
    return transaction.objectStore('notas');
}
const guardarNota = (titulo, msg) => {
    const objectStore = transaction('readwrite');
    const nuevaNota = {titulo,msg};
    objectStore.put(nuevaNota);
}
const eliminarNota = (id)=>{
    const objectStore = transaction('readwrite');
    objectStore.delete(id);
}
const actualizarNota = (titulo,msg,id)=>{
    const objectStore = transaction('readwrite');
    objectStore.put({titulo,msg,id});
}
const obtenerNotas = ()=>{
    const objectStore = transaction('readonly');
    const contenedor = document.querySelector('.contenedor');
    let fragment  = document.createDocumentFragment();
    contenedor.innerHTML = '';
    const cursor = objectStore.openCursor();
    cursor.addEventListener('success',(e)=>{
        if (cursor.result) {
            let html = createHTML(cursor.result.value.id,cursor.result.value.titulo,cursor.result.value.msg);
            fragment.appendChild(html)
            cursor.result.continue();
        }else{
            contenedor.appendChild(fragment);
        }
    })
}
const createHTML = (id,titulo,msg)=>{
    const contenedor = document.createElement('div');
    const h2 = document.createElement('h2');
    const p = document.createElement('p');
    const borrar = document.createElement('img');

    borrar.classList.add ('contenedor__borrar');
    borrar.alt = 'borrar nota';
    borrar.src = 'basura.svg';
    borrar.height = '22px'

    contenedor.classList.add('contenedor__div');

    h2.classList.add('contenedor__div-title');
    h2.textContent = titulo;
    
    p.classList.add('contenedor__div-p');   
    p.textContent = msg;

    contenedor.appendChild(h2);
    contenedor.appendChild(borrar);
    contenedor.appendChild(p);

    contenedor.addEventListener('click',(e)=>{
        let target = e.target;

        if (target.classList.contains('contenedor__borrar')) {
            eliminarNota(id);
            contenedor.parentNode.removeChild(contenedor);
        }else{
            tituloNode.setAttribute('key',id);
            tituloNode.textContent = titulo;
            msgNode.textContent = msg;

            closeMain();
            goToNoteMode();
        }
    })
    return contenedor;
}

//EventListeners:

IDBRequest.addEventListener('upgradeneeded',(e)=>{
    db = e.target.result;
    db.createObjectStore('notas', { keyPath: 'id', autoIncrement: true });
})

IDBRequest.addEventListener('success',(e)=>{
    db = e.target.result;
    obtenerNotas();
})

IDBRequest.addEventListener('error',(e)=>{
    console.error('No se pudo abrir la base de datos',e.target.error);
})

confirmButton.addEventListener('click',()=>{
    let key = tituloNode.attributes.key
    let titulo = tituloNode.textContent;
    let msg = msgNode.textContent;
    if ( key !== undefined) actualizarNota(titulo, msg, parseInt(key.value));
    else guardarNota(titulo,msg);
    closeNoteMode();
    goToMain();
})

cancelButton.addEventListener('click',()=>{
    let cancelar = window.confirm('¿Quiere salir sin guardar?');
    if (cancelar) {
        closeNoteMode();
        goToMain();
    }
})

plusButton.addEventListener('click',(e)=>{
    closeMain();
    resetNoteMode();
    goToNoteMode();
})
