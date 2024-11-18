import "./Timer.css";
import { useState, useEffect } from "react";

export default function Timer() {
   const [timerAtual, setTimerAtual] = useState(1500); // Tempo inicial em segundos (25 minutos)
   const [timerTela, setTimerTela] = useState(formatarTempo(1500)); // Inicia com o tempo formatado
   const [telaAtual, setTelaAtual] = useState(1)
   const [botao, setBotao] = useState("Iniciar");
   const [intervalo, setIntervalo] = useState(null);
   const [ciclosPomodoro, setCiclosPomodoro] = useState(0); // Número de ciclos de Pomodoro completados
   const [intervalosDesejados, setIntervalosDesejados] = useState(3); // Número de intervalos (ciclos) antes de Long Break

   const pomodoroTimer = 25 * 60;
   const shortTimer = 5 * 60;
   const longTimer = 15 * 60;

   // document.getElementById("btnPomo").style.backgroundColor = "#FFEB55";

   // Função para formatar o tempo
   function formatarTempo(segundos) {
      let minutos = Math.floor(segundos / 60);
      let secs = segundos % 60;
      return (minutos < 10 ? "0" + minutos : minutos) + ":" + (secs < 10 ? "0" + secs : secs);
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
      setTimerAtual(1500); // Reinicia para 25 minutos
      setBotao("Iniciar");
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
            <i className="fa-solid fa-music" id="musicButton"></i>
            <i className="fa-solid fa-gear" id="configButton"></i>
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
      </div>
   );
}