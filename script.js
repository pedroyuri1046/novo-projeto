function configurarCalculadora(escolha) {

    document.querySelectorAll('.button-wrapper .box-item').forEach(btn => {
        btn.style.borderColor = 'transparent';
    });
    
    event.currentTarget.style.borderColor = '#fff20f';

    const painel = document.getElementById('painel-entrada');
    const titulo = document.getElementById('titulo-painel');
    const containerInputs = document.getElementById('container-inputs');

    containerInputs.innerHTML = '';
    
    let inputsNecessarios = [];

    if (escolha === 'tempo') {
        titulo.innerText = "CALCULAR TEMPO:";
        inputsNecessarios = ['distancia', 'pace'];
    } else if (escolha === 'pace') {
        titulo.innerText = "CALCULAR PACE:";
        inputsNecessarios = ['distancia', 'tempo'];
    } else if (escolha === 'distancia') {
        titulo.innerText = "CALCULAR DISTÂNCIA:";
        inputsNecessarios = ['tempo', 'pace'];
    }

    inputsNecessarios.forEach(item => {
        const label = item === 'distancia' ? 'DISTÂNCIA (km)' : item.toUpperCase();

        const precisaMascara = item === 'tempo' || item === 'pace';

        containerInputs.innerHTML += `
            <div style="margin-bottom: 15px;">
                <p class="Teko" style="font-size: 24px; color: #fff;">${label}</p>
                <input 
                    type="text" 
                    id="input-${item}" 
                    class="input-pace" 
                    placeholder="${precisaMascara ? '00:00' : 'Ex: 5.0'}"
                    ${precisaMascara ? 'oninput="aplicarMascaraTempo(this)"' : ''}
                >
            </div>
        `;
    });

    painel.classList.add('painel-visivel');
}


function aplicarMascaraTempo(input) {
    let valor = input.value.replace(/\D/g, '');

    if (valor.length > 6) valor = valor.slice(0, 6);

    if (valor.length <= 2) {
        input.value = valor;
    } else if (valor.length <= 4) {
        input.value = valor.replace(/(\d{2})(\d+)/, '$1:$2');
    } else {
        input.value = valor.replace(/(\d{2})(\d{2})(\d+)/, '$1:$2:$3');
    }
}

// Suas funções continuam iguais 👇

function tempoParaSegundos(tempo) {
    const partes = tempo.split(':').map(Number);
    if (partes.length === 3) {
        return (partes[0] * 3600) + (partes[1] * 60) + partes[2];
    } else if (partes.length === 2) {
        return (partes[0] * 60) + partes[1];
    }
    return 0;
}

function segundosParaTempo(segundos) {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = Math.round(segundos % 60);

    const partes = [];

    // Só adiciona horas se o valor for maior que zero
    if (h > 0) {
        partes.push(h.toString().padStart(2, '0'));
    }

    // Minutos e segundos sempre aparecem
    partes.push(m.toString().padStart(2, '0'));
    partes.push(s.toString().padStart(2, '0'));

    return partes.join(':');
}


function calcular() {
    const titulo = document.getElementById('titulo-painel').innerText;
    const valorDisplay = document.getElementById('valor-resultado');
    const resultadoBox = document.getElementById('painel-resultado');

    let resultado = "";

    if (titulo.includes("PACE")) {
        const tempo = tempoParaSegundos(document.getElementById('input-tempo').value);
        const dist = parseFloat(document.getElementById('input-distancia').value);
        if (tempo && dist) {
            resultado = segundosParaTempo(tempo / dist) + " min/km";
        }
    } 
    else if (titulo.includes("DISTÂNCIA")) {
        const tempo = tempoParaSegundos(document.getElementById('input-tempo').value);
        const pace = tempoParaSegundos(document.getElementById('input-pace').value);
        if (tempo && pace) {
            resultado = (tempo / pace).toFixed(2) + " km";
        }
    } 
    else if (titulo.includes("TEMPO")) {
        const dist = parseFloat(document.getElementById('input-distancia').value);
        const pace = tempoParaSegundos(document.getElementById('input-pace').value);
        if (dist && pace) {
            resultado = segundosParaTempo(dist * pace, true);
        }
    }

    if (resultado) {
        valorDisplay.innerText = resultado;
        resultadoBox.classList.add('painel-visivel');
    } else {
        alert("Por favor, preencha os campos corretamente (ex: 05:30 ou 01:00:00)");
    }
}