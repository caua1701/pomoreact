import "./Timer.css";
import { useState, useEffect } from "react";
import Modal from "react-modal";

export default function Timer() {
   // Inicializando o estado com valores do localStorage ou com valores padrão
   const [pomodoroTimer, setPomodoroTimer] = useState(() => {
      const savedPomodoroTimer = localStorage.getItem("pomodoroTimer");
      return savedPomodoroTimer ? JSON.parse(savedPomodoroTimer) : 25 * 60; // Valor padrão: 25 minutos
   });
   const [shortTimer, setShortTimer] = useState(() => {
      const savedShortTimer = localStorage.getItem("shortTimer");
      return savedShortTimer ? JSON.parse(savedShortTimer) : 5 * 60; // Valor padrão: 5 minutos
   });
   const [longTimer, setLongTimer] = useState(() => {
      const savedLongTimer = localStorage.getItem("longTimer");
      return savedLongTimer ? JSON.parse(savedLongTimer) : 15 * 60; // Valor padrão: 15 minutos
   });
   const [intervalosDesejados, setIntervalosDesejados] = useState(() => {
      const savedIntervalosDesejados = localStorage.getItem("intervalosDesejados");
      return savedIntervalosDesejados ? JSON.parse(savedIntervalosDesejados) : 3; // Valor padrão: 3 intervalos
   });

   const [telaAtual, setTelaAtual] = useState(1)
   const [botao, setBotao] = useState("Iniciar");
   const [intervalo, setIntervalo] = useState(null);
   const [ciclosPomodoro, setCiclosPomodoro] = useState(0); // Número de ciclos de Pomodoro completados

   //Timer
   const [timerAtual, setTimerAtual] = useState(pomodoroTimer); // Tempo inicial em segundos (25 minutos)
   const [timerTela, setTimerTela] = useState(formatarTempo(pomodoroTimer)); // Inicia com o tempo formatado

   //Modal
   const [modalMusicOpen, setmodalMusicOpen] = useState(false);
   const [modalConfigOpen, setmodalConfigOpen] = useState(false);

   function openMusicModal() {
      setmodalMusicOpen(true);
   }

   function openConfigModal() {
      setmodalConfigOpen(true);
   }

   function closeModalMusic() {
      setmodalMusicOpen(false);
   }

   function closeModalConfig() {
      setmodalConfigOpen(false);
   }

   // Função para formatar o tempo
   function formatarTempo(segundos) {
      let minutos = Math.floor(segundos / 60);
      let secs = segundos % 60;
      return (minutos < 10 ? "0" + minutos : minutos) + ":" + (secs < 10 ? "0" + secs : secs);
   }

   // Função para carregar as configurações do localStorage
   function carregarConfiguracoes() {
      const localConfig = JSON.parse(localStorage.getItem("configPomo"));
      if (localConfig) {
         setPomodoroTimer(localConfig.pomoTimer);
         setShortTimer(localConfig.shortTimer);
         setLongTimer(localConfig.longTimer);
         setIntervalosDesejados(localConfig.interval);
      } else {
         // Se não existir configuração salva, cria uma com os valores padrão
         const configPomo = {
            pomoTimer: pomodoroTimer,
            shortTimer: shortTimer,
            longTimer: longTimer,
            interval: intervalosDesejados,
         };
         localStorage.setItem("configPomo", JSON.stringify(configPomo));
      }
   }

   // Salvar as configurações no localStorage sempre que elas mudarem
   function salvarConfiguracoes() {
      const configPomo = {
         pomoTimer: pomodoroTimer,
         shortTimer: shortTimer,
         longTimer: longTimer,
         interval: intervalosDesejados,
      };
      localStorage.setItem("configPomo", JSON.stringify(configPomo));

      // Atualiza o timerAtual com base na tela atual
      switch (telaAtual) {
         case 1: // Pomodoro
            setTimerAtual(pomodoroTimer);
            break;
         case 2: // Short Break
            setTimerAtual(shortTimer);
            break;
         case 3: // Long Break
            setTimerAtual(longTimer);
            break;
         default:
            break;
      }
   }

   // Inicia/pausa o cronômetro
   function contador() {
      if (botao === "Iniciar") {
         setBotao("Pausar");
         const novoIntervalo = setInterval(passarTempo, 1000);
         setIntervalo(novoIntervalo);
      } else {
         setBotao("Iniciar");
         clearInterval(intervalo);
         setIntervalo(null); // Limpa o intervalo
      }
   }

   // Função que decrementa o tempo
   function passarTempo() {
      setTimerAtual((prev) => prev - 1); // Decrementa o tempo de 1 segundo
   }

   function reiniciarTempo() {
      clearInterval(intervalo);
      setBotao("Iniciar");
      switch (telaAtual) {
         case 1:
            setTimerAtual(pomodoroTimer);
            break;
         case 2:
            setTimerAtual(shortTimer);
            break;
         case 3:
            setTimerAtual(longTimer);
            break;
         default:
            break;
      }
   }

   function pularTempo() {
      setTimerAtual(1); // Define um segundo para pular
   }

   // Função para mudar a tela (Pomodoro, Short Break, Long Break)
   function mudarTela(tela) {
      setTelaAtual(tela); // Atualiza a tela atual

      // Define o tempo baseado na tela selecionada
      let novoTempoSegundos;
      switch (tela) {
         case 1:
            novoTempoSegundos = pomodoroTimer;
            break;
         case 2:
            novoTempoSegundos = shortTimer;
            break;
         case 3:
            novoTempoSegundos = longTimer;
            break;
         default:
            novoTempoSegundos = pomodoroTimer; // Valor padrão
            break;
      }
      setTimerAtual(novoTempoSegundos); // Atualiza o tempo de acordo com a tela

      // Atualiza a cor dos botões
      resetarCores(); // Reseta as cores de todos os botões
      atualizarCorBotao(tela); // Atualiza a cor do botão ativo
   }

   // Função para resetar as cores para o estado inicial
   function resetarCores() {
      const botoes = ["btnPomo", "btnShort", "btnLong"];
      botoes.forEach((id) => {
         const botao = document.getElementById(id);
         botao.style.backgroundColor = "";
         botao.style.color = "";
         botao.classList.remove("active");
      });
   }

   // Função para atualizar a cor do botão ativo
   function atualizarCorBotao(tela) {
      const coresAtivas = {
         1: "#FFEB55", // Cor do botão Pomodoro
         2: "#4CAF50", // Cor do botão Short Break
         3: "#FF5733"  // Cor do botão Long Break
      };

      const botoes = {
         1: "btnPomo",
         2: "btnShort",
         3: "btnLong"
      };

      const botaoAtivo = document.getElementById(botoes[tela]);
      botaoAtivo.style.backgroundColor = coresAtivas[tela];
      botaoAtivo.style.color = "black";
      botaoAtivo.classList.add("active"); // Adiciona a classe 'active' para indicar o botão selecionado
   }

   function handleInputChange(event) {
      const { id, value } = event.target;

      switch (id) {
         case "pomoInput":
            setPomodoroTimer(Number(value) * 60); // Conversão para segundos
            break;
         case "shortInput":
            setShortTimer(Number(value) * 60);
            break;
         case "longInput":
            setLongTimer(Number(value) * 60);
            break;
         case "interval":
            setIntervalosDesejados(Number(value));
            break;
         default:
            break;
      }
   }

   useEffect(() => {
      localStorage.setItem("pomodoroTimer", JSON.stringify(pomodoroTimer));
      localStorage.setItem("shortTimer", JSON.stringify(shortTimer));
      localStorage.setItem("longTimer", JSON.stringify(longTimer));
      localStorage.setItem("intervalosDesejados", JSON.stringify(intervalosDesejados));
   }, [pomodoroTimer, shortTimer, longTimer, intervalosDesejados]); // Salva quando algum desses valores mudar

   // Função para mudar a tela automaticamente conforme a sequência Pomodoro - Short Break - Long Break
   useEffect(() => {
      carregarConfiguracoes(); // Carrega as configurações ao montar o componente
   }, []); // Este useEffect roda apenas uma vez ao montar o componente

   // Função para mudar a tela automaticamente conforme a sequência Pomodoro - Short Break - Long Break
   useEffect(() => {
      if (timerAtual <= 0) {
         if (telaAtual === 1) {
            // Se a tela for Pomodoro, muda para Short Break
            if (ciclosPomodoro < intervalosDesejados) { // 2 ciclos de Pomodoro, vai para Short Break
               setTelaAtual(2);
               mudarTela(2)
               setCiclosPomodoro(ciclosPomodoro + 1);
            } else {
               // Se já completou 3 ciclos de Pomodoro, vai para Long Break
               setTelaAtual(3);
               mudarTela(3)
               setCiclosPomodoro(0); // Resetando o ciclo para começar novo
            }
         } else if (telaAtual === 2) {
            // Se a tela for Short Break, volta para Pomodoro
            setTelaAtual(1);
            mudarTela(1)
         } else if (telaAtual === 3) {
            // Se a tela for Long Break, volta para Pomodoro
            setTelaAtual(1);
            mudarTela(1)
         }
         setBotao("Iniciar"); // Reseta o botão para "Iniciar"
         clearInterval(intervalo); // Limpa o intervalo ao mudar a tela
      }
   }, [timerAtual, telaAtual, intervalo, ciclosPomodoro]); // Usa efeito de dependência para checar mudanças

   useEffect(() => {
      // Inicia com a tela Pomodoro e aplica a cor correta ao botão
      mudarTela(1); // Garante que o Pomodoro seja a tela inicial e o botão já tenha a cor
      setTimerTela(formatarTempo(timerAtual)); // Atualiza o valor formatado para exibir na tela
   }, []); // Este useEffect roda apenas uma vez, logo após a primeira renderização

   useEffect(() => {
      setTimerTela(formatarTempo(timerAtual)); // Atualiza o valor formatado para exibir na tela
   }, [timerAtual]); // Observa tanto o valor do timerAtual quanto o intervalo

   return (
      <div className="container">
         <div className="options">
            <button id="btnPomo" onClick={() => mudarTela(1)}>Pomodoro</button>
            <button id="btnShort" onClick={() => mudarTela(2)}>Short Break</button>
            <button id="btnLong" onClick={() => mudarTela(3)}>Long Break</button>
         </div>

         <div className="modal-options">
            <i className="fa-solid fa-music" id="musicButton" onClick={openMusicModal}></i>
            <i className="fa-solid fa-gear" id="configButton" onClick={openConfigModal}></i>
         </div>

         <div className="cronometro">
            <div className="tempo" id="timer">{timerTela}</div>

            <div className="actions">
               <i className="fa-solid fa-rotate-right" onClick={reiniciarTempo}></i>

               <button id="botaoTimer" onClick={contador}>{botao}</button>

               <i className="fa-solid fa-forward" onClick={pularTempo}></i>
            </div>
         </div>

         <div id="int-atual">#{ciclosPomodoro + 1}</div>

         {/* Modal de Música */}
         <Modal
            isOpen={modalMusicOpen}
            onRequestClose={closeModalMusic}
            contentLabel="Música"
            overlayClassName="modal-overlay"
            className="modal-content"
            appElement={document.getElementById('root')}
         >
            <div className="modal-music">
               <span className="close-music" onClick={closeModalMusic}>&times;</span>
               <iframe
                  width="100%"
                  height="300"
                  scrolling="no"
                  frameBorder="no"
                  src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1234281943&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
               ></iframe>
            </div>
         </Modal>

         <Modal
            isOpen={modalConfigOpen}
            onRequestClose={closeModalConfig}
            contentLabel="Música"
            overlayClassName="modal-overlay"
            className="modal-content"
            appElement={document.getElementById('root')}
         >
            <div id="configModal" class="modal">
               <div class="modal-content">
                  <span class="close">&times;</span>
                  <h2>Configurações</h2>
                  <label htmlFor="pomoInput">Pomodoro (minutos):</label>
                  <input type="number" id="pomoInput" value={pomodoroTimer / 60} onChange={handleInputChange} />
                  <br />
                  <label htmlFor="shortInput">Pausa Curta (minutos):</label>
                  <input type="number" id="shortInput" value={shortTimer / 60} onChange={handleInputChange} />
                  <br />
                  <label htmlFor="longInput">Pausa Longa (minutos):</label>
                  <input type="number" id="longInput" value={longTimer / 60} onChange={handleInputChange} />
                  <br />
                  <label htmlFor="interval">Intervalos:</label>
                  <input type="number" id="interval" value={intervalosDesejados} onChange={handleInputChange} />
                  <br /><br />
                  <button id="saveConfig" onClick={salvarConfiguracoes}>Salvar</button>
               </div>
            </div>
         </Modal>
      </div>
   );
}