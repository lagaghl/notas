"use strict";
const plusButton = document.getElementById('agregar_nota');
const main = document.querySelector('.main');
const note = document.querySelector('.editor-notas');
const cancel = document.querySelector('.header__cancel');
const confirm = document.querySelector('.header__confirm');
const IDBRequest = indexedDB.open('Notas', 1);
const tituloNode = document.querySelector('.header__titulo');
const msgNode = document.querySelector('.escribir-nota__p');
let db;

IDBRequest.addEventListener('upgradeneeded',(e)=>{
    db = e.target.result;
    db.createObjectStore('notas', { keyPath: 'id', autoIncrement: true });
})
IDBRequest.addEventListener('success',(e)=>{
    db = e.target.result;
    obtenerNotas();
    console.log('Base de datos abierta de forma exitosa');
})
IDBRequest.addEventListener('error',(e)=>{
    console.error('No se pudo abrir la base de datos',e.target.error);
})
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
    const img = document.createElement('img');

    img.classList.add ('contenedor__borrar');
    img.alt = 'borrar nota';
    img.src = 'basura.svg';

    contenedor.classList.add('contenedor__div');
    contenedor.setAttribute('tabindex',0);

    h2.classList.add('contenedor__div-title');
    h2.textContent = titulo;
    
    p.classList.add('contenedor__div-p');   
    p.textContent = msg;

    contenedor.appendChild(h2);
    contenedor.appendChild(img);
    contenedor.appendChild(p);

    contenedor.addEventListener('dblclick',()=>{
        tituloNode.setAttribute('key',id);
        tituloNode.textContent = titulo;
        msgNode.textContent = msg;

        closeMain();
        goToNoteMode();
    })

    return contenedor;
}

document.querySelector('.header__confirm').addEventListener('click',()=>{
    let key = tituloNode.attributes.key
    let titulo = tituloNode.textContent;
    let msg = msgNode.textContent;
    if ( key !== undefined) actualizarNota(titulo, msg, parseInt(key.value));
    else guardarNota(titulo,msg);
    closeNoteMode();
    goToMain();
})

plusButton.addEventListener('click',(e)=>{
    closeMain();
    goToNoteMode();
})

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