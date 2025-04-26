// Adiciona um novo bloco de medicamento
function adicionarMedicamento() {
    const div = document.createElement ('div');
    div.className = 'medicamento mb-4 p-3 border rounded shadow-sm';
    div.innerHTML = `
      <h5 class="text-primary">Medicamento</h5>
      <input type="text" name="nomeMedicamento" class="form-control mb-2" placeholder="Nome do Medicamento" required />
  
      <select name="controlado" class="form-select mb-2" required>
        <option value="">Controlado?</option>
        <option value="SIM">SIM</option>
        <option value="NAO">NÃO</option>
      </select>
  
      <input type="date" name="validade" class="form-control mb-2" placeholder="Validade do Medicamento" required />
  
      <input type="number" name="qtdPedida" class="form-control mb-2" placeholder="Quantidade Pedida" required />
      <hr/>
    `;
    document.getElementById('medicamentos').appendChild(div);
  }
  
  // Adiciona um novo bloco de material
  function adicionarMaterial() {
    const div = document.createElement('div');
    div.className = 'material mb-4 p-3 border rounded shadow-sm';
    div.innerHTML = `
      <h5 class="text-success">Material</h5>
      <input type="text" name="nomeMaterial" class="form-control mb-2" placeholder="Nome do Material" required />
  
      <input type="date" name="validade" placeholder="Validade do material" class="form-control mb-2"  required />
  
      <input type="number" name="qtdPedidaMaterial" class="form-control mb-2" placeholder="Quantidade Pedida" required />
  
     
  
      <select name="liberar" class="form-select mb-2" required>
        <option value="">Liberar?</option>
        <option value="LIBERADO">LIBERADO</option>
        <option value="NAO_LIBERADO">NÃO LIBERADO</option>
      </select>
  
      <textarea name="obs" class="form-control mb-2" placeholder="Observações"></textarea>
      <hr/>
    `;
    document.getElementById('materiais').appendChild(div);
  }
  
  function salvarComanda() {
    const medicamentos = [];
    const materiais = [];
  
    const medicamentoInputs = document.querySelectorAll('#medicamentos .medicamento');
    medicamentoInputs.forEach(med => {
      medicamentos.push({
        nomeMedicamento: med.querySelector('input[name="nomeMedicamento"]').value,
        controlado: med.querySelector('select[name="controlado"]').value,
        validade: med.querySelector('input[name="validade"]').value,
        qtdPedida: parseInt(med.querySelector('input[name="qtdPedida"]').value)
      });
    });
  
    const materialInputs = document.querySelectorAll('#materiais .material');
    materialInputs.forEach(mat => {
      materiais.push({
        nomeMaterial: mat.querySelector('input[name="nomeMaterial"]').value,
        validade: mat.querySelector('input[name="validade"]').value,
        qtdPedidaMaterial: parseInt(mat.querySelector('input[name="qtdPedidaMaterial"]').value),      
        liberar: mat.querySelector('select[name="liberar"]').value,
        obs: mat.querySelector('textarea[name="obs"]').value
      });
    });
  
    const comanda = {         
      setorOrigem: document.getElementById("setorOrigem").value,
      setorDestino: document.getElementById("setorDestino").value,
      medico: document.getElementById("medico").value,
      especialidade: document.getElementById("especialidade").value,
      paciente: document.getElementById("paciente").value,
      idade: document.getElementById("idade").value,
      obs: document.getElementById("obs").value,
      medicamentos: medicamentos,
      materiais: materiais
    };
  
    fetch('http://localhost:8080/comandas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comanda)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao salvar a comanda');
      }
      return response.json();
    })
    .then(data => {
      alert('Comanda salva com sucesso!');
      getComandas();
      window.location.reload();
    })
    .catch(error => {
      console.error('Erro:', error);
      alert('Erro ao salvar a comanda');
    });
  }
  
  function renderComandas(comandas) {
  const container = document.getElementById('comandasSalvas');
  container.innerHTML = '';

  comandas.forEach((comanda, index) => {
    const card = document.createElement('div');
    card.className = 'card p-3 mb-3';

    card.innerHTML = `
      <h5 class="text-primary">Comanda #${index + 1} - Código: ${comanda.codComanda}</h5>      
      <p><strong>Data E Hora:</strong> <span class="text-primary">${comanda.dataHora}</span></p>          
      <p><strong>Médico Responsável:</strong> <span class="text-primary">${comanda.medico}</span></p>
       <p><strong>Especialidade:</strong> <span class="text-primary">${comanda.especialidade}</span></p>
      <p><strong>Farmacêutico Responsável:</strong> <span class="text-primary">${comanda.farmaceutico}</span></p>
      <p><strong>Paciente:</strong><span class="text-primary"> ${comanda.paciente}</p>
      <p><strong>Idade:</strong><span class="text-primary"> ${comanda.idade}</p>
      <p><strong>Setor Origem:</strong><span class="text-primary"> ${comanda.setorOrigem} </p>
       <p><strong>Setor Destino:</strong><span class="text-primary"> ${comanda.setorDestino}</p>
       <p><strong>Observação:</strong><span class="text-primary"> ${comanda.obs}</p>
      <div class="mt-2">
        <strong>Medicamentos:</strong>
        <ul>
          ${comanda.medicamentos.map(m => `
            <li><strong><span class="text-danger">${m.nomeMedicamento}</strong> - <strong>${m.qtdPedida}</strong> un. - <strong>Controlado:</strong> ${m.controlado} - <strong>Lote:</strong> ${m.lote} - <strong>Validade:</strong><span class="text-danger"> ${m.validade}</li>
          `).join('')}
        </ul>
      </div>

      <div class="mt-2">
        <strong>Materiais:</strong>
        <ul>
          ${comanda.materiais.map(m => `
            <li><strong><span class="text-danger">${m.nomeMaterial}</strong> - <strong>${m.qtdPedidaMaterial}</strong> un. - <strong>Liberar:</strong> ${m.liberar} - <strong>Lote:</strong> ${m.lote} - <strong>Validade:</strong><span class="text-danger"> ${m.validade}</li>
          `).join('')}
        </ul>            
      </div>

       <div class="text-center mt-3">
         <button class="btn btn-danger btn-lg w-50" onclick="excluirComanda('${comanda.id}')">
        Excluir Comanda
      </button>
    </div>
`;   

    container.appendChild(card);
  });
} 


