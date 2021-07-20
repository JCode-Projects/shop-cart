/* Variables */
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody")
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");
let articulosCarrito = [];

cargarEventListeners();
function cargarEventListeners() {
    /* Agregar al carrito cuando se de click */
    listaCursos.addEventListener("click", agregarCurso);

    /* Elimina cursos del carrito */
    carrito.addEventListener("click", eliminarCurso);

    /* Vaciar el carrito de compras */
    vaciarCarritoBtn.addEventListener("click", () => {
        articulosCarrito = [];
        limpiarHTML();
    });

    // Muestra los cursos del localStorage
    document.addEventListener("DOMContentLoaded", () => {
        articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carritoHTML();
    })
}

/* Funciones */
function agregarCurso(e) {
    e.preventDefault();
    
    if(e.target.classList.contains("agregar-carrito")) {
        const cursoSelect = e.target.parentNode.parentNode;
        leerDatosCurso(cursoSelect);
    }
}

function leerDatosCurso(curso) {
    const infoCurso = {
        imagen: curso.querySelector(".imagen-curso").src,
        titulo: curso.querySelector("h4").textContent,
        precio: curso.querySelector(".precio span").textContent,
        id: curso.querySelector("a").getAttribute("data-id"),
        cantidad: 1
    }

    // Validar si el elemento ya está agregado
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if(existe) {
        // Actualizar la cantidad
        const cursos = articulosCarrito.map(curso => {
            if(curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso;
            }
            return curso;
        });

        articulosCarrito = [...cursos];
    } else {
        // Agrega elementos al carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    carritoHTML();
}

// Eliminar un curso del carrito
function eliminarCurso(e) {
    e.preventDefault();
    if(e.target.classList.contains("borrar-curso")) {
        const id = e.target.getAttribute("data-id");

        // Elimina del arreglo
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== id);
        
        carritoHTML();
    }
}

// Muestra los articulos en el DOM
function carritoHTML() {
    // Limpiar el HTML
    limpiarHTML();

    // Agregar al HTML los carritos
    articulosCarrito.forEach(curso => {
        const row = document.createElement('tr');
        const { imagen, titulo, precio, cantidad, id } = curso;
        
        row.innerHTML = `
            <td><img width="100" src="${imagen}" alt="Curso seleccionado"></td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td><a href="#" class="borrar-curso" data-id="${id}">X</a></td>
        `;

        contenedorCarrito.appendChild(row);
    });

    // Sincronizar el storage
    sincronizarStorage();
}

function limpiarHTML() {
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.firstChild.remove();
    }
}

function sincronizarStorage() {
    localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}