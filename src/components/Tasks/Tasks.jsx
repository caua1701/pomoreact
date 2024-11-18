import "./Tasks.css"

export default function Tasks() {
   return (
      <div class="Tasks">
         <h3 id="task-title">Tarefas</h3>

         <div class="task-inputs">
            <input type="text" id="tarefa-input" placeholder="Digite sua tarefa..." />
            <button id="tarefa-button">Salvar</button>
         </div>

         <div class="tarefas" id="lista"></div>
      </div>
   )

}