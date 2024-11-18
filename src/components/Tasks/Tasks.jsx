import { useState, useEffect } from "react";
import "./Tasks.css";

export default function Tasks() {
   // Estado para as tarefas
   const [tarefas, setTarefas] = useState(() => {
      const tarefasSalvas = localStorage.getItem("tarefas");
      return tarefasSalvas ? JSON.parse(tarefasSalvas) : [];
   });

   // Estado para o input de nova tarefa
   const [novaTarefa, setNovaTarefa] = useState("");

   // Função para salvar as tarefas no localStorage
   const salvarTarefas = (novasTarefas) => {
      localStorage.setItem("tarefas", JSON.stringify(novasTarefas));
   };

   // Função para adicionar uma nova tarefa
   const adicionarTarefa = () => {
      if (novaTarefa.trim()) {
         const tarefa = { nome: novaTarefa, concluida: false }; // Tarefa criada
         const novasTarefas = [...tarefas, tarefa]; // Adiciona a nova tarefa à lista
         setTarefas(novasTarefas); // Atualiza o estado
         salvarTarefas(novasTarefas); // Salva as tarefas no localStorage
         setNovaTarefa(""); // Limpa o campo de input
      }
   };

   // Função para excluir uma tarefa
   const excluirTarefa = (index) => {
      const novasTarefas = tarefas.filter((_, i) => i !== index); // Filtra a tarefa
      setTarefas(novasTarefas); // Atualiza o estado
      salvarTarefas(novasTarefas); // Atualiza no localStorage
   };

   // Função para alternar a conclusão de uma tarefa
   const alternarConclusaoTarefa = (index) => {
      const novasTarefas = [...tarefas]; // Cria uma cópia das tarefas
      novasTarefas[index].concluida = !novasTarefas[index].concluida; // Alterna a conclusão
      setTarefas(novasTarefas); // Atualiza o estado
      salvarTarefas(novasTarefas); // Salva as tarefas no localStorage
   };

   // Função para renderizar as tarefas
   const renderizarTarefas = () => {
      return tarefas.map((tarefa, index) => (
         <div className="tarefa" key={index}>
            <span
               style={{
                  textDecoration: tarefa.concluida ? "line-through" : "none",
                  color: tarefa.concluida ? "#FFEB55" : "black",
               }}
               onClick={() => alternarConclusaoTarefa(index)} // Marca/desmarca ao clicar no nome
            >
               {tarefa.nome}
            </span>
            <button
               className="delete-button"
               onClick={() => excluirTarefa(index)} // Exclui ao clicar no botão
            >
               Excluir
            </button>
         </div>
      ));
   };

   return (
      <div className="Tasks">
         <h3 id="task-title">Tarefas</h3>

         <div className="task-inputs">
            <input
               type="text"
               id="tarefa-input"
               placeholder="Digite sua tarefa..."
               value={novaTarefa}
               onChange={(e) => setNovaTarefa(e.target.value)} // Atualiza o input
            />
            <button
               id="tarefa-button"
               onClick={adicionarTarefa}
            >
               Salvar
            </button>
         </div>

         <div className="tarefas" id="lista">
            {renderizarTarefas()}
         </div>
      </div>
   );
}
