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
      }
   }

   // Função que decrementa o tempo
   function passarTempo() {
      setTimerAtual((prev) => {
         if (prev > 0) {
            return prev - 1; // Decrementa o tempo
         } else {
            clearInterval(intervalo); // Para o intervalo quando o tempo chega a zero
            setBotao("Iniciar"); // Reseta o botão para "Iniciar"
            return 1500; // Reinicia o tempo para 25 minutos (ou o tempo original configurado)
         }
      });
   }

   useEffect(() => {
      setTimerTela(formatarTempo(timerAtual)); // Atualiza o valor formatado para exibir na tela
   }, [timerAtual]); // A cada vez que o timerAtual muda, formate o tempo novamente

   return (
      <div class="container">
         <div class="options">
            <button id="btnPomo" onclick="mudarTela(1)">Pomodoro</button>
            <button id="btnShort" onclick="mudarTela(2)">Short Break</button>
            <button id="btnLong" onclick="mudarTela(3)">Long Break</button>
         </div>

         <div className="modal-options">
            <i class="fa-solid fa-music" id="musicButton"></i>
            <i class="fa-solid fa-gear" id="configButton"></i>
         </div>

         <div class="cronometro">
            <div class="tempo" id="timer">{timerTela}</div>

            <div class="actions">
               <i class="fa-solid fa-rotate-right" onclick="reiniciarTimer()"></i>

               <button id="botaoTimer" onClick={contador}>{botao}</button>

               <i class="fa-solid fa-forward" onclick="pular()"></i>
            </div>
         </div>

         <div id="int-atual">#1</div>
      </div>
   )
}