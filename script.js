function generarComparativa() {
    const prod = document.getElementById('prod-nombre').value;
    const p1 = {
        nom: document.getElementById('p1-nom').value || "Proveedor A",
        precio: parseFloat(document.getElementById('p1-precio').value) || 0,
        envio: document.getElementById('p1-envio').value,
        obs: document.getElementById('p1-obs').value,
        foto: document.getElementById('p1-link').value || "https://via.placeholder.com/100"
    };
    const p2 = {
        nom: document.getElementById('p2-nom').value || "Proveedor B",
        precio: parseFloat(document.getElementById('p2-precio').value) || 0,
        envio: document.getElementById('p2-envio').value,
        obs: document.getElementById('p2-obs').value,
        foto: document.getElementById('p2-link').value || "https://via.placeholder.com/100"
    };

    document.getElementById('res-producto').innerText = prod;
    document.getElementById('th-p1').innerText = p1.nom;
    document.getElementById('th-p2').innerText = p2.nom;

    // Determinar cuál es más barato
    const claseP1 = (p1.precio < p2.precio && p1.precio > 0) ? "mejor-precio" : "";
    const claseP2 = (p2.precio < p1.precio && p2.precio > 0) ? "mejor-precio" : "";

    const html = `
        <tr><td><b>Foto</b></td><td><img src="${p1.foto}" class="foto-cotiz"></td><td><img src="${p2.foto}" class="foto-cotiz"></td></tr>
        <tr><td><b>Precio Unitario</b></td><td class="${claseP1}">Q${p1.precio.toFixed(2)}</td><td class="${claseP2}">Q${p2.precio.toFixed(2)}</td></tr>
        <tr><td><b>Envío Incluido</b></td><td>${p1.envio}</td><td>${p2.envio}</td></tr>
        <tr><td><b>Observaciones</b></td><td>${p1.obs}</td><td>${p2.obs}</td></tr>
    `;

    document.getElementById('tabla-body').innerHTML = html;
    document.getElementById('form-section').classList.add('hidden');
    document.getElementById('result-section').classList.remove('hidden');
}

function reiniciar() { location.reload(); }
