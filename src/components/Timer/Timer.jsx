import "./Timer.css";
import { useState, useEffect } from "react";

export default function Timer() {
   const [timerAtual, setTimerAtual] = useState(1500); // Tempo inicial em segundos (25 minutos)
   const [timerTela, setTimerTela] = useState(formatarTempo(1500)); // Inicia com o tempo formatado
   const [botao, setBotao] = useState("Iniciar");
   const [intervalo, setIntervalo] = useState(null);

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

   useEffect(() => {
      setTimerTela(formatarTempo(timerAtual)); // Atualiza o valor formatado para exibir na tela

      // Se o tempo chegar a zero, para o cronômetro
      if (timerAtual === 0) {
         setTimerAtual(1500);
         clearInterval(intervalo); // Limpa o intervalo
         setBotao("Iniciar"); // Reseta o botão para "Iniciar"
      }
   }, [timerAtual, intervalo]); // Observa tanto o valor do timerAtual quanto o intervalo

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

         <div id="int-atual">#1</div>
      </div>
   );
}