// Função para buscar todas as comandas
async function getComandas() {
  try {
    const response = await fetch('http://localhost:8080/comandas');
    if (!response.ok) {
      throw new Error(`Erro ao buscar comandas: ${response.status}`);
    }

    const comandas = await response.json();
    renderComandas(comandas);
  } catch (error) {
    console.error('Erro ao carregar comandas:', error);
    alert('Erro ao carregar comandas. Verifique o console.');
  }
}

// Função para buscar uma comanda específica pelo codComanda
async function buscarComandaPorCodigo(codComanda) {
  try {
    const response = await fetch(`http://localhost:8080/comandas/buscarComanda?codComanda=${encodeURIComponent(codComanda)}`);
    if (!response.ok) {
      throw new Error('Comanda não encontrada.');
    }

    const comanda = await response.json();
    renderComandas([comanda]); // Envia como array para reutilizar a função renderComandas
  } catch (error) {
    console.error('Erro ao buscar comanda:', error);
    alert(error.message);
  }
}

// Event listener para o botão "Buscar"
document.getElementById('btnBuscar').addEventListener('click', () => {
  const codComanda = document.getElementById('campoBusca').value.trim();
  if (codComanda) {
    buscarComandaPorCodigo(codComanda);
  } else {
    alert('Por favor, insira o código da comanda.');
  }
});

// Event listener para o botão "Mostrar Todas"
document.getElementById('btnMostrarTodas').addEventListener('click', () => {
  getComandas();
});

// Carrega todas as comandas ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
  getComandas();
});
 
async function excluirComanda(id) {
  if (!confirm(`Tem certeza que deseja excluir a comanda com ID ${id}?`)) {
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/comandas/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Erro ao excluir comanda: ${response.status}`);
    }

    alert(`Comanda com ID ${id} excluída com sucesso.`);
    getComandas(); // Recarrega as comandas após a exclusão
  } catch (error) {
    console.error('Erro ao excluir comanda:', error);
    alert('Erro ao excluir comanda. Verifique o console para mais detalhes.');
  }
}


  getComandas();

 // <input type="number" name="estoque" class="form-control mb-2" placeholder="Estoque Atual" required />