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

    // 1. Obtener Nombre del Producto y CANTIDAD (Nuevo)
    const productoNombre = document.getElementById('prod-nombre').value || "Suministro General";
    const productoCantidad = parseInt(document.getElementById('prod-cantidad').value) || 1; // Valor por defecto: 1

    // 2. Procesar las 3 imágenes
    const img1 = await procesarImagen('p1-file');
    const img2 = await procesarImagen('p2-file');
    const img3 = await procesarImagen('p3-file');

    // 3. Capturar datos de proveedores
    const obtenerDatos = (num, img) => {
        const precioUnit = parseFloat(document.getElementById(`p${num}-precio`).value) || 0;
        return {
            nom: document.getElementById(`p${num}-nom`).value || `Proveedor ${num}`,
            precioUnitario: precioUnit,
            precioTotal: precioUnit * productoCantidad, // Calcula el total automáticamente
            envio: document.getElementById(`p${num}-envio`).value,
            obs: document.getElementById(`p${num}-obs`).value || "-",
            foto: img
        };
    };

    const datos = [obtenerDatos(1, img1), obtenerDatos(2, img2), obtenerDatos(3, img3)];

    // 4. Agregar al arreglo del proyecto
    proyectoActual.push({
        producto: productoNombre.toUpperCase(),
        cantidad: productoCantidad, // Se guarda la cantidad
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
        // Encontrar el precio TOTAL más bajo para resaltar al ganador
        const preciosTotalesValidos = item.opciones.map(d => d.precioTotal).filter(p => p > 0);
        const minPrecioTotal = preciosTotalesValidos.length > 0 ? Math.min(...preciosTotalesValidos) : -1;

        const htmlTabla = `
            <div class="tabla-wrapper">
                <h3 class="tabla-titulo">▶ PRODUCTO: ${item.producto} (Cantidad: ${item.cantidad})</h3>
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
                            <td>Q${item.opciones[0].precioUnitario.toFixed(2)}</td>
                            <td>Q${item.opciones[1].precioUnitario.toFixed(2)}</td>
                            <td>Q${item.opciones[2].precioUnitario.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td><b>Precio Total (x${item.cantidad})</b></td>
                            <td class="${preciosTotalesValidos.length > 0 && item.opciones[0].precioTotal === minPrecioTotal ? 'mejor-precio' : ''}"><b>Q${item.opciones[0].precioTotal.toFixed(2)}</b></td>
                            <td class="${preciosTotalesValidos.length > 0 && item.opciones[1].precioTotal === minPrecioTotal ? 'mejor-precio' : ''}"><b>Q${item.opciones[1].precioTotal.toFixed(2)}</b></td>
                            <td class="${preciosTotalesValidos.length > 0 && item.opciones[2].precioTotal === minPrecioTotal ? 'mejor-precio' : ''}"><b>Q${item.opciones[2].precioTotal.toFixed(2)}</b></td>
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
    document.getElementById('prod-cantidad').value = "1"; // Resetea la cantidad a 1
    
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
