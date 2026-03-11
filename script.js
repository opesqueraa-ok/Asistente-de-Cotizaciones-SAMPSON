// Arreglo para guardar todos los productos del proyecto actual
let proyectoActual = [];

// Función para procesar imágenes cargadas localmente
const procesarImagen = (idInput) => {
    return new Promise((resolve) => {
        const file = document.getElementById(idInput).files[0];
        if (!file) return resolve("https://via.placeholder.com/150?text=Sin+Foto");
        
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
};

async function agregarProducto() {
    const btn = document.getElementById('btn-agregar');
    btn.innerText = "⏳ Procesando...";
    btn.disabled = true;

    // 1. Obtener Nombre del Producto
    const productoNombre = document.getElementById('prod-nombre').value || "Suministro General";

    // 2. Procesar las 3 imágenes
    const img1 = await procesarImagen('p1-file');
    const img2 = await procesarImagen('p2-file');
    const img3 = await procesarImagen('p3-file');

    // 3. Capturar datos de proveedores
    const obtenerDatos = (num, img) => ({
        nom: document.getElementById(`p${num}-nom`).value || `Proveedor ${num}`,
        precio: parseFloat(document.getElementById(`p${num}-precio`).value) || 0,
        envio: document.getElementById(`p${num}-envio`).value,
        obs: document.getElementById(`p${num}-obs`).value || "-",
        foto: img
    });

    const datos = [obtenerDatos(1, img1), obtenerDatos(2, img2), obtenerDatos(3, img3)];

    // 4. Agregar al arreglo del proyecto
    proyectoActual.push({
        producto: productoNombre.toUpperCase(),
        opciones: datos
    });

    // 5. Renderizar todas las tablas
    renderizarProyecto();

    // 6. Limpiar el formulario para el siguiente producto
    limpiarFormulario();

    // Restaurar botón
    btn.innerText = "➕ Agregar Producto al Proyecto";
    btn.disabled = false;
}

function renderizarProyecto() {
    const contenedor = document.getElementById('tablas-container');
    contenedor.innerHTML = ""; // Limpiar antes de volver a dibujar

    // Poner la fecha de hoy
    document.getElementById('fecha-hoy').innerText = new Date().toLocaleDateString();
    document.getElementById('fecha-contenedor').classList.remove('hidden');

    // Dibujar cada producto como una tabla independiente
    proyectoActual.forEach((item) => {
        // Encontrar el precio más bajo
        const preciosValidos = item.opciones.map(d => d.precio).filter(p => p > 0);
        const minPrecio = preciosValidos.length > 0 ? Math.min(...preciosValidos) : -1;

        const htmlTabla = `
            <div class="tabla-wrapper">
                <h3 class="tabla-titulo">▶ PRODUCTO: ${item.producto}</h3>
                <table>
                    <thead>
                        <tr>
                            <th width="25%">Detalle</th>
                            <th>${item.opciones[0].nom}</th>
                            <th>${item.opciones[1].nom}</th>
                            <th>${item.opciones[2].nom}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><b>Imagen Referencia</b></td>
                            <td><img src="${item.opciones[0].foto}" class="foto-cotiz"></td>
                            <td><img src="${item.opciones[1].foto}" class="foto-cotiz"></td>
                            <td><img src="${item.opciones[2].foto}" class="foto-cotiz"></td>
                        </tr>
                        <tr>
                            <td><b>Precio Unitario</b></td>
                            <td class="${preciosValidos.length > 0 && item.opciones[0].precio === minPrecio ? 'mejor-precio' : ''}">Q${item.opciones[0].precio.toFixed(2)}</td>
                            <td class="${preciosValidos.length > 0 && item.opciones[1].precio === minPrecio ? 'mejor-precio' : ''}">Q${item.opciones[1].precio.toFixed(2)}</td>
                            <td class="${preciosValidos.length > 0 && item.opciones[2].precio === minPrecio ? 'mejor-precio' : ''}">Q${item.opciones[2].precio.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td><b>Envío Incluido</b></td>
                            <td>${item.opciones[0].envio}</td>
                            <td>${item.opciones[1].envio}</td>
                            <td>${item.opciones[2].envio}</td>
                        </tr>
                        <tr>
                            <td><b>Observaciones</b></td>
                            <td>${item.opciones[0].obs}</td>
                            <td>${item.opciones[1].obs}</td>
                            <td>${item.opciones[2].obs}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
        contenedor.innerHTML += htmlTabla;
    });

    // Mostrar botones de imprimir y área de firma
    document.getElementById('print-actions').classList.remove('hidden');
    document.getElementById('firma-area').classList.remove('hidden');
}

function limpiarFormulario() {
    document.getElementById('prod-nombre').value = "";
    for(let i=1; i<=3; i++) {
        document.getElementById(`p${i}-nom`).value = "";
        document.getElementById(`p${i}-precio`).value = "";
        document.getElementById(`p${i}-envio`).value = "No";
        document.getElementById(`p${i}-obs`).value = "";
        document.getElementById(`p${i}-file`).value = ""; // Limpia el archivo cargado
    }
    // Subir la vista al inicio del formulario para seguir agregando
    document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
}
