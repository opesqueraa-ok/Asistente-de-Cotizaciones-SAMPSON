// Función para procesar imágenes cargadas
const procesarImagen = (idInput) => {
    return new Promise((resolve) => {
        const file = document.getElementById(idInput).files[0];
        if (!file) return resolve("https://via.placeholder.com/150?text=Sin+Foto");
        
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
};

async function generarComparativa() {
    // 1. Obtener Nombre del Producto y Fecha
    const producto = document.getElementById('prod-nombre').value || "Suministro General";
    document.getElementById('res-producto').innerText = producto.toUpperCase();
    document.getElementById('fecha-hoy').innerText = new Date().toLocaleDateString();

    // 2. Procesar las 3 imágenes (esperar a que carguen)
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

    // 4. Encontrar el precio más bajo (mayor a 0)
    const preciosValidos = datos.map(d => d.precio).filter(p => p > 0);
    const minPrecio = preciosValidos.length > 0 ? Math.min(...preciosValidos) : -1;

    // 5. Construir Tabla
    const tableBody = document.getElementById('tabla-body');
    
    // Fila Nombres Proveedores
    document.getElementById('th-p1').innerText = datos[0].nom;
    document.getElementById('id-p2').innerText = datos[1].nom;
    document.getElementById('id-p3').innerText = datos[2].nom;

    const filasHtml = `
        <tr>
            <td><b>Imagen Referencia</b></td>
            <td><img src="${datos[0].foto}" class="foto-cotiz"></td>
            <td><img src="${datos[1].foto}" class="foto-cotiz"></td>
            <td><img src="${datos[2].foto}" class="foto-cotiz"></td>
        </tr>
        <tr>
            <td><b>Precio Unitario</b></td>
            <td class="${datos[0].precio === minPrecio ? 'mejor-precio' : ''}">Q${datos[0].precio.toFixed(2)}</td>
            <td class="${datos[1].precio === minPrecio ? 'mejor-precio' : ''}">Q${datos[1].precio.toFixed(2)}</td>
            <td class="${datos[2].precio === minPrecio ? 'mejor-precio' : ''}">Q${datos[2].precio.toFixed(2)}</td>
        </tr>
        <tr>
            <td><b>Envío Incluido</b></td>
            <td>${datos[0].envio}</td>
            <td>${datos[1].envio}</td>
            <td>${datos[2].envio}</td>
        </tr>
        <tr>
            <td><b>Observaciones</b></td>
            <td>${datos[0].obs}</td>
            <td>${datos[1].obs}</td>
            <td>${datos[2].obs}</td>
        </tr>
    `;

    tableBody.innerHTML = filasHtml;

    // 6. Mostrar resultado y ocultar formulario
    document.getElementById('form-section').classList.add('hidden');
    document.getElementById('result-section').classList.remove('hidden');
    
    // Scroll hacia arriba para ver el resultado
    window.scrollTo(0, 0);
}